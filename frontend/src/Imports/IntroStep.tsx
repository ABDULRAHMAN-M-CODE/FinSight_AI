import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { type IntroStepProps } from "../Types/IntroStepProps";
export default function IntroStep({handleNext}:IntroStepProps){
        {/* Step 1: Introduction */}
        
        return (
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
        );


}
