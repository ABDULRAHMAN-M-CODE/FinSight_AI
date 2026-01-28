from pydantic import BaseModel, Field, condecimal, root_validator
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import date, datetime

Money = condecimal(max_digits=30, decimal_places=2)

# JSON1 - questionnaire raw input from client (client-side validated)
class QuestionnaireJSON1(BaseModel):
    user_id: Optional[UUID] = None
    household_income: Optional[Money] = None
    income_sources: Optional[List[Dict[str, Any]]] = None
    monthly_budget: Optional[Money] = None
    investment_accts: Optional[List[Dict[str, Any]]] = None
    outstanding_debts: Optional[List[Dict[str, Any]]] = None
    life_insurance: Optional[Dict[str, Any]] = None
    signup_completed: Optional[bool] = False

# JSON2 - server-side validated data (validated user info)
class QuestionnaireJSON2(BaseModel):
    user_id: UUID
    household_income: Optional[Money] = None
    income_sources: Optional[List[Dict[str, Any]]] = None
    monthly_budget: Optional[Money] = None
    investment_accts: Optional[List[Dict[str, Any]]] = None
    outstanding_debts: Optional[List[Dict[str, Any]]] = None
    life_insurance: Optional[Dict[str, Any]] = None
    validated_at: datetime

# JSON3 - AI advice structure returned by the LLM (and stored)
class AIAdviceJSON3(BaseModel):
    user_id: UUID
    savings_cta: Optional[str] = None
    recommendations: Optional[List[Dict[str, Any]]] = None
    projections: Optional[Dict[str, Any]] = None
    generated_at: datetime

# Simulation request
class SimulationRunRequest(BaseModel):
    user_id: UUID
    scenario_text: str
    run_async: Optional[bool] = True
    max_iterations: Optional[int] = 12

# Simulation response (immediate)
class SimulationRunResponse(BaseModel):
    task_id: Optional[str] = None
    status: str

# Simulation history item
class SimulationHistoryItem(BaseModel):
    id: UUID
    user_id: UUID
    scenario_text: str
    scenario_hash: Optional[str] = None
    created_at: datetime
    confidence_score: Optional[float] = None
    iteration_count: Optional[int] = None

# Alert trigger request
class AlertMonitorRequest(BaseModel):
    user_id: UUID

# Alert record
class AlertRecord(BaseModel):
    id: UUID
    user_id: UUID
    alert_type: Optional[str]
    message: Optional[str]
    severity: Optional[str]
    triggered_at: datetime

# Generic API response wrapper
class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None