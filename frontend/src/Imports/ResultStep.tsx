import type { ResultStepProps } from "../Types/ResultStepProps"
import LimitedAdvice from "./LimitedAdvice"
import { Link } from "react-router-dom"

export  default function ResultStep({handleEditRequest } :ResultStepProps ){
        {/* Step 3: Show advice */}

        
return(
    <> 

        {/**main advice content */}
        <LimitedAdvice />

        {/** Edit info, Signup, and Login capabilities */}
        {/** Task : apply separation of concerns by removing the Button, Button should be Shared, Links should not be shared*/}
        <div className="flex gap-4 justify-center">


          <button
            onClick={handleEditRequest}
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
);

 
        
       
}