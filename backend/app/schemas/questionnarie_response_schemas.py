from pydantic import BaseModel,Field
from typing import List, Literal
from datetime import date
# Protection Gap Section

class MonthlyData(BaseModel):
    month: int
    required: float
    current: float
    gap: float


class ProtectionGap(BaseModel):
    currentCoverage: float
    requiredCoverage: float
    gap: float
    annualIncome: float
    yearsToRetirement: int
    incomeReplacementRate: float
    monthlyData: List[MonthlyData]


# Recommendations Section

class Recommendation(BaseModel):
    id: int
    policyName: str
    currentCoverage: float
    recommendedCoverage: float
    gap: float
    action: str
    priority: Literal["High", "Medium", "Low"]
    reason: str
    estimatedCost: str


# Full Partial Response

class ProtectionAdvice(BaseModel):
    protectionGap: ProtectionGap
    recommendations: List[Recommendation]


# Monthly Projections

class MonthlyProjection(BaseModel):
    month: int
    totalDebt: float
    highInterestDebt: float
    debtToIncome: float
    interestCost: float


# Individual Debts

class Debt(BaseModel):
    id: int
    name: str
    balance: float
    interestRate: float
    riskLevel: Literal["High", "Medium", "Low"]
    type: str


# Risk Metrics

class RiskMetrics(BaseModel):
    debtToIncomeRatio: float
    highInterestDebtRatio: float
    monthlyDebtBurden: float
    estimatedDebtFreeDate: date
    totalInterestSavings: float
    monthsSaved: int

# Full Debt Advice Response

class DebtsAdvice(BaseModel):# note 1 solved.
    monthlyProjections: List[MonthlyProjection]
    debts: List[Debt]
    riskMetrics: RiskMetrics

# later to add goalsAdvice.
#class GoalsAdvice(BaseModel):
    # add fields later.

# for note 2 : the name (QuestionnarieResponse) referese to the following:
# (when Questionnarie is submited by user in frontend, the backend will receive it, then it will call the-
#   ai using langchain, then ai will respond to this call with some advices..., so this respond is called QuestionnarieResponse) it means the response of the questionnarie call.
# also note that this name will not effect the route, the route uses (data) as a name of the object of this class so dont worry about it.

# DTO for Questionnarie response. direction(AI --> backend --> frontend).
class QuestionnarieResponse(BaseModel):
    # notes 3, 4 and 5 solved.
    protectionAdvice:ProtectionAdvice 
    debtsAdvice     :DebtsAdvice     
    # Note :  advice for goals  will be added later.

