import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
export type  Recommendation= {
  id: number;
  policyName: string;
  currentCoverage: number;
  recommendedCoverage: number;
  gap: number;
  action: string;
  priority: 'High' | 'Medium' | 'Low'; // This  May Cause Error
  
  reason: string;
  estimatedCost: string;
}
// Logic
function useCoverageRecommendations({ recommendations }: {recommendations: Recommendation[]}){
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const highPriorityCount = recommendations.filter(r => r.priority === 'High').length;
  const totalGap = recommendations.reduce((sum, r) => sum + r.gap, 0);

  const priorityStyles = {
    High: 'bg-red-50 border-red-200 text-red-800',
    Medium: 'bg-amber-50 border-amber-200 text-amber-800',
    Low: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const priorityIconColor = {
    High: 'text-red-500',
    Medium: 'text-amber-500',
    Low: 'text-blue-500',
  };  
  return{
    sortedRecommendations,
    highPriorityCount,
    totalGap,
    priorityStyles,
    priorityIconColor
  }
}
// Rendering
export function CoverageRecommendations({ recommendations }: {recommendations: Recommendation[]}) {

  const {
    sortedRecommendations,
    highPriorityCount,
    totalGap,
    priorityStyles,
    priorityIconColor}=useCoverageRecommendations({recommendations}) // When Function signature does destructing, I must pass object contianing , not the variable.
  //Rendering
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-900">Required Coverage Adjustments</h2>
          <div className="flex items-center gap-2"> {/** rest of rendering */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {highPriorityCount} High Priority
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Total protection gap: <span className="font-semibold text-gray-900">
            ${totalGap.toLocaleString()}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {sortedRecommendations.map((recommendation) => {
          const gapPercentage = recommendation.currentCoverage === 0 
            ? '100' 
            : ((recommendation.gap / recommendation.recommendedCoverage) * 100).toFixed(0);
            const priority = ['High','Medium','Low'].includes(recommendation.priority) ? recommendation.priority : 'Low';


          return (
            <div key={recommendation.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{recommendation.policyName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyles[priority]}`}>
                      {priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{recommendation.action}</p>
                </div>
                <AlertCircle className={priorityIconColor[priority]} size={24} />
              </div>

              {/* Coverage Gap Visualization */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Coverage Progress</span>
                  <span className="text-gray-900 font-medium">
                    {recommendation.currentCoverage === 0 
                      ? 'No Coverage' 
                      : `${((recommendation.currentCoverage / recommendation.recommendedCoverage) * 100).toFixed(0)}% of need`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      priority === 'High' 
                        ? 'bg-red-500' 
                        : priority === 'Medium' 
                        ? 'bg-amber-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.min((recommendation.currentCoverage / recommendation.recommendedCoverage) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${recommendation.currentCoverage.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Required</p>
                  <p className="text-sm font-semibold text-blue-600">
                    ${recommendation.recommendedCoverage.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gap</p>
                  <p className="text-sm font-semibold text-red-600">
                    ${recommendation.gap.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Reason and Cost */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <TrendingUp className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-gray-600">{recommendation.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-gray-400 flex-shrink-0" size={16} />
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Estimated cost:</span> {recommendation.estimatedCost}
                  </p>
                </div>
              </div>

              {/* Gap Alert */}
              {parseInt(gapPercentage) > 50 && (
                <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-800">
                    <strong>Critical Gap:</strong> {gapPercentage}% coverage shortfall - immediate action required
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Summary */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-900">
          <strong>Next Step:</strong> Address high-priority gaps immediately to secure household financial stability. 
          These adjustments are based on income replacement analysis and debt obligations.
        </p>
      </div>
    </div>
  );
}