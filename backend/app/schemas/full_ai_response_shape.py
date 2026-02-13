from pydantic import BaseModel, Field
from typing import List, Literal
 
 
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
 
from pydantic import BaseModel
from typing import List, Literal
from datetime import date
 
 
# Monthly Projections
 
class MonthlyProjection(BaseModel):
    month: int
    totalDebt: float
    highInterestDebt: float
    debtToIncome: float
    interestCost: float
 
 
# Individual Debt