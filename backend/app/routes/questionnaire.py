from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session


from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.registration import User
from app.schemas.questionnaire_schemas import QuestionnaireSubmit
from app.user_prompts import full_service_user_prompt
from app.core.utils.llm_utils import call_llm
from app.core.utils.json_safe_utils import json_safe

from app.models.user_financial_data import UserFinancialData

from app.models.portfolio_models.portfolios import Portfolios
from app.models.portfolio_models.portfolios_performance_metrics import (
    PortfoliosPerformanceMetrics
)

from app.models.debt_models.debts_advices import DebtsAdvices
from app.models.debt_models.debts_metrics import DebtMetrics

from app.schemas.questionnaire_schemas import (
    QuestionnaireSubmit,
    Goal,
    DebtIn
)

from app.core.utils.json_safe_utils import json_safe

# debts logic
from app.core.finance.successive_value_modeling import (
    full_debts_ui_data_orchestrator,
    FullDebtsUiData,
    choose_strategy_from_personality
)
from app.schemas.questionnaire_schemas import DebtIn

from pydantic import BaseModel
####################################
# imports related to rebalancing .
from app.worker import cel_app

###################################


# portfolio logic
from app.core.finance.portfolio_construction import (
    InvestementsAdviceOrchestrator,
    InvestementsAdviceMocks,
    Asset
)

# goals logic
from app.core.finance.goals_advisor import (
    generate_goals_advice,
    save_goals_and_advice
)

from app.schemas.goals_schemas import GoalAdviceItemSchema,GoalAdviceResponseSchema
import traceback

# =========================================================
# FINAL API RESPONSE SCHEMA
# =========================================================

class FullAdviceData(BaseModel):
    fullDebtsUiData: FullDebtsUiData
    
    goalsAdvice: list[GoalAdviceItemSchema]

# =========================================================
# ROUTER
# =========================================================

router = APIRouter(prefix="/onboarding")


@router.post(
    "/questionnaire",
    status_code=status.HTTP_201_CREATED,
    response_model=FullAdviceData
)
def submit_questionnaire(
    data: QuestionnaireSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> FullAdviceData:

    try:
        print("received questionnaire successfully")
        if not current_user.is_first_login:
            raise HTTPException(
                status_code=400,
                detail="user already filled finance data"
            )

        # =================================================
        # DEBTS ADVICE LOGIC
        # =================================================
        print("calculating total income")
        total_income = sum(
            member.annual_income
            for member in data.household_income
        )
        print("ABOUT TO CALL debt advice logic ")        
        strategy = choose_strategy_from_personality(7)
        debts: list[DebtIn] = (  data.outstanding_debts)
        balances = [  d.balance for d in debts]
        interest_rates = [
            d.interest_rate for d in debts
        ]
        fixed_monthly_payments = [d.monthly_payment for d in debts]
        debts_advice = (
            full_debts_ui_data_orchestrator(
                strategy=strategy,
                balances=balances,
                interest_rates=interest_rates,
                fixed_montlhy_payments=(fixed_monthly_payments),
                user_validated_data=data
            )
        )
        # =================================================
        # GOALS ADVICE LOGIC
        # =================================================
        print("ABOUT TO CALL advice logic")

        goals_advice = generate_goals_advice(
            user_id=current_user.id,
            monthly_income=float(total_income/12),
            monthly_expenses=float(
                data.monthly_budget
            ),
            monthly_debt_payments=float(
                sum(
                    debt.monthly_payment
                    for debt in data.outstanding_debts
                )
            ),
            investments_total=float(
                data
                .subjective_answers_values_and_weights
                .investement_amount
            ),
            goals_input=data.goals
        )


        print("ABOUT TO CALL PORTFOLIO ORCHESTRATOR")
        cel_app.send_task("run_portfolio_orchestrator_task", args=[data.model_dump(),current_user.id])
        #########################################
        # Database operations
        print("ABOUT TO store user finance data")
        user_financial_data = UserFinancialData(
            user_id=current_user.id,
            household_income=float(total_income),
            income_sources=json_safe([
                member.model_dump()
                for member in data.household_income
            ]),
            monthly_budget=float(
                data.monthly_budget
            ),
            outstanding_debts=json_safe([
                debt.model_dump()
                for debt in data.outstanding_debts
            ])
        )

        db.add(user_financial_data)
        print("storing debt AI results")

        db.add(
            DebtsAdvices(
                user_id=current_user.id,
                debts_advice=json_safe(
                    debts_advice.advice.model_dump()
                )
            )
        )

        db.add(
            DebtMetrics(
                user_id=current_user.id,
                metrics=json_safe(
                    debts_advice.model_dump(
                        exclude={"advice"}
                    )
                )
            )
        )

        print("store goals advices")
        save_goals_and_advice(
            db=db,
            user_id=current_user.id,
            goals_input=data.goals,
            validated_goals=goals_advice
        )

        current_user.is_first_login = False
        db.commit()

        

        

        # the foollowing return statement returns data to the frontend.
        return FullAdviceData(
            fullDebtsUiData=debts_advice,
            goalsAdvice=goals_advice
        )
    
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise