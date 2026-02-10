from pydantic import BaseModel
from typing import List,Literal

#Those models Are required to Define the output of the LLM, which will be used to populate the UI in the frontend
class FinancialGoal(BaseModel):
    goal_name: str
    type: str
    #targetDate: str
    #yearsAway: int
    riskLevel: Literal["low", "high"]
    timeline_alignment_summary: str
    goal_advice: str

class InvestmentAccount(BaseModel):
    account_name: str
    account_type: str
    balance: float
    status: str = "Active"
    taxCategory: Literal["Taxable", "Tax-Deferred", "Tax-Free"]
    efficiency_score_percent: int
    linkedGoals: List[str]=[]
    tax_strategy_analysis: str

# Final Expected output from AI ,related to Demo service
class DemoResponseFormat(BaseModel):
    strategic_time_horizon_map: List[FinancialGoal]
    tax_efficiency_optimizer: List[InvestmentAccount]