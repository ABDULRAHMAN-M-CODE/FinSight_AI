
import { Shield, Lock, Eye, FileText, ArrowRight, Sparkles } from 'lucide-react';

import { useNavigate } from 'react-router';

// Logic component  : Custom hook
function useDataCollectionIntro(){
       const navigate= useNavigate();
  
  const handleContinue=()=>{

   // Reset MultStep Context state. (force the local storage to forget it )
   localStorage.removeItem("step")
   
   // Redirect the user to the MultiStepContext
    navigate("/MultiStepContex")
    
  }
  return{
    handleContinue
  }
}


// UI component
export default function DataCollectionIntro() {
  
  // Custom hook usage .
  const {handleContinue}=useDataCollectionIntro()
  
  // Rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 sm:px-12 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" aria-hidden="true" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <Sparkles className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
              </div>
            </div>
            <h1 className="text-white mb-3">
              Let's Personalize Your Experience
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              To provide you with tailored financial guidance, we need to understand your unique financial situation and goals
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-12">
            {/* What Happens Next */}
            <div className="mb-10">
              <h2 className="text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" aria-hidden="true" />
                What Happens Next
              </h2>
              <p className="text-slate-600 mb-6">
                You'll be guided through a series of questions about your financial information and behaviors. 
                This includes your income, expenses, savings, investments, and financial goals. The information 
                you provide will serve as context for our AI to deliver personalized, actionable recommendations.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Sparkles className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 mb-2">
                      Why We Need This Information
                    </h3>
                    <p className="text-slate-600">
                      Our AI analyzes your complete financial picture to provide CFP®-aligned recommendations 
                      that are specifically tailored to your situation. The more accurate your information, 
                      the more precise and valuable your personalized advice will be.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Privacy */}
            <div className="mb-10">
              <h2 className="text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" aria-hidden="true" />
                Your Data is Protected
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <Lock className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">Bank-Level Encryption</p>
                    <p className="text-sm text-slate-600">
                      All data is encrypted in transit and at rest using industry-standard protocols
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <Eye className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">Read-Only Access</p>
                    <p className="text-sm text-slate-600">
                      We never have the ability to move or withdraw your funds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <Shield className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">Privacy First</p>
                    <p className="text-sm text-slate-600">
                      Your information is never shared with third parties without consent
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">Compliant & Secure</p>
                    <p className="text-sm text-slate-600">
                      SOC 2 Type II certified with regular security audits
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Estimated Time</p>
                  <p className="text-sm text-slate-600">
                    The questionnaire takes approximately 3-5 minutes to complete
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  ~3 min
                </div>
              </div>
            </div>

            {/* Redirect the user to the MultiStepContext */}
            <button
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 active:scale-98 transition-all duration-200 shadow-lg shadow-blue-600/25"
              aria-label="Continue to provide financial information"
            >
              <span>Continue </span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>

            
          </div>
        </div>

        
        
      </div>
    </div>
  );
}
