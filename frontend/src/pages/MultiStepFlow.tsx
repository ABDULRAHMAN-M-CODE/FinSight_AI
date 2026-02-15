// Hook
import React, { useEffect, useState } from "react";

//types
import { type limitedAdvice } from "../types/limitedAdviceData"; 
import type { InvestmentAccount } from "../types/financial";
import type { Goal } from "../types/financial";
import type { HandlerProps } from "../types/HandlerProps";
import type { GenerateAdviceProps } from "../types/GenerateAdviceProps";

//custome reusable UI
import { ProgressBar } from "./ProgressBar";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import LimitedAdvice from "./LimitedAdvice";
import { InvestmentAccountsSection } from "./InvestmentAccountsSection";
import { FinancialGoalsSection } from "./FinancialGoalsSection";


// data "states" 
function useData(){

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

// API calling 
const generateAdvice = async (e: React.SubmitEvent<HTMLFormElement>, {setIsLoading,setFinishedProcessing, setFinishedOnboarding,investmentAccounts,goals}: GenerateAdviceProps)=>{
      
       // dont call custom hook inside async function or any function.
      
      // prevents page reload
      e.preventDefault();
      
      //showing the loading effect for better UX design. 
      setIsLoading(true);

      // this will be send to backend.
      const payload = {
        investment_accounts: investmentAccounts,
        financial_goals:goals, // <--- Add the 'n' here
      };

      

      // frontend → backend → LLM → backend→ frontend .
      try {
      const response = await fetch("http://127.0.0.1:8000/onboarding/demo-questionnaire", { // check URL later 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
          setIsLoading(false);
          alert("error happened")
          return;
      }

      // persist the ai response to withstand page reloads.  
      const AI_RESPONSE:limitedAdvice= await response.json();
      localStorage.setItem("AI_RESPONSE", JSON.stringify(AI_RESPONSE));

      setIsLoading(false);
      
      
      setFinishedProcessing(true);
      

      
      setFinishedOnboarding(false);
      


      } catch (error) {
      setIsLoading(false);
      // use error masseges instead of alert, better user experience.
      alert("Connection failed, please check your internet connection and try again")
      } 

};


//navigation Logic 
function useHandlers({currentStep,finishedProcessing,setFinishedProcessing,setFinishedOnboarding,setCurrentStep}:HandlerProps){
      




      const handleNext = () => {
        
        if (currentStep < 3) {
          
          if (currentStep===1){
              
              setFinishedProcessing(false);   
          }          
          if (currentStep==2){

              setFinishedOnboarding(true);
              
          } 
          setCurrentStep(currentStep + 1);
          
        }
      };
      const handleBack = () => {
        if (currentStep > 1) {
            if (currentStep===2&& finishedProcessing){
                  
                  
                  setFinishedProcessing(false);
                  

                  return // ensure the user stay in step 2  to see the form 
            }
            
          setCurrentStep(currentStep - 1);
          
        }
      };
      const didNotLikeAdvice=()=>{
          handleBack();
          setFinishedProcessing(false);
      }

      return {
        handleNext,
        handleBack,
        didNotLikeAdvice
      };
      
}

//main UI component
export  default function MultiStepFlow() {
  
  //hook rule : called once inside top level component, never inside function, conditional, or async operation.
  const
    {
        currentStep,setCurrentStep,
        finishedOnboarding,setFinishedOnboarding,
        finishedProcessing,setFinishedProcessing,
        isLoading,setIsLoading,
        steps,
        investmentAccounts,setInvestmentAccounts,
        goals,setGoals
      
    } = useData()

  const
   {
    handleNext,
    handleBack,
    didNotLikeAdvice,
   }=useHandlers({currentStep,finishedProcessing,setFinishedProcessing,setFinishedOnboarding,setCurrentStep});



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      {/* Progress Bar */}
      <div className="pt-8">
        <ProgressBar currentStep={currentStep}  steps={steps}totalSteps={3} />
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        {/* Step 1: Introduction */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Get Your Personalized Financial Recommendation
              </h1>
              <p className="text-lg text-gray-600">
                We'll guide you through a simple process to understand your financial situation
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Share Your Financial Context</h3>
                  <p className="text-gray-600 text-sm">
                    In the next steps, we'll collect information about your financial goals and investements. This helps us understand your unique needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-green-50 rounded-xl border border-green-100">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receive Tailored Recommendations</h3>
                  <p className="text-gray-600 text-sm">
                    Based on your input, we'll generate a personalized recommendation designed specifically 
                    for your financial situation and goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">No signup required.</span> You can complete this process 
                    and receive your recommendation without creating an account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: context collection : formData is used in the custome hook */} 
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center py-16">

              {/** Optional : provide  condtionally Rendered error massege here */}
 {/**{setIsLoading,setFinishedProcessing, setFinishedOnboarding,investmentAccounts,goals} */}

              {/** cards are conditionally rendered , only if backend  processing is not done  */}
              {!finishedProcessing &&(
               
                <form onSubmit={(e: React.SubmitEvent<HTMLFormElement>)=>  
                     generateAdvice(e,{
                        setIsLoading,
                       setFinishedProcessing,
                       setFinishedOnboarding,
                       investmentAccounts,
                       goals
                     })
                }>
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
        )}

        {/* Step 3: Show advice */}
        {currentStep === 3 && finishedOnboarding&& (
          
          
          <> 
              <LimitedAdvice />
              <div className="flex gap-4 justify-center">


                <button
                  onClick={didNotLikeAdvice}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Not Helpful?
                </button>
                <Link to="/Signup"
                  
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Unlock More Features
                </Link>
                
                <Link to="/Login"
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>

              </div>
            
          </> 
        
        )}
        
      </div>

    </div>
  );
}
