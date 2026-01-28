"""
LangGraph StateGraph implementation for the what-if simulation (FULL, Stage3).

This file implements:
- SimulationState TypedDict (uses datetime for timestamp fields)
- Nodes: fetch_context, run_simulations, confidence_gate, summarize
- Graph builder with conditional edges and PostgresSaver integration (checkpointing)
- BaseStore usage (semantic memory) for deduplication per repository docs
- Uses numba-accelerated Monte Carlo helper monte_carlo_paths_accel (with numpy fallback)

Notes:
- All node functions are synchronous callables because StateGraph examples in the repo used
  synchronous node functions and used asyncio.run() internally for async DB access.
- Input/Output fields and DB accesses for every node are documented in the function docstrings.
- The implementation follows the repository documentation you uploaded (Database_description_clean.txt
  and the notebooks), including the requirement that core tables such as investment_accounts and
  user_financial_data are treated as read-only by simulations; only what_if_simulation and limited_advice
  are written by the simulation flow.
"""

from typing import TypedDict, List, Dict, Any
from datetime import datetime
import asyncio
import logging

logger = logging.getLogger(__name__)

# Attempt to import langgraph classes per repository docs.
try:
    from langgraph.graph import StateGraph, START, END
    from langgraph.checkpoint.postgres import PostgresSaver
    from langgraph.errors import NodeInterrupt
    from langgraph.persistence import BaseStore
    HAVE_LANGGRAPH = True
except Exception:
    # If langgraph is not installed, we still provide the module, but runtime operations that require
    # langgraph will raise a RuntimeError with a clear message.
    StateGraph = None  # type: ignore
    START = END = None  # type: ignore
    PostgresSaver = None  # type: ignore
    BaseStore = None  # type: ignore
    NodeInterrupt = Exception  # generic fallback
    HAVE_LANGGRAPH = False

from app.langgraph_config import POSTGRES_CONN
from app.db import async_session
from app import crud, models
from app.utils import scenario_hash
from app.langchain_service import get_llm, extract_simulation_assumptions, summarize_simulation_with_llm
from app.simulation_accel import monte_carlo_paths_accel

from uuid import uuid4

# SimulationState schema (TypedDict)
class SimulationState(TypedDict, total=False):
    user_id: str
    scenario_text: str
    scenario_hash: str
    base_params: Dict[str, Any]
    sim_results: List[Dict[str, Any]]
    confidence_score: float
    iteration_count: int
    created_at: datetime
    final_summary: Dict[str, Any]
    sim_id: str

# NODE: fetch_context
def fetch_context_node(state: SimulationState) -> SimulationState:
    """
    fetch_context node
    Input:
      - user_id: str
      - scenario_text: str
    Output:
      - base_params: dict (user_financial_data, investment_accounts, goals, health_snapshots)
      - scenario_hash: str
      - created_at: datetime (UTC)
      - iteration_count: int (initialized to 0 if absent)
    DB access (reads only):
      - user_financial_data
      - investment_accounts
      - goals
      - health_score_snapshots
    Writes: none
    """
    if "user_id" not in state or "scenario_text" not in state:
        raise NodeInterrupt("fetch_context requires 'user_id' and 'scenario_text' in state")

    user_id = state["user_id"]

    async def _fetch():
        async with async_session() as session:
            from sqlalchemy import select
            # user_financial_data (one row)
            res_fin = await session.execute(select(models.UserFinancialData).filter(models.UserFinancialData.user_id == user_id))
            fin = res_fin.scalar_one_or_none()
            # investment_accounts (many)
            res_acc = await session.execute(select(models.InvestmentAccount).filter(models.InvestmentAccount.user_id == user_id))
            acc_rows = [r[0] for r in res_acc.all()]
            # goals
            res_goals = await session.execute(select(models.Goal).filter(models.Goal.user_id == user_id))
            goal_rows = [r[0] for r in res_goals.all()]
            # health snapshots (latest up to 12)
            res_health = await session.execute(select(models.HealthScoreSnapshot).filter(models.HealthScoreSnapshot.user_id == user_id).order_by(models.HealthScoreSnapshot.calculated_at.desc()).limit(12))
            health_rows = [r[0] for r in res_health.all()]
            return fin, acc_rows, goal_rows, health_rows

    try:
        fin, accs, goals, health = asyncio.run(_fetch())
    except Exception as e:
        logger.exception("fetch_context DB fetch failed: %s", e)
        raise NodeInterrupt(f"DB fetch failed: {e}")

    # Build base_params following the uploaded docs expectations
    base_params = {
        "user_financial_data": {
            "household_income": float(fin.household_income) if fin and fin.household_income is not None else None,
            "monthly_budget": float(fin.monthly_budget) if fin and fin.monthly_budget is not None else None,
            "outstanding_debts": fin.outstanding_debts if fin and fin.outstanding_debts else None,
            "investment_accts": fin.investment_accts if fin and fin.investment_accts else None
        } if fin else None,
        "investment_accounts": [
            {"account_name": a.account_name, "current_value": float(a.current_value) if a.current_value is not None else None, "risk_level": a.risk_level}
            for a in accs
        ],
        "goals": [
            {"goal_name": g.goal_name, "target_amount": float(g.target_amount) if g.target_amount is not None else None, "current_amount": float(g.current_amount) if g.current_amount is not None else None}
            for g in goals
        ],
        "health_snapshots": [
            {"overall_score": s.overall_score, "calculated_at": s.calculated_at.isoformat()} for s in health
        ]
    }

    out = dict(state)
    out["base_params"] = base_params
    out["scenario_hash"] = scenario_hash(state["scenario_text"])
    out["created_at"] = datetime.utcnow()
    if "iteration_count" not in out:
        out["iteration_count"] = 0
    return out

