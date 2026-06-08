from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db 
from app.core.dependencies import get_current_user
from app.models.registration import User

from app.schemas.questionnaire_schemas import (
    QuestionnaireSubmit,
    DebtIn
)

import traceback
from app.core.utils.json_safe_utils import json_safe

from app.models.user_financial_data import UserFinancialData

from app.models.portfolio_models.portfolios import Portfolios
from app.models.portfolio_models.portfolios_performance_metrics import (
    PortfoliosPerformanceMetrics
)

from app.models.debt_models.debts_advices import DebtsAdvices
from app.models.debt_models.debts_metrics import DebtMetrics

# debts logic
from app.core.finance.successive_value_modeling import (
    full_debts_ui_data_orchestrator,
    FullDebtsUiData,
    choose_strategy_from_personality
)

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

from app.schemas.goals_schemas import (
    GoalAdviceItemSchema
)

from pydantic import BaseModel

# celery
from app.worker import cel_app


# =========================================================
# FINAL API RESPONSE SCHEMA
# =========================================================

class FullAdviceData(BaseModel):
    fullDebtsUiData: FullDebtsUiData
    goalsAdvice: list[GoalAdviceItemSchema]
# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/financial-data",
    tags=["Financial Data"]
)


# =========================================================
# REGENERATE FINANCIAL DATA
# =========================================================

@router.put(
    "/regenerate",
    response_model=FullAdviceData
)
def regenerate_financial_data(

    data: QuestionnaireSubmit,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

) -> FullAdviceData:

    try:

        print("STARTING FINANCIAL DATA REGENERATION")

        # =================================================
        # DELETE OLD PORTFOLIO ASSETS
        # =================================================

        old_portfolios = db.query(
            PortfoliosPerformanceMetrics
        ).filter(
            PortfoliosPerformanceMetrics.user_id == current_user.id
        ).all()

        for portfolio in old_portfolios:

            db.query(Portfolios).filter(
                Portfolios.portfolio_id == portfolio.portfolio_id
            ).delete()

        # =================================================
        # DELETE OLD DATA
        # =================================================

        db.query(DebtsAdvices).filter(
            DebtsAdvices.user_id == current_user.id
        ).delete()

        db.query(DebtMetrics).filter(
            DebtMetrics.user_id == current_user.id
        ).delete()

        db.query(PortfoliosPerformanceMetrics).filter(
            PortfoliosPerformanceMetrics.user_id == current_user.id
        ).delete()

        db.query(UserFinancialData).filter(
            UserFinancialData.user_id == current_user.id
        ).delete()

        # =================================================
        # CALCULATE TOTAL HOUSEHOLD INCOME
        # =================================================

        print("calculating total income")

        total_income = sum(
            member.annual_income
            for member in data.household_income
        )

        # =================================================
        # STORE USER FINANCIAL DATA
        # =================================================

        print("storing user finance data")

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

        # =================================================
        # DEBTS ADVICE LOGIC
        # =================================================

        print("running debts advice logic")

        score = 7

        strategy = choose_strategy_from_personality(
            score
        )

        debts: list[DebtIn] = (
            data.outstanding_debts
        )

        balances = [
            d.balance for d in debts
        ]

        interest_rates = [
            d.interest_rate for d in debts
        ]

        fixed_monthly_payments = [
            d.monthly_payment for d in debts
        ]

        debts_advice = (
            full_debts_ui_data_orchestrator(

                strategy=strategy,

                balances=balances,

                interest_rates=interest_rates,

                fixed_montlhy_payments=(
                    fixed_monthly_payments
                ),

                user_validated_data=data
            )
        )

        # =================================================
        # STORE DEBTS AI RESULTS
        # =================================================

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

        # =================================================
        # GOALS ADVICE LOGIC
        # =================================================

        print("running goals advice logic")

        goals_advice = generate_goals_advice(

            user_id=current_user.id,

            monthly_income=float(total_income / 12),

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

        # =================================================
        # STORE GOALS + GOALS AI ANALYSIS
        # =================================================

        print("storing goals advice")

        save_goals_and_advice(

            db=db,

            user_id=current_user.id,

            goals_input=data.goals,

            validated_goals=goals_advice
        )

        # =================================================
        # PORTFOLIO / INVESTMENT ADVICE
        # =================================================
        print("ABOUT TO CALL PORTFOLIO ORCHESTRATOR")
        cel_app.send_task("run_portfolio_orchestrator_task", args=[data.model_dump(),current_user.id])

        # =================================================
        # FINAL DATABASE COMMIT
        # =================================================

        print("committing regenerated data")

        db.commit()
        # =================================================
        # FINAL RESPONSE
        # =================================================

        print("returning regenerated response")

        return FullAdviceData(

            fullDebtsUiData=debts_advice,
            goalsAdvice=goals_advice
        )

    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        db.rollback()

        print("ERROR:", str(e))

        traceback.print_exc()
        raise