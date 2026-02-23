// type; Contract for data
import { type limitedAdvice } from "../Types/limitedAdviceData";

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

  const getRiskColor = (riskLevel: string) => {
    return riskLevel === "low" 
      ? { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-600", border: "border-green-300" }
      : { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-600", border: "border-red-300" };
  };

  /*const getTaxCategoryColor = (category: string) => {
    if (category === "Tax-Free") return { bg: "bg-green-500", text: "text-green-600" };
    if (category === "Tax-Deferred") return { bg: "bg-blue-500", text: "text-blue-600" };
    return { bg: "bg-slate-500", text: "text-slate-600" };
  };*/

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
   // use the custome hook.  
    const {
    getRiskColor,
    getGoalRiskColor,
    getEfficiencyColor,
    formatCurrency } = useLimitedAdvice();
  

    /**
     1. Read the response as string from the  local storage.
     2. parse  the string to object.
     */
    const saved = localStorage.getItem("Demo_Data");
    const AI_DATA: limitedAdvice | null = saved ? JSON.parse(saved) : null;
 
  // 2. Guard Clause: Don't render if data is null (standard practice)
  if (!AI_DATA) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500 animate-pulse">Analyzing financial data...</p>
      </div>
    );
  }
  const taxableAccounts = AI_DATA.tax_efficiency_optimizer.filter(acc => acc.tax_category === "Taxable");
  const taxDeferredAccounts = AI_DATA.tax_efficiency_optimizer.filter(acc => acc.tax_category === "Tax-Deferred");
  const taxFreeAccounts = AI_DATA.tax_efficiency_optimizer.filter(acc => acc.tax_category === "Tax-Free");
