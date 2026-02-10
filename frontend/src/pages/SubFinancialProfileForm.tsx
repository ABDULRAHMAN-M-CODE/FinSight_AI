import { useState } from 'react';
import { InvestmentAccountsSection } from './InvestmentAccountsSection';
import { FinancialGoalsSection } from './FinancialGoalsSection';
import type {InvestmentAccount, Goal} from './financial';
function useSubFinancialProfileForm(){

  const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>([
    { id: '1', accountName: '', accountType: '', currentBalance: '', isActive: true }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: '', type: 'short-term', targetAmount: '', deadline: '' }
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