from pydantic import BaseModel,Field
from typing import List, Literal
from datetime import date
# Protection Gap Section

class MonthlyData(BaseModel):
    month: int=0
    required: float=0.0
    current: float=0.0
    gap: float=0.0


class ProtectionGap(BaseModel):
    currentCoverage: float=0.0
    requiredCoverage: float=0.0
    gap: float=0.0
    annualIncome: float=0.0
    yearsToRetirement: int=25
    incomeReplacementRate: float=0.7
    monthlyData: List[MonthlyData]=Field(default_factory=lambda:[MonthlyData()])# List is mutable, need a default factory to prevent instance sharing between objects.
    #default_factory always expects callable, that callable must return expression/value, lambda satisfies this without the need for 'return' keyword

# Recommendations Section

class Recommendation(BaseModel):
    id: int=0
    policyName: str="No action required"
    currentCoverage: float=0.0
    recommendedCoverage: float=0.0
    gap: float=0.0
    action: str="No Adjustements needed"
    priority: Literal["High", "Medium", "Low"]="Low"
    reason: str="No protection gap detected"
    estimatedCost: str="0"


# Full Partial Response

class ProtectionAdvice(BaseModel):
    protectionGap: ProtectionGap=Field(default_factory=ProtectionGap)# default is single object
    recommendations: List[Recommendation]=Field(default_factory=lambda:[Recommendation()]) # default is List that contains a single object


# Monthly Projections

class MonthlyProjection(BaseModel):
    month: int=0
    totalDebt: float=0.0
    highInterestDebt: float=0.0
    debtToIncome: float=0.0
    interestCost: float=0.0


# Individual Debts

class Debt(BaseModel):
    
    id: int=0
    name: str="No Debt detectd"
    balance: float=0.0
    interestRate: float=0.0
    riskLevel: Literal["High", "Medium", "Low"]="Low"
    type: str="No type detected"


# Risk Metrics

class RiskMetrics(BaseModel):
    debtToIncomeRatio: float=0.0
    highInterestDebtRatio: float=0.0
    monthlyDebtBurden: float=0.0
    estimatedDebtFreeDate: date=date.today() 
    totalInterestSavings: float=0.0
    monthsSaved: int=0

# Full Debt Advice Response

class DebtsAdvice(BaseModel):
    monthlyProjections: List[MonthlyProjection]=Field(default_factory=lambda:[MonthlyProjection()]) # default is list that contains single object
    debts: List[Debt]=Field(default_factory=lambda:[Debt()])
    riskMetrics: RiskMetrics=Field(default_factory=RiskMetrics)


class  FinancialGoal(BaseModel):
    id: int=0
    name: str="No Goal detected"
    target: int=0
    deadline: int=date.today().year  #default is the current year if missing in the AI response.
    currentAssets: int=0


class Investment(BaseModel):

    id: int=0
    name: str="No Investement detected"
    currentValue: int=0
    riskTier: Literal['Conservative' , 'Balanced' , 'Growth']="Conservative" 


class ProbabilityPoint(BaseModel):
    contribution:  int=0
    riskTier: Literal ['Conservative' , 'Balanced' , 'Growth']
    probability: int=0    

class GoalProbabilityData(BaseModel):
    
    goalId: int=0
    contributionRiskMatrix: List[ProbabilityPoint]=Field(default_factory=lambda:[ProbabilityPoint()])
    
    
class  TrajectoryPoint(BaseModel):
    year: int=date.today().year
    currentMedian: float =0.0
    optimizedMedian:  float=0.0
    current10th: float=0.0
    optimized10th: float=0.0
    
    
    

class StrategyDirective(BaseModel):
    id: int=0
    type: Literal['contribution' , 'allocation' , 'liquidity' , 'timeline' , 'consolidation']='liquidity'
    title: str="No Adjustment Required"
    value: str ="Maintain current strategy"
    description: str="Current allocation meets optimization criteria"


class ImpactSummary(BaseModel):

    probabilityImprovement: int=0 
    projectedGain: int=0

class OptimalStrategy (BaseModel):
    directives: List[StrategyDirective]=Field(default_factory=lambda:[StrategyDirective()]) 
    impactSummary: ImpactSummary =Field(default_factory=ImpactSummary) # passing ImpactSummary() would be wrong, we  should pass a callable , not an object


class GoalProbabilitySurface (BaseModel):

    dataPerGoal: List[GoalProbabilityData]=Field(default_factory=lambda:[GoalProbabilityData()])
    text2: str="no advice"

class FinancialTrajectoryDivergence(BaseModel):
    currentPath: List[TrajectoryPoint]=Field(default_factory=lambda:[TrajectoryPoint()])
    text2: str="no advice"
class GoalsAndInvestementsAdvice(BaseModel):
    

    goals: List [FinancialGoal]=Field(default_factory=lambda:[FinancialGoal()])
    investments: List[Investment]=Field(default_factory=lambda:[Investment()])
    optimalStrategy: OptimalStrategy=Field(default_factory=OptimalStrategy)
    goalProbabilitySurface: GoalProbabilitySurface=Field(default_factory=GoalProbabilitySurface) # don't pass class call, but pass a callable to prevent instance sharing.
    financialTrajectoryDivergence: FinancialTrajectoryDivergence=Field(default_factory=FinancialTrajectoryDivergence)
    


# DTO for Questionnarie response. direction(AI --> backend --> frontend).
# thus, frontend will define interface/type that expects three fields : protectionAdvice, debtsAdvice,  and goalsAndInvestementsAdvice.
class FullAiResponse(BaseModel):
    protectionAdvice:ProtectionAdvice=Field(default_factory=ProtectionAdvice)
    debtsAdvice:DebtsAdvice=Field(default_factory=DebtsAdvice)    
    
    goalsAndInvestementsAdvice:GoalsAndInvestementsAdvice=Field(default_factory=GoalsAndInvestementsAdvice)
    

