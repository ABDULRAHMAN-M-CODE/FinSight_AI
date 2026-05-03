from pydantic import BaseModel,Field
from decimal import Decimal
from typing import List
from typing import Literal
from datetime import date
from pydantic import BaseModel, model_validator
from typing_extensions import Self 

class HouseholdIncomeMember(BaseModel):
    id:Decimal  
    member_name: str
    annual_income: Decimal
    income_source: str

class DebtIn(BaseModel):
    id:Decimal
    type: str               
    balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal
    @model_validator(mode='after')
    def ensure_debt_shrinks(self) -> Self :
        min_payment = (self.balance * self.interest_rate)+1
        if self.monthly_payment < min_payment:
            self.monthly_payment = min_payment + Decimal('1') 
        return self 

class SubjectiveAnswersValuesAndWeights(BaseModel):    
    questions_weights:list[int]
    answers_values:list[int]
    investement_amount:float=3000
class QuestionnaireSubmit(BaseModel):
    monthly_budget: Decimal 
    household_income: List[HouseholdIncomeMember] 
    outstanding_debts: List[DebtIn] 
    subjective_answers_values_and_weights:SubjectiveAnswersValuesAndWeights#related to risk assasement