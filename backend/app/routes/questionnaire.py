from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import date, datetime
from uuid import UUID

from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.questionnaire_schemas import QuestionnaireSubmit

#  neccessary imports to talk to the AI
from app.schemas.questionnarie_response_schemas import FullAiResponse
from app.system_prompts import full_service_system_prompt
from app.user_prompts import full_service_user_prompt
from app.core.utils.llm_utils import call_llm

# import your json_safe from utils
from app.core.utils.json_safe_utils import json_safe
import json
# import needed models 
from app.models.registration import User
from app.models.user_financial_data import UserFinancialData
from app.models.goal import Goal
from app.models.investment_account import InvestmentAccount
from app.models.protection_advices import ProtectionAdvices
from app.models.debts_advices import DebtsAdvices
from app.models.goals_and_investements_advices import GoalsAndInvestmentsAdvices

# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")


@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
     data: QuestionnaireSubmit,
     current_user: User = Depends(get_current_user), 
     db: Session = Depends(get_db),
):
    try:
        print("recived data successfully")

        # check if user already filled finance data
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

        db.flush()  # Stage all inserts

        # 2- call the LLM and store it's result in varaible.
        model="gpt-5"
        # convert safely to JSON string for LLM
        user_context = json.dumps(json_safe(data.model_dump()))
        system_prompt=full_service_system_prompt
        response_format=FullAiResponse
        role="user"
        prompt = full_service_user_prompt
        
        advice=call_llm(model ,user_context, system_prompt,response_format, role,  prompt)    
    
        # 3- Store the AI result in the Database.

        # Store AI advice
        db.add(ProtectionAdvices(
            user_id=current_user.id,
            protection_advice=json_safe(advice.protectionAdvice.model_dump())
        ))
        db.add(DebtsAdvices(
            user_id=current_user.id,
            debts_advice=json_safe(advice.debtsAdvice.model_dump())
        ))
        db.add(GoalsAndInvestmentsAdvices(
            user_id=current_user.id,
            advice=json_safe(advice.goalsAndInvestementsAdvice.model_dump())
        ))

        # 4- Mark first login as completed
        current_user.is_first_login = False
        db.commit()

        # 5- Return the advice to the frontend.
        return advice 

    except Exception as e:
        db.rollback()
        print("ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )