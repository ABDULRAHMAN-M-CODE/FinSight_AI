   // shape of Demo AI response
   export interface limitedAdvice {
    strategic_time_horizon_map: Array<{
    id:string;
    name: string;
    type: string;
    target_date: string;
    years_away: number
    riskLevel:"low"| "high";
    allocation_status:string;
    advice:string;
  }>;
  tax_efficiency_optimizer: Array<{
    name: string;
    type: string;
    balance: number;
    status: string // = "Active"; 
    tax_category: "Taxable"| "Tax-Deferred"| "Tax-Free";
    efficiency: number
    linked_goals: string[];
    tax_strategy_advice: string
  }>;
}

type StrategicTimeHorizonMapContract={
    id:string;
    name: string;
    type: string;
    target_date: string;
    years_away: number
    riskLevel:"low"| "high";
    allocation_status:string;
    advice:string;
}
const StrategicTimeHorizonMapDefaults:StrategicTimeHorizonMapContract={
    id:"Default  id ",
    name: "Default name",
    type: "Default type",
    target_date: "default target_date",
    years_away: 0,
    riskLevel:"low",
    allocation_status:"Default allocation_status",
    advice:'Default Advice'

}

type TaxEfficiencyOptimizerContract={
    name: string;
    type: string;
    balance: number;
    status: string // = "Active"; 
    tax_category: "Taxable"| "Tax-Deferred"| "Tax-Free";
    efficiency: number
    linked_goals: string[];
    tax_strategy_advice: string
}
const TaxEfficiencyOptimizerDefaults:TaxEfficiencyOptimizerContract={
      name: "Default tax name",
    type: "Defualt tax type",
    balance: 0,
    status: "Default Stauts", 
    tax_category: "Taxable",
    efficiency: 0,
    linked_goals: ["Default Linked Goals"],
    tax_strategy_advice: "Default tax_strategy_advice"
}
export const LimitedAdviceDefaults:limitedAdvice={
  strategic_time_horizon_map:  [StrategicTimeHorizonMapDefaults],
  tax_efficiency_optimizer: [TaxEfficiencyOptimizerDefaults]
}