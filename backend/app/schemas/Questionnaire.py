from pydantic import BaseModel
from decimal import Decimal
from typing import Dict, Any, Optional,List
from datetime import date


class InvestmentAccountCreate(BaseModel):
    account_name: str
    account_type: str
    current_value: Decimal
    is_active: bool = True


class GoalCreate(BaseModel):
    goal_name: str
    goal_type: str  # short-term / long-term
    target_amount: Decimal
    deadline: date | None = None

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from datetime import date

class HouseholdMember(BaseModel):
    member_name: str
    annual_income: Decimal
    income_source: str

class DebtCreate(BaseModel):
    debt_type: str
    balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal

class InsuranceCreate(BaseModel):
    insurance_type: str
    death_benefit: Decimal
    cash_value: Optional[Decimal] = None
    monthly_premium: Decimal

class QuestionnaireSubmit(BaseModel):
    household_members: List[HouseholdMember]
    monthly_budget: Decimal
    monthly_income: Decimal
    monthly_expenses: Decimal
    investment_accounts: List[InvestmentAccountCreate] = []
    outstanding_debts: List[DebtCreate] = []
    life_insurance: List[InsuranceCreate] = []
    goals: List[GoalCreate] = []