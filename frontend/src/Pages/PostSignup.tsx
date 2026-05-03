import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PostSignup() {
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
        <div className="space-y-3  ml-25">
          {/* Primary CTA - Start Tutorial */}
          <Link
            
            to="/IntroStepper"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start guided tutorial"
          >
          Quick intro
          </Link>

          {/* Secondary CTA - Skip */}
          <Link
            
            to="/MultiStepContext"
            className="w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Skip tutorial and go to main application"
          >
            Skip for Now
          </Link>
        </div>
      </div>
    </div>
  );

}
