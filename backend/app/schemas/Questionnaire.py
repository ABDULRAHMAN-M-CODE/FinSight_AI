from pydantic import BaseModel,Field
from decimal import Decimal
from typing import List
from typing import Literal
from datetime import date

# DTO for House hold members
class HouseholdIncomeMember(BaseModel):
    member_name: str
    annual_income: Decimal
    income_source: str

# DTO for investment acccounts
class InvestmentAccountIn(BaseModel):
    id:str
    name: str
    type: str
    current_balance: Decimal
    is_active : bool

# DTO for debts 
class DebtIn(BaseModel):
    id:str
    type: str
    balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal

# DTO for insurances 
class InsuranceIn(BaseModel):
    insurance_type: str
    death_benefit: Decimal
    cash_value: Decimal 
    monthly_premium: Decimal

# DTO for user finance goals 
class FinancialGoalsIn(BaseModel):
    id:str
    name : str
    type : Literal["short-term", "long-term"]
    target_amount : Decimal
    deadline : date 

# DTO for Questionnaire form
#Field must be used to prevent data leaks, otherwise multiple requests will, for example, share the same household_income array because if we did not use the Field, it will be shared for all the instances of the Class.
# backend Expects that the sent dict is to follow the following : 
class QuestionnaireSubmit(BaseModel):
    household_income: List[HouseholdIncomeMember] =Field(default_factory=list)
    monthly_budget: Decimal
    investment_accounts: List[InvestmentAccountIn] = Field(default_factory=list)
    outstanding_debts: List[DebtIn] =Field(default_factory=list)
    life_insurance: List[InsuranceIn] = Field(default_factory=list)
    financial_goals: List[FinancialGoalsIn] = Field(default_factory=list)
    

