
import { GoalProbabilitySurface } from '../Imports/GoalProbabilitySurface';
import { OptimalStrategyContainer } from '../Imports/OptimalStrategyContainer';
import { FinancialTrajectoryDivergence } from '../Imports/FinancialTrajectoryDivergence';

// the mock data iz not uzed here, it iz uzed in the child componentz which iz not ztandard
export function GoalsAndInvestementsAdvice() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Grid */}
          <div className="space-y-8">
            
            {/* Component 1: Optimal Strategy Container (Full Width, Dominant) */}
            <div>
              <OptimalStrategyContainer />
            </div>

            {/* Component 2: Goal Probability Surface */}
            <div className="h-[600px]">
              <GoalProbabilitySurface />
            </div>

            {/* Component 3: Financial Trajectory Divergence Map */}
            <div className="h-[600px]">
              <FinancialTrajectoryDivergence />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}