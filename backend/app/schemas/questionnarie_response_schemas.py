from pydantic import BaseModel,Field
from typing import List, Literal
from datetime import date
# Protection Gap Section


# default data makes the AI think that the field is not required , they are now reomved
class MonthlyData(BaseModel):
    month: int#=0
    required: float#=0.0
    current: float#=0.0
    gap: float#=0.0


class ProtectionGap(BaseModel):
    currentCoverage: float#=0.0
    requiredCoverage: float#=0.0
    gap: float#=0.0
    annualIncome: float#=0.0
    yearsToRetirement: int#=25
    incomeReplacementRate: float#=0.7
    monthlyData: List[MonthlyData]#=Field(default_factory=lambda:[MonthlyData()])# List is mutable, need a default factory to prevent instance sharing between objects.
    #default_factory always expects callable, that callable must return expression/value, lambda satisfies this without the need for 'return' keyword

# Recommendations Section

class Recommendation(BaseModel):
    id: int#=0
    policyName: str#="No action required"
    currentCoverage: float#=0.0
    recommendedCoverage: float#=0.0
    gap: float#=0.0
    action: str#="No Adjustements needed"
    priority: Literal["High", "Medium", "Low"]#="Low"
    reason: str#="No protection gap detected"
    estimatedCost: str#="0"


# Full Partial Response

class ProtectionAdvice(BaseModel):
    protectionGap: ProtectionGap#=Field(default_factory=ProtectionGap)# default is single object
    recommendations: List[Recommendation]#=Field(default_factory=lambda:[Recommendation()]) # default is List that contains a single object


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
    monthlyProjections: List[MonthlyProjection]
    debts: List[Debt]
    riskMetrics: RiskMetrics


class  FinancialGoal(BaseModel):
    id: int#=0
    name: str#="No Goal detected"
    target: int#=0
    deadline: int#=date.today().year  #default is the current year if missing in the AI response.
    currentAssets: int#=0


class Investment(BaseModel):

    id: int#=0
    name: str#="No Investement detected"
    currentValue: int#=0
    riskTier: Literal['Conservative' , 'Balanced' , 'Growth']#="Conservative" 


class ProbabilityPoint(BaseModel):
    contribution:  int#=0
    riskTier: Literal ['Conservative' , 'Balanced' , 'Growth']#='Conservative'
    probability: int#=0    

class GoalProbabilityData(BaseModel):
    
    goalId: int
    contributionRiskMatrix: List[ProbabilityPoint]#=Field(default_factory=lambda:[ProbabilityPoint()])
    
    
class  TrajectoryPoint(BaseModel):
    year: int
    currentMedian: float 
    optimizedMedian:  float
    current10th: float
    optimized10th: float
    
    
    

class StrategyDirective(BaseModel):
    id: int
    type: Literal['contribution' , 'allocation' , 'liquidity' , 'timeline' , 'consolidation']
    title: str
    value: str 
    description: str


class ImpactSummary(BaseModel):

    probabilityImprovement: int
    projectedGain: int

class OptimalStrategy (BaseModel):
    directives: List[StrategyDirective]
    impactSummary: ImpactSummary  # passing ImpactSummary() would be wrong, we  should pass a callable , not an object


class GoalProbabilitySurface (BaseModel):

    dataPerGoal: List[GoalProbabilityData]
    text2: str


class FinancialTrajectoryDivergence(BaseModel):
    currentPath: List[TrajectoryPoint]
    text2: str
class GoalsAndInvestementsAdvice(BaseModel):
    

    goals: List [FinancialGoal]
    investments: List[Investment]
    optimalStrategy: OptimalStrategy
    goalProbabilitySurface: GoalProbabilitySurface
    financialTrajectoryDivergence: FinancialTrajectoryDivergence
    


# DTO for Questionnarie response. direction(AI --> backend --> frontend).

# thus, frontend will define interface/type that expects three fields : protectionAdvice, debtsAdvice,  and goalsAndInvestementsAdvice.
class FullAiResponse(BaseModel):
    protectionAdvice:ProtectionAdvice
    debtsAdvice:DebtsAdvice  
    goalsAndInvestementsAdvice:GoalsAndInvestementsAdvice
    

