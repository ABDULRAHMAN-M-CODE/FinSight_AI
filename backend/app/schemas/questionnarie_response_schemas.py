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
    #householdIncome: float  , # Note 1:  sorry this should not exist, because my UI does not even use it
    monthlyProjections: List[MonthlyProjection]
    debts: List[Debt]
    riskMetrics: RiskMetrics

# DTO for Questionnarie response. direction(AI --> backend --> frontend).

# Note 2 : this name is so bad , why would you even call it  "QuestionnarieResponse" ?? the name is so misleading.
#Justification to change the  name  : AI sends data backend, so it should called something like : FullAiResponse, 
#Frontend's questionarry is not even fucking  envolved .
class QuestionnarieResponse(BaseModel):
    protectionAdvice: List [ProtectionAdvice] = Field(default_factory=list) # Note 3 : why this is array ?  this should  be object, not List of Objects!!!
    debtsAdvice: List [DebtsAdvice] = Field(default_factory=list)          # Note 4 : why this is array ?  this should  be object, not List of Objects!!!
    
    # Note 5 : Suggested fix by me 
    #protectionAdvice:ProtectionAdvice #(instead of List)
    #debtsAdvice     :DebtsAdvice     #(instead of List)

    # Note :  advice for goals  will be added later.
    # Note :  advice for goals will be added later.
