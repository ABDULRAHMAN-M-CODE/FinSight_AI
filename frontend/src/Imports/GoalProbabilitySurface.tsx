//import { mockDashboardData } from "../mocks/goalsAndInvestementsAdviceMock";


// Reusable components.
import {  useState } from 'react';
import cn from "../Components/utils";
import { Badge } from "../Components/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Components/tabs';




//Functions.
import { resolveData } from "../Functions/api/resolveData";

//constants.
import { defaultGoals } from "../utils/constants";
import { defaultGoalProbabilitySurface } from "../utils/constants";
import { riskOrder } from "../utils/constants";

// Types .
import { type FinancialGoalResponse } from "../Types/GoalsAndInvestementsAdviceContract";
import { type TYPE1 } from "../Types/TYPE1";
import { type GoalProbabilitySurface, type ProbabilityPoint } from "../Types/GoalsAndInvestementsAdviceContract";
import { FullAdviceSchema } from '../Functions/api/reusable_functions/getFullAdviceSchema';


// Custome hook
function useGoalProbabilitySurface({goals,goalProbabilitySurface}:TYPE1){
  
  
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0].id.toString());

  const getGoalData = (id: number) => {
    return goalProbabilitySurface.dataPerGoal.find(d => d.goalId === id);
  };

  const getProbability = (data: ProbabilityPoint[] | undefined, risk: string, contribution: number) => {
    if (!data) return 0;
    return data.find(d => d.riskTier === risk && d.contribution === contribution)?.probability || 0;
  };

  const getColor = (prob: number) => {
    if (prob >= 80) return 'bg-emerald-500';
    if (prob >= 60) return 'bg-emerald-300';
    if (prob >= 40) return 'bg-amber-200';
    return 'bg-red-200';
  };

  // Helper to get unique contributions for the axis
  const getContributions = (data: ProbabilityPoint[] | undefined) => {
    if (!data) return [];
    return Array.from(new Set(data.map(d => d.contribution))).sort((a, b) => a - b);
  };
  return{
    selectedGoalId,setSelectedGoalId,
    getContributions,
    getColor,
    getProbability,
    getGoalData,
  }
}


// Rendering 
export function GoalProbabilitySurface() {


    const  goals:FinancialGoalResponse[]=resolveData<FinancialGoalResponse[], typeof FullAdviceSchema >("fullAdvice", FullAdviceSchema, [defaultGoals],(data)=>data?.goalsAndInvestementsAdvice.goals);
    const   goalProbabilitySurface:GoalProbabilitySurface=resolveData<GoalProbabilitySurface, typeof FullAdviceSchema>("fullAdvice",FullAdviceSchema,defaultGoalProbabilitySurface,(data)=>data?.goalsAndInvestementsAdvice.goalProbabilitySurface);

    const{
    selectedGoalId,setSelectedGoalId,
    getContributions,
    getColor,
    getProbability,
    getGoalData,
  }=useGoalProbabilitySurface({goals,goalProbabilitySurface});
    return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-gray-900 font-semibold mb-1">Goal Probability Surface</h2>
          <p className="text-sm text-gray-600">Success Probability by Contribution & Risk</p>
        </div>
        <Badge variant="outline" className="text-xs font-normal text-slate-500">
          Multi-Goal Analysis
        </Badge>
      </div>

      {/* Tabs for Goals */}
      <Tabs value={selectedGoalId} onValueChange={setSelectedGoalId} className="w-full flex-1 flex flex-col">
        <TabsList className="w-full justify-start bg-gray-100 p-1 mb-4 h-auto flex-wrap">
          {goals.map(goal => (
            <TabsTrigger 
              key={goal.id} 
              value={goal.id.toString()}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs py-1.5 h-8"
            >
              {goal.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {goals.map(goal => {
          const goalData = getGoalData(goal.id);
          const contributions = getContributions(goalData?.contributionRiskMatrix);

          return (
            <TabsContent key={goal.id} value={goal.id.toString()} className="flex-1 flex flex-col mt-0">
              <div className="relative h-[280px] w-full flex flex-col justify-end pb-8 pl-24 pr-4 mb-4">
                {/* Y-axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 w-24 flex flex-col justify-between py-4 text-xs text-gray-500 text-right pr-3">
                  {riskOrder.map(risk => (
                    <div key={risk} className="flex-1 flex items-center justify-end font-medium">{risk}</div>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex-1 flex flex-col justify-between gap-2">
                  {riskOrder.map((risk) => (
                    <div key={risk} className="flex-1 flex gap-2">
                      {contributions.map((contribution) => {
                        const prob = getProbability(goalData?.contributionRiskMatrix, risk, contribution);
                        return (
                          <div 
                            key={`${risk}-${contribution}`}
                            className={cn(
                              "flex-1 rounded transition-all hover:shadow-md hover:scale-105 hover:z-10 group relative",
                              getColor(prob)
                            )}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded pointer-events-none whitespace-nowrap z-20">
                              {prob}% Prob.
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* X-axis Labels */}
                <div className="absolute bottom-0 left-24 right-4 h-8 flex justify-between items-center text-xs text-gray-500 font-medium">
                  {contributions.map(c => (
                    <span key={c}>${c}</span>
                  ))}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Text Blocks */}
      <div className="space-y-3 pt-6 border-t border-gray-200 mt-auto">
        {/* text1 (Static) */}
        <p className="text-sm text-gray-600 leading-relaxed">
          This chart shows how likely each of your goals is to succeed depending on contribution and risk levels. Darker green areas indicate a high probability of reaching the target by the deadline.
        </p>
        
        {/* text2 (Dynamic) */}
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-md flex gap-3 items-start">
          <div className="w-1 h-full min-h-[1.25rem] bg-blue-400 rounded-full flex-shrink-0 mt-1" />
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong className="font-semibold text-blue-800 uppercase text-xs tracking-wide block mb-1">AI Recommendation</strong> 
            {goalProbabilitySurface.text2}
          </p>
        </div>
      </div>
    </div>
  );
}
