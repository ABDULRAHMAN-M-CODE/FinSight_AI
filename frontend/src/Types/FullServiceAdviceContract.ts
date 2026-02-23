import { type InsurenceAdviceContract } from "./InsurenceAdviceContract";
import { type DebtAdviceContract } from "./DebtAdviceContract";
import { type GoalsAndInvestementsAdviceContract } from "../Types/GoalsAndInvestementsAdviceContract";


export type FullServiceAdviceContract={
  protectionAdvice:InsurenceAdviceContract;
  debtsAdvice:DebtAdviceContract;
  goalsAndInvestementsAdvice:GoalsAndInvestementsAdviceContract;
}
