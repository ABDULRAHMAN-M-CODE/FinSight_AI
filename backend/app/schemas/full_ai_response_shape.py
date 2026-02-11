
# for now , I want you to make pydantic model that defines the shape  of  just a 'part' of the full AI response.

# For Today , I want  you to make pydantic model just for the Following response from AI :

#Again , this is not the Full AI response yet, Just part of it , it will be used to populate only one UI.

# I sent the UI to you on Figma, check your Figma notifications.

"""
mockFinancialData = {
    protectionGap: {
    currentCoverage: 500000,
    requiredCoverage: 1200000,
    gap: 700000,
    annualIncome: 150000,
    yearsToRetirement: 25,
    incomeReplacementRate: 0.75,
    monthlyData: [
      { month: 0, required: 1200000, current: 500000, gap: 700000 },
      { month: 5, required: 1150000, current: 500000, gap: 650000 },
      { month: 10, required: 1100000, current: 500000, gap: 600000 },
      { month: 15, required: 1000000, current: 500000, gap: 500000 },
      { month: 20, required: 850000, current: 500000, gap: 350000 },
      { month: 25, required: 650000, current: 500000, gap: 150000 },
    ]
  },
  recommendations: [
    {
      id: 1,
      policyName: 'Term Life Insurance',
      currentCoverage: 500000,
      recommendedCoverage: 1200000,
      gap: 700000,
      action: 'Increase coverage by $700,000 to protect household income for 10+ years',
      priority: 'High',
      reason: 'Current coverage only replaces 3.3 years of income vs recommended 8 years',
      estimatedCost: '+$85/month'
    },
    {
      id: 2,
      policyName: 'Disability Insurance',
      currentCoverage: 0,
      recommendedCoverage: 112500,
      gap: 112500,
      action: 'Establish disability coverage at 75% income replacement',
      priority: 'High',
      reason: 'No income protection if unable to work - high risk exposure',
      estimatedCost: '$120/month'
    },
    {
      id: 3,
      policyName: 'Critical Illness Coverage',
      currentCoverage: 50000,
      recommendedCoverage: 150000,
      gap: 100000,
      action: 'Increase coverage to align with annual income',
      priority: 'Medium',
      reason: 'Current coverage insufficient for medical expenses and income loss',
      estimatedCost: '+$45/month'
    }
  ]
};
"""
##########################################################################################################################
# SECOND SCHEMA : DebtsAdvice  

# I sent to you another UI on Figma, check the notifications,old UI was ugly and non usefull at all

 """Note : Updating UI or making new Design, of course, needs different AI response to handle that new UI. 
    thus we will store different Kind of response than the old planned, Old Tables Needs Modifications.
    it's easy to Update the Tables because They are Separate, Again, this is a huge benefit of separation the Tables.
    Login and signup Tables  Tables Will not Be Touched at all , they will stay as they are- which is strong benefit of separating the tables-.
    I will tell you later Which Tables Needs modifications """


#*****VERY IMPORTANT : KEEP THE NAME OF THE VARIABLES in the following schema  EXACTLY AS THEY ARE**** 
"""
mockDebtData = {
  
  householdIncome: 8500,


  monthlyProjections: [
    { month: 0, totalDebt: 86200, highInterestDebt: 20700, debtToIncome: 0.52, interestCost: 950 },
    { month: 6, totalDebt: 78400, highInterestDebt: 15200, debtToIncome: 0.47, interestCost: 820 },
    { month: 12, totalDebt: 69800, highInterestDebt: 9500, debtToIncome: 0.42, interestCost: 680 },
    { month: 18, totalDebt: 60200, highInterestDebt: 4100, debtToIncome: 0.36, interestCost: 520 },
    { month: 24, totalDebt: 49500, highInterestDebt: 0, debtToIncome: 0.30, interestCost: 380 },
    { month: 30, totalDebt: 38200, highInterestDebt: 0, debtToIncome: 0.23, interestCost: 240 },
    { month: 36, totalDebt: 26100, highInterestDebt: 0, debtToIncome: 0.16, interestCost: 150 },
  ]
,
  debts: [
    {
      id: 1,
      name: 'Credit Card A',
      balance: 12500,
      interestRate: 22.99,
      riskLevel: 'High',
      type: 'Credit Card',

    },
    {
      id: 2,
      name: 'Credit Card B',
      balance: 8200,
      interestRate: 19.49,
      riskLevel: 'High',
      type: 'Credit Card'
      
    },
    {
      id: 3,
      name: 'Auto Loan',
      balance: 18500,
      interestRate: 6.75,
      riskLevel: 'Medium',
      type: 'Auto Loan'

    },
    {
      id: 4,
      name: 'Personal Loan',
      balance: 15000,
      interestRate: 11.5,
      riskLevel: 'Medium',
      type: 'Personal Loan'

    },
    {
      id: 5,
      name: 'Student Loan',
      balance: 32000,
      interestRate: 4.25,
      riskLevel: 'Low',
      type: 'Student Loan'

    }
  ],

  riskMetrics: {
    debtToIncomeRatio: 0.52, // 52%
    highInterestDebtRatio: 0.38, // 38% of total debt is high-interest
    monthlyDebtBurden: 0.22, // 22% of monthly income
    estimatedDebtFreeDate: '2028-06-15',
    totalInterestSavings: 4010, // From optimized strategy
    monthsSaved: 14
  },

};


"""