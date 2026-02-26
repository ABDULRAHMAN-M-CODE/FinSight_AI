// Note 1: The types are already  specified (as React TypeScript code) , they are not schema yet, all you have to do is to turn it into python pydantic schema.
// Note 2'export type ' is just a typescript syntax, replace it with Pydantic class.
// Note 3 : all the following is new and must be implmented

import z from "zod";


//Must be  Used in  the top level pydantic schema .
export type FinancialGoalResponse= {
  id: number;
  name: string;
  target: number;
  deadline: number; // Year
  currentAssets: number;
}

//Must be  Used in  the top level pydantic schema .
export type InvestmentResponse ={
  id: number;
  name: string;
  currentValue: number;
  riskTier: 'Conservative' | 'Balanced' | 'Growth';
}

//not used in the top level schema, it's only used in the ' GoalProbabilityData' only.
export type ProbabilityPoint ={
  contribution: number;
  riskTier: 'Conservative' | 'Balanced' | 'Growth';
  probability: number;
}

//Must be  Used in  the top level pydantic schema .
export type GoalProbabilityData ={
  goalId: number;
  contributionRiskMatrix: ProbabilityPoint[];
}



//Must be  Used in  the top level pydantic schema .
export  type TrajectoryPoint ={
  year: number; // date 
  currentMedian: number;
  optimizedMedian: number;
  current10th: number;
  optimized10th: number;
}

//Must be  Used in  the top level pydantic schema .
export type StrategyDirective ={
  id: number;
  type: 'contribution' | 'allocation' | 'liquidity' | 'timeline' | 'consolidation';
  title: string;
  value: string; // e.g., "$500", "12%", "1 year"
  description: string;
}


//Must be  Used in  the top level pydantic schema .
export type ImpactSummary ={
  probabilityImprovement: number; // percentage points
  projectedGain: number; // dollar amount
}

export type OptimalStrategy={
  directives:StrategyDirective[];
  impactSummary: ImpactSummary;
}
 export type GoalProbabilitySurface= {
    dataPerGoal: GoalProbabilityData[];
    text2: string; // Dynamic advice
  };
 
 
  export type FinancialTrajectoryDivergence= {
    currentPath: TrajectoryPoint[];
    text2: string; 
  };


// Top level  Pydantic schema (currently it's a type, turn it to schema).
export type GoalsAndInvestementsAdviceContract ={
  goals: FinancialGoalResponse[];
  investments: InvestmentResponse[];
  
  optimalStrategy: {
    directives: StrategyDirective[];
    impactSummary: ImpactSummary;
  };
  
  goalProbabilitySurface: {
    dataPerGoal: GoalProbabilityData[];
    text2: string; // Dynamic advice
  };

  financialTrajectoryDivergence: {
    currentPath: TrajectoryPoint[];
    text2: string; // Dynamic advice
  };
}



const FinancialGoalResponseSchema=z.object({
  id: z.number(),
  name: z.string(),
  target: z.number(),
  deadline: z.number(), // Year
  currentAssets: z.number()
})

const InvestementResponseSchema=z.object({
  id: z.number(),
  name: z.string(),
  currentValue: z.number(),
  riskTier: z.union([
  z.literal('Conservative'),
    z.literal('Balanced'), 
    z.literal( 'Growth')

  ])
})

const StrategyDirectiveSchema=z.object({
  id: z.number(),
  type: z.union([
    z.literal('contribution'),
    z.literal( 'allocation') , 
    z.literal('liquidity' ), 
    z.literal('timeline') , 
    z.literal('consolidation')
  ]),
  title: z.string(),
  value: z.string(), // e.g., "$500", "12%", "1 year"
  description: z.string()
})
const ImpactSummarySchema=z.object({
    probabilityImprovement: z.number(), // percentage points
  projectedGain: z.number() // dollar amount
})

const ProbabilityPointSchema=z.object({
    contribution: z.number(),
  riskTier: z.union([
  z.literal('Conservative'), 
   z.literal('Balanced') ,
   z.literal( 'Growth')
  ]),
  probability: z.number()
})
const GoalProbabilityDataSchema=z.object({
  goalId: z.number(),
  contributionRiskMatrix: z.array(ProbabilityPointSchema)
})

const TrajectoryPointSchema=z.object({
  year: z.number(), // date 
  currentMedian: z.number(),
  optimizedMedian: z.number(),
  current10th: z.number(),
  optimized10th: z.number()
})
export const GoalsAndInvestementsAdviceSchema=z.object({
  goals: z.array(FinancialGoalResponseSchema),
  investments: z.array(InvestementResponseSchema),
  
  optimalStrategy: z.object({
    directives: z.array(StrategyDirectiveSchema),
    impactSummary: ImpactSummarySchema
  }),
  
  goalProbabilitySurface: z.object({
    dataPerGoal: z.array(GoalProbabilityDataSchema),
    text2: z.string() 
  }),

  financialTrajectoryDivergence:z.object( {
    currentPath: z.array(TrajectoryPointSchema),
    text2: z.string() 
  })
})






