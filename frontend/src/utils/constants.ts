import {  type MonthlyProjection } from "../Types/DebtAdviceContract"
import { type DebtData } from "../Types/DebtAdviceContract"
import { type RiskMetrics } from "../Types/DebtAdviceContract"  
import { type DebtAdviceContract } from "../Types/DebtAdviceContract"
const monthlyProjectionDefault: MonthlyProjection={
    month: 1,
    totalDebt: 1,
    highInterestDebt: 1,
    debtToIncome: 1,
    interestCost: 1,
  }
  const debtDataDefault:DebtData={
    id: 1,
    name: "no balance",
    balance: 1,
    interestRate: 1,
    riskLevel: "Low" ,
    type: "no type"
  }
  const RiskMetrics:RiskMetrics={
    debtToIncomeRatio: 1,
    highInterestDebtRatio: 1,
    monthlyDebtBurden: 1,
    estimatedDebtFreeDate: "No estimatedDebtFreeDate",
    totalInterestSavings: 1,
    monthsSaved: 1,
  }
  export const debtsAdviceDefaults:DebtAdviceContract={
    monthlyProjections: [monthlyProjectionDefault],
    debts: [debtDataDefault],
    riskMetrics: RiskMetrics
  }
  import { type MonthlyData } from "../Types/InsurenceAdviceContract"
    const monthlyDataDefaults:MonthlyData={
      month: 0,
      required: 0.0,
      current: 0,
      gap: 0
    }
    import { type ProtectionGap } from "../Types/InsurenceAdviceContract"
    const protectionGapDefaults:ProtectionGap={
     currentCoverage:0.0,
     requiredCoverage: 0.0,
     gap:0.0,
     annualIncome:0.0,
     yearsToRetirement:25,
     incomeReplacementRate: 0.7,
     monthlyData: [monthlyDataDefaults]    
    }
  
    import { type Recommendation } from "../Imports/CoverageRecommendations"
    const recommendationsDefault:Recommendation={
      id: 0,
      policyName: "No action required",
      currentCoverage: 0.0,
      recommendedCoverage: 0.0,
      gap: 0.0,
      action: "No Adjustements needed",
      priority:  "Low",
      reason:"No protection gap detected",
      estimatedCost: "0"
    }
  
    import { type InsurenceAdviceContract } from "../Types/InsurenceAdviceContract"
  
    
      export const  protectionAdviceDefaults: InsurenceAdviceContract={
        protectionGap:protectionGapDefaults,
        recommendations: [recommendationsDefault]
      }
    import { type ImpactSummary } from "../Types/GoalsAndInvestementsAdviceContract"
    import { type StrategyDirective } from "../Types/GoalsAndInvestementsAdviceContract"
    import { type OptimalStrategy } from "../Types/GoalsAndInvestementsAdviceContract"
    const  defaultimpactSummary:ImpactSummary={
          probabilityImprovement:0,
          projectedGain:0
        }
    const defaultDirectives:StrategyDirective={
        id: 0,
        type: 'liquidity',
        title: "default",
        value: "default",
        description: "default"
    }
        
    export const defaultOptimalStrategy: OptimalStrategy = {
    directives: [defaultDirectives],
    impactSummary: defaultimpactSummary
    
    };

    import { type TrajectoryPoint } from "../Types/GoalsAndInvestementsAdviceContract"
    const defaultCurrentPath: TrajectoryPoint  = {
        year: new Date().getFullYear(), // date 
        currentMedian: 0.0,
        optimizedMedian: 0.0,
        current10th: 0.0,
        optimized10th: 0.0
    };
    import { type FinancialTrajectoryDivergence } from "../Types/GoalsAndInvestementsAdviceContract"
  export const defaultFinancialTrajectoryDivergence: FinancialTrajectoryDivergence = {
      currentPath: [defaultCurrentPath],
      text2: "No advice"
    };
import { type FinancialGoalResponse } from "../Types/GoalsAndInvestementsAdviceContract"
    export const defaultGoals: FinancialGoalResponse = {
        id: 0,
        name: "No Goal detected",
        target: 0,
        deadline: new Date().getFullYear(), // Year, Not number
        currentAssets: 0
    };

    import { type ProbabilityPoint } from "../Types/GoalsAndInvestementsAdviceContract"
     const defaultContributionRiskMatrix:ProbabilityPoint  = {
        contribution:0,
        riskTier:'Conservative',
        probability:0
     };    

     import { type GoalProbabilityData } from "../Types/GoalsAndInvestementsAdviceContract"
    const defaultDataPerGoal:GoalProbabilityData  = {
      goalId: 0,
      contributionRiskMatrix: [defaultContributionRiskMatrix]
  };

    import { type GoalProbabilitySurface } from "../Types/GoalsAndInvestementsAdviceContract"
  
    export const defaultGoalProbabilitySurface: GoalProbabilitySurface = {
    dataPerGoal: [defaultDataPerGoal],// fix the default value
    text2: "No advice"
  };  
  export const riskOrder = ['Growth', 'Balanced', 'Conservative'];