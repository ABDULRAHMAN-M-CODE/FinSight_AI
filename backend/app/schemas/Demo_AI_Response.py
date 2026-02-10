from pydantic import BaseModel
from typing import List,Literal

#Those models Are required to Define the output of the LLM, which will be used to populate the UI in the frontend
class FinancialGoal(BaseModel):
    name: str
    type: str
    targetDate: str
    yearsAway: int
    riskLevel: Literal["low", "high"]
    allocationStatus: str
    advice: str

class InvestmentAccount(BaseModel):
    name: str
    type: str
    balance: float
    status: str = "Active"
    taxCategory: Literal["Taxable", "Tax-Deferred", "Tax-Free"]
    efficiency: int
    linkedGoals: List[str]
    taxStrategyAdvice: str

# Final Expected output from AI ,related to Demo service
class DemoResponseFormat(BaseModel):
    goals: List[FinancialGoal]
    accounts: List[InvestmentAccount]