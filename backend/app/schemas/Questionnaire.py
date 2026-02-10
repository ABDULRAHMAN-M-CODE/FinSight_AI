from pydantic import BaseModel,Field
from decimal import Decimal
from typing import List, Optional
from datetime import date

# DTO for House hold members
class HouseholdIncomeMember(BaseModel):
    member_name: str
    annual_income: Decimal
    income_source: str

# DTO for investment acccounts
class InvestmentAccountIn(BaseModel):
    name: str
    type: str
    current_balance: Decimal
    is_active : bool

# DTO for debts 
class DebtIn(BaseModel):
    type: str
    balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal

# DTO for insurances 
class InsuranceIn(BaseModel):
    insurance_type: str
    death_benefit: Decimal
    cash_value: Optional[Decimal] = None
    monthly_premium: Decimal

# DTO for user finance goals 
class FinancialGoalsIn(BaseModel):
    name : str
    type : str
    amount : Decimal
    deadline : date 

# DTO for Questionnaire form
class QuestionnaireSubmit(BaseModel):
    household_income: List[HouseholdIncomeMember]
    monthly_budget: Decimal
    investment_accounts: List[InvestmentAccountIn] = []
    outstanding_debts: List[DebtIn] = []
    life_insurance: List[InsuranceIn] = []
    financial_goals: Optional[FinancialGoalsIn] = None
    
# DTO for limited service ( the demo service)
class LimitedQuestionnaireSubmit(BaseModel):
    investment_accounts: List[InvestmentAccountIn] = Field(default_factory=list)
    financial_goals: List[FinancialGoalsIn] = Field(default_factory=list)