
// hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom";

// Prebuilt components
import { ProgressBar } from "../Imports/ProgressBar"
import { HouseholdIncomeSection } from "../Imports/HouseholdIncomeSection";
import { MonthlyBudgetSection } from '../Imports/MonthlyBudgetSection';

import { OutstandingDebtsSection } from '../Imports/OutstandingDebtsSection';
import { LifeInsuranceSection } from '../Imports/LifeInsuranceSection';
import { FinancialGoalsSection } from '../Imports/FinancialGoalsSection';
import BackAndContinueButtons from "../Imports/BackAndContinueButtons";
import RiskAssessment from "../Components/InvestementsRiskProfileAssasementCard";


import type { HouseholdMember,  } from '../Types/HouseHoldMember';
import type { Debt } from "../Types/Debt";
import { type Goal } from "../Types/Goal";
import { type InsuranceInfo } from "../Types/InsuranceInfo";
import { type SubjectiveQuestionAnswer } from "../Components/InvestementsRiskProfileAssasementCard";
//Needed later (Unless we refactor the code)
//import { type FullServiceAdviceContract } from "../Types/FullServiceAdviceContract";
//import { type DebtsAdviceUiDataShape } from "../Components/MultiDebtPayoffTrajectory";
import { type SubjectiveQuestionsType } from "../Components/InvestementsRiskProfileAssasementCard";

//  custome functions
import { FetchData } from "../Functions/api/fetchData";
//import { extractAndSaveDataToLocalStorage } from "../Functions/api/reusable_functions/extractAndSaveDataToLocalStorage ";
import z from "zod";
const Asset=z.object({
    assetName: z.string(),
    capitalAllocationPercentage:z.number(),
    quantity: z.number()
})

        
const Metrics=z.object({
    expectedAnnualReturn: z.number(),
    annualVolatility: z.number(),
    sharpeRatio: z.number()
}) 



const OptimalPortfolio=z.object({
    assets:z.array(Asset), 
    metrics:Metrics 
})


    
const AssetScatterPoint=z.object({
    ticker:z.string(),
    volatility: z.number(),
    expectedReturn:z.number()  
})

    
const EfficientFrontierPoint=z.object({
    volatility: z.number(),
    expectedReturn: z.number()
}) 


const  InvestementsAdviceSchema =z.object({
    leftover: z.number(),
    optimalPortfolio:OptimalPortfolio, 
    assetsScatter: z.array(AssetScatterPoint),
    efficientFrontierPoints: z.array(EfficientFrontierPoint)

})
export type InvestementsAdviceType = z.infer<typeof InvestementsAdviceSchema>; 
export const FullAdviceDataSchema=z.object({
    //fullDebtsUiData:FullDebtsUiData   # commented for testing, add it later, change those names
    investementsAdvice:InvestementsAdviceSchema 
})
export type FullAdviceDataType= z.infer<typeof FullAdviceDataSchema>; 

