from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

# DB session dependency
from app.database import get_db

# Authentication dependency 
from app.core.dependencies import get_current_user

#  import the necessary schemas
from app.schemas.questionnaire_schemas import QuestionnaireSubmit

#  necessary imports to talk to the AI

#from app.system_prompts import full_service_system_prompt
from app.user_prompts import full_service_user_prompt
from app.core.utils.llm_utils import call_llm

# import  json_safe from utils
from app.core.utils.json_safe_utils import json_safe

# import the needed models 
from app.models.registration import User
from app.models.user_financial_data import UserFinancialData
from app.models.goal import Goal
from app.models.investment_account import InvestmentAccount
from app.models.protection_advices import ProtectionAdvices
from app.models.debt_models.debts_advices import DebtsAdvices
from app.models.goals_and_investements_advices import GoalsAndInvestmentsAdvices
from app.models.debt_models.debts_metrics import DebtMetrics
from app.core.finance.successive_value_modeling import (
    full_debts_ui_data_orchestrator,
    FullDebtsUiData,   
)
from app.schemas.questionnaire_schemas import DebtIn


# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")

from app.schemas.questionnarie_response_schemas import FullAdviceData
@router.post("/questionnaire", status_code=status.HTTP_201_CREATED) #this router is executed after the user provide all his context 
def submit_questionnaire(
     data: QuestionnaireSubmit,
     #current_user: User = Depends(get_current_user), 
     #db: Session = Depends(get_db),
)->FullAdviceData:
    try:
        print("recived data successfully")

        # check if user already filled finance data

        """
        if not current_user.is_first_login :
            print("if block was executed")
            raise HTTPException(
                status_code=400,
                detail="user already filled finance data ",
            )

        # 1- Store all submitted user's info "data" in the  appropriate database tables.
        # Store User Financial Data
        total_income = sum(member.annual_income for member in data.household_income)
        user_financial_data = UserFinancialData(
            user_id=current_user.id,
            household_income=float(total_income),
            income_sources=json_safe([member.model_dump() for member in data.household_income]),
            monthly_budget=float(data.monthly_budget),
            investment_accounts=json_safe([acc.model_dump() for acc in data.investment_accounts]),
            outstanding_debts=json_safe([debt.model_dump() for debt in data.outstanding_debts]),
            life_insurance=json_safe([ins.model_dump() for ins in data.life_insurance]),
        )
        db.add(user_financial_data)

        # Store Investment Accounts
        for acc in data.investment_accounts:
            investment = InvestmentAccount(
                user_id=current_user.id,
                account_name=acc.name,
                account_type=acc.type,
                current_value=float(acc.current_balance),
                is_active=acc.is_active,
            )
            db.add(investment)

        # Store Goals
        for goal in data.financial_goals:
            new_goal = Goal(
                user_id=current_user.id,
                goal_name=goal.name,
                goal_type=goal.type,
                target_amount=float(goal.target_amount),
                current_amount=float(getattr(goal, "current_amount", 0)),  # fallback if current_amount missing
                deadline=goal.deadline,
            )
            db.add(new_goal)
  
        db.flush() 
            
        # 2- Perform all the required computations and data modeling
        # first, we model the Successive value formula which is : b(k)=(b(k-1)*(1+interestRate))-p, the inputs to this equation is exlicitly  provided by user info
        
        # all the results of this equation or function call  must be passed to the full_service_user_prompt (or define that prompt in the same file containing  the function implmentation)

        debts:list[DebtIn]=data.outstanding_debts
        balances = [d.balance for d in debts]
        interest_rates = [d.interest_rate for d in debts]
        fixed_monthly_payments = [d.monthly_payment for d in debts]
        debts_ui_data=full_debts_ui_data_orchestrator( balances ,interest_rates, fixed_monthly_payments,data)

        
        # 3- Store the AI results in the Database.
        db.add(DebtsAdvices(
            user_id=current_user.id,
            debts_advice=json_safe(debts_ui_data.advice.model_dump())
        ))
        db.add(
            DebtMetrics(
                user_id=current_user.id,
                metrics=json_safe(
                    debts_ui_data.model_dump(exclude={"advice"}))
        ))
        
        # 4- Mark first login as completed
        current_user.is_first_login = False
        db.commit()"""

        
        
        #bussines logic 
        from app.core.finance.portfolio_construction import investements_advice_orchestrator,InvestementsAdviceMocks
        total_portfolio_value=3500.0                        #PROBLEM : total_investement_amount # Fetch from user_portfolio_state table 
        question_scores = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8]    #PROBLEM:  provided by frontend (simulated for now)
        answers_weights = [1,2 , 3, 4, 5, 6, 7, 8, 9, 10]    #PROBLEM : provided by frontend(simulated for now )
        investements_advice:InvestementsAdviceMocks=investements_advice_orchestrator(question_scores,answers_weights,total_portfolio_value)
        print("number of scatter points to be shown on the frontend(must be compatible with frontend number of scatters)",len(investements_advice.assetsScatter))

        #PROBLEM :  in the future, we will add many other things to this returned object.
        #PROBLEM : DON"T JUST RETURN IT , STROE IN DATABASE, in frontend, if the user is new , he consume returned data, if not , he consume stored data
        return FullAdviceData(investementsAdvice=investements_advice)
        
        
    except Exception as e:
        #db.rollback()
        print("ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )