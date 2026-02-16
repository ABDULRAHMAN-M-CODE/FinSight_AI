import { useState } from "react";
import { useEffect } from "react";
import { type InvestmentAccount } from "../Types/InvestmentAccount";
import { type Goal } from "../Types/Goal";
// data "states"  custom hook
export function useData(){
      
      // adjust the steps as needed.
      const steps = [
        { number: 1, label: "Introduction" },
        { number: 2, label: "Financial Context" },
        { number: 3, label: "Recommendation" },
      ];
      const [currentStep, setCurrentStep]= useState( Number( localStorage.getItem("currentStep") ) || 1 )
      
      useEffect(
          
          () => {
            localStorage.setItem("currentStep", currentStep.toString());
          },

       [currentStep] );
      
       const [finishedOnboarding,setFinishedOnboarding]=useState( Boolean( localStorage.getItem("finishedOnboarding") ) );
       useEffect(
          
          () => {
            localStorage.setItem("finishedOnboarding", finishedOnboarding.toString());
          },

       [finishedOnboarding] );
       
      // do not use Boolean class, because Boolean("false")== true , it's confusing , better to not use it.
      const [finishedProcessing, setFinishedProcessing]= useState( localStorage.getItem("finishedProcessing") ==="true" );
      useEffect(
          
          () => {
            localStorage.setItem("finishedProcessing", finishedProcessing.toString());
          },

       [finishedProcessing] );      
      
      
      const [isLoading, setIsLoading]=useState(false);



      const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>([
        {  id:'',name: '', type: '', current_balance: 0, is_active: true }
      ]);

      const [goals, setGoals] = useState<Goal[]>([
        
        { id:'', name: '', type: 'short-term', target_amount:0, deadline:"" }
      ]);
      return{
        currentStep,setCurrentStep,
        finishedOnboarding,setFinishedOnboarding,
        finishedProcessing,setFinishedProcessing,
        isLoading,setIsLoading,
        steps,
        investmentAccounts,setInvestmentAccounts,
        goals,setGoals
      }
}