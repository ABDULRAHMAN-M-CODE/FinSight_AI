type  MonthlyProjection= {
  month: number;
  totalDebt: number;
  highInterestDebt: number;
  debtToIncome: number;
  interestCost: number;
}

export type DebtData= {
  id: number;
  name: string;
  balance: number;
  interestRate: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  type: string;
}


type  RiskMetrics ={
  debtToIncomeRatio: number;
  highInterestDebtRatio: number;
  monthlyDebtBurden: number;
  estimatedDebtFreeDate: string;
  totalInterestSavings: number;
  monthsSaved: number;
}

// final contract
export type  DebtAdviceContract= {
  monthlyProjections: MonthlyProjection[];
  debts: DebtData[];
  riskMetrics: RiskMetrics;
}