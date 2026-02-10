//Redux Related: Reading State from Store
import { useSelector } from "react-redux";
import type { RootState } from "../store";

// Shape of Investments data
interface InvestmentAccount {
  name: string;
  type: string;
  balance: number;
  status: string;
  taxCategory: "Taxable" | "Tax-Deferred" | "Tax-Free";
  efficiency: number;
  linkedGoals: string[];
  taxStrategyAdvice: string;
}

// Shape of Goals Data
interface FinancialGoal {
  name: string;
  type: string;
  targetDate: string;
  yearsAway: number;
  riskLevel: "low" | "high";
  allocationStatus: string;
  advice: string;
}

// Mock data - replace with actual AI response's data
// Question  to chatGPT : AI_DATA is Defined inside the component and it's not accessable  in this scope , how to make it so ?
const goals: FinancialGoal[] = [
  {
    name: "Emergency Reserve",
    type: "Dec 2026 • 1 years",
    targetDate: "Dec 2026",
    yearsAway: 1,
    riskLevel: "low",
    allocationStatus: "Your account allocation for Emergency Reserve is well-matched to your 1-year timeline.",
    advice: "To close the $10,000 gap, increase monthly contributions by $938 over the next 11 months."
  },
  {
    name: "Down Payment Fund",
    type: "Jun 2027 • 1 years",
    targetDate: "Jun 2027",
    yearsAway: 1,
    riskLevel: "high",
    allocationStatus: "URGENT: Move Down Payment Fund funds to stable, liquid assets immediately. Your current account allocation is too volatile for a 1-year timeline.",
    advice: "CRITICAL: You need $6,321/month to meet this goal. Consider extending your deadline by 0 years or reducing your target to $105,000 for a more realistic plan."
  },
  {
    name: "College Fund",
    type: "Aug 2038 • 13 years",
    targetDate: "Aug 2038",
    yearsAway: 13,
    riskLevel: "low",
    allocationStatus: "Your account allocation for College Fund is well-matched to your 13-year timeline.",
    advice: "CRITICAL: You need $779/month to meet this goal. Consider extending your deadline by 4 years or reducing your target to $140,000 for a more realistic plan."
  },
  {
    name: "Retirement at 65",
    type: "Dec 2045 • 20 years",
    targetDate: "Dec 2045",
    yearsAway: 20,
    riskLevel: "low",
    allocationStatus: "Your account allocation for Retirement at 65 is well-matched to your 20-year timeline.",
    advice: "CRITICAL: You need $5,213/month to meet this goal. Consider extending your deadline by 6 years or reducing your target to $1,050,000 for a more realistic plan."
  }
];

