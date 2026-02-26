export type  MonthlyProjection= {
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


export type  RiskMetrics ={
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



/** Run time validation using zod library */
import {z} from "zod";

const MonthlyProjectionSchema=z.object({
  month: z.number(),
  totalDebt: z.number(),
  highInterestDebt: z.number(),
  debtToIncome: z.number(),
  interestCost: z.number()
})
const DebtDataSchema=z.object({
  id: z.number(),
  name: z.string(),
  balance: z.number(),
  interestRate: z.number(),
  riskLevel: z.enum(["High", "Medium", "Low"]),
  type: z.string()
})
const RiskMetricsSchema=z.object({
    debtToIncomeRatio: z.number(),
  highInterestDebtRatio: z.number(),
  monthlyDebtBurden: z.number(),
  estimatedDebtFreeDate: z.string(),
  totalInterestSavings: z.number(),
  monthsSaved: z.number()
})
export const DebtAdviceSchema=z.object({
  monthlyProjections: z.array(MonthlyProjectionSchema),
  debts: z.array(DebtDataSchema),
  riskMetrics: RiskMetricsSchema
})