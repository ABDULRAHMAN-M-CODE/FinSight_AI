
from pydantic import BaseModel,Field
from typing import List
from app.schemas.questionnaire_schemas import InvestmentAccountIn
from app.schemas.questionnaire_schemas import FinancialGoalsIn

# DTO for Demo submit. direction (frontend --> backend --> AI)
class DemoSubmit(BaseModel):
    investment_accounts: List[InvestmentAccountIn] = Field(default_factory=list)
    financial_goals: List[FinancialGoalsIn] = Field(default_factory=list)