# NODE: run_simulations
def run_simulations_node(state: SimulationState) -> SimulationState:
    """
    run_simulations node
    Input:
      - base_params: dict (from fetch_context)
      - scenario_text: str
      - iteration_count: int
    Output:
      - sim_results: list[dict] containing 'baseline' and 'scenario' stats
      - confidence_score: float (0..1)
      - iteration_count: incremented
    DB access:
      - reads: investment_accounts, user_financial_data (via base_params), investment_performance_snapshots optionally
    Writes: none (persisting handled by 'summarize')
    Behavior:
      - Uses LLM to extract assumptions (expected_return, volatility, liquidity_impact)
      - Runs accelerated Monte Carlo (monte_carlo_paths_accel) for baseline and scenario
      - Computes a heuristic confidence_score
    """
    if "base_params" not in state:
        raise NodeInterrupt("run_simulations requires 'base_params' in state")

    user_id = state.get("user_id")
    scenario_text = state.get("scenario_text", "")
    iteration_count = int(state.get("iteration_count", 0))

    # Extract assumptions using LLM (best-effort; fall back to defaults)
    try:
        llm = get_llm()
        assumptions = extract_simulation_assumptions(llm, scenario_text)
        expected_return = float(assumptions.expected_return)
        volatility = float(assumptions.volatility)
        liquidity_impact = float(assumptions.liquidity_impact) if assumptions.liquidity_impact is not None else 0.0
    except Exception as e:
        logger.info("LLM assumption extraction failed or not available; using defaults. %s", e)
        expected_return = 0.06
        volatility = 0.12
        liquidity_impact = 0.0

    # Determine initial capital from base_params (investment_accounts)
    initial_capital = 10000.0
    try:
        inv_accs = state["base_params"].get("investment_accounts") if state["base_params"] else None
        if inv_accs and isinstance(inv_accs, list) and len(inv_accs) > 0:
            first_val = inv_accs[0].get("current_value", None)
            if first_val is not None:
                initial_capital = float(first_val)
    except Exception:
        logger.debug("Failed to extract initial capital from base_params; using default.")

    years = 5
    n_paths = 10000  # use large number; monte_carlo_paths_accel scales with numba

    # Baseline: use expected_return as baseline
    try:
        baseline_stats = monte_carlo_paths_accel(initial_capital, expected_return, volatility, years, n_paths=n_paths, steps_per_year=12)
    except Exception as e:
        logger.exception("Monte Carlo baseline failed: %s", e)
        raise NodeInterrupt(f"Monte Carlo baseline failed: {e}")

    # Scenario: tweak expected_return to represent the user's scenario; for now trust assumption or add delta
    scenario_expected_return = expected_return  # the LLM assumption may already encode scenario; conservative approach
    # If scenario_text indicates an increase (simple heuristic), bump expected return by 0.02
    if "invest" in scenario_text.lower() or "high-risk" in scenario_text.lower() or "stocks" in scenario_text.lower():
        scenario_expected_return = expected_return + 0.02

    try:
        scenario_stats = monte_carlo_paths_accel(initial_capital, scenario_expected_return, volatility, years, n_paths=n_paths, steps_per_year=12)
    except Exception as e:
        logger.exception("Monte Carlo scenario failed: %s", e)
        raise NodeInterrupt(f"Monte Carlo scenario failed: {e}")

    # Heuristic confidence calculation:
    try:
        base_band = baseline_stats.get("p90", 0.0) - baseline_stats.get("p10", 0.0)
        scen_band = scenario_stats.get("p90", 0.0) - scenario_stats.get("p10", 0.0)
        band = max(abs(base_band), abs(scen_band), 1e-6)
        confidence_score = max(0.0, min(0.99, 1.0 - (band / (abs(initial_capital) + band))))
    except Exception:
        confidence_score = 0.5

    sim_results = [
        {"type": "baseline", "stats": baseline_stats},
        {"type": "scenario", "stats": scenario_stats}
    ]

    out = dict(state)
    out["sim_results"] = sim_results
    out["iteration_count"] = iteration_count + 1
    out["confidence_score"] = float(confidence_score)
    return out

