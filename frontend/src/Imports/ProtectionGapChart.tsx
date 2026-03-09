import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';


// types
import { type  ProtectionGap } from '../Types/InsurenceAdviceContract';
// For Code Readability, ensure Function signature  has little props count

type  ProtectionGapChartProps ={
  data: ProtectionGap
}

//Logic
function useProtectionGapChart({data}:ProtectionGapChartProps){

    const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const gapPercentage = ((data.gap / data.requiredCoverage) * 100).toFixed(1);

  
  return{
    formatCurrency,
    gapPercentage
  }
}

//Rendering
export function ProtectionGapChart({ data }: ProtectionGapChartProps) {
  
  const {formatCurrency,gapPercentage}=useProtectionGapChart({data});

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-4">Income Replacement Coverage Analysis</h2>
        
        {/* Gap Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-red-600 mb-1">Coverage Gap</p>
                <p className="text-2xl font-semibold text-red-900">
                  {formatCurrency(data.gap)}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {gapPercentage}% shortfall
                </p>
              </div>
              <AlertTriangle className="text-red-500" size={24} />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div>
              <p className="text-sm text-blue-600 mb-1">Required Coverage</p>
              <p className="text-2xl font-semibold text-blue-900">
                {formatCurrency(data.requiredCoverage)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {data.incomeReplacementRate * 100}% income replacement
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Coverage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data.currentCoverage)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Existing policies
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data.monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                label={{ value: 'Years from Now', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                tickFormatter={formatCurrency}
                label={{ value: 'Coverage Amount', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip 
                 formatter={(value?: number) => value !== undefined ? formatCurrency(value) : ''}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Area 
                type="monotone" 
                dataKey="required" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRequired)" 
                name="Required Coverage"
              />
              <Area 
                type="monotone" 
                dataKey="current" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCurrent)" 
                name="Current Coverage"
              />
              <Area 
                type="monotone" 
                dataKey="gap" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorGap)" 
                name="Coverage Gap"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          <strong>Critical Finding:</strong> Your current coverage of {formatCurrency(data.currentCoverage)} leaves 
          a {formatCurrency(data.gap)} gap in income protection. This shortfall exposes your household to significant 
          financial risk during the critical earning years ahead.
        </p>
      </div>
    </div>
  );
}
