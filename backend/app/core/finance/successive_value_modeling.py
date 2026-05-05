# Pydantic models
# some Syntax source : "https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.extra , and AI 
# mypy and pytest where used for testing , there is zero syntax erros , outcomes of  the code was verified , there is no logical erros at all 
# what is the level o the designer of the following codes ? the design was by human , the syntax refrence is primarly  AI , google,and some documentation
# note :AI never designed the code , the aecheticture was made by human, most of the syntax was learned druing development 

from pydantic import BaseModel, ConfigDict
from typing import Union, Literal
from app .core.utils.llm_utils import call_llm
from app.system_prompts import generate_debts_related_advice_only
import datetime
from app.schemas.questionnaire_schemas import QuestionnaireSubmit,DebtIn
from decimal import Decimal
from typing import TypedDict
import json


###########***Classes that are used for run time validation on the system boundary***###########################

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


# Top level schema
class FullDebtsUiData(BaseModel):
    # those four debt-advice-related fields will be provided as additional context to the AI and will be also returned to the frontend .
    strategy: Literal["snowball", "avalanche"]   # NEW
    startingTotalBalance:float 
    trajectory:list[DebtTrajectoryPoint]
    monthsToTotalPayoff:int                         
    estimatedPayoffDate:str                         
              
    
    debtKeys:list[DebtsKeysConfigSchema]         
    advice:TextualDebtAdvice                        
     

###########**** classes that defines data shape and  types only; no run time  validation****  ########################

# Used for assembling a strctured object to be serialized into formmated JSON string
class UserDataAndSuccessiveValueFormulaResultsAsContext(TypedDict):
    user_context: dict
    precomputed_data: dict

class SuccessiveValueFormulaComputedData(BaseModel):
    startingTotalBalance:float 
    trajectory:list[DebtTrajectoryPoint]
    monthsToTotalPayoff:int                         
    estimatedPayoffDate:str


#######################################
from decimal import Decimal

#this function will be passed as parameter to the json.dumps()

# this function return a list of pydantic mdoels instead of TypeDict ; justification is that tthe result of this function should be returned to the frontend, thus, this is a operation related to the boundary f the system, thus it must be validated
def get_debts_keys(
          user_validated_data: QuestionnaireSubmit
          ) -> list[DebtsKeysConfigSchema]:
    
        colors: list[str] = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"]
        user_debts:list[DebtIn]=user_validated_data.outstanding_debts

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

from decimal import Decimal, getcontext
from typing import List
import datetime

getcontext().prec = 28  # high precision for finance


def to_decimal_list(values: List[float]) -> List[Decimal]:
    return [Decimal(str(v)) for v in values]


def monthly_rate(apr: Decimal) -> Decimal:
    return apr / Decimal("12")


def is_all_paid(balances: List[Decimal]) -> bool:
    return all(b <= 0 for b in balances)



def choose_strategy_from_personality(score: float) -> str:
    """
    score ~ 1 → impulsive / emotional
    score ~ 5 → disciplined / analytical
    """

    if score < 3:
        return "snowball"   # needs motivation
    else:
        return "avalanche"  # can handle long-term optimization

