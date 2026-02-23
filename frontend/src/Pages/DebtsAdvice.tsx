// types and interfaces : Contracts/ Schemas for data format/shape 

import { DebtRiskVisualization } from '../Imports/DebtRiskVisualization';// mock data contract 

// premade components
import { type DebtData } from '../Types/DebtAdviceContract';





// replace with actual advice that is stored in the local storage  
export const debtsAdvice = {
  
  monthlyProjections: [
    { month: 0, totalDebt: 86200, highInterestDebt: 20700, debtToIncome: 0.52, interestCost: 950 },
    { month: 6, totalDebt: 78400, highInterestDebt: 15200, debtToIncome: 0.47, interestCost: 820 },
    { month: 12, totalDebt: 69800, highInterestDebt: 9500, debtToIncome: 0.42, interestCost: 680 },
    { month: 18, totalDebt: 60200, highInterestDebt: 4100, debtToIncome: 0.36, interestCost: 520 },
    { month: 24, totalDebt: 49500, highInterestDebt: 0, debtToIncome: 0.30, interestCost: 380 },
    { month: 30, totalDebt: 38200, highInterestDebt: 0, debtToIncome: 0.23, interestCost: 240 },
    { month: 36, totalDebt: 26100, highInterestDebt: 0, debtToIncome: 0.16, interestCost: 150 },
  ]
,
  debts: [
    {
      id: 1,
      name: 'Credit Card A',
      balance: 12500,
      interestRate: 22.99,
      riskLevel: 'High',
      type: 'Credit Card',

    },
    {
      id: 2,
      name: 'Credit Card B',
      balance: 8200,
      interestRate: 19.49,
      riskLevel: 'High',
      type: 'Credit Card'
      
    },
    {
      id: 3,
      name: 'Auto Loan',
      balance: 18500,
      interestRate: 6.75,
      riskLevel: 'Medium',
      type: 'Auto Loan'

    },
    {
      id: 4,
      name: 'Personal Loan',
      balance: 15000,
      interestRate: 11.5,
      riskLevel: 'Medium',
      type: 'Personal Loan'

    },
    {
      id: 5,
      name: 'Student Loan',
      balance: 32000,
      interestRate: 4.25,
      riskLevel: 'Low',
      type: 'Student Loan'

    }
  ],

  riskMetrics: {
    debtToIncomeRatio: 0.52, // 52%
    highInterestDebtRatio: 0.38, // 38% of total debt is high-interest
    monthlyDebtBurden: 0.22, // 22% of monthly income
    estimatedDebtFreeDate: '2028-06-15',
    totalInterestSavings: 4010, // From optimized strategy
    monthsSaved: 14
  },

};


export default function DebtsAdvice() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Debt Risk Stress Analysis</h1>
          <p className="text-gray-600">
            Structural risk assessment and mitigation strategy
          </p>
        </div>

        {/* Main Rendered component */}
        <section>
          <DebtRiskVisualization 
            monthlyProjections={debtsAdvice.monthlyProjections}
            debts={debtsAdvice.debts as DebtData[]}
            riskMetrics={debtsAdvice.riskMetrics}
          />
        </section>
      </div>
    </div>
  );
}