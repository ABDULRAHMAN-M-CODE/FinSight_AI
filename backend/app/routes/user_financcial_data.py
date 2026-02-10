#I got this from langChain docs.
from langchain.agents import create_agent
from app.prompts import SYSTEM_PROMPT
from app.schemas.Demo_AI_Response import DemoResponseFormat

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.registration.user import User
from app.models.user_financial_data import UserFinancialData
from app.models.limited_advice import LimitedAdvice
from app.models.investment_account import InvestmentAccount
from app.models.goal import Goal

from app.schemas.Questionnaire import QuestionnaireSubmit , LimitedQuestionnaireSubmit
from app.core.utils.finance_calculations import (
    compute_savings_rate,
    compute_projections,
)
from app.core.utils.json_safe import json_safe

router = APIRouter(prefix="/onboarding")

# this endpoint is meant to serve the first login questionnaire page (authorization required, first time login only )
@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
    data: QuestionnaireSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_first_login:
        raise HTTPException(
            status_code=400,
            detail="Questionnaire already completed",
        )

    try:
        # 1. Household income
        total_household_income = sum(
            member.annual_income for member in data.household_income
        )

        income_sources = {}
        for member in data.household_income:
            income_sources.setdefault(member.income_source, Decimal("0"))
            income_sources[member.income_source] += member.annual_income

        # 2. Save UserFinancialData (JSONB-safe)
        financial_data = UserFinancialData(
            user_id=current_user.id,
            household_income=total_household_income,
            income_sources=json_safe(income_sources),
            monthly_budget=data.monthly_budget,
            investment_accounts=json_safe(
                [acc.dict() for acc in data.investment_accounts]
            ),
            outstanding_debts=json_safe(
                [debt.dict() for debt in data.outstanding_debts]
            ),
            life_insurance=json_safe(
                [ins.dict() for ins in data.life_insurance]
            ),
        )

        # 3. Derived financial metrics
        monthly_income = total_household_income / Decimal("12")
        monthly_expenses = data.monthly_budget

        savings_rate = compute_savings_rate(
            monthly_income,
            monthly_expenses,
        )

        projections = compute_projections(
            monthly_income,
            monthly_expenses,
        )

        limited_advice = LimitedAdvice(
            user_id=current_user.id,
            monthly_income=monthly_income,
            monthly_expenses=monthly_expenses,
            savings_rate=float(savings_rate),
            projections=json_safe(projections),
        )

        # 4. Investment accounts table
        investment_rows = [
            InvestmentAccount(
                user_id=current_user.id,
                account_name=acc.name,
                account_type=acc.type,
                current_value=acc.current_balance,
                is_active=acc.is_active,
            )
            for acc in data.investment_accounts
        ]

        # 5. Financial goals → Goal rows
        goal_rows = []

        if data.financial_goals:
                goal_rows.append(
                    Goal(
                        user_id=current_user.id,
                        goal_name=data.financial_goals.name,
                        goal_type=data.financial_goals.type,
                        target_amount=data.financial_goals.amount,
                        current_amount=Decimal("0"),
                        deadline=data.financial_goals.deadLine,
                    )
                )
                
        # 6. Complete onboarding
        current_user.is_first_login = False

        # 7. add to db
        db.add(financial_data)
        db.add(limited_advice)
        db.add_all(investment_rows)
        db.add_all(goal_rows)
        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error submitting questionnaire: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}


# this endpoint is meant to serve the demo (no authorization required)

@router.post("/Limited-questionnaire", status_code=status.HTTP_201_CREATED)
    

def submit_questionnaire(
    data: LimitedQuestionnaireSubmit 
    ):
    
    try: 
        
      
      user_context = data.model_dump_json()              # turn the data to data type that the LLM is expert to deal with       
      
      agent = create_agent(                              # Abstraction note : inside the Agent, the os.getenv("OPENAI_API_KEY") is called, this is hidden from us.                                 
        model="gpt-5-nano",                              # we can choose any LLM supported by openAI.
        system_prompt=SYSTEM_PROMPT,                     # the prompt can be found in  app/prompts.py
        response_format=ToolStrategy(DemoResponseFormat) # define the shape of the data that is generated by the LLM.
      )

      
      response = agent.invoke({                          # call the LLM
            "messages": [
                {
                    "role": "user", 
                    "content": f"Analyze this financial data and provide Financial recommendations: {user_context}"# user's financial  info
                }
            ]
      })

      return response['structured_response']             # returned to the FrontEnd
      
      
    except Exception as e:
            print(f"Error submitting questionnaire: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to submit questionnaire",
            )
    return data

