   // shape of AI response
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
