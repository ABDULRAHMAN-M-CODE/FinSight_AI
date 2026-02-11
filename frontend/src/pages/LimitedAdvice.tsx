//Redux Related: Reading State from Store
import { useSelector } from "react-redux";
import type { RootState } from "../store";





//States and Logic lives here
function useLimitedAdvice(){
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" };
    if (efficiency >= 70) return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" };
    return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };
  };

  // Standardizing risk: AI doesn't send riskLevel yet, so we default to 'low' or logic
  const getRiskColor = (riskLevel: string = "low") => {
    return riskLevel === "low" 
      ? { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-600", border: "border-green-300" }
      : { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-600", border: "border-red-300" };
  };


  const getGoalRiskColor = (riskLevel: string) => {
    return riskLevel === "low" ? "border-green-500" : "border-red-500";
  };  


  return{
    getRiskColor,
    getGoalRiskColor,
    getEfficiencyColor,
    formatCurrency
  };
}


//Rendering Lives here
export default function LimitedAdvice() {
  const {  getGoalRiskColor, getEfficiencyColor } = useLimitedAdvice();
  
  // 1. Pull AI_DATA from Redux
  const AI_DATA = useSelector((state: RootState) => state.limitedAdvice.data);

  // 2. Guard Clause: Don't render if data is null (standard practice)
  if (!AI_DATA) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500 animate-pulse">Analyzing financial data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-5">
        <h1 className="text-2xl font-semibold text-slate-900">Wealth Management Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">AI-Powered Financial Guidance</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Strategic Time-Horizon Map */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Strategic Time-Horizon Map</h2>
          </div>

          <div className="p-5 space-y-3">
            {AI_DATA.strategic_time_horizon_map?.map((goal, index) => {
              // Standardizing colors (defaulting to low risk for now)
              
              const borderColor = getGoalRiskColor("low");
              
              return (
                <div key={goal.goal_id || index} className="relative">
                
                  {index < AI_DATA.strategic_time_horizon_map.length - 1 && (
                    <div className="absolute left-[7px] top-[16px] w-0.5 h-[185px] bg-slate-300" />
                  )}

                  <div className="absolute left-0 top-[12px] w-4 h-4 rounded-lg bg-green-500 border-2 border-white" />

                  <div className={`ml-6 bg-slate-50 rounded-lg border ${borderColor} p-4`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900">{goal.goal_name}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Timeline Alignment</p>
                      </div>
                    </div>

                    <div className={`bg-slate-700 rounded-md px-3.5 py-3 mb-3 border-l-2 ${borderColor}`}>
                      <p className="text-sm text-slate-100 leading-snug">{goal.timeline_alignment_summary}</p>
                    </div>

                    <div className={`bg-slate-700 rounded-md px-3.5 py-3 border-l-2 ${borderColor}`}>
                      <p className="text-sm text-slate-100 leading-snug">{goal.goal_advice}</p>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Tax-Efficiency Optimizer */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Tax-Efficiency Optimizer</h2>
          </div>

          <div className="p-5 space-y-3">
            {AI_DATA.tax_efficiency_optimizer?.map((account,index) => {
              const effColors = getEfficiencyColor(account.efficiency_score_percent);
              const adviceColor = account.efficiency_score_percent >= 70 ? "border-amber-500" : "border-red-500";
              
              return (
                <div key={account.account_id || index}   className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-slate-900">{account.account_name}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{account.account_type}</p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-xl ${effColors.bg} border ${effColors.border}`}>
                      <p className={`text-xs font-bold ${effColors.text}`}>{account.efficiency_score_percent}% Efficient</p>
                    </div>
                  </div>

                  {/* Balance - Note: AI doesn't send balance, so we omit or update backend */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Funding Goals</p>
                    <div className="flex flex-wrap gap-1.5">
                      {account.funding_goals?.map((fg) => (
                        <div key={fg.goal_id} className="px-3 py-1.5 rounded-md border bg-green-50 border-green-200 text-green-600 flex items-center gap-1.5">
                          <span className="text-xs font-medium">{fg.goal_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`bg-slate-700 rounded-md px-3.5 py-3 border-l-2 ${adviceColor}`}>
                    <p className="text-sm text-slate-100 leading-snug">{account.tax_strategy_analysis}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}