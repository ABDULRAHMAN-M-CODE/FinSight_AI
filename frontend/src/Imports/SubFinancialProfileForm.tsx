import { useState } from 'react';
import { InvestmentAccountsSection } from './InvestmentAccountsSection';
import { FinancialGoalsSection } from './FinancialGoalsSection';
import { type InvestmentAccount } from '../Types/InvestmentAccount';
import { type Goal } from '../Types/Goal';
function useSubFinancialProfileForm(){

  const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>([
    { id: Date.now() , name: '', type: '', current_balance: 0, is_active: true }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: Date.now() , name: '', type: 'short-term', target_amount:0, deadline: '' }
  ]);

  return{

    investmentAccounts,
    setInvestmentAccounts,
    goals,
    setGoals
  }

}
export default function SubFinancialProfileForm(){

 
  const {
    investmentAccounts,
    setInvestmentAccounts,
    goals,
    setGoals} = useSubFinancialProfileForm();


    return (
       <>
                {/* Investment Accounts */}
            <InvestmentAccountsSection accounts={investmentAccounts} onUpdate={setInvestmentAccounts}/>

            {/* Financial Goals */}
            <FinancialGoalsSection goals={goals} onUpdate={setGoals}/>
      </>
    );


} 