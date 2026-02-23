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
// Top level contract for Insurence Advice
export type  InsurenceAdviceContract={
  protectionGap:ProtectionGap;
  recommendations:Recommendation[];
}