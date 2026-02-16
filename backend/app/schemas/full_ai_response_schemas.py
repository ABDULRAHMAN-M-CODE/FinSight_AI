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

class DebtsAdvice(BaseModel):
    householdIncome: float
    monthlyProjections: List[MonthlyProjection]
    debts: List[Debt]
    riskMetrics: RiskMetrics

# the name of the schema is suck, the name is misleading, why the hell you mention "Questionnarie" in the name? I want you to  give proper names to the schemas.
class QuestionnarieResponseSchemas(BaseModel):
    protectionAdvice: List [ProtectionAdvice] = Field(default_factory=list)
    debtsAdvice: List [DebtsAdvice] = Field(default_factory=list)
    #advice for goals and investements
