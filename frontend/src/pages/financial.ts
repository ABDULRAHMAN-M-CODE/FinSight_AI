export interface HouseholdMember {
  name: string;
  income: string;
  source: string;
}

export interface InvestmentAccount {
  id: string;
  accountName: string;
  accountType: string;
  currentBalance: string;
  isActive: boolean;
}

export interface Debt {
  id: string;
  type: string;
  balance: string;
  monthlyPayment: string;
  interestRate: string;
}

export interface Goal {
  id: string;
  name: string;
  type: 'short-term' | 'long-term';
  targetAmount: string;
  deadline: string;
}

export interface InsuranceInfo {
  type: string;
  deathBenefit: string;
  cashValue: string;
  monthlyPremium: string;
}
