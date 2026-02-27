import {z} from "zod"
export const StrategicTimeHorizonMapSchema= z.object({
    id:z.string(),
    name: z.string(),
    type: z.string(),
    target_date: z.string(),
    years_away: z.number(),
    riskLevel:z.enum(["low","high"]),
    allocation_status:z.string(),
    advice:z.string()  
})
export const  TaxEfficiencyOptimizerSchema=z.object({
    name: z.string(),
    type: z.string(),
    balance: z.number(),
    status: z.string(),  
    tax_category: z.enum(["Taxable", "Tax-Deferred", "Tax-Free"]),
    efficiency: z.number(),
    linked_goals: z.array(z.string()),
    tax_strategy_advice: z.string () 
})    

export const LimitedAdviceSchema=z.object({
  strategic_time_horizon_map: z.array(StrategicTimeHorizonMapSchema) ,
  tax_efficiency_optimizer:z.array(TaxEfficiencyOptimizerSchema)
})