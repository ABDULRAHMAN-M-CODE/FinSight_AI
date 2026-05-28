
// hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// Prebuilt components
import { ProgressBar } from "../Imports/ProgressBar"
import { HouseholdIncomeSection } from "../Imports/HouseholdIncomeSection";
import { MonthlyBudgetSection } from '../Imports/MonthlyBudgetSection';
import { FinancialGoalsSection } from "../Imports/FinancialGoalsSection";
import { OutstandingDebtsSection } from '../Imports/OutstandingDebtsSection';
import BackAndContinueButtons from "../Imports/BackAndContinueButtons";
import RiskAssessment from "../Components/InvestementsRiskProfileAssasementCard";


// types
import { type HouseholdMember,  } from '../Types/HouseHoldMember';
import { type Debt } from "../Types/Debt";
import { type SubjectiveQuestionAnswer } from "../Components/InvestementsRiskProfileAssasementCard";
import { type SubjectiveQuestionsType } from "../Components/InvestementsRiskProfileAssasementCard";
import { type Goal } from "../Types/Goal";



//run time validation
import z from "zod";
import { DebtsAdviceUiDataSchema } from "../Components/MultiDebtPayoffTrajectory";
import { GoalAdviceItemSchema } from "./GoalsAdvice";
const Asset=z.object({
    assetName: z.string(),
    capitalAllocationPercentage:z.number()
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

const  InvestementsAdviceSchema =z.object({
    leftover: z.number(),
    optimalPortfolio:OptimalPortfolio

})


export type InvestementsAdviceType = z.infer<typeof InvestementsAdviceSchema>; 
export const FullAdviceDataSchema=z.object({
    fullDebtsUiData:DebtsAdviceUiDataSchema, 
    investementsAdvice:InvestementsAdviceSchema, 
    goalsAdvice:z.array(GoalAdviceItemSchema)
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


// logic and states. 
function useMultiStepContex(){

        
        
             
        const [isLoading, setIsLoading]=useState(false);

        const navigate= useNavigate();

        const location = useLocation();
        console.log(location.state.endpointURL)
        console.log("this questionnary will use HTTP method of the following kind : ",location.state.httpMethod)
        const key="step";
        
        // remember that the demo uses 'currentStep' instead of 'step', so there is no conflict.
        const [step, setStep]= useState( Number( localStorage.getItem(key)) || 1 );
        
        // when the user reloads the page, error states must not persisted, they must be reset to prevent  stuck in error state.
        const [isThereError,setIsThereError]=useState(false);
        const [errorMsg,setErrorMsg]=useState("");
        const [investementAmount,setInvestementAmount]=useState(3000);
       
        const steps = [
            { number: 1, label: "Household income" },
            { number: 2, label: "Monthly budget" },
            { number: 3, label: "Risk-appetitie" },
            { number: 4, label: "Goals" },
            { number: 5, label: "Debts" },
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
        const [debts, setDebts] = useState<Debt[]>([
            { id:Date.now(), type: '', balance: 0, monthly_payment: 0, interest_rate: 0 }
        ]);
        const [goals, setGoals] = useState<Goal[]>([
            { id:Date.now(), goal_name: '', target_amount: 0, deadline: "",description: "" }
        ]);
        
        const handleBack = () => {
          if (step > 1) {
            setStep(step - 1);
            localStorage.setItem("step",(step-1).toString()); 
           
        }
        };

        const handleNext = async (e: React.SubmitEvent<HTMLFormElement>) => {
            setIsThereError(false)
            e.preventDefault();
            // all steps before last step : data accumalation, then move to next step only.
            if (step < steps.length) {
    
                setStep(step + 1);
                localStorage.setItem("step", (step + 1).toString());
                return;
            }
            
            // last step : submite data payload to backend.
            setIsThereError(false)
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
                    investement_amount:number
                },
                goals:Goal[]
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

                outstanding_debts: debts, // onlty comment chatgpt should care about : this worked, then why the fuck to use map at all ? questio nto chatgpt
                
                subjective_answers_values_and_weights:{
                    questions_weights:subjectiveQuestions.map(question=>question.questionWeight),
                    answers_values:answers.map(answer=>answer.answerValue),
                    investement_amount:investementAmount
                },   
                goals:goals        
            };


            
            try { 
                console.log('goals are ',payload.goals,'\n'); 
                console.log('debts data is ',payload.outstanding_debts,'\n'); // to visulaize the sent data as table on the console.               
                // send a request
                const response = await fetch(location.state.endpointURL, { 
                    method: location.state.httpMethod,
                    headers: { "Content-Type": "application/json" },
                    body:JSON.stringify(payload),
                    credentials:"include",
                });
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
        
                const data: FullAdviceDataType = await response.json();
                console.table(`data recived from backend  before validation is : ${data}`)    
                const result=FullAdviceDataSchema.safeParse(data); // run time validation on the unknown data, checks the 'correctness' of the  existing data
                console.log(`safeParse result content is ${result}`)
                if(result.success){
                    console.log("run time validation succeed!, results stored in the local storage")
                    localStorage.setItem("FullAdviceData", JSON.stringify(data));// storing response as key:value in the local storage
                    navigate("/PostMultiStepContext");
                }
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
        handleBack,
        handleNext,
        isLoading,
        isThereError,
        errorMsg,investementAmount,setInvestementAmount
        ,goals,setGoals
    }
}
// presentation component.
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
        handleBack,
        handleNext,
        isLoading,
        isThereError,
        errorMsg,
        investementAmount,setInvestementAmount,
        goals,setGoals
    }= useMultiStepContex();
   
   console.log("step =", step);
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

                        <RiskAssessment answers={answers} setAnswers={setAnswers} sliderValue={sliderValue} setSliderValue={setSliderValue} subjectiveQuestions={subjectiveQuestions}  investementAmount={investementAmount} setInvestementAmount={setInvestementAmount} />
                        <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   />                       
                    
                    </form>
                    
                    // should I put button here ? 
                )}
                {step==4 && (

                    <form onSubmit={handleNext}>

                        <FinancialGoalsSection goals={goals} onUpdate={setGoals} isLoading={isLoading} />                        
                        <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   />                       
                    
                    </form>
                    
                    // should I put button here ? 
                )}

                {step==steps.length && isThereError&& (
                    <div className="border border-red-300 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                        <p className="text-sm text-red-800">
                            {errorMsg}
                        </p>
                        </div>
                    </div>
                    </div>
                )}
                {step==steps.length && (
                    
                    <form onSubmit={handleNext}>
                        <OutstandingDebtsSection
                            debts={debts}
                            onUpdate={setDebts}
                        />                   
                        <BackAndContinueButtons  handleBack={handleBack} isLoading={isLoading}   /> 
                    </form>
        
                )}

          
            
        </div>
     </div>
)

}

