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
      
      // persiste the currentStep against page reload
      // casting is used because local storage stores that  string of the value
      const key1="currentStep";
      const [currentStep, setCurrentStep]= useState( Number( localStorage.getItem(key1) ) || 1 )
      // useEffect is a solution to the repitive, manual work of updating local storage when state changes
      useEffect(
          
          () => {
            localStorage.setItem("currentStep", currentStep.toString());
          },

       [currentStep] );
/////////////////////////////////////////////////////////////////////////////////
      
      // persist a flag against page reload
       const key2="finishedOnboarding"
       const [finishedOnboarding,setFinishedOnboarding]=useState( Boolean( localStorage.getItem(key2) ) );
       // useEffect is a solution to the repitive, manual work of updating local storage when state changes
       useEffect(
          
          () => {
            localStorage.setItem("finishedOnboarding", finishedOnboarding.toString());
          },

       [finishedOnboarding] );
       
//////////////////////////////////////////////////////////////////////////////////
    
      // persistence of a flag against page reload
      // do not use Boolean class, because Boolean("false")== true , it's confusing , better to not use it.
      // no casting is needed because we do the comparison between strings
      const key3="finishedProcessing";
      const [finishedProcessing, setFinishedProcessing]= useState( localStorage.getItem(key3) ==="true" );
      // useEffect is a solution to the repitive, manual work of updating local storage when state changes
      useEffect(
          
          () => {
            localStorage.setItem("finishedProcessing", finishedProcessing.toString());
          },

       [finishedProcessing] );      
      
/////////////////////////////////////////////////////////////////////////////////////
      const [isLoading, setIsLoading]=useState(false);



      const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>([
        {  id:Date.now(),name: '', type: '', current_balance: 0, is_active: true }
      ]);

      const [goals, setGoals] = useState<Goal[]>([
        
        { id:Date.now(), name: '', type: 'short-term', target_amount:0, deadline:"" }
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