// Hook and custom hooks
import { useData } from "../CustomHooks/useData";
import { useHandlers } from "../CustomHooks/useHandlers";

// reusable components
import { ProgressBar } from "../Imports/ProgressBar";
import ResultStep from "../Imports/ResultStep";
import FormStep from "../Imports/FormStep";
import IntroStep from "../Imports/IntroStep";

//main UI component
export  default function MultiStepFlow() {
  
  //note for novice : call custom hook once in the parent  component, then pass props down.
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
    handleEditRequest,
   }=useHandlers({currentStep,finishedProcessing,setFinishedProcessing,setFinishedOnboarding,setCurrentStep});



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      {/* Progress Bar */}
      <div className="pt-8">
        <ProgressBar currentStep={currentStep}  steps={steps}totalSteps={steps.length} />
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        {/** Onboarding: Introduction step, which is pure UI with no logic */}
        {currentStep === 1 && (
        <IntroStep  handleNext={handleNext}/>
         )}
        

         {/** data Submission to backend */}
        {currentStep === 2 &&(
         <FormStep 
         finishedProcessing={finishedProcessing}
         setIsLoading={setIsLoading} 
         setFinishedProcessing={setFinishedProcessing}  
         setFinishedOnboarding={setFinishedOnboarding}
         investment_accounts={investmentAccounts}
         financial_goals={goals}
         setInvestmentAccounts={setInvestmentAccounts}
         setGoals={setGoals}
         handleBack={handleBack}
         handleNext={handleNext}
         isLoading={isLoading}
         />)}

        {/** AI results are shown here */}
        {currentStep === 3 && finishedOnboarding&& (
          <ResultStep currentStep={currentStep} finishedOnboarding={finishedOnboarding}  handleEditRequest={handleEditRequest} /> 
        ) } 

        
      </div>

    </div>
  );
}
