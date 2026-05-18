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


# =========================================================
# FINAL API RESPONSE SCHEMA
# =========================================================

class FullAdviceData(BaseModel):
    fullDebtsUiData: FullDebtsUiData
    investementsAdvice: InvestementsAdviceMocks
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
        if data.goals:
            print(
                f"first goal: {data.goals[0]}"
            )
        if not current_user.is_first_login:
            raise HTTPException(
                status_code=400,
                detail="user already filled finance data"
            )

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

        # =================================================
        # DEBTS ADVICE LOGIC
        # =================================================
        print("ABOUT TO CALL debt advice logic ")

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

        # =================================================
        # STORE GOALS + GOALS AI ANALYSIS
        # =================================================
        print("store goals advices")

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

        portfolio_advice:InvestementsAdviceMocks = InvestementsAdviceOrchestrator(
            answers_weights=data.subjective_answers_values_and_weights.questions_weights,
            questions_scores=data.subjective_answers_values_and_weights.answers_values,
            total_portfolio_value=data.subjective_answers_values_and_weights.investement_amount
        ).get_investement_advice()

        portfolio_description = PortfoliosPerformanceMetrics(
            user_id=current_user.id,
            expected_annual_return=portfolio_advice.optimalPortfolio.metrics.expectedAnnualReturn,
            annual_volatility=portfolio_advice.optimalPortfolio.metrics.annualVolatility,
            sharpe_ratio=portfolio_advice.optimalPortfolio.metrics.sharpeRatio
        )

        assets: list[Asset] = portfolio_advice.optimalPortfolio.assets

        assets_names = []
        for asset in assets:
            assets_names.append(asset.assetName)

        assets_percentages = []
        for asset in assets:
            assets_percentages.append(asset.capitalAllocationPercentage)
        quantities=[]
        for asset in assets:
            quantities.append(asset.quantity)
        portfolio_description.assets=[Portfolios(asset_name=name,capital_allocation_percentage=percentage,quantity=quantity) for name,percentage,quantity in zip(assets_names,assets_percentages,quantities)]


        db.add(portfolio_description)

        # =================================================
        # MARK USER AS FINISHED ONBOARDING
        # =================================================
        print("Finished PORTFOLIO ORCHESTRATOR")

        current_user.is_first_login = False

        # =================================================
        # FINAL DATABASE COMMIT
        # =================================================
        print("db commit")

        db.commit()


        cel_app.send_task("monitor_user_task", args=[current_user.id])
                
        
    
        # =================================================
        # FINAL API RESPONSE
        # =================================================
        print("final resopnce of the backend --> frontend")

        return FullAdviceData(

            fullDebtsUiData=debts_advice,

            investementsAdvice=portfolio_advice,

            goalsAdvice=goals_advice

        )

    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        db.rollback()

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )