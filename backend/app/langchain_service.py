"""
LangChain integration for Stage2.

This module provides:
- LLM initialization using ChatOpenAI (as shown in the uploaded docs)
- Structured output enforcement using Pydantic schemas (JSON2, JSON3, SimulationSummary)
- Tool definitions (Python functions bound to the LLM)
- Prompt templates (exact text as used below)
- Helpers to call the LLM and parse structured JSON outputs

"""

import os
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.config import settings

# The repository documentation uses langchain_openai.ChatOpenAI.
# Import it if available in environment.
try:
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage
    HAVE_LANGCHAIN_OPENAI = True
except Exception:
    # Fallback to placeholder to keep module importable; runtime will error if not installed.
    ChatOpenAI = None  # type: ignore
    HumanMessage = None  # type: ignore
    SystemMessage = None  # type: ignore
    HAVE_LANGCHAIN_OPENAI = False

# Structured output Pydantic models used by the LLM outputs
class SimulationAssumptions(BaseModel):
    expected_return: float = Field(..., description="Expected annual return as decimal")
    volatility: float = Field(..., description="Annual volatility")
    liquidity_impact: Optional[float] = Field(None, description="Estimated liquidity impact")

class SimulationSummary(BaseModel):
    baseline_mean: float
    baseline_p10: float
    baseline_p90: float
    scenario_mean: float
    scenario_p10: float
    scenario_p90: float
    ai_recommendation: str
    confidence_score: float
    iteration_count: int
    simulation_params: Dict[str, Any]

# JSON3 (AI advice) schema; derived from repo file Database_description_clean.txt
class AIAdviceJSON3(BaseModel):
    user_id: str
    savings_cta: Optional[str]
    recommendations: Optional[List[Dict[str, Any]]]
    projections: Optional[Dict[str, Any]]
    generated_at: datetime

# JSON2 schema for validated user input (server-side)
class QuestionnaireJSON2(BaseModel):
    user_id: str
    household_income: Optional[float]
    income_sources: Optional[List[Dict[str, Any]]]
    monthly_budget: Optional[float]
    investment_accts: Optional[List[Dict[str, Any]]]
    outstanding_debts: Optional[List[Dict[str, Any]]]
    life_insurance: Optional[Dict[str, Any]]
    validated_at: datetime

# Prompt templates (exact text)
SIMULATION_ASSUMPTION_PROMPT = """You are a financial assistant that extracts numerical assumptions from a natural-language scenario.
Input scenario: \"\"\"{scenario_text}\"\"\"

Respond in strict JSON matching the schema:
{{
  "expected_return": "annual expected return as decimal (e.g. 0.06)",
  "volatility": "annual volatility as decimal (e.g. 0.12)",
  "liquidity_impact": "optional decimal"
}}

Only output valid JSON.
"""

SIMULATION_SUMMARY_PROMPT = """You are a financial analytics assistant that summarizes simulation results.
Input: baseline and scenario path statistics and a short context.
Produce JSON that matches SimulationSummary schema:
{{
  "baseline_mean": ...,
  "baseline_p10": ...,
  "baseline_p90": ...,
  "scenario_mean": ...,
  "scenario_p10": ...,
  "scenario_p90": ...,
  "ai_recommendation": "...",
  "confidence_score": 0.0-1.0,
  "iteration_count": integer,
  "simulation_params": {{ ... }}
}}
Only output JSON.
"""

# Tool definitions
# The repo examples show binding tools like add/multiply; we provide a finance helper tool.
def compute_sharpe(returns_mean: float, volatility: float, risk_free: float = 0.0) -> float:
    if volatility == 0:
        return 0.0
    return (returns_mean - risk_free) / volatility

# Optionally, we can provide the @tool decorator if langchain tools are available.
def bind_tools_to_llm(llm):
    """
    If ChatOpenAI exposes bind_tools as in your docs, attach finance tools.
    """
    if not llm:
        return llm
    try:
        # the docs show llm.bind_tools([...])
        tools = [compute_sharpe]
        bound = llm.bind_tools(tools)
        return bound
    except Exception:
        # ignore if not available
        return llm

# LLM initializer
def get_llm():
    """
    Initialize ChatOpenAI per repository examples. Requires OPENAI_API_KEY in env.
    """
    
    if not HAVE_LANGCHAIN_OPENAI:
        raise RuntimeError("langchain_openai is not installed in this environment.")
    api_key = os.getenv("OPENAI_API_KEY", settings.OPENAI_API_KEY)
    if not api_key:
        # The user must set OPENAI_API_KEY in .env
        raise RuntimeError("OPENAI_API_KEY is not set. Set in .env or environment.")
    # Example initialization following uploaded docs
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    # Bind tools if possible
    llm = bind_tools_to_llm(llm)
    return llm

# Helper functions to call LLMs and parse outputs using Pydantic models
def extract_simulation_assumptions(llm, scenario_text: str) -> SimulationAssumptions:
    prompt = SIMULATION_ASSUMPTION_PROMPT.format(scenario_text=scenario_text)
    # Use chat model via messages if available
    if hasattr(llm, "invoke"):
        # Some langchain LLMs expose invoke(messages)
        resp = llm.invoke([HumanMessage(content=prompt)])
        # resp may be a structured object or string. Try to parse JSON.
        content = getattr(resp, "content", None) or str(resp)
    else:
        # Fallback simple call
        content = llm(prompt) if callable(llm) else ""
    import json
    parsed = json.loads(content)
    return SimulationAssumptions(**parsed)

def summarize_simulation_with_llm(llm, baseline: Dict[str, Any], scenario: Dict[str, Any], iteration_count: int, params: Dict[str, Any]) -> SimulationSummary:
    # Build a minimal context string
    context = {
        "baseline": baseline,
        "scenario": scenario,
        "iteration_count": iteration_count,
        "params": params
    }
    import json
    prompt = SIMULATION_SUMMARY_PROMPT + "\n\nContext:\n" + json.dumps(context)
    if hasattr(llm, "invoke"):
        resp = llm.invoke([HumanMessage(content=prompt)])
        content = getattr(resp, "content", None) or str(resp)
    else:
        content = llm(prompt) if callable(llm) else ""
    parsed = json.loads(content)
    return SimulationSummary(**parsed)