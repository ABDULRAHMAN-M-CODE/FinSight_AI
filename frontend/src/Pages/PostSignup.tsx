import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {  type NavigateFunction } from 'react-router-dom';
export const ShowMultiStepContext=({n,endpointURL,httpMethod}:{n:NavigateFunction,endpointURL:string,httpMethod:string})=>{
  localStorage.setItem("step","1"); // because step is stored in non-volatile memory
  n("/MultiStepContext",{state:{ endpointURL: endpointURL, httpMethod:httpMethod }}) // because the url is stored inside a volatile memory , the RAM.
}

export default function PostSignup() {
  const navigate=useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle2 
              className="w-16 h-16 text-green-600" 
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            You're all set!
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Your account has been created successfully and is ready to use. 
            Take a quick tour to discover key features, or jump right in.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6 justify-center">
          {/* Primary CTA - Start Tutorial */}
          <Link
            
            to="/IntroStepper"
             className="w-full sm:w-1/2 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-flex items-center justify-center text-center shadow-sm" 
          >
          Quick intro
          </Link>

          {/* Secondary CTA - Skip */}
          <button
            
            onClick={()=> ShowMultiStepContext({n:navigate,endpointURL:"http://localhost:8000/onboarding/questionnaire",httpMethod:"POST"}) }
             className="w-full sm:w-1/2 py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors text-center shadow-sm" 
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );

}