# NODE: confidence_gate (conditional)
def confidence_gate_node(state: SimulationState) -> str:
    """
    Conditional gate:
    - If confidence_score >= 0.92 or iteration_count >= 12 -> return 'summarize'
    - Else -> return 'run_simulations' (refine)
    DB access: none
    """
    conf = float(state.get("confidence_score", 0.0))
    iters = int(state.get("iteration_count", 0))
    if conf >= 0.92 or iters >= 12:
        return "summarize"
    return "run_simulations"

# NODE: summarize
def summarize_node(state: SimulationState) -> SimulationState:
    """
    summarize node
    Input:
      - sim_results (list), base_params, user_id, scenario_text, scenario_hash, iteration_count, confidence_score
    Output:
      - final_summary (dict) containing aggregated summary matching SimulationSummary schema (best-effort)
      - sim_id (str): id of created what_if_simulation DB row
    DB access:
      - Writes: what_if_simulation, limited_advice
      - Optionally writes: BaseStore (semantic memory) using Postgres (per repo docs)
    """
    if "sim_results" not in state:
        raise NodeInterrupt("summarize requires 'sim_results' in state")

    baseline = next((r["stats"] for r in state["sim_results"] if r.get("type") == "baseline"), {})
    scenario = next((r["stats"] for r in state["sim_results"] if r.get("type") == "scenario"), {})

    # Try to obtain an LLM summary; fall back to deterministic summary if LLM not available
    try:
        llm = get_llm()
        summary_obj = summarize_simulation_with_llm(llm, baseline, scenario, state.get("iteration_count", 1), {"initial_capital": baseline.get("final_mean")})
        final_summary = summary_obj.dict()
    except Exception as e:
        logger.info("LLM summarization unavailable or failed; using deterministic summary. %s", e)
        final_summary = {
            "baseline_mean": baseline.get("final_mean"),
            "baseline_p10": baseline.get("p10"),
            "baseline_p90": baseline.get("p90"),
            "scenario_mean": scenario.get("final_mean"),
            "scenario_p10": scenario.get("p10"),
            "scenario_p90": scenario.get("p90"),
            "ai_recommendation": "Stage3 default recommendation: consider rebalancing; consult advisor.",
            "confidence_score": float(state.get("confidence_score", 0.0)),
            "iteration_count": int(state.get("iteration_count", 1)),
            "simulation_params": {
                "n_paths": 10000,
                "years": 5
            }
        }

    # Persist results to DB (what_if_simulation and limited_advice)
    async def _persist():
        async with async_session() as session:
            try:
                w = await crud.create_what_if_simulation(
                    session=session,
                    user_id=state["user_id"],
                    scenario_text=state["scenario_text"],
                    baseline_path=baseline,
                    scenario_path=scenario,
                    uncertainty_band={
                        "baseline": {"p10": baseline.get("p10"), "p90": baseline.get("p90")},
                        "scenario": {"p10": scenario.get("p10"), "p90": scenario.get("p90")}
                    },
                    goal_impacts={"note": "Goal impacts not fully computed in Stage3"},
                    ai_recommendation=final_summary.get("ai_recommendation", ""),
                    confidence_score=float(final_summary.get("confidence_score", 0.0)),
                    iteration_count=int(final_summary.get("iteration_count", 1)),
                    simulation_params=final_summary.get("simulation_params", {})
                )

                # Create limited_advice record for UI
                from app.schemas import AIAdviceJSON3
                advice = AIAdviceJSON3(
                    user_id=state["user_id"],
                    savings_cta="What-if simulation complete; view projections.",
                    recommendations=[{"note": final_summary.get("ai_recommendation", "")}],
                    projections={"baseline": baseline, "scenario": scenario},
                    generated_at=datetime.utcnow()
                )
                await crud.store_limited_advice(session, advice)
                await session.commit()
                return str(w.id)
            except Exception as e:
                logger.exception("Failed to persist simulation results: %s", e)
                raise

    try:
        sim_id = asyncio.run(_persist())
    except Exception as e:
        logger.exception("Persist step failed: %s", e)
        raise NodeInterrupt(f"Persist failed: {e}")

    # Persist to BaseStore for semantic memory (deduplication) if available
    try:
        if HAVE_LANGGRAPH and BaseStore is not None and POSTGRES_CONN:
            try:
                store = BaseStore(POSTGRES_CONN)
                # Per repository example: store.put(("user_123","simulations"), simulation_hash, {"input": scenario_text, "output": sim_summary})
                store.put((state["user_id"], "simulations"), state["scenario_hash"], {"input": state["scenario_text"], "output": final_summary})
            except Exception as e:
                logger.info("BaseStore persistence skipped/failed: %s", e)
    except Exception:
        # Be tolerant: BaseStore optional
        logger.info("BaseStore not available; skipping semantic memory persistence.")

    out = dict(state)
    out["final_summary"] = final_summary
    out["sim_id"] = sim_id
    return out

