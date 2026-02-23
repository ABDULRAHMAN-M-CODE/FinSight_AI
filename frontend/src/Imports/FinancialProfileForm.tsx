import { useState } from 'react';
import { 
  Briefcase, 
} from 'lucide-react';
import { HouseholdIncomeSection } from './HouseholdIncomeSection';
import { MonthlyBudgetSection } from './MonthlyBudgetSection';
import { InvestmentAccountsSection } from './InvestmentAccountsSection';
import { OutstandingDebtsSection } from './OutstandingDebtsSection';
import { LifeInsuranceSection } from './LifeInsuranceSection';
import { FinancialGoalsSection } from './FinancialGoalsSection';
import type { HouseholdMember } from '../Types/HouseHoldMember';
import type { InvestmentAccount } from '../Types/InvestmentAccount';
import type { Debt } from '../Types/Debt';
import type { Goal } from '../Types/Goal';
import type { InsuranceInfo } from '../Types/InsuranceInfo';
function useFinancialProfileForm(){
 
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([
    { id: Date.now() ,member_name: '', annual_income: 0, income_source: '' }
  ]);
  
// After
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  
  const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>([
    { id: Date.now() , name: '', type: '', current_balance: 0, is_active: true }
  ]);
  
  const [debts, setDebts] = useState<Debt[]>([
    { id: Date.now() , type: '', balance: 0, monthly_payment:0, interest_rate:0 }
  ]);
  
const [insurance, setInsurance] = useState<InsuranceInfo[]>([
  { insurance_type: '', death_benefit: 0, cash_value: 0, monthly_premium: 0 }
]);
  
  const [goals, setGoals] = useState<Goal[]>([
    { id: Date.now() , name: '', type: 'short-term', target_amount: 0, deadline: '' }
  ]);
  

  return{
     householdMembers
     ,setHouseholdMembers
     , monthlyBudget
     ,setMonthlyBudget
    ,investmentAccounts
    ,setInvestmentAccounts
    ,debts
    ,setDebts
    ,insurance
    ,setInsurance
    ,goals
    ,setGoals
  }

}
export default function FinancialProfileForm  ()  {
 
  const {householdMembers
     ,setHouseholdMembers     
     , monthlyBudget
     ,setMonthlyBudget
     , investmentAccounts
     ,setInvestmentAccounts,
    debts
    ,setDebts
    ,insurance
    ,setInsurance
    ,goals
    ,setGoals} = useFinancialProfileForm();
 
    return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-gray-900 mb-2">Financial Profile</h1>
        <p className="text-gray-600 text-sm">
          Help us understand your financial situation to provide personalized guidance
        </p>
      </div>

      {/* Household Income */}
      <HouseholdIncomeSection
        members={householdMembers}
        onUpdate={setHouseholdMembers}
      />

      {/* Monthly Household Budget */}
      <MonthlyBudgetSection
        budget={monthlyBudget}
        onUpdate={setMonthlyBudget}
      />

      {/* Investment Accounts */}
      <InvestmentAccountsSection
        accounts={investmentAccounts}
        onUpdate={setInvestmentAccounts}
      />
      {/* Financial Goals */}
      <FinancialGoalsSection
        goals={goals}
        onUpdate={setGoals}
      />
      {/* Outstanding Debts */}
      <OutstandingDebtsSection
        debts={debts}
        onUpdate={setDebts}
      />

      {/* Life Insurance Coverage */}
      <LifeInsuranceSection
        insuranceList={insurance}
        onUpdate={setInsurance}
      />



    </div>
  );
};
