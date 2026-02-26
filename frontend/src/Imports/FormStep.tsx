//types
import { type FormStepProps } from "../Types/FormStepProps";

// custom hook(s)
import useFormStep from "../CustomHooks/useFormStep";

// custome or  standard functions
import { handleDemoSubmit } from "../Functions/api/reusable_functions/handleDemoSubmit";

//reusable components
import { InvestmentAccountsSection } from "./InvestmentAccountsSection";
import { FinancialGoalsSection } from "./FinancialGoalsSection";
import { Button } from "./Button";
import { ArrowRight } from "lucide-react";
import React from "react";

  
// Rendering 
export  default function FormStep({finishedProcessing, setIsLoading,setFinishedProcessing,setFinishedOnboarding,investment_accounts,financial_goals, setInvestmentAccounts, setGoals, handleBack, handleNext,isLoading}:FormStepProps ){
   // custome hook is called.
   const {
    payload,
    url,
    localStorageKey
   }=useFormStep({investment_accounts,financial_goals });
    

   {/* Step 2 in Demo: context collection : */} 
   return(
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="text-center py-16">

          {/** Optional : provide  condtionally Rendered error massege here */}


          {/** cards are conditionally rendered , only if backend  processing is not done  */}
          {!finishedProcessing &&(
            
            <form onSubmit={
              async (e: React.SubmitEvent<HTMLFormElement>)=>{
                     
                   handleDemoSubmit ({e,setIsLoading, payload, url, localStorageKey, setFinishedProcessing, setFinishedOnboarding })
              }  
                  
            }>
              {/* Investment Accounts */}
              <InvestmentAccountsSection
                accounts={investment_accounts}
                onUpdate={setInvestmentAccounts}
              />
              {/* Financial Goals */}
              <FinancialGoalsSection
                goals={financial_goals}
                onUpdate={setGoals}
              />
              <Button type="submit" variant="primary" className="translate-y-5  translate-x-[-15px]">{isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                We are processing your info...
              </>
                ) : (
                  "Submit"
                )}</Button>
            </form>

          )}

          {/** success msg is rendered, only if processing is done successfully  */}
            {finishedProcessing&& (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center py-16">
                <h1>We have Finished processing your data.  now you can see the result in the next step</h1>

              </div>

            </div>
            )}
          
          {/**buttons */}
          <div className="flex gap-4 justify-center translate-y-12">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {finishedProcessing?(<p>I want to update my info</p>):(<p>back</p>)}
            </button>
            <button
              disabled={!finishedProcessing}
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors flex items-center gap-2  disabled:cursor-not-allowed disabled:opacity-50"
            >
                Continue
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        
        </div>
      </div>
   );     


}