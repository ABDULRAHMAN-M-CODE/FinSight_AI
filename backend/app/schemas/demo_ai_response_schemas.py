from pydantic import BaseModel, Field
from typing import List,Literal

#Those models Are required to Define the output of the LLM, which will be used to populate the UI in the frontend
class FinancialGoal(BaseModel):
    id:str
    name: str
    type: str
    target_date: str
    years_away: int
    riskLevel: Literal["low", "high"]
    allocation_status:str
    advice:str

class InvestmentAccount(BaseModel):
    name: str
    type: str
    balance: float
    status: str = "Active" # if AI did not provide the value, we assume the account is Active.
    tax_category: Literal["Taxable", "Tax-Deferred", "Tax-Free"]
    efficiency: int
    linked_goals: List[str]=Field(default_factory=list)
    tax_strategy_advice: str

# Final Expected output from AI ,related to Demo service
class DemoResponseFormat(BaseModel):
    strategic_time_horizon_map: List[FinancialGoal]
    tax_efficiency_optimizer: List[InvestmentAccount]