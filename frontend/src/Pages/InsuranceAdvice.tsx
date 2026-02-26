
//Reusable components
import { ProtectionGapChart } from '../Imports/ProtectionGapChart';
import { CoverageRecommendations } from '../Imports/CoverageRecommendations';


//types 
import { type Recommendation } from '../Imports/CoverageRecommendations';
import { type InsurenceAdviceContract, type MonthlyData } from '../Types/InsurenceAdviceContract';
import { type ProtectionGap } from '../Types/InsurenceAdviceContract';


// functions
import { getParsedData } from '../Functions/api/reusable_functions/getParsedData';



// default values specification
 const  getInsurenceAdviceDefaultValues= ():InsurenceAdviceContract=> {
  const monthlyDataDefaults:MonthlyData={
    month: 0,
    required: 0.0,
    current: 0,
    gap: 0
  }
  const protectionGapDefaults:ProtectionGap={
   currentCoverage:0.0,
   requiredCoverage: 0.0,
   gap:0.0,
   annualIncome:0.0,
   yearsToRetirement:25,
   incomeReplacementRate: 0.7,
   monthlyData: [monthlyDataDefaults]    
  }

  const recommendationsDefault:Recommendation={
    id: 0,
    policyName: "No action required",
    currentCoverage: 0.0,
    recommendedCoverage: 0.0,
    gap: 0.0,
    action: "No Adjustements needed",
    priority:  "Low",
    reason:"No protection gap detected",
    estimatedCost: "0"
  }


    const  protectionAdviceDefaults: InsurenceAdviceContract={
      protectionGap:protectionGapDefaults,
      recommendations: [recommendationsDefault]
    }
    return protectionAdviceDefaults; // return {protectionAdviceDefaults} would be wrong, because the function is not expected to return object inside object
    
}

// Get data from local storage and pass it to the UI
const  getProtectionAdvice=():InsurenceAdviceContract=>{
  
    //  advice has two possible sources : default data or stored data in the local storage.
    const parsedData=getParsedData();
    const protectionAdviceDefaults:InsurenceAdviceContract= getInsurenceAdviceDefaultValues();
    
    const protectionAdvice:InsurenceAdviceContract= parsedData?.protectionAdvice??protectionAdviceDefaults;
    
    return protectionAdvice;
    
  }


  // Rendering
export default function InsuranceAdvice() {
  
  const protectionAdvice:InsurenceAdviceContract=getProtectionAdvice();
  
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
