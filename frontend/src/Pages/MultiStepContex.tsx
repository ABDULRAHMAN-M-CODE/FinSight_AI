
// hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom";

// Prebuilt components
import { ProgressBar } from "../Imports/ProgressBar"
import { HouseholdIncomeSection } from "../Imports/HouseholdIncomeSection";
import { MonthlyBudgetSection } from '../Imports/MonthlyBudgetSection';
import { InvestmentAccountsSection } from '../Imports/InvestmentAccountsSection';
import { OutstandingDebtsSection } from '../Imports/OutstandingDebtsSection';
import { LifeInsuranceSection } from '../Imports/LifeInsuranceSection';
import { FinancialGoalsSection } from '../Imports/FinancialGoalsSection';
import BackAndContinueButtons from "../Imports/BackAndContinueButtons";


// types
import type { HouseholdMember,  } from '../Types/HouseHoldMember';
import { type InvestmentAccount } from "../Types/InvestmentAccount";
import type { Debt } from "../Types/Debt";
import { type Goal } from "../Types/Goal";
import { type InsuranceInfo } from "../Types/InsuranceInfo";
import { type FullServiceAdviceContract } from "../Types/FullServiceAdviceContract";

// functions
import { FetchData } from "../Functions/api/fetchData";
import { extractAndSaveDataToLocalStorage } from "../Functions/api/reusable_functions/extractAndSaveDataToLocalStorage ";

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


       
       // const [processingFinished, setProcessingFinished]=useState(false); 
        
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
        
        const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>([
            {  id:Date.now(),name: '', type: '', current_balance: 0, is_active: true }
        ]);

        const [goals, setGoals] = useState<Goal[]>([
            { id:Date.now(), name: '', type: 'short-term', target_amount:0, deadline:"" }
        ]);        
        const [debts, setDebts] = useState<Debt[]>([
            { id:Date.now(), type: '', balance: 0, monthly_payment: 0, interest_rate: 0 }
        ]);
        
        // Note 1 : currently , id is not needed. 
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
            setIsLoading(true);
            const payload = {
                household_income: householdMembers.map(m => ({
                    id:m.id,
                    member_name: m.member_name,
                    annual_income: Number(m.annual_income),
                    income_source: m.income_source
                })),
                monthly_budget: Number(monthlyBudget),
                investment_accounts: investmentAccounts.map(a => ({
                    id: a.id,
                    name: a.name,
                    type: a.type,
                    current_balance: Number(a.current_balance),
                    is_active: a.is_active
                })),
                outstanding_debts: debts, // Map this if needed
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

                console.log("user's info which used as context for the LLM is : ")
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
                
                // persiste the data and redirect user to other UI
                
                
                console.log("recived data from backend")
                
                
                const localStorageKey="fullAdvice"
                await extractAndSaveDataToLocalStorage<FullServiceAdviceContract>({response,localStorageKey});
                
                
                navigate("/PostMultiStepContext");

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
        investmentAccounts,
        setInvestmentAccounts,
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

// UI Component
export default function MultiStepContex(){
    
    //use the custome hook
    const {

        step,
        steps,
        householdMembers,
        setHouseholdMembers,
         monthlyBudget,
        setMonthlyBudget,
        investmentAccounts,
        setInvestmentAccounts,
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
   
   
    // rendering 
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
                {step==3 && (
                    <form onSubmit={handleNext}>
                        <InvestmentAccountsSection
                            accounts={investmentAccounts}
                            onUpdate={setInvestmentAccounts}
                        />
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

