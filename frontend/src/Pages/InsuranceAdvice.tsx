
//Reusable components
import { ProtectionGapChart } from '../Imports/ProtectionGapChart';
import { CoverageRecommendations } from '../Imports/CoverageRecommendations';


//types 
import { type InsurenceAdviceContract } from '../Types/InsurenceAdviceContract';



// functions
import { resolveData } from '../Functions/api/resolveData';


// default values specification


// Get data from local storage and pass it to the UI


import { protectionAdviceDefaults } from '../utils/constants';
  // Rendering
export default function InsuranceAdvice() {
  
  //const protectionAdvice:InsurenceAdviceContract=getProtectionAdvice();
   const  protectionAdvice:InsurenceAdviceContract=resolveData<InsurenceAdviceContract>(protectionAdviceDefaults,(data)=>data?.protectionAdvice);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Protection Gap Analysis</h1>
          <p className="text-gray-600">
            Critical coverage adjustments based on your financial profile
          </p>
        </div>

        {/* Section 1: Protection Gap Visualization */}
        <section className="mb-8">
          <ProtectionGapChart data={protectionAdvice.protectionGap} />
        </section>

        {/* Section 2: Actionable Coverage Recommendations */}
        <section>
          <CoverageRecommendations recommendations={protectionAdvice.recommendations} />
        </section>
      </div>
    </div>
  );
}
