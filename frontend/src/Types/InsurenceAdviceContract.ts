// replace this import with  the actual type
import { type Recommendation } from '../Imports/CoverageRecommendations';
export type MonthlyData={
  month:number;
  required:number;
  current:number;
  gap:number;
}

export type  ProtectionGap={
   currentCoverage:number;
   requiredCoverage: number;
   gap:number;
   annualIncome:number;
   yearsToRetirement:number;
   incomeReplacementRate: number;
   monthlyData: MonthlyData[];

}
// Top level type
export type  InsurenceAdviceContract={
  protectionGap:ProtectionGap;
  recommendations:Recommendation[];
}



import {z} from "zod"
const monthlyDataSchema= z.object({
  month: z.number(),
  required: z.number(),
  current: z.number(),
  gap: z.number()      
})
const protectionGapSchema=z.object({
    currentCoverage:z.number(),
    requiredCoverage: z.number(),
    gap:z.number(),
    annualIncome:z.number(),
    yearsToRetirement:z.number(),
    incomeReplacementRate: z.number(),
    monthlyData: z.array(monthlyDataSchema)       
})

const recommendaionSchema=z.object({
    id: z.number(),
    policyName: z.string(),
    currentCoverage: z.number(),
    recommendedCoverage: z.number(),
    gap: z.number(),
    action: z.string(),
    priority: z.enum(["Low", "Medium", "High"]),
    reason:z.string(),
    estimatedCost: z.string()
})
  // top level schema
export const protectionAdviceSchema= z.object({
  protectionGap:protectionGapSchema,
  recommendations:z.array(recommendaionSchema)
})