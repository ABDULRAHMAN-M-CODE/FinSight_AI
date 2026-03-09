import { type DumbDebtRiskVisualizationProps } from "../Imports/DebtRiskVisualization";
export const mockDebtRiskVisualizationData: DumbDebtRiskVisualizationProps = {
  // Top metric cards
  dtiRatio: {
    value: "45%",
    status: "Critical",
    color: "red"
  },

  highInterestExposure: {
    value: "$15,000",
    avgRate: "22.5%"
  },

  monthlyInterestCost: "$450",
  monthlyDebtBurden: "$1,200",

  // Chart data (raw numbers for Recharts)
  monthlyProjections: [
    { month: 1, totalDebt: 25000, highInterestDebt: 15000, debtToIncome: 0.45 },
    { month: 2, totalDebt: 24400, highInterestDebt: 14200, debtToIncome: 0.44 },
    { month: 3, totalDebt: 23850, highInterestDebt: 13450, debtToIncome: 0.43 },
    { month: 4, totalDebt: 23300, highInterestDebt: 12750, debtToIncome: 0.42 },
    { month: 5, totalDebt: 22750, highInterestDebt: 12050, debtToIncome: 0.41 },
    { month: 6, totalDebt: 22200, highInterestDebt: 11400, debtToIncome: 0.40 },
    { month: 7, totalDebt: 21650, highInterestDebt: 10800, debtToIncome: 0.39 },
    { month: 8, totalDebt: 21100, highInterestDebt: 10200, debtToIncome: 0.38 },
    { month: 9, totalDebt: 20550, highInterestDebt: 9600, debtToIncome: 0.37 },
    { month: 10, totalDebt: 20000, highInterestDebt: 9000, debtToIncome: 0.36 },
    { month: 11, totalDebt: 19450, highInterestDebt: 8400, debtToIncome: 0.35 },
    { month: 12, totalDebt: 18900, highInterestDebt: 7800, debtToIncome: 0.34 }
  ],

  // Formatting functions
  formatCurrency: (value: number) => `$${value.toLocaleString()}`,
  formatPercent: (value: number) => `${(value * 100).toFixed(0)}%`,

  // High risk debt breakdown
  highRiskDebts: [
    {
      id: 1,
      name: "Credit Card A",
      rate: "24.9% APR",
      balance: "$6,500"
    },
    {
      id: 2,
      name: "Credit Card B",
      rate: "21.5% APR",
      balance: "$5,000"
    },
    {
      id: 3,
      name: "Personal Loan",
      rate: "19.9% APR",
      balance: "$3,500"
    }
  ],

  totalHighRiskExposure: {
    value: "$15,000",
    percentage: "60%"
  },

  // Timeline
  mitigationTimeline: {
    debtFreeDate: "Oct 2026",
    monthsSaved: 14
  },

  // AI recommendation messages
  recommendations: {
    criticalRiskMessage:
      "Your debt-to-income ratio exceeds the recommended safe threshold (36%). Immediate repayment prioritization is advised.",
    highInterestMessage:
      "A large portion of your debt carries interest rates above 20%. Prioritizing these balances could significantly reduce long-term cost.",
    trajectoryMessage:
      "If current payments continue, your total debt is projected to decline steadily over the next 12 months."
  }
};