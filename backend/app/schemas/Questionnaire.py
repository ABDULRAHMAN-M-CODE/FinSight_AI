from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional
from datetime import date

class HouseholdIncomeMember(BaseModel):
    member_name: str
    annual_income: Decimal
    income_source: str


class InvestmentAccountIn(BaseModel):
    name: str
    type: str
    current_balance: Decimal
    is_active : bool


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
    name : str
    type : str
    amount : Decimal
    deadLine : date 


class QuestionnaireSubmit(BaseModel):
    household_income: List[HouseholdIncomeMember]
    monthly_budget: Decimal
    investment_accounts: List[InvestmentAccountIn] = []
    outstanding_debts: List[DebtIn] = []
    life_insurance: List[InsuranceIn] = []
    financial_goals: Optional[FinancialGoalsIn] = None
