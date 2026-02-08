import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

//State+ Logic
function useMultiStepFlow(){
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

   return {
     handleNext,
     handleBack,
     currentStep
   };
}

//Rendering 
export  default function MultiStepFlow() {
   const {handleNext,handleBack,currentStep}=useMultiStepFlow();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                    In the next steps, we'll collect information about your financial goals, current situation, 
                    and preferences. This helps us understand your unique needs.
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

        {/* Step 2: Placeholder */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Context Collection</h2>
              <p className="text-gray-500 mb-8">
                [Placeholder for Step 2 content - Will be provided later]
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors flex items-center gap-2"
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
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Personalized Recommendation</h2>
              <p className="text-gray-500 mb-8">
                [Placeholder for Step 3 content - Will be provided later]
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
