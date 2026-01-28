from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
from datetime import datetime
from app import models
from app.schemas import QuestionnaireJSON2, AIAdviceJSON3
from app.utils import scenario_hash
from typing import Dict, Any, Optional, List

async def upsert_user_financial_data(session: AsyncSession, data: QuestionnaireJSON2):
    # Insert or update user_financial_data
    obj = await session.get(models.UserFinancialData, data.user_id)
    if obj:
        obj.household_income = data.household_income
        obj.income_sources = data.income_sources
        obj.monthly_budget = data.monthly_budget
        obj.investment_accts = data.investment_accts
        obj.outstanding_debts = data.outstanding_debts
        obj.life_insurance = data.life_insurance
    else:
        obj = models.UserFinancialData(
            user_id=data.user_id,
            household_income=data.household_income,
            income_sources=data.income_sources,
            monthly_budget=data.monthly_budget,
            investment_accts=data.investment_accts,
            outstanding_debts=data.outstanding_debts,
            life_insurance=data.life_insurance,
        )
        session.add(obj)
    await session.flush()
    return obj

async def store_limited_advice(session: AsyncSession, advice: AIAdviceJSON3):
    node = models.LimitedAdvice(
        id=uuid4(),
        user_id=advice.user_id,
        savings_cta=advice.savings_cta,
        recommendations=advice.recommendations,
        projections=advice.projections,
        created_at=datetime.utcnow()
    )
    session.add(node)
    await session.flush()
    return node

async def create_what_if_simulation(session: AsyncSession,
                                    user_id,
                                    scenario_text: str,
                                    baseline_path: Dict[str, Any],
                                    scenario_path: Dict[str, Any],
                                    uncertainty_band: Dict[str, Any],
                                    goal_impacts: Dict[str, Any],
                                    ai_recommendation: str,
                                    confidence_score: float,
                                    iteration_count: int,
                                    simulation_params: Dict[str, Any]):
    w = models.WhatIfSimulation(
        id=uuid4(),
        user_id=user_id,
        scenario_text=scenario_text,
        scenario_hash=scenario_hash(scenario_text),
        baseline_path=baseline_path,
        scenario_path=scenario_path,
        uncertainty_band=uncertainty_band,
        goal_impacts=goal_impacts,
        ai_recommendation=ai_recommendation,
        confidence_score=confidence_score,
        iteration_count=iteration_count,
        simulation_params=simulation_params,
        created_at=datetime.utcnow()
    )
    session.add(w)
    await session.flush()
    return w

async def list_simulations_by_user(session: AsyncSession, user_id, limit=50):
    q = select(models.WhatIfSimulation).filter(models.WhatIfSimulation.user_id == user_id).order_by(models.WhatIfSimulation.created_at.desc()).limit(limit)
    res = await session.execute(q)
    return [r[0] for r in res.all()]

async def insert_financial_alert(session: AsyncSession, user_id, alert_type, detected_pattern, message, severity, ai_reasoning):
    a = models.FinancialAlert(
        id=uuid4(),
        user_id=user_id,
        alert_type=alert_type,
        detected_pattern=detected_pattern,
        message=message,
        severity=severity,
        ai_reasoning=ai_reasoning,
    )
    session.add(a)
    await session.flush()
    return a