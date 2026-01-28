"""
Celery tasks for Stage3:
- run_simulation_task: starts LangGraph orchestration (as in Stage2)
- monitor_user: runs one-off monitoring for a specific user (writes financial_alerts)
- monitor_all_users: periodic task that scans all users and triggers monitor_user (scheduled via Celery beat)
- Tasks use asyncio.run to call async DB functions
"""

from app.celery_app import celery_app
from app.langgraph_service import run_simulation_graph
from celery.utils.log import get_task_logger
import asyncio
from app.db import async_session
from app import crud, models
from sqlalchemy import select
from datetime import datetime
from typing import Any
import traceback
import os

logger = get_task_logger(__name__)

@celery_app.task(bind=True, acks_late=True, max_retries=3, autoretry_for=(Exception,), retry_backoff=True)
def run_simulation_task(self, user_id: str, scenario_text: str, max_iterations: int = 12):
    try:
        logger.info("Starting LangGraph simulation for user_id=%s", user_id)
        res = run_simulation_graph(user_id=user_id, scenario_text=scenario_text, max_iterations=max_iterations)
        logger.info("LangGraph simulation completed: %s", res.get("sim_id"))
        return {"status": "completed", "simulation_id": res.get("sim_id"), "final_summary": res.get("final_summary", {})}
    except Exception as e:
        logger.exception("Simulation task failed: %s", e)
        raise

@celery_app.task(bind=True)
def monitor_user(self, user_id: str):
    """
    Runs a single-pass monitoring check for the user and inserts alerts when detected.
    Behavior and heuristics mirror app/routers/alerts.monitor but optimized for background run.
    """
    async def _monitor():
        async with async_session() as session:
            q = select(models.UserFinancialData).filter(models.UserFinancialData.user_id == user_id)
            res = await session.execute(q)
            user_fin = res.scalar_one_or_none()
            alerts_created = []
            if user_fin and user_fin.monthly_budget:
                try:
                    budget = float(user_fin.monthly_budget)
                    if budget < 100:  # placeholder rule from Stage1
                        a = await crud.insert_financial_alert(
                            session=session,
                            user_id=user_id,
                            alert_type="low_monthly_budget",
                            detected_pattern={"monthly_budget": budget},
                            message="Your monthly budget is below $100; consider reviewing expenses.",
                            severity="medium",
                            ai_reasoning="Budget below threshold rule (Stage3)"
                        )
                        alerts_created.append(a.id)
                        await session.commit()
                except Exception:
                    logger.exception("Error computing monitor rule for user %s", user_id)
            return alerts_created

    try:
        res = asyncio.run(_monitor())
        logger.info("Monitor complete for user=%s created alerts=%s", user_id, res)
        return {"status": "ok", "alerts_created": res}
    except Exception as e:
        logger.exception("monitor_user failed for user=%s: %s", user_id, e)
        raise

@celery_app.task(bind=True)
def monitor_all_users(self):
    """
    Periodic task that lists all users and triggers monitor_user tasks for each.
    Scheduled by Celery Beat (see celery_app.beat_schedule).
    """
    async def _list_users():
        async with async_session() as session:
            q = select(models.User.id)
            res = await session.execute(q)
            return [r[0] for r in res.all()]

    try:
        user_ids = asyncio.run(_list_users())
        logger.info("monitor_all_users found %d users", len(user_ids))
        for uid in user_ids:
            # enqueue monitoring per user (non-blocking)
            monitor_user.delay(str(uid))
        return {"status": "queued", "users": len(user_ids)}
    except Exception as e:
        logger.exception("monitor_all_users failed: %s\n%s", e, traceback.format_exc())
        raise