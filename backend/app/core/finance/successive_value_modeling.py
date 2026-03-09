


# Pydantic models
# Syntax source : "https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.extra
from pydantic import BaseModel, ConfigDict
from typing import Union, Literal
from app .core.utils.llm_utils import call_llm
from app.system_prompts import generate_debts_related_advice_only
import datetime
from app.schemas.questionnaire_schemas import QuestionnaireSubmit,DebtIn
from decimal import Decimal


class  DebtTrajectoryPoint(BaseModel):
        monthLabel: str
        # the following allows any other keys with values of str, float, or int, which is consistent with 'zod schema' in frontend.
        __pydantic_extra__:dict[str, Union[str, float, int, Decimal]]# mirros 'catchall' in 'zod' in the frontend. , extra fields stored '__pydantic_extra__'
        model_config=ConfigDict(extra='allow')

class DebtsKeysConfigSchema(BaseModel):
        key: str
        name: str
        color: str

class TextualDebtAdvice(BaseModel):
        type: Literal["urgent" , "positive" , "neutral"]# equivelemt to z.enum(["urgent" , "positive" , "neutral"]) in frontend
        textualAdvice: str
    
class SuccessiveValueFormulaComputedData(BaseModel):
    startingTotalBalance:float 
    trajectory:list[DebtTrajectoryPoint]
    monthsToTotalPayoff:int                         
    estimatedPayoffDate:str   
class UserDataAndSuccessiveValueFormulaResultsAsContext(BaseModel):
    user_context: dict
    precomputed_data: dict


# Top level schema for the expected  data that will populate the  Debts UI
class FullDebtsUiData(BaseModel):
    # those four fields will be provided as additional context to the AI and will be also returned to the frontend .
    startingTotalBalance:float 
    trajectory:list[DebtTrajectoryPoint]
    monthsToTotalPayoff:int                         
    estimatedPayoffDate:str                         
              
    
    debtKeys:list[DebtsKeysConfigSchema]         
    advice:TextualDebtAdvice                        
     




def get_debts_keys(data: QuestionnaireSubmit) -> list[DebtsKeysConfigSchema]:
    
        colors: list[str] = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"]
        user_debts:list[DebtIn]=data.outstanding_debts

        keys = []
    # Assuming 'outstanding_debts' is a list of debt objects in QuestionnaireSubmit
        for i, debt in enumerate(user_debts):
            # We use 'debt_0', 'debt_1', etc., as the key to match the dynamic keys 
            # generated in calculate_debts_payoff_trajectory_data (e.g., point_data[f"debt_{i}"])
            key = f"debt_{i}"
            
            # We assume debt has 'name' and 'interest_rate' attributes
            # e.g., "Credit Card (25% APR)"
            name = f"{debt.type} ({debt.interest_rate}% APR)"
            
            # Cycle through colors if there are more debts than colors
            color:str = colors[i % len(colors)]
            
            keys.append(DebtsKeysConfigSchema(key=key, name=name, color=color)) 
        
        return keys   



