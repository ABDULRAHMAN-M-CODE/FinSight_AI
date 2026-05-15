
import { Target, CheckCircle, AlertTriangle, Calendar, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { type FullAdviceDataType } from './MultiStepContext';

import z from 'zod';
export const GoalAdviceItemSchema=z.object({
  goal_id: z.number(),
  goal_name: z.string(),
  is_possible: z.boolean(),
  priority: z.enum(["high", "medium", "low"]),
  required_monthly_saving: z.number(),
  months_remaining: z.number(),
  ai_summary: z.string(),
  simple_plan: z.array(z.string())
})
type GoalAdvice=z.infer<typeof GoalAdviceItemSchema>

const defaultData: GoalAdvice[] = [
  {
    "goal_id": 1,
    "goal_name": "Emergency Fund",
    "is_possible": true,
    "priority": "high",
    "required_monthly_saving": 312.5,
    "months_remaining": 16,
    "ai_summary": "Building an emergency fund is highly important and achievable with your current financial profile.",
    "simple_plan": [
      "Save automatically every month",
      "Reduce unnecessary subscriptions",
      "Keep emergency savings in separate account",
      "Use bonuses to accelerate savings"
    ]
  },
  {
    "goal_id": 2,
    "goal_name": "Buy a Car",
    "is_possible": true,
    "priority": "medium",
    "required_monthly_saving": 625,
    "months_remaining": 24,
    "ai_summary": "This goal is achievable but should come after strengthening emergency savings.",
    "simple_plan": [
      "Save consistently every month",
      "Compare cheaper car options",
      "Avoid high-interest financing",
      "Track savings progress monthly"
    ]
  },
  {
    "goal_id": 3,
    "goal_name": "Vacation Trip",
    "is_possible": false,
    "priority": "low",
    "required_monthly_saving": 1000,
    "months_remaining": 2,
    "ai_summary": "The timeline for this goal is too aggressive given your disposable income.",
    "simple_plan": [
      "Postpone trip by 6 months",
      "Reduce trip budget",
      "Focus on debt reduction first",
      "Re-evaluate after improving savings"
    ]
  },
  {
    "goal_id": 4,
    "goal_name": "New Phone",
    "is_possible": true,
    "priority": "low",
    "required_monthly_saving": 180,
    "months_remaining": 5,
    "ai_summary": "This goal is achievable with minor spending adjustments.",
    "simple_plan": [
      "Save monthly in dedicated account",
      "Look for discounts and offers",
      "Delay purchase if emergencies arise",
      "Avoid installment debt if possible"
    ]
  }
];



//hooks
import { useState } from 'react';

//types
export default function GoalsAdvice() {
  const [mockData, setMockData] = useState< GoalAdvice[]>(defaultData);
  
    useEffect(()=>{
      const rawString:string |null =localStorage.getItem("FullAdviceData")
      if(rawString){
        const backendData:FullAdviceDataType=JSON.parse(rawString)
        console.log("BACKEND DATA =", backendData);
        setMockData(backendData.goalsAdvice) // error A here
      }
    },[])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            Financial Goals Advice
          </h1>
          <p className="text-gray-500 mt-2">
            AI-driven insights and step-by-step action plans for your financial goals.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockData.map((goal) => (
            <section
              key={goal.goal_id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {goal.goal_name}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                      goal.priority === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : goal.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {goal.priority} Priority
                  </span>
                </div>
                
                <div
                  className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border shadow-sm ${
                    goal.is_possible
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}
                >
                  {goal.is_possible ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Achievable
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-1.5" />
                      Needs Adjustment
                    </>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                {/* AI Summary */}
                <div className="mb-6 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                      {goal.ai_summary}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" /> Required Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${goal.required_monthly_saving}
                      <span className="text-sm text-gray-500 font-normal"> /mo</span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" /> Timeline
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {goal.months_remaining}
                      <span className="text-sm text-gray-500 font-normal"> mos</span>
                    </p>
                  </div>
                </div>

                {/* Plan List */}
                <div className="mt-auto">
                  <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                    Recommended Plan
                  </h3>
                  <ul className="space-y-3">
                    {goal.simple_plan.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-gray-700 bg-gray-50/50 p-2.5 rounded border border-gray-100"
                      >
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
