   // shape of AI response
   export interface limitedAdvice {
  strategic_time_horizon_map: Array<{
    goal_id: string;
    goal_name: string;
    timeline_alignment_summary: string;
    goal_advice: string;
  }>;
  tax_efficiency_optimizer: Array<{
    account_id: string;
    account_name: string;
    account_type: string;
    efficiency_score_percent: number;
    funding_goals: Array<{ goal_id: string; goal_name: string }>;
    tax_strategy_analysis: string;
  }>;
}