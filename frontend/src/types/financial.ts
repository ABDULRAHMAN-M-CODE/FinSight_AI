export interface HouseholdMember {
  member_name: string;
  annual_income: number ;
  income_source: string;

}

export interface InvestmentAccount {
  id: string;
  name: string;
  type: string;
  current_balance: number ;
  is_active : boolean;
}

export interface Goal {
  id: string;
  name: string;
  type: "short-term" | "long-term";
  target_amount: number;
  deadline: string ;

}


export interface Debt {
  id: string;
  type: string;
  balance: number ;
  monthly_payment: number;
  interest_rate: number;

}

export interface InsuranceInfo {
  insurance_type: string;
  death_benefit: number ;
  cash_value: number ;
  monthly_premium: number ;
}




export interface QuestionnaireSubmit {
  household_income: HouseholdMember[];
  monthly_budget: number;
  investment_accounts: InvestmentAccount[];
  outstanding_debts: Debt[];
  life_insurance: InsuranceInfo[];
  financial_goals: Goal[];
}
