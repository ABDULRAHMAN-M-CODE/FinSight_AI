
from pydantic import BaseModel,Field
from typing import List
from app.schemas.questionnaire_schemas import InvestmentAccountIn
from app.schemas.questionnaire_schemas import FinancialGoalsIn

# DTO for 
#Using Field(default_factory=list) ensures that each instance gets its own separate list, avoiding the pitfalls of shared mutable defaults
class LimitedQuestionnaireShape(BaseModel):
    investment_accounts: List[InvestmentAccountIn] = Field(default_factory=list)
    financial_goals: List[FinancialGoalsIn] = Field(default_factory=list)