import { type GoalsAndInvestementsAdviceContract } from "../Types/GoalsAndInvestementsAdviceContract";
export const mockDashboardData:GoalsAndInvestementsAdviceContract = {
  goals: [
    { id: 1, name: "Retirement", target: 2000000, deadline: 2045, currentAssets: 500000 },
    { id: 2, name: "College Fund", target: 300000, deadline: 2035, currentAssets: 50000 }
  ],
  investments: [
    { id: 1, name: "401k", currentValue: 200000, riskTier: "Growth" },
    { id: 2, name: "Brokerage", currentValue: 100000, riskTier: "Balanced" },
    { id: 3, name: "High Yield Savings", currentValue: 250000, riskTier: "Conservative" }
  ],

  optimalStrategy: {
    directives: [
      { 
        id: 1, 
        type: 'contribution', 
        title: 'Increase Monthly Investment', 
        value: '+$850', 
        description: 'Raise total monthly contributions from $2,000 to $2,850 across all goals to significantly improve success probability.' 
      },
      { 
        id: 2, 
        type: 'allocation', 
        title: 'Shift Asset Allocation', 
        value: '32% → Growth', 
        description: 'Reallocate 32% of portfolio from conservative to growth-oriented assets to maximize long-term returns.' 
      },
      { 
        id: 3, 
        type: 'liquidity', 
        title: 'Deploy Excess Liquidity', 
        value: '$175K above threshold', 
        description: 'Move $175,000 from High Yield Savings into diversified equity positions while maintaining 6-month emergency reserve.' 
      },
      { 
        id: 4, 
        type: 'timeline', 
        title: 'Optimize Goal Timeline', 
        value: '+1 year delay', 
        description: 'Extend College Fund deadline by 1 year to unlock 18% higher success probability without additional contributions.' 
      },
      { 
        id: 5, 
        type: 'consolidation', 
        title: 'Consolidate Accounts', 
        value: '3 → 2 accounts', 
        description: 'Merge Brokerage and 401k management to reduce fees by $480/year and simplify rebalancing strategy.' 
      }
    ],
    impactSummary: {
      probabilityImprovement: 22,
      projectedGain: 820000
    }
  },

  goalProbabilitySurface: {
    dataPerGoal: [
      {
        goalId: 1,
        contributionRiskMatrix: [
          // Conservative
          { contribution: 1000, riskTier: 'Conservative', probability: 30 },
          { contribution: 2000, riskTier: 'Conservative', probability: 50 },
          { contribution: 3000, riskTier: 'Conservative', probability: 65 },
          // Balanced
          { contribution: 1000, riskTier: 'Balanced', probability: 45 },
          { contribution: 2000, riskTier: 'Balanced', probability: 65 },
          { contribution: 3000, riskTier: 'Balanced', probability: 78 },
          // Growth
          { contribution: 1000, riskTier: 'Growth', probability: 55 },
          { contribution: 2000, riskTier: 'Growth', probability: 75 },
          { contribution: 3000, riskTier: 'Growth', probability: 88 },
        ]
      },
      {
        goalId: 2,
        contributionRiskMatrix: [
           // Conservative
           { contribution: 200, riskTier: 'Conservative', probability: 40 },
           { contribution: 500, riskTier: 'Conservative', probability: 60 },
           { contribution: 800, riskTier: 'Conservative', probability: 75 },
           // Balanced
           { contribution: 200, riskTier: 'Balanced', probability: 55 },
           { contribution: 500, riskTier: 'Balanced', probability: 72 },
           { contribution: 800, riskTier: 'Balanced', probability: 85 },
           // Growth
           { contribution: 200, riskTier: 'Growth', probability: 65 },
           { contribution: 500, riskTier: 'Growth', probability: 82 },
           { contribution: 800, riskTier: 'Growth', probability: 92 },
        ]
      }
    ],
    text2: "Increase contribution for Retirement to $2,500/month and shift College Fund to Growth to exceed 75% success probability."
  },
 
  financialTrajectoryDivergence: {
    currentPath: Array.from({ length: 31 }, (_, i) => {
      const year = 2026 + i;
      const currentBase = 550000;
      const optimizedBase = 550000;
      return {
        year,
        currentMedian: Math.round(currentBase * Math.pow(1.06, i) + (i * 30000)),
        optimizedMedian: Math.round(optimizedBase * Math.pow(1.08, i) + (i * 36000)),
        current10th: Math.round((currentBase * Math.pow(1.04, i) + (i * 30000)) * 0.9),
        optimized10th: Math.round((optimizedBase * Math.pow(1.06, i) + (i * 36000)) * 0.95),
      };
    }),
    text2: "Adopt the optimized strategy across all goals to reduce downside risk by 15% and capture $650k projected wealth gains."
  }
};


