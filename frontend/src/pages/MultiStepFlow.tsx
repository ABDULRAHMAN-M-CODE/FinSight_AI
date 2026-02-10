   // Hook
   import { useState } from "react";
  
   // Redux related : Dispatching  actions using Reducers
   import { useDispatch } from 'react-redux'; // Redux related  
   import { setLimitedAdviceData  as setGlobalLimitedAdviceData} from '../store/limitedAdviceSlice';
   
   //interface "Shape" of AI response
   import { type limitedAdvice } from "../types/limitedAdviceData"; 
  
  // custome reusable UI
   import { ProgressBar } from "./ProgressBar";
   import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
   import SubFinancialProfileForm from "./SubFinancialProfileForm";
   import { Button } from "./Button";
   import { Link } from "react-router-dom";
   import LimitedAdvice from "./LimitedAdvice";
  
   //State+ Logic
  function useMultiStepFlow(){

        //const [currentStep, setCurrentStep]=useState(1); → This causes Lose of progress if page reloads or if the component is remounted
        
        // use Local Storage instead
        // state Lives inside the component for once, Then it's always outside component ,therefore , no loosing of progress
        // Even if React schedualed a Rerender, progress will not be Lost because the state Lives outside the component
        // state is stored as key/value pairs
        const [currentStep, setCurrentStep]= useState(Number(localStorage.getItem("currentStep"))||1)
        
        // Redux related, we dispatch actions(intents, whether intention of updating or clearing global value)
        const dispatch = useDispatch();

        // Two custome Flags
        const [finishedProcessing, setFinishedProcessing]= useState(false);
        const [isLoading, setIsLoading]=useState(false);

        const handleNext = () => {
          if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            localStorage.setItem("currentStep",(currentStep+1).toString())// either adding the "currentStep" key or updating it's value
          }
        };

        
       const generateAdvice = async (e: React.SubmitEvent<HTMLFormElement>)=>{

              e.preventDefault();
              setIsLoading(true);
              // using formData was bad practice , I will never use it again to submit form data to backend
              const formData= new FormData(e.currentTarget)

             // We loop through your 'accounts' state just to know how many there are
            // But we pull the actual VALUE from the formData
            // 1. Get all unique indices from the form keys (e.g., "0", "1")
              const indices = Array.from(formData.keys())
                .filter(key => key.startsWith('accounts['))
                .map(key => key.match(/\d+/)?.[0])
                .filter((value, index, self) => self.indexOf(value) === index);

              // 2. Reconstruct the array by pulling values for each index
              const accountsArray = indices.map(index => ({
                name: formData.get(`accounts[${index}][name]`),
                type: formData.get(`accounts[${index}][type]`),
                current_balance: parseFloat(formData.get(`accounts[${index}][current_balance]`) as string) || 0,
                is_active: formData.get(`accounts[${index}][is_active]`) === 'on'
              }));
              // Inside generateAdvice...
              const goalIndices = Array.from(formData.keys())
                .filter(key => key.startsWith('goals['))
                .map(key => key.match(/\d+/)?.[0])
                .filter((v, i, a) => a.indexOf(v) === i);

              const goalsArray = goalIndices.map(index => ({
                name: formData.get(`goals[${index}][name]`),
                type: formData.get(`goals[${index}][type]`),
                target_amount: parseFloat(formData.get(`goals[${index}][target_amount]`) as string) || 0,
                deadline: formData.get(`goals[${index}][deadline]`)
              }));
              const payload = {
                investment_accounts: accountsArray,
                financial_goals: goalsArray, // <--- Add the 'n' here
              };

              console.log("Final Payload for Python:", payload);

        // frontend calls backend, backend calls LLM , LLm return repsonse to backend, backend return final response
      try {
        const response = await fetch("http://127.0.0.1:8000/Limited-questionnaire", { // check URL later 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        //
        if (!response.ok) {
            //const data = await response.json();
            //set Errors using this data  then Return

            // Set Errors here
            // return in safe way
            setIsLoading(false);
            alert("error happened")
            return;
        }

        // 
        
        //Dispatch the LLM response to Redux so that other UI can access this response 
        

        //
        //The AI result is  guaranteed or promised to be of some shape "interface" 
        const AI_RESPONSE:limitedAdvice= await response.json();
        setFinishedProcessing(true);
        dispatch(setGlobalLimitedAdviceData(AI_RESPONSE) );
        setIsLoading(false);
        alert("Form Submitted Succesfully ")
      } catch (error) {
        setIsLoading(false);
        alert("Connection failed, pleas check your internet connection and try again")
      } 
       };

       
       const handleBack = () => {
          if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            localStorage.setItem("currentStep",(currentStep-1).toString()); // here, updates the key's value
          }
        };

        return {
          handleNext,
          handleBack,
          currentStep,
          finishedProcessing,
          generateAdvice,
          isLoading
        };
        
  }

  //Rendering 
  export  default function MultiStepFlow() {
    const {handleNext,handleBack,currentStep,finishedProcessing,generateAdvice,isLoading}=useMultiStepFlow();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
        {/* Progress Bar */}

        <div className="pt-8">
          <ProgressBar currentStep={currentStep} totalSteps={3} />
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


          {/* Step 2: Collect context from " Form of cards" */} 
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center py-16">

                {/** Optional : provide  condtionally Rendered massege here 
                 *

                */}


                {/** cards are conditionally rendered , only if backend  processing is not done  */}
                {!finishedProcessing &&(

                  <form onSubmit={generateAdvice} >
                    <SubFinancialProfileForm />
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
                {finishedProcessing &&(<h1>We have Finished processing your data.  now you can see the result in the next step</h1>)}
                <div className="flex gap-4 justify-center translate-y-12">
                  <button
                    onClick={handleBack}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
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

          {/* Step 3: Placeholder */}
          {currentStep === 3 && (
            
            
            <> 
                <LimitedAdvice />
                <div className="flex gap-4 justify-center">

                  <button
                    onClick={handleBack}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  
                  <Link to="/Signup"
                    
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Signup for more features
                  </Link>
                  
                  <Link to="/Login"
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Already have account?
                  </Link>

                </div>
              
            </> 
          
          )}
          
        </div>
      </div>
    );
  }