def calculate_debts_payoff_trajectory_data(
    balances: list[float],
    interest_rates: list[float],  # APR
    fixed_monthly_payments: list[float]
) -> list[DebtTrajectoryPoint]:

    balances_d = to_decimal_list(balances)
    rates_d = to_decimal_list(interest_rates)
    payments_d = to_decimal_list(fixed_monthly_payments)

    trajectory: list[DebtTrajectoryPoint] = []
    current_date = datetime.date.today().replace(day=1)

    for _ in range(1200):

        if is_all_paid(balances_d):
            break

        # Step 1: apply monthly interest
        for i in range(len(balances_d)):
            if balances_d[i] > 0:
                balances_d[i] *= (Decimal("1") + monthly_rate(rates_d[i]))

        # Step 2: sort by highest interest (avalanche)
        debt_order = sorted(
            range(len(balances_d)),
            key=lambda i: rates_d[i],
            reverse=True
        )

        # Step 3: apply payments with cascade
        for i in debt_order:
            if balances_d[i] <= 0:
                continue

            payment = payments_d[i]

            if payment >= balances_d[i]:
                leftover = payment - balances_d[i]
                balances_d[i] = Decimal("0")

                # cascade leftover
                remaining = leftover
                for j in debt_order:
                    if balances_d[j] > 0:
                        if remaining >= balances_d[j]:
                            remaining -= balances_d[j]
                            balances_d[j] = Decimal("0")
                        else:
                            balances_d[j] -= remaining
                            break
            else:
                balances_d[i] -= payment

        # Step 4: clamp + record
        point_data = {
            "monthLabel": current_date.strftime("%b %Y")
        }

        for i in range(len(balances_d)):
            balances_d[i] = max(Decimal("0"), balances_d[i])
            point_data[f"debt_{i}"] = float(round(balances_d[i], 2))

        trajectory.append(DebtTrajectoryPoint(**point_data))

        # next month
        next_month = current_date.month % 12 + 1
        next_year = current_date.year + (current_date.month // 12)
        current_date = current_date.replace(year=next_year, month=next_month)

    return trajectory

def calculate_debts_payoff_trajectory_data_snowball(
    balances: list[float],
    interest_rates: list[float],
    minimum_payments: list[float]
) -> list[DebtTrajectoryPoint]:

    balances_d = to_decimal_list(balances)
    rates_d = to_decimal_list(interest_rates)
    payments_d = to_decimal_list(minimum_payments)

    trajectory: list[DebtTrajectoryPoint] = []
    current_date = datetime.date.today().replace(day=1)

    for _ in range(1200):

        if is_all_paid(balances_d):
            break

        # Step 1: apply interest
        for i in range(len(balances_d)):
            if balances_d[i] > 0:
                balances_d[i] *= (Decimal("1") + monthly_rate(rates_d[i]))

        # Step 2: sort by smallest balance (snowball)
        debt_order = sorted(
            range(len(balances_d)),
            key=lambda i: balances_d[i] if balances_d[i] > 0 else Decimal("Infinity")
        )

        # Step 3: apply payments with cascade
        for i in debt_order:
            if balances_d[i] <= 0:
                continue

            payment = payments_d[i]

            if payment >= balances_d[i]:
                leftover = payment - balances_d[i]
                balances_d[i] = Decimal("0")

                # cascade leftover
                remaining = leftover
                for j in debt_order:
                    if balances_d[j] > 0:
                        if remaining >= balances_d[j]:
                            remaining -= balances_d[j]
                            balances_d[j] = Decimal("0")
                        else:
                            balances_d[j] -= remaining
                            break
            else:
                balances_d[i] -= payment

        # Step 4: clamp + record
        point_data = {
            "monthLabel": current_date.strftime("%b %Y")
        }

        for i in range(len(balances_d)):
            balances_d[i] = max(Decimal("0"), balances_d[i])
            point_data[f"debt_{i}"] = float(round(balances_d[i], 2))

        trajectory.append(DebtTrajectoryPoint(**point_data))

        # next month
        next_month = current_date.month % 12 + 1
        next_year = current_date.year + (current_date.month // 12)
        current_date = current_date.replace(year=next_year, month=next_month)

    return trajectory

def full_debts_ui_data_orchestrator(
          strategy: Literal["avalanche", "snowball"],
          balances: list[float], 
          interest_rates: list[float], 
          fixed_montlhy_payments: list[float],
          user_validated_data:QuestionnaireSubmit
          )->FullDebtsUiData:
       
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
       
       # strategy selection (NEW)
       strategy_map = {
            "avalanche": calculate_debts_payoff_trajectory_data,
            "snowball": calculate_debts_payoff_trajectory_data_snowball
       }

       try:
            trajectory:list[DebtTrajectoryPoint] = strategy_map[strategy](
                balances,interest_rates,fixed_montlhy_payments
            )
       except KeyError:
            raise ValueError(f"Unsupported strategy: {strategy}")
       
       #  safety check (NEW)
       if not trajectory:
            raise ValueError("Trajectory calculation failed - empty result")
       
       monthsToTotalPayoff:int= len(trajectory)
       
       last_point:DebtTrajectoryPoint=trajectory[-1]
       estimatedPayoffDate:str = last_point.model_dump()["monthLabel"]  

       
       debts_keys_config_schema:list[DebtsKeysConfigSchema]= get_debts_keys(user_validated_data) 
    

       
       # Genrate a textual recommendation (for the now , the advice governs the debts only)
       model="gpt-5-nano"
       system_prompt:str=generate_debts_related_advice_only # defines fixed instructions
       role="user"
       # in contrast to the system_prompt , the following user prompt is dynamic ; it's not meant to be static.
       #first question we are concerend abou : question we are concerend about for now: why not to inject the user_ context in the prompt it self like `${user_context}`
       prompt = (
    "You are a strict, accurate financial advisor analyzing a user's debt simulation results.\n"
    "Return EXACTLY 3 sentences, no more, no less.\n\n"

    "You will be given a debt payoff simulation that was computed using a specific strategy:\n"
    "- 'snowball' = pay smallest debts first for motivation\n"
    "- 'avalanche' = pay highest interest debts first for financial optimization\n\n"

    f"Sentence 1: Clearly explain the user's current debt situation, INCLUDING the strategy used ({strategy}), and what it means for their repayment path.\n"
    "Sentence 2: State the REQUIRED monthly payment level needed to achieve the projected payoff timeline, and explicitly compare it to their current payment level.\n"
    "Sentence 3: Give one clear, actionable habit or rule that improves financial discipline and ensures they stay on track long-term.\n\n"

    "Rules:\n"
    "- Address the user directly.\n"
    "- Be factual, numeric, and realistic — do NOT soften financial truths.\n"
    "- Always mention the strategy name in Sentence 1.\n"
    "- Make Sentence 2 numerical and explicit when possible.\n"
    "- Do NOT exceed 3 sentences.\n"
    "- Do NOT merge sentences.\n"
    "- Keep language simple, direct, and practical.\n"
)
       precomputed_data = SuccessiveValueFormulaComputedData.model_construct(
            startingTotalBalance=startingTotalBalance,
            trajectory=trajectory,  
            monthsToTotalPayoff=monthsToTotalPayoff,
            estimatedPayoffDate=estimatedPayoffDate
        )
       
       import typing
       user_context=UserDataAndSuccessiveValueFormulaResultsAsContext(
            user_context=user_validated_data.model_dump(), 
            precomputed_data=precomputed_data.model_dump() # mypy ignores type mismatch at rune time ; no casting happens at run time because TypeDict=dict
       )
       
       parsed_user_context:str=json.dumps(user_context, default=str)
       response_format=TextualDebtAdvice

      # call_llm(model:str ,user_context:str, system_prompt:str, response_format: Type[T], role:str, prompt:str   )->T
       advice:TextualDebtAdvice=call_llm(model ,parsed_user_context, system_prompt,response_format, role,  prompt)   
       
    
       #results will be validated at run time
       return   FullDebtsUiData(
                        strategy=strategy,  
                        trajectory=trajectory,
                        monthsToTotalPayoff=monthsToTotalPayoff,
                        estimatedPayoffDate=estimatedPayoffDate,
                        startingTotalBalance=startingTotalBalance,
                        debtKeys=debts_keys_config_schema,
                        advice=advice
                    )