# Graph builder
def build_simulation_graph():
    """
    Build and compile a StateGraph for simulations with PostgresSaver checkpointing.
    Returns compiled graph object.
    """
    if not HAVE_LANGGRAPH:
        raise RuntimeError("LangGraph is not installed in this environment; install langgraph package to run graphs.")

    # Create PostgresSaver checkpointer using the provided connection string
    checkpointer = PostgresSaver(POSTGRES_CONN)

    builder = StateGraph(SimulationState)
    builder.add_node("fetch_context", fetch_context_node)
    builder.add_node("run_simulations", run_simulations_node)
    # We treat 'refine_assumptions' as another run_simulations in the builder by using the conditional gate
    builder.add_node("summarize", summarize_node)

    builder.set_entry_point("fetch_context")
    builder.add_edge("fetch_context", "run_simulations")
    builder.add_conditional_edges("run_simulations", confidence_gate_node)
    builder.add_edge("summarize", END)

    # Compile with checkpointer for persistence
    graph = builder.compile(checkpointer=checkpointer)
    return graph

# Convenience runner (blocking)
def run_simulation_graph(user_id: str, scenario_text: str, max_iterations: int = 12) -> Dict[str, Any]:
    """
    Construct and run the simulation graph synchronously and return the final state.
    This function is intended to be called from a Celery worker (synchronous context).
    """
    graph = build_simulation_graph()

    initial_state: SimulationState = {
        "user_id": user_id,
        "scenario_text": scenario_text,
        "scenario_hash": scenario_hash(scenario_text),
        "iteration_count": 0,
        "created_at": datetime.utcnow()
    }

    try:
        final_state = graph.invoke(initial_state)
    except Exception as e:
        logger.exception("Graph invocation failed: %s", e)
        raise

    return final_state