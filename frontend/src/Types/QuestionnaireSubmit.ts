
import { type HouseholdMember } from "./HouseHoldMember";
import { type InvestmentAccount } from "./InvestmentAccount";
import { type Debt } from "./Debt";
import { type InsuranceInfo } from "./InsuranceInfo";
import { type Goal } from "./Goal";
export interface QuestionnaireSubmit {
  household_income: HouseholdMember[];
  monthly_budget: number;
  investment_accounts: InvestmentAccount[];
  outstanding_debts: Debt[];
  life_insurance: InsuranceInfo[];
  financial_goals: Goal[];
}