return (
    <div className="min-h-screen bg-slate-50">
      


      {/* Content */}
      <div className="p-4 space-y-4">
        
        {/* Strategic Time-Horizon Map */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Strategic Time-Horizon Map</h2>
          </div>

          <div className="p-5 space-y-3">
            {AI_DATA.strategic_time_horizon_map?.map((goal, index) => {
              const riskColors = getRiskColor(goal.riskLevel);
              const borderColor = getGoalRiskColor(goal.riskLevel);
              
              return (
                <div key={index} className="relative">
                  {/* Timeline indicator on left */}
                  {index < AI_DATA.strategic_time_horizon_map.length - 1 && (
                    <div className="absolute left-[7px] top-[16px] w-0.5 h-[185px] bg-slate-300" />
                  )}
                  <div className={`absolute left-0 top-[12px] w-4 h-4 rounded-lg ${goal.riskLevel === 'low' ? 'bg-green-500' : 'bg-red-500'} border-2 border-white`} />

                  {/* Goal Card */}
                  <div className={`ml-6 bg-slate-50 rounded-lg border ${borderColor === 'border-green-500' ? 'border-green-200' : 'border-red-200'} p-4`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900">{goal.name}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">{goal.type}</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl ${riskColors.bg} flex items-center gap-1.5`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${riskColors.dot}`} />
                        <span className={`text-xs font-semibold ${riskColors.text} uppercase`}>
                          {goal.riskLevel} risk
                        </span>
                      </div>
                    </div>

                    {/* Allocation Status */}
                    <div className={`bg-slate-700 rounded-md px-3.5 py-3 mb-3 border-l-2 ${borderColor}`}>
                      <p className="text-sm text-slate-100 leading-snug">{goal.allocation_status}</p>
                    </div>

                    {/* Advice */}
                    <div className={`bg-slate-700 rounded-md px-3.5 py-3 border-l-2 ${borderColor}`}>
                      <p className="text-sm text-slate-100 leading-snug">{goal.advice}</p>
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


          {/* Taxable Accounts Section */}
           {taxableAccounts.length>0 &&(
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-slate-500 rounded-sm" />
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Taxable Accounts</h3>
            </div>

            <div className="space-y-3">
              {AI_DATA.tax_efficiency_optimizer?.filter(acc => acc.tax_category === "Taxable").map((account, index) => {
                const effColors = getEfficiencyColor(account.efficiency);
                const adviceColor = account.efficiency >= 70 ? "border-amber-500" : "border-red-500";
                
                return (
                  <div key={index} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    {/* Account Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-slate-900">{account.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{account.type}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-xl ${effColors.bg} border ${effColors.border}`}>
                        <p className={`text-xs font-bold ${effColors.text}`}>{account.efficiency}% Efficient</p>
                      </div>
                    </div>

                    {/* Balance */}
                    <p className="text-2xl font-bold text-slate-900 mb-3">{formatCurrency(account.balance)}</p>

                    {/* Funding Goals */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Funding Goals</p>
                      <div className="flex flex-wrap gap-1.5">
                        
                        {account.linked_goals.length>0 && ((account.linked_goals||[]).map((goalName, idx) => {
                          const linkedGoal = AI_DATA.strategic_time_horizon_map.find(g => g.name === goalName);
                          const goalColor = linkedGoal?.riskLevel === "low" ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600";
                          
                          return (
                            <div key={idx} className={`px-3 py-1.5 rounded-md border ${goalColor} flex items-center gap-1.5`}>
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                                <path d="M5 1V9M1 5H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                              </svg>
                              <span className="text-xs font-medium">{goalName}</span>
                            </div>
                          );
                        })) }

                      </div>
                    </div>

                    {/* Tax Strategy */}
                    <div className={`bg-slate-700 rounded-md px-3.5 py-3 border-l-2 ${adviceColor}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${account.efficiency >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        Tax Strategy Analysis
                      </p>
                      <p className="text-sm text-slate-100 leading-snug">{account.tax_strategy_advice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
           )}


          {/* Tax-Deferred Accounts Section */}
          { taxDeferredAccounts.length > 0 && (

          <div className="px-5 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Tax-Deferred Accounts</h3>
            </div>

            <div className="space-y-3">
              {AI_DATA.tax_efficiency_optimizer.filter(acc => acc.tax_category === "Tax-Deferred").map((account, index) => {
                const effColors = getEfficiencyColor(account.efficiency);
                
                return (
                  <div key={index} className="bg-slate-50 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-slate-900">{account.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{account.type}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-xl ${effColors.bg} border ${effColors.border}`}>
                        <p className={`text-xs font-bold ${effColors.text}`}>{account.efficiency}% Efficient</p>
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-slate-900 mb-3">{formatCurrency(account.balance)}</p>

                    {/** Funding Goals */}
                    {account.linked_goals.length>0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Funding Goals</p>
                      <div className="flex flex-wrap gap-1.5">
                        
                        {account.linked_goals.map((goalName, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-md border bg-green-50 border-green-200 text-green-600 flex items-center gap-1.5">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                              <path d="M5 1V9M1 5H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                            <span className="text-xs font-medium">{goalName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    )}


                    <div className="bg-slate-700 rounded-md px-3.5 py-3 border-l-2 border-amber-500">
                      <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1.5">
                        Tax Strategy Analysis
                      </p>
                      <p className="text-sm text-slate-100 leading-snug">{account.tax_strategy_advice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}


          {/* Tax-Free Accounts Section */}
          {taxFreeAccounts.length>0 &&(
         <div className="px-5 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide">Tax-Free Accounts</h3>
            </div>

            <div className="space-y-3">
              {AI_DATA.tax_efficiency_optimizer.filter(acc => acc.tax_category === "Tax-Free").map((account, index) => {
                const effColors = getEfficiencyColor(account.efficiency);
                
                return (
                  <div key={index} className="bg-slate-50 rounded-lg border border-green-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-slate-900">{account.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{account.type}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-xl ${effColors.bg} border ${effColors.border}`}>
                        <p className={`text-xs font-bold ${effColors.text}`}>{account.efficiency}% Efficient</p>
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-slate-900 mb-3">{formatCurrency(account.balance)}</p>

                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Funding Goals</p>
                      <div className="flex flex-wrap gap-1.5">
                        {account.linked_goals.map((name, index) => (
                          <div key={index} className="px-3 py-1.5 rounded-md border bg-green-50 border-green-200 text-green-600 flex items-center gap-1.5">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                              <path d="M5 1V9M1 5H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                            <span className="text-xs font-medium">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-md px-3.5 py-3 border-l-2 border-green-500">
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1.5">
                        Tax Strategy Analysis
                      </p>
                      <p className="text-sm text-slate-100 leading-snug">{account.tax_strategy_advice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
 
        </div>
      
      </div>
    
    </div>
  );
}