def calculate_debts_payoff_trajectory_data( balances: list[float],  interest_rates: list[float],  fixed_montlhy_payments: list[float]) -> list[DebtTrajectoryPoint]:
    
    """summary of the function behavior

        This function models the successive value formula in finance, the desired outcome is to let the user know when all his debts will be payedoff.
        For a single debt, the successive value formula is balance(k) = balance(k-1)*(1+interest rate) - (fixed_monthly_payment).
        Thus, to determine the debt-payoff trajectroy timeline for each debt, we need a array of balances, array of intrest rates, and array of fixed_monthly_payments.
     
     Args:
        
        balances (list[float]): the amount of money that is borrowed for each debt. 
        
        interest_rates (list[float]): represents time value of money for each debt.
        
        fixed_montlhy_payments (list[float]): the amount of money paid monthly for each debt. 
        
    
    Returns:

        list[DebtTrajectoryPoint]: Array of records , each record contains a month and variable number of corresponding balnaces values for each debt name -debt name can be any thing- , example of a  single record : {monthLabel="March 17", firstDebtName=45, secondDebtName=56456 } 
    """

    
    # 1. Create a working copy of balances so we don't mutate the user's original input list
    current_balances = list(balances)
    trajectory:list[DebtTrajectoryPoint] = []
    
    # 2. Initialize date to the 1st of the current month.
    # CRITICAL FIX: We set day=1 to avoid "End of Month" bugs. 
    # (e.g. If today is Jan 31st, trying to jump to Feb 31st would crash Python).
    current_date = datetime.date.today().replace(day=1)

    # 3. Use a standard loop bounded to 1200 (100 years) as our built-in safety net
    for _ in range(1200):
        
        # BASE CASE: If no balances are greater than 0, we are completely debt-free. Stop looping., ensure every balance reach zero
        if trajectory and not any(getattr(trajectory[-1], f"debt_{i}") > 0 for i in range(len(current_balances))):
             break
            
        # Create the dictionary for this month
        point_data: dict[str, Union[str, float, int]] = {"monthLabel": current_date.strftime("%b %Y")}
        
        # Process each debt
        for i in range(len(current_balances)):
            bal = current_balances[i]
            
            # Record the current balance (floored at 0.0)
            point_data[f"debt_{i}"] = float(round(max(0.0, bal), 2))
            
            # Calculate next month's balance and update the array directly
            if bal > 0:
                current_balances[i] = bal * (1 + interest_rates[i]) - fixed_montlhy_payments[i]
            else:
                current_balances[i] = 0.0
        
        # Instantiate the Pydantic model and add it to our results list
        trajectory.append(DebtTrajectoryPoint.model_construct(None,**point_data))# data is already validated, let's bypass the validation to enhance performence ! (I do not know what "None" here means)
        
        # Increment the date to the next month (handles December -> January year rollover)
        next_month = current_date.month % 12 + 1
        next_year = current_date.year + (current_date.month // 12)
        current_date = current_date.replace(year=next_year, month=next_month)
        
    return trajectory




def full_debts_ui_data_orchestrator(   balances: list[float], interest_rates: list[float], fixed_montlhy_payments: list[float],data:QuestionnaireSubmit)->FullDebtsUiData:
       """_summary_ (later)

        Args:
            balances (list[float]): _description_ (later)
            interest_rates (list[float]): _description_ (later)
            fixed_montlhy_payments (list[float]): _description_ (later)
            data (QuestionnaireSubmit): _description_(later)

        Returns:
            FullDebtsUiData: _description_ (later)
        
       """

       
       startingTotalBalance:float=sum(balances)
       
       trajectory:list[DebtTrajectoryPoint]=calculate_debts_payoff_trajectory_data(balances,interest_rates,fixed_montlhy_payments)
       monthsToTotalPayoff:int= len(trajectory)
       
       last_point:DebtTrajectoryPoint=trajectory[-1]
       estimatedPayoffDate:str = last_point.model_dump()["monthLabel"]  

       
       debts_keys_config_schema:list[DebtsKeysConfigSchema]= get_debts_keys(data) # problem
    


       
       # genrate a textual recommendation (for the now , the advice governs the debts only)
       from dotenv import load_dotenv
       load_dotenv() # loads the .env file
       model="gpt-5-nano"
       system_prompt:str=generate_debts_related_advice_only # defines fixed instructions
       role="user"
       
       # in contrast to the system_prompt , the following user prompt is dynamic ; it's not meant to be static.
       prompt = "I will give you an information about my goals, investements, life insurence, household income,  my debts, and a precomputed values that describes the pay-off timeline of my debts." \
       " please give me advice, I understand nothing about finance,I'm a novice in the finance world." \
       " you ardive must tell  what I should exactly do so that I understand with least minimal mental effort." \
       " you should mention some technical terms, but the overall advice must be very udnerstandable to me! "
       
  
       

       precomputed_data = SuccessiveValueFormulaComputedData(
            startingTotalBalance=startingTotalBalance,
            trajectory=trajectory,  
            monthsToTotalPayoff=monthsToTotalPayoff,
            estimatedPayoffDate=estimatedPayoffDate
        )
       
       user_context=UserDataAndSuccessiveValueFormulaResultsAsContext.model_construct(
            user_context=data.model_dump(),
            precomputed_data=precomputed_data.model_dump()
       )

       parsed_user_context:str=user_context.model_dump_json()
      
       response_format=TextualDebtAdvice 
       advice:TextualDebtAdvice=call_llm(model ,parsed_user_context, system_prompt,response_format, role,  prompt)   
       
       

       return   FullDebtsUiData(
                        trajectory=trajectory,
                        monthsToTotalPayoff=monthsToTotalPayoff,
                        estimatedPayoffDate=estimatedPayoffDate,
                        startingTotalBalance=startingTotalBalance,
                        debtKeys=debts_keys_config_schema,
                        advice=advice
                    )
       
