import { TrendingUp, ArrowUpRight } from 'lucide-react';

import { type OptimalStrategy } from '../Types/GoalsAndInvestementsAdviceContract';


const typeIcons = {
  contribution: '💰',
  allocation: '📊',
  liquidity: '💧',
  timeline: '⏰',
  consolidation: '🔗'
};


import { defaultOptimalStrategy } from '../utils/constants';
import { resolveData } from '../Functions/api/resolveData';
import { FullAdviceSchema } from '../Functions/api/reusable_functions/getFullAdviceSchema';


export function OptimalStrategyContainer() {


  const  optimalStrategy:OptimalStrategy=resolveData<OptimalStrategy, typeof FullAdviceSchema>("fullAdvice",FullAdviceSchema,defaultOptimalStrategy,(data)=>data?.goalsAndInvestementsAdvice.optimalStrategy);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-gray-900 font-semibold mb-1">AI-Recommended Strategy</h2>
          <p className="text-sm text-gray-600">Optimized allocation & contribution plan</p>
        </div>
        
        {/* Impact Summary Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Success Rate</div>
            <div className="text-lg font-semibold text-emerald-600">
              +{optimalStrategy.impactSummary.probabilityImprovement}%
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Projected Gain</div>
            <div className="text-lg font-semibold text-blue-600">
              +${(optimalStrategy.impactSummary.projectedGain / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Directives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {optimalStrategy.directives.map((directive) => (
          <div
            key={directive.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all group bg-gray-50/50"
          >
            {/* Directive Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{typeIcons[directive.type]}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                    {directive.type}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{directive.title}</h3>

            {/* Value Highlight */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded px-2.5 py-1 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">{directive.value}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed">{directive.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Notice */}
      <div className="border-t border-gray-200 pt-6 space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          This integrated strategy maximizes goal success probability through optimized contribution levels, asset allocation shifts, and timeline adjustments derived from multi-goal Monte Carlo analysis.
        </p>
        
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-md flex gap-3 items-start">
          <div className="w-1 h-full min-h-[1.25rem] bg-amber-400 rounded-full flex-shrink-0 mt-1" />
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong className="font-semibold text-amber-800 uppercase text-xs tracking-wide block mb-1">Decision Required</strong>
            Adopt this strategy to unlock the projected gains, or consciously maintain your current approach with full awareness of the opportunity cost.
          </p>
        </div>
      </div>
    </div>
  );
}