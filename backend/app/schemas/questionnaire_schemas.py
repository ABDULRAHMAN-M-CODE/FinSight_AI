from pydantic import BaseModel,Field
from decimal import Decimal
from typing import List
from typing import Literal
from datetime import date


# from documentation "https://docs.pydantic.dev/latest/concepts/validators/#model-validators"
from pydantic import BaseModel, model_validator
from typing_extensions import Self 

# DTO for House hold members
class HouseholdIncomeMember(BaseModel):
    id:Decimal  # Note 1  : id is necessary for the frontend to work, as adding/removing  a member requires a logic that uses the id  to distinguish between the members
    member_name: str
    annual_income: Decimal
    income_source: str

# DTO for investment acccounts : (for both the Demo (Limited) and the full service)
class InvestmentAccountIn(BaseModel):
    id:Decimal
    name: str
    type: str
    current_balance: Decimal
    is_active : bool

# DTO for user finance goals :  (for both the Demo (Limited) and the full service)
class FinancialGoalsIn(BaseModel):
    id:Decimal
    name : str
    type : Literal["short-term", "long-term"]
    target_amount : Decimal
    deadline : date 

# DTO for debts 
class DebtIn(BaseModel):
    id:Decimal
    type: str#  currently, it's the same as debt name, that cause bugs !
    balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal
    ######New Addition (mandatory , not optional) #####
    # for amortization to work  this value  have a rule to ensure the debt is shrinking over time ,
    #  the rule simply  is : monthly_payment > balance* interest_rate , 
    # if otherwise, we must default to the minimal  monthly_payment that satisfies this !

    @model_validator(mode='after')
    def ensure_debt_shrinks(self) -> Self :# why not return self ??? 
        # Rule in finance : monthly payment > balance * monthly_interest_rate
        # 
        min_payment = (self.balance * self.interest_rate)+1
        
        if self.monthly_payment < min_payment:
            # Default to minimal payment that allows shrinking
            self.monthly_payment = min_payment + Decimal('1') # add minimum unit to satisfy the requirement
            
        return self # the validated instance must be returned as documentations says.

# DTO for insurances 
class InsuranceIn(BaseModel):
    #id:Decimal , it may be needed later
    insurance_type: str
    death_benefit: Decimal
    cash_value: Decimal 
    monthly_premium: Decimal


# DTO for questionnaire submit. direction(frontend --> backend --> AI).
class QuestionnaireSubmit(BaseModel):
    """Contract for the data that is expected as a user info
        Note1 : we may need to add default values for the fields ; to ensure that the  info always exist
        Note 2: some fields name must be renamed later because they  introduced bugs; for example , instead of life_insurence (single) , we should name it 'life_ensurences' (plural, and use e instead of 'i')
    Args:
        BaseModel (_type_): _description_ (will be written later)
    """
    
    monthly_budget: Decimal
    household_income: List[HouseholdIncomeMember] 
    investment_accounts: List[InvestmentAccountIn] 
    outstanding_debts: List[DebtIn] 
    life_insurance: List[InsuranceIn]
    financial_goals: List[FinancialGoalsIn] 
    