export const subjectiveQuestions:SubjectiveQuestionsType = [
  {
    questionId: 0,
    questionTitle: "1. Investment Objective",
    questionText: "What is your primary investment goal?",
    questionWeight:10,// backend only cares about this and the answerOptionValue
    
    answerOptions: [
      { answerOptionText: "A) Preserve my capital with little to no growth.", answerOptionValue: 1 },
      { answerOptionText: "B) Some growth potential with moderate capital preservation.", answerOptionValue: 4 },
      { answerOptionText: "C) Balanced growth and preservation of capital.", answerOptionValue: 6 },
      { answerOptionText: "D) Primarily focused on growth, even with some risk.", answerOptionValue: 8 },
      { answerOptionText: "E) Maximize growth potential with high tolerance for risk.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 1,
    questionTitle: "2. Investment Horizon",
    questionText: "How long do you intend to hold your investments before accessing them?",
    questionWeight:5,
    answerOptions: [
      { answerOptionText: "A) Less than 2 years.", answerOptionValue: 1 },
      { answerOptionText: "B) 2-5 years.", answerOptionValue: 4 },
      { answerOptionText: "C) 5-10 years.", answerOptionValue: 6 },
      { answerOptionText: "D) 10-15 years.", answerOptionValue: 8 },
      { answerOptionText: "E) More than 15 years.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 2,
    questionTitle: "3. Comfort with Market Volatility",
    questionText: "How do you react to fluctuations  of your investments?",
    questionWeight:5,
    answerOptions: [
      { answerOptionText: "A) I feel very uncomfortable and prefer little to no fluctuation.", answerOptionValue: 1 },
      { answerOptionText: "B) I feel uneasy but can tolerate minimal fluctuation.", answerOptionValue: 4 },
      { answerOptionText: "C) I can accept moderate fluctuations.", answerOptionValue: 6 },
      { answerOptionText: "D) I can tolerate significant fluctuations for potential growth.", answerOptionValue: 8 },
      { answerOptionText: "E) I am very comfortable with high volatility for growth potential.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 3,
    questionTitle: "4. Withdrawal",
    questionText: "As I withdraw money from these investments, I plan to spend it over a period of...",
    questionWeight:4,
    answerOptions: [
      { answerOptionText: "A) 2 years or less", answerOptionValue: 1 },
      { answerOptionText: "B) 3-5 years", answerOptionValue: 4 },
      { answerOptionText: "C)6-10 years", answerOptionValue: 6 },
      { answerOptionText: "D) 11-15 years", answerOptionValue: 8 },
      { answerOptionText: "E)More than 15 years", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 4,
    questionTitle: "5. Expected Returns",
    questionText: "What level of return are you hoping for from your investments?",
    questionWeight:10,
    answerOptions: [
      { answerOptionText: "A) Low returns to protect my capital.", answerOptionValue: 1 },
      { answerOptionText: "B) Modest returns with some protection of my capital.", answerOptionValue: 4 },
      { answerOptionText: "C) Balanced returns, accepting moderate risk.", answerOptionValue: 6 },
      { answerOptionText: "D) Higher returns, accepting some potential loss.", answerOptionValue: 8 },
      { answerOptionText: "E) Maximum returns, accepting a high level of risk.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 5,
    questionTitle: "6. Reaction to a Market Downturn",
    questionText: "How would you respond if your investment portfolio lost 15% in a few months due to market conditions?",
    questionWeight:8,
    answerOptions: [
      { answerOptionText: "A) Sell all investments to avoid further loss.", answerOptionValue: 1 },
      { answerOptionText: "B) Sell some investments to reduce risk.", answerOptionValue: 4 },
      { answerOptionText: "C) Do nothing and wait for the market to recover.", answerOptionValue: 6 },
      { answerOptionText: "D) Consider investing more while prices are low.", answerOptionValue: 8 },
      { answerOptionText: "E) Confidently invest more to maximize potential gains.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 6,
    questionTitle: "7. Income vs. Growth Preference",
    questionText: "What is your preference between income (dividends, interest) and growth (capital appreciation)?",
    questionWeight:7,
    answerOptions: [
      { answerOptionText: "A) I prefer a steady income with little growth.", answerOptionValue: 1 },
      { answerOptionText: "B) Mainly income with some growth potential.", answerOptionValue: 4 },
      { answerOptionText: "C) Balanced between income and growth.", answerOptionValue: 6 },
      { answerOptionText: "D) Mostly growth with some income.", answerOptionValue: 8 },
      { answerOptionText: "E) Primarily focused on growth, with minimal concern for income.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 7,
    questionTitle: "8. Financial Stability",
    questionText: "How stable is your overall financial situation?",
    questionWeight:8,
    answerOptions: [
      { answerOptionText: "A) I need to prioritise savings for emergencies and short-term needs.", answerOptionValue: 1 },
      { answerOptionText: "B) I have some savings but might need additional funds for unexpected expenses.", answerOptionValue: 4 },
      { answerOptionText: "C) My financial situation is stable, and I can take moderate risks.", answerOptionValue: 6 },
      { answerOptionText: "D) I have a strong financial base and can handle fluctuations in my investments.", answerOptionValue: 8 },
      { answerOptionText: "E) I am financially secure and willing to accept high risk for high potential returns.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 8,
    questionTitle: "9. Investment Knowledge",
    questionText: "How would you rate your knowledge of investments and financial markets?",
    questionWeight:6,
    answerOptions: [
      { answerOptionText: "A) Very limited understanding of investments.", answerOptionValue: 1 },
      { answerOptionText: "B) Basic understanding with some exposure to investing.", answerOptionValue: 4 },
      { answerOptionText: "C) Moderate understanding and experience in investing.", answerOptionValue: 6 },
      { answerOptionText: "D) Good knowledge and comfortable with various types of investments.", answerOptionValue: 8 },
      { answerOptionText: "E) Extensive knowledge and confident in high-risk investments.", answerOptionValue: 10 }
    ]
  },
  {
    questionId: 9,
    questionTitle: "10. Past Investment Experiences",
    questionText: "What has been your experience with previous investments?",
    questionWeight:5,
    answerOptions: [
      { answerOptionText: "A) I have little to no experience and prefer low-risk investments.", answerOptionValue: 1 },
      { answerOptionText: "B) I have some experience but tend to avoid high-risk answerOptionTexts.", answerOptionValue: 4 },
      { answerOptionText: "C) I have had mixed results and am open to moderate risks.", answerOptionValue: 6 },
      { answerOptionText: "D) I am comfortable with risk and have had positive experiences with growth investments.", answerOptionValue: 8 },
      { answerOptionText: "E) I actively seek high-risk investments and understand their potential rewards and losses.", answerOptionValue: 10 }
    ]
  }
];


// custome hook : Logic and States 

function useMultiStepContex(){

        // Problem 1 : Refactor this custom hook, apply separation of concerns.
        
             
        const [isLoading, setIsLoading]=useState(false);

        const navigate= useNavigate();

        const url="http://127.0.0.1:8000/onboarding/questionnaire";

        const key="step";
        // remember that the demo uses 'currentStep' instead of 'step', so there is no conflict.
        const [step, setStep]= useState( Number( localStorage.getItem(key)) || 1 );
        
        // when the user reloads the page, error states must not persisted, they must be reset to prevent  stuck in error state.
        const [isThereError,setIsThereError]=useState(false);
        const [errorMsg,setErrorMsg]=useState("");


       
      
        
       const steps = [
        { number: 1, label: "Household income" },
        { number: 2, label: "Monthly budget" },
        { number: 3, label: "Investestments accounts" },
        { number: 4, label: "Outstanding debts" },
        { number: 5, label: "Life insurence" },
        { number: 6, label: "Goals" }
        ];
        
       // Date.now() to unqiuely identify each id, insure all id's are unique and collisions  happen.
        const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([
            {id:Date.now(), member_name: '', annual_income: 0, income_source: '' }
        ]);
        
        const [monthlyBudget, setMonthlyBudget] = useState(0);
        
        
        
        
        const [answers, setAnswers] = useState< SubjectiveQuestionAnswer[] >(
            subjectiveQuestions.map((q)=> ({
            "questionId": q.questionId,
            "answerValue": 0
        })) // ({}) : returns object , when use {}, JS thinks {} is function block; when want to return object  implicitly in map,  ({}) ,otherwise error will occur.
        );
        const [sliderValue, setSliderValue] = useState<number>(5);
        
        const [goals, setGoals] = useState<Goal[]>([
            { id:Date.now(), name: '', type: 'short-term', target_amount:0, deadline:"" }
        ]);        
        const [debts, setDebts] = useState<Debt[]>([
            { id:Date.now(), type: '', balance: 0, monthly_payment: 0, interest_rate: 0 }
        ]);
        
        
        const [insurance, setInsurance] = useState<InsuranceInfo[]>([{
            insurance_type: '',
            death_benefit: 0,
            cash_value: 0,
            monthly_premium: 0
        }]);
        


        const handleBack = () => {
          if (step > 1) {
            setStep(step - 1);
            localStorage.setItem("step",(step-1).toString()); 
           
        }
        };

        const handleNext = async (e: React.SubmitEvent<HTMLFormElement>) => {
             e.preventDefault();

            // Steps 1 to 5: Just move to the next step
            if (step < 6) {
                setStep(step + 1);
                localStorage.setItem("step", (step + 1).toString());
                return;
            }
            
            // setup
            type PayLoadTYpe={
                
                household_income: {
                    id: number;
                    member_name: string;
                    annual_income: number;
                    income_source: string;
                }[];
                
                monthly_budget: number;
                
                outstanding_debts: Debt[];
                
                subjective_answers_values_and_weights:{
                    questions_weights:number[],
                    answers_values:number[],
                },

                life_insurance: {
                    insurance_type: string;
                    death_benefit: number;
                    cash_value: number;
                    
                }[],
                financial_goals: {
                    id: number;
                    name: string;
                    type: "short-term" | "long-term";
                    target_amount: number;
                    deadline: string;
                }[];    
        }
            setIsLoading(true);
            const payload:PayLoadTYpe = {
                household_income: householdMembers.map(m => ({
                    id:m.id,
                    member_name: m.member_name,
                    annual_income: Number(m.annual_income),
                    income_source: m.income_source
                })),
                monthly_budget: Number(monthlyBudget),

                outstanding_debts: debts, // Map this if needed
                
                subjective_answers_values_and_weights:{
                    questions_weights:subjectiveQuestions.map(question=>question.questionWeight),
                    answers_values:answers.map(answer=>answer.answerValue)
                },
                
                life_insurance: insurance.map(i => ({
                    insurance_type: i.insurance_type,
                    death_benefit: Number(i.death_benefit),
                    cash_value: Number(i.cash_value),
                    monthly_premium: Number(i.monthly_premium)
                })),
                financial_goals: goals.map(g => ({
                    id: g.id,
                    name: g.name,
                    type: g.type,
                    target_amount: Number(g.target_amount),
                    deadline: g.deadline
                }))
            };


            //console.table(payload) // to visulaize the sent data as table on the console.
    
            // Problem 2 : after making this function work, replace the try catch block with already made function, maybe it's the 'handleDemoSubmit'
            try {

                console.log("user's info which used as context for the LLM  and to be stored in the database is  :\n ")
                console.log(payload)
                
                // send a request
                const response= await FetchData({payload, url});


                // Show the error (if any) returned by the backend
                if (!response.ok) {
                    setIsLoading(false)
                    setIsThereError(true);
                    
                    const errorData= await response.json();
                    console.log(errorData)
                    setErrorMsg(errorData.detail)
                    
                    return
                }
                
                setIsLoading(false);
                setIsThereError(false);
                setErrorMsg("");
                                



                //PROBLEM: CHANGE THE FOLLOWING 
                
                               
                
                const data: FullAdviceDataType = await response.json();
                
                console.table(`data recived from backend  before validation is : ${data}`)
                    
                const result=FullAdviceDataSchema.safeParse(data); // run time validation on the unknown data, checks the 'correctness' of the  existing data
                console.log(`safeParse result content is ${result}`)
                if(result.success){
                    console.log("nice!. run time validation succeed!, results stored in the local storage")
                    localStorage.setItem("FullAdviceData", JSON.stringify(data));// storing response as key:value in the local storage
                    navigate("/PostMultiStepContext");
                }
/*                 if (!result.success) {
                    console.error("Zod Validation Errors:", result.error.format());
                } */
               else{
                    setIsThereError(true)
                    setErrorMsg("Run Time validation failed\n, data recived from the backend does not follow the contract\nInspect the console for more details")
               }
                
            } catch (e) {
                setIsLoading(false);
                setIsThereError(true);
                setErrorMsg("Network Error, inspect the console for more details.");//  Update/Remove it once development finishes
                console.error(e);
                alert("Network Error");// Update/Remove it once development finishes
            }
};
    
    // returns object, thus, use destructing at calling site
    return{
        step,
        steps,
        householdMembers,
        setHouseholdMembers,
         monthlyBudget,
        setMonthlyBudget,
        answers,setAnswers,
        sliderValue,setSliderValue,
        debts,
        setDebts,
        insurance,
        setInsurance,
        goals,
        setGoals,
        handleBack,
        handleNext,
        isLoading,
        isThereError,
        errorMsg
    }
}

export default function MultiStepContext(){
    
    
    const {

        step,
        steps,
        householdMembers,
        setHouseholdMembers,
         monthlyBudget,
        setMonthlyBudget,
        answers,setAnswers,
        sliderValue,setSliderValue,
        debts,
        setDebts,
        insurance,
        setInsurance,
        goals,
        setGoals,
        handleBack,
        handleNext,
        isLoading,
        isThereError,
        errorMsg
    }= useMultiStepContex();
   
   
    // PROBLEM: REFACTOR THE FOLLOWING JSX.
    return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
        
        {/** progress bard is always rendered */}
        <div className="pt-8">
          <ProgressBar currentStep={step} steps={steps} totalSteps={6} />
        </div>
        
        <div className="max-w-2xl mx-auto px-4 py-12">
            {/** Cards are cpnditionally rendered*/}
                {step==1 && (
                    <form onSubmit={handleNext}>
                        {/**problem , Different cards have differnt width and hight, that makes the Position of the Buttons  varies, bad user experience, must enforce Fixed Width */}
                        <HouseholdIncomeSection
                            members={householdMembers}
                            onUpdate={setHouseholdMembers}
                            />
                            <BackAndContinueButtons  handleBack={handleBack}  isLoading={isLoading}   /> 
                        
                    </form>

                        
                    )}
                {step==2 && (
                    <form onSubmit={handleNext}>
                     <MonthlyBudgetSection
                        budget={monthlyBudget}
                        onUpdate={setMonthlyBudget}
                    />
                     <BackAndContinueButtons  handleBack={handleBack}  isLoading={isLoading}  /> 


                    </form>

                    
                )}

                {/** Subjective questions */}
                {step==3 && (

                    <form onSubmit={handleNext}>

                        <RiskAssessment answers={answers} setAnswers={setAnswers} sliderValue={sliderValue} setSliderValue={setSliderValue} subjectiveQuestions={subjectiveQuestions}  />
                        <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   />                       
                    
                    </form>
                    
                    // should I put button here ? 
                )}

                {step==4 && (

                    <form onSubmit={handleNext}>
                        <OutstandingDebtsSection
                            debts={debts}
                            onUpdate={setDebts}
                        />                   
                        <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   /> 
                    </form>
        
                )}
                {step==5 && (
                    <form onSubmit={handleNext}>
                        <LifeInsuranceSection
                            insuranceList={insurance}
                            onUpdate={setInsurance}
                        />        
                                    
                        <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   /> 
                    </form>

                    // should I put button here ? 
                )}
          
                {/** Data Submission to backend happens here */}
                {step==6 && (
             
                    <>
                        {/** conditionally rendered error when step=6 && there is error */}
                        {isThereError &&(
                            <div className="border border-red-300 bg-red-50 rounded-lg p-4 text-red-800">
                               {errorMsg}
                            </div>                            
                        )}

                        {/** Goals Section that user must fill  */}
                        <form onSubmit={handleNext}>
                            <FinancialGoalsSection
                                goals={goals}
                                onUpdate={setGoals}
                            />        
                            <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   /> 
                        </form>
                    </>
                )}              
        </div>
     </div>
)

}

