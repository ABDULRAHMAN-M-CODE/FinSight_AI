from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional


class HouseholdIncomeMember(BaseModel):
    member_name: str
    annual_income: Decimal
    income_source: str


class InvestmentAccountIn(BaseModel):
    type: str
    current_balance: Decimal


class DebtIn(BaseModel):
    type: str
    balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal


class InsuranceIn(BaseModel):
    insurance_type: str
    death_benefit: Decimal
    cash_value: Optional[Decimal] = None
    monthly_premium: Decimal


class FinancialGoalsIn(BaseModel):
    short_term: Optional[str] = None
    long_term: Optional[str] = None


class QuestionnaireSubmit(BaseModel):
    household_income: List[HouseholdIncomeMember]
    monthly_budget: Decimal
    investment_accounts: List[InvestmentAccountIn] = []
    outstanding_debts: List[DebtIn] = []
    life_insurance: List[InsuranceIn] = []
    financial_goals: Optional[FinancialGoalsIn] = None