// Mock data - replace with actual AI response's data
const accounts: InvestmentAccount[] = [
  {
    name: "Primary Brokerage",
    type: "Brokerage",
    balance: 45000,
    status: "Active",
    taxCategory: "Taxable",
    efficiency: 55,
    linkedGoals: ["Down Payment Fund", "College Fund"],
    taxStrategyAdvice: "Review your tax strategy. This taxable account may not be optimally aligned with your goal timelines."
  },
  {
    name: "Emergency Savings",
    type: "Savings",
    balance: 15000,
    status: "Active",
    taxCategory: "Taxable",
    efficiency: 70,
    linkedGoals: ["Emergency Reserve"],
    taxStrategyAdvice: "Good alignment. Consider maximizing contributions to this taxable account to take full advantage of tax benefits."
  },
  {
    name: "Retirement Fund",
    type: "Traditional IRA",
    balance: 125000,
    status: "Active",
    taxCategory: "Tax-Deferred",
    efficiency: 70,
    linkedGoals: ["Retirement at 65"],
    taxStrategyAdvice: "Good alignment. Consider maximizing contributions to this tax-deferred account to take full advantage of tax benefits."
  },
  {
    name: "Company 401k",
    type: "401(k)",
    balance: 92000,
    status: "Active",
    taxCategory: "Tax-Deferred",
    efficiency: 85,
    linkedGoals: ["Retirement at 65"],
    taxStrategyAdvice: "Good alignment. Consider maximizing contributions to this tax-deferred account to take full advantage of tax benefits."
  },
  {
    name: "Roth Growth",
    type: "Roth IRA",
    balance: 38000,
    status: "Active",
    taxCategory: "Tax-Free",
    efficiency: 92,
    linkedGoals: ["Retirement at 65"],
    taxStrategyAdvice: "Excellent tax-free growth strategy. This account is well positioned for long-term retirement savings with tax-free withdrawals."
  }
];

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
export default  function LimitedAdvice() {

// using custome hook : separating between Logic and  Rendering 
const {getRiskColor,getGoalRiskColor,getEfficiencyColor,formatCurrency}= useLimitedAdvice();
      // Redux Related : Read specific state (shared data) from specific Slice in the Store
      //Redux Related : Question to chatGPT, what RootState means ? What useSelector means ? is limitedAdvice considered Interface or Slice ?I understand nothing because there is alot of confustion between the names of the  variables, how to avoid confusion of the Variables When I write the codes or the boilerplates  that are  Related to Redux
    const AI_DATA= useSelector((state:RootState)=>state.limitedAdvice.data);
    
return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-5">
        <h1 className="text-2xl font-semibold text-slate-900">Wealth Management Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">AI-Powered Financial Guidance</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Strategic Time-Horizon Map */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Strategic Time-Horizon Map</h2>
          </div>

          <div className="p-5 space-y-3">
            {goals.map((goal, index) => {
              const riskColors = getRiskColor(goal.riskLevel);
              const borderColor = getGoalRiskColor(goal.riskLevel);
              
              return (
                <div key={index} className="relative">
                  {/* Timeline indicator on left */}
                  {index < goals.length - 1 && (
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
                      <p className="text-sm text-slate-100 leading-snug">{goal.allocationStatus}</p>
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
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-slate-500 rounded-sm" />
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Taxable Accounts</h3>
            </div>

            <div className="space-y-3">
              {accounts.filter(acc => acc.taxCategory === "Taxable").map((account, index) => {
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
                        {account.linkedGoals.map((goalName, idx) => {
                          const linkedGoal = goals.find(g => g.name === goalName);
                          const goalColor = linkedGoal?.riskLevel === "low" ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600";
                          
                          return (
                            <div key={idx} className={`px-3 py-1.5 rounded-md border ${goalColor} flex items-center gap-1.5`}>
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                                <path d="M5 1V9M1 5H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                              </svg>
                              <span className="text-xs font-medium">{goalName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tax Strategy */}
                    <div className={`bg-slate-700 rounded-md px-3.5 py-3 border-l-2 ${adviceColor}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${account.efficiency >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        Tax Strategy Analysis
                      </p>
                      <p className="text-sm text-slate-100 leading-snug">{account.taxStrategyAdvice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax-Deferred Accounts Section */}
          <div className="px-5 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Tax-Deferred Accounts</h3>
            </div>

            <div className="space-y-3">
              {accounts.filter(acc => acc.taxCategory === "Tax-Deferred").map((account, index) => {
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

                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Funding Goals</p>
                      <div className="flex flex-wrap gap-1.5">
                        {account.linkedGoals.map((goalName, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-md border bg-green-50 border-green-200 text-green-600 flex items-center gap-1.5">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                              <path d="M5 1V9M1 5H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                            <span className="text-xs font-medium">{goalName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-md px-3.5 py-3 border-l-2 border-amber-500">
                      <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1.5">
                        Tax Strategy Analysis
                      </p>
                      <p className="text-sm text-slate-100 leading-snug">{account.taxStrategyAdvice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax-Free Accounts Section */}
          <div className="px-5 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide">Tax-Free Accounts</h3>
            </div>

            <div className="space-y-3">
              {accounts.filter(acc => acc.taxCategory === "Tax-Free").map((account, index) => {
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
                        {account.linkedGoals.map((goalName, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-md border bg-green-50 border-green-200 text-green-600 flex items-center gap-1.5">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10">
                              <path d="M5 1V9M1 5H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                            <span className="text-xs font-medium">{goalName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-md px-3.5 py-3 border-l-2 border-green-500">
                      <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1.5">
                        Tax Strategy Analysis
                      </p>
                      <p className="text-sm text-slate-100 leading-snug">{account.taxStrategyAdvice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
