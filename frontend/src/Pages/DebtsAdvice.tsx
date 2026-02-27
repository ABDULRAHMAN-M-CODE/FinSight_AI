// types and interfaces : Contracts/ Schemas for data format/shape 

import { DebtRiskVisualization } from '../Imports/DebtRiskVisualization';// mock data contract 

// constants or values
import { debtsAdviceDefaults } from '../utils/constants';   

// top level type
import { type DebtAdviceContract } from '../Types/DebtAdviceContract';


// function 
import { resolveData } from '../Functions/api/resolveData';
import { FullAdviceSchema } from '../Functions/api/reusable_functions/getFullAdviceSchema';




 

    
export default function DebtsAdvice() {
  //const debtsAdvice=getDebtsAdvice();
  const debtsAdvice:DebtAdviceContract=resolveData<DebtAdviceContract, typeof FullAdviceSchema>("fullAdvice",FullAdviceSchema,debtsAdviceDefaults,(data)=>data?.debtsAdvice);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Debt Risk Stress Analysis</h1>
          <p className="text-gray-600">
            Structural risk assessment and mitigation strategy
          </p>
        </div>

        {/* Main Rendered component */}
        <section>
          <DebtRiskVisualization 
            monthlyProjections={debtsAdvice.monthlyProjections}
            debts={debtsAdvice.debts }
            riskMetrics={debtsAdvice.riskMetrics}
          />
        </section>
      </div>
    </div>
  );
}