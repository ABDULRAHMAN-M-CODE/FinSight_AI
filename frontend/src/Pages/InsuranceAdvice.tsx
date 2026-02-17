import { ProtectionGapChart } from '../Imports/ProtectionGapChart';
import { CoverageRecommendations } from '../Imports/CoverageRecommendations';
import { type Recommendation } from '../Imports/CoverageRecommendations';
// Dynamic mock data - easily adjustable to show different scenarios
    


export const protectionAdvice = {
  
    //  I think we need to store as JSONB , is that true ? 
    protectionGap: {

    currentCoverage: 500000,
    requiredCoverage: 1200000,
    gap: 700000,
    annualIncome: 150000,
    yearsToRetirement: 25,
    incomeReplacementRate: 0.75,
    monthlyData: [
      { month: 0, required: 1200000, current: 500000, gap: 700000 },
      { month: 5, required: 1150000, current: 500000, gap: 650000 },
      { month: 10, required: 1100000, current: 500000, gap: 600000 },
      { month: 15, required: 1000000, current: 500000, gap: 500000 },
      { month: 20, required: 850000, current: 500000, gap: 350000 },
      { month: 25, required: 650000, current: 500000, gap: 150000 },
    ]
    },
    
    //  I think we need to store as JSONB , is that true ? 
    recommendations:[
      {
        id: 1,
        policyName: 'Term Life Insurance',
        currentCoverage: 500000,
        recommendedCoverage: 1200000,
        gap: 700000,
        action: 'Increase coverage by $700,000 to protect household income for 10+ years',
        priority: 'High',
        reason: 'Current coverage only replaces 3.3 years of income vs recommended 8 years',
        estimatedCost: '+$85/month'
      },
      {
        id: 2,
        policyName: 'Disability Insurance',
        currentCoverage: 0,
        recommendedCoverage: 112500,
        gap: 112500,
        action: 'Establish disability coverage at 75% income replacement',
        priority: 'High',
        reason: 'No income protection if unable to work - high risk exposure',
        estimatedCost: '$120/month'
      },
      {
        id: 3,
        policyName: 'Critical Illness Coverage',
        currentCoverage: 50000,
        recommendedCoverage: 150000,
        gap: 100000,
        action: 'Increase coverage to align with annual income',
        priority: 'Medium',
        reason: 'Current coverage insufficient for medical expenses and income loss',
        estimatedCost: '+$45/month'
      }
    ]

};

export default function InsuranceAdvice() {
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
          <CoverageRecommendations recommendations={protectionAdvice.recommendations  as Recommendation[]} />
        </section>
      </div>
    </div>
  );
}
