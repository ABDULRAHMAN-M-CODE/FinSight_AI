import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, TrendingDown, Shield } from 'lucide-react';


// Types, data shape contracts, or interfaces
import {  type DebtAdviceContract } from '../Types/DebtAdviceContract';


// custome hook
function useDebtRiskVisualization({debts, riskMetrics }: DebtAdviceContract){
 
 
 
 const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const highInterestDebts = debts.filter(d => d.riskLevel === 'High');
  const totalHighInterestBalance = highInterestDebts.reduce((sum, d) => sum + d.balance, 0);
  const avgHighInterestRate = highInterestDebts.length > 0 
    ? (highInterestDebts.reduce((sum, d) => sum + d.interestRate, 0) / highInterestDebts.length).toFixed(2)
    : 0;

  const currentDTI = riskMetrics.debtToIncomeRatio;
  const dtiStatus = currentDTI > 0.43 ? 'Critical' : currentDTI > 0.36 ? 'High' : currentDTI > 0.28 ? 'Moderate' : 'Healthy';
  const dtiColor = currentDTI > 0.43 ? 'red' : currentDTI > 0.36 ? 'amber' : currentDTI > 0.28 ? 'yellow' : 'green';
  return{
    formatCurrency,
    formatPercent,
    totalHighInterestBalance,
    avgHighInterestRate,dtiStatus,dtiColor,
    currentDTI,
    highInterestDebts
  }
}


//Rendering
export function DebtRiskVisualization({ monthlyProjections, debts, riskMetrics }: DebtAdviceContract) {
   
    const {    
    formatCurrency,
    formatPercent,
    totalHighInterestBalance,
    avgHighInterestRate,
    dtiStatus,
    dtiColor,
    currentDTI,
    highInterestDebts}=useDebtRiskVisualization({ monthlyProjections, debts, riskMetrics });


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-4">Debt Risk Stress Analysis</h2>
        
        {/* Risk Concentration Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`bg-${dtiColor}-50 border border-${dtiColor}-200 rounded-lg p-4`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm text-${dtiColor}-600 mb-1`}>Debt-to-Income Ratio</p>
                <p className={`text-2xl font-semibold text-${dtiColor}-900`}>
                  {formatPercent(currentDTI)}
                </p>
                <p className={`text-xs text-${dtiColor}-600 mt-1`}>
                  Status: {dtiStatus}
                </p>
              </div>
              <AlertTriangle className={`text-${dtiColor}-500`} size={24} />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div>
              <p className="text-sm text-red-600 mb-1">High-Interest Exposure</p>
              <p className="text-2xl font-semibold text-red-900">
                {formatCurrency(totalHighInterestBalance)}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Avg rate: {avgHighInterestRate}%
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Monthly Interest Cost</p>
                <p className="text-2xl font-semibold text-blue-900">
                  ${monthlyProjections[0]?.interestCost.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        {/* Debt Burden Trajectory Chart */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Debt Burden Reduction Trajectory</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyProjections}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHighInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  label={{ value: 'Months from Now', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={formatCurrency}
                  label={{ value: 'Debt Balance', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip 
                    formatter={(value?: number, name?: string) => {
                    if (value === undefined) return '';
                    if (name === 'Debt-to-Income Ratio') return formatPercent(value);
                    return formatCurrency(value);
                    }}

                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area 
                  type="monotone" 
                  dataKey="totalDebt" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  name="Total Debt"
                />
                <Area 
                  type="monotone" 
                  dataKey="highInterestDebt" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorHighInterest)" 
                  name="High-Interest Debt"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DTI Ratio Over Time */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Debt-to-Income Ratio Stress Test</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyProjections}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  label={{ value: 'Months from Now', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={formatPercent}
                  domain={[0, 0.6]}
                  label={{ value: 'DTI Ratio', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                {/**value should be optional to match the expected Formatter<number, string> type in Recharts */}
                <Tooltip 
                  formatter={(value?: number) => (value !== undefined ? formatPercent(value) : '')}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Risk threshold lines */}
                <Line 
                  type="monotone" 
                  dataKey={() => 0.43} 
                  stroke="#dc2626" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="Critical Threshold (43%)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey={() => 0.36} 
                  stroke="#f59e0b" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="High Risk (36%)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="debtToIncome" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Your DTI Trajectory"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Concentration Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              High-Risk Debt Concentration
            </h4>
            <div className="space-y-2">
              {highInterestDebts.map(debt => (
                <div key={debt.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{debt.name}</p>
                    <p className="text-xs text-gray-600">{debt.interestRate}% APR</p>
                  </div>
                  <p className="text-sm font-semibold text-red-600">
                    ${debt.balance.toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="pt-2 border-t border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Total High-Risk Exposure:</strong> ${totalHighInterestBalance.toLocaleString()} 
                  ({((totalHighInterestBalance / debts.reduce((sum, d) => sum + d.balance, 0)) * 100).toFixed(0)}% of total debt)
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="text-green-500" size={18} />
              Risk Mitigation Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><strong>Month 18:</strong> High-interest debt reduced by 80%</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><strong>Month 24:</strong> All high-interest debt eliminated</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><strong>Month 36:</strong> DTI ratio drops below 20% (healthy range)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Derived from Graph */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Risk-Based Recommendations</h4>
          
          {currentDTI > 0.43 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                <strong>Critical Risk:</strong> Your DTI ratio of {formatPercent(currentDTI)} exceeds the critical threshold. 
                Prioritize high-interest debt reduction immediately to avoid financial stress and potential default risk.
              </p>
            </div>
          )}

          {riskMetrics.highInterestDebtRatio > 0.3 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>High-Interest Concentration:</strong> {formatPercent(riskMetrics.highInterestDebtRatio)} of your debt 
                carries high interest rates (≥15%). This creates structural weakness—eliminate these debts first to reduce 
                monthly interest costs by ${(monthlyProjections[0]?.interestCost * 0.65).toFixed(0)}/month.
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Trajectory Analysis:</strong> Following the optimized payoff sequence reduces your DTI from {formatPercent(currentDTI)} to 
              {formatPercent(monthlyProjections[monthlyProjections.length - 1]?.debtToIncome)} within {monthlyProjections[monthlyProjections.length - 1]?.month} months, 
              eliminating high-interest debt exposure entirely by month 24.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
