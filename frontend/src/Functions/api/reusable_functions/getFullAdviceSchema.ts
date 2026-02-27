
// library 
import {z} from "zod"

// schemas
import { protectionAdviceSchema } from "../../../Types/InsurenceAdviceContract";
import { DebtAdviceSchema } from "../../../Types/DebtAdviceContract";


// types 
import { GoalsAndInvestementsAdviceSchema } from "../../../Types/GoalsAndInvestementsAdviceContract";

export const FullAdviceSchema=z.object({
  protectionAdvice:protectionAdviceSchema,
  debtsAdvice:DebtAdviceSchema,
  goalsAndInvestementsAdvice:GoalsAndInvestementsAdviceSchema      
})


