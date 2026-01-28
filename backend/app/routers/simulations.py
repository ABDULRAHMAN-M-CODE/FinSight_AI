from fastapi import APIRouter, Depends, HTTPException
from app.schemas import SimulationRunRequest, SimulationRunResponse, SimulationHistoryItem, APIResponse
from app.db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.tasks import run_simulation_task
from app import crud
from typing import List
from uuid import UUID

router = APIRouter()

@router.post("/run", response_model=SimulationRunResponse)
async def run_simulation(request: SimulationRunRequest, session: AsyncSession = Depends(get_async_session)):
    """
    POST /simulations/run
    Request body schema: SimulationRunRequest
    Response schema: SimulationRunResponse
    Side effects:
      - reads: user_financial_data, investment_accounts, goals (when the Celery task runs)
      - writes: what_if_simulation and limited_advice (done in Celery task)
    Behavior:
      - If run_async == True: dispatches a Celery task and returns task id immediately.
      - If run_async == False: will dispatch a blocking synchronous execution (not recommended).
    """
    # Start celery task
    async_task = run_simulation_task.delay(str(request.user_id), request.scenario_text, request.max_iterations)
    return SimulationRunResponse(task_id=async_task.id, status="queued")

@router.get("/history", response_model=APIResponse)
async def simulations_history(user_id: UUID, session: AsyncSession = Depends(get_async_session)):
    """
    GET /simulations/history?user_id=<uuid>
    Response schema: APIResponse with data as list of SimulationHistoryItem
    Side effects: reads what_if_simulation table
    """
    sims = await crud.list_simulations_by_user(session, str(user_id))
    items = []
    for s in sims:
        items.append({
            "id": s.id,
            "user_id": s.user_id,
            "scenario_text": s.scenario_text,
            "scenario_hash": s.scenario_hash,
            "created_at": s.created_at,
            "confidence_score": float(s.confidence_score) if s.confidence_score is not None else None,
            "iteration_count": s.iteration_count
        })
    return APIResponse(success=True, data=items)