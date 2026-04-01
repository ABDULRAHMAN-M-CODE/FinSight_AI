from pydantic import BaseModel,Field
from typing import List, Literal
from datetime import date
# Protection Gap Section


# default data makes the AI think that the field is not required , they are now reomved
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
    monthlyProjections: List[MonthlyProjection]
    debts: List[Debt]
    riskMetrics: RiskMetrics


class  FinancialGoal(BaseModel):
    id: int
    name: str
    target: int
    deadline: int
    currentAssets: int#=0


class Investment(BaseModel):

    id: int
    name: str
    currentValue: int
    riskTier: Literal['Conservative' , 'Balanced' , 'Growth']


class ProbabilityPoint(BaseModel):
    contribution:  int#=0
    riskTier: Literal ['Conservative' , 'Balanced' , 'Growth']
    probability: int#=0    

class GoalProbabilityData(BaseModel):
    
    goalId: int
    contributionRiskMatrix: List[ProbabilityPoint]
    
    
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
    impactSummary: ImpactSummary 


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
    



from app.core.finance.successive_value_modeling import FullDebtsUiData
from app.core.finance.portfolio_construction import InvestementsAdviceMocks
class FullAdviceData(BaseModel):
    #fullDebtsUiData:FullDebtsUiData   # commented for testing, change those names.
    investementsAdvice:InvestementsAdviceMocks 

