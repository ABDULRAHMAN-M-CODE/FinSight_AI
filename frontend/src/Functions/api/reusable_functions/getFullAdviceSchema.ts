
import {z} from "zod"
import { protectionAdviceSchema } from "../../../Types/InsurenceAdviceContract";
import { DebtAdviceSchema } from "../../../Types/DebtAdviceContract";
import { GoalsAndInvestementsAdviceSchema } from "../../../Types/GoalsAndInvestementsAdviceContract";


export const getFullAdviceSchema=()=>{
    
    const FullAdviceSchema=z.object({
      protectionAdvice:protectionAdviceSchema,
      debtsAdvice:DebtAdviceSchema,
      goalsAndInvestementsAdvice:GoalsAndInvestementsAdviceSchema      
    })
    
    return FullAdviceSchema;
}