import { CalendarCheck, Target, TrendingDown, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import * as z from "zod";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const DebtTrajectoryPoint=z.object({
    monthLabel:z.string(),
}).catchall(z.union([z.number(),z.string()])) 
export const DebtKeyConfigSchema=z.object({
  key: z.string(), // key= name visually, not functionally.
  name: z.string(),
  color: z.string()    
 })
export  const TextualDebtAdvice=z.object({
   type:z.enum(["urgent", "positive", "neutral"]),
   textualAdvice: z.string()
 })
export  const  DebtsAdviceUiDataSchema = z.object({
  trajectory: z.array(DebtTrajectoryPoint),
  debtKeys: z.array(DebtKeyConfigSchema),
  monthsToTotalPayoff: z.number(),
  estimatedPayoffDate: z.string(),
  startingTotalBalance: z.number(),
  advice: TextualDebtAdvice
  });
export type DebtsAdviceUiDataShape=z.infer<typeof DebtsAdviceUiDataSchema>
export function MultiDebtPayoffTrajectory({trajectory,debtKeys,monthsToTotalPayoff,estimatedPayoffDate,startingTotalBalance,advice}: DebtsAdviceUiDataShape) {

  // Presentation logic only (not financial math)
const formatCurrency = (value: number | string | Array<any> | undefined) => {
    if (typeof value === 'number') {
      if (value === 0) return '$0';
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
      return `$${value}`;
    }
    return '';
  };

  const formatTooltipCurrency = (value: number | string | Array<any> | undefined) => {
    if (typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    return `$0`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Debt payoff  timeline</h2>
        <p className="text-sm text-gray-500">Visualizing the exact timeline of each debt dropping to zero</p>
      </div>

      {/* Pre-calculated Insights Cards : [put it in standalone component in the same file for readability] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium mb-1">Starting Total Balance</p>
              <p className="text-2xl font-bold text-orange-900">
                ${startingTotalBalance.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="text-orange-500" size={20} />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Time to Total Freedom</p>
              <p className="text-2xl font-bold text-blue-900">
                {monthsToTotalPayoff} Months
              </p>
            </div>
            <Target className="text-blue-500" size={20} />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium mb-1">Complete Freedom Date</p>
              <p className="text-2xl font-bold text-emerald-900">
                {estimatedPayoffDate}
              </p>
            </div>
            <CalendarCheck className="text-emerald-500" size={20} />
          </div>
        </div>
      </div>



      {/* Stacked Area Chart :[put it in standalone component in the same file for readability] */}
      <div className="h-[400px] w-full min-h-[400px]">
        <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={400}>
          <AreaChart
            data={trajectory}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              key="xaxis"
              dataKey="monthLabel" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              key="yaxis"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              key="tooltip"
              formatter={formatTooltipCurrency}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#111827'
              }}
              itemStyle={{ fontWeight: 500 }}
              labelStyle={{ color: '#6b7280', marginBottom: '0.5rem', fontWeight: 600 }}
            />
            <Legend 
              key="legend"
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}
            />
            
            {/* 
              Dynamically render an Area for each debt in the configuration array.
              The magic here is stackId="1" which tells Recharts to stack them on top of each other.
              We map in reverse so the first item (highest priority/interest) is on the bottom of the stack,
              making its drop-to-zero visually obvious.
            */}
            {[...debtKeys].reverse().map((debt) => (
              <Area 
                key={debt.key}
                id={debt.key}
                type="monotone" 
                dataKey={debt.key} 
                name={debt.name}
                stackId="1" 
                stroke={debt.color} 
                strokeWidth={2}
                fillOpacity={0.8} 
                fill={debt.color} 
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>



      {/* Dynamic Advice Container - Single Block :[put it in standalone component in the same file for readability] */}
      {advice && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          
          
          {(() => {
            let bgColor = 'bg-gray-50';
            let borderColor = 'border-gray-200';
            let iconColor = 'text-gray-500';
            let titleColor = 'text-gray-900';
            let Icon = Info;

            if (advice.type === 'urgent') {
              bgColor = 'bg-red-50';
              borderColor = 'border-red-100';
              iconColor = 'text-red-500';
              titleColor = 'text-red-900';
              Icon = AlertCircle;
            } else if (advice.type === 'positive') {
              bgColor = 'bg-emerald-50';
              borderColor = 'border-emerald-100';
              iconColor = 'text-emerald-500';
              titleColor = 'text-emerald-900';
              Icon = CheckCircle2;
            } else if (advice.type === 'neutral') {
              bgColor = 'bg-blue-50';
              borderColor = 'border-blue-100';
              iconColor = 'text-blue-500';
              titleColor = 'text-blue-900';
              Icon = Info;
            }

            return (
              <div className={`flex items-start gap-4 p-5 rounded-lg border ${bgColor} ${borderColor}`}>
                <Icon className={`mt-0.5 shrink-0 ${iconColor}`} size={24} />
                <div>
                  <h4 className={`text-base font-semibold mb-2 ${titleColor}`}>Recommendation</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{advice.textualAdvice}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}