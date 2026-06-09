from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.registration import User

from app.models.debt_models.debts_advices import DebtsAdvices
from app.models.debt_models.debts_metrics import DebtMetrics

from app.models.portfolio_models.portfolios_performance_metrics import (
    PortfoliosPerformanceMetrics
)

from app.models.goal_models.goal_analysis import GoalAnalysis

from app.routes.questionnaire import FullAdviceData
from app.schemas.goals_schemas import GoalAdviceItemSchema

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =========================================================
# GET DASHBOARD
# =========================================================

@router.get("/", response_model=FullAdviceData)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # =====================================================
    # DEBTS
    # =====================================================

    debt_metrics_row = (
        db.query(DebtMetrics)
        .filter(DebtMetrics.user_id == current_user.id)
        .first()
    )

    debt_advice_row = (
        db.query(DebtsAdvices)
        .filter(DebtsAdvices.user_id == current_user.id)
        .first()
    )

    if not debt_metrics_row or not debt_advice_row:
        raise HTTPException(
            status_code=404,
            detail="Debt data not found for this user"
        )

    debts_data = debt_metrics_row.metrics
    debts_data["advice"] = debt_advice_row.debts_advice


    # =====================================================
    # INVESTMENTS
    # =====================================================

    portfolio_row = (
        db.query(PortfoliosPerformanceMetrics)
        .filter(PortfoliosPerformanceMetrics.user_id == current_user.id)
        .first()
    )

    if not portfolio_row:
        raise HTTPException(
            status_code=404,
            detail="Portfolio data not found for this user"
        )

    investments_data = {
        "leftover": getattr(portfolio_row, "leftover", 0.0),

        "optimalPortfolio": {
            "metrics": {
                "expectedAnnualReturn": portfolio_row.expected_annual_return,
                "annualVolatility": portfolio_row.annual_volatility,
                "sharpeRatio": portfolio_row.sharpe_ratio
            },

            "assets": [
                {
                    "assetName": asset.asset_name,
                    "capitalAllocationPercentage": asset.capital_allocation_percentage,
                    "quantity": asset.quantity
                }
                for asset in portfolio_row.assets
            ]
        },

        "assetsScatter": getattr(portfolio_row, "assets_scatter", [])
    }


    # =====================================================
    # GOALS (FIXED)
    # =====================================================

    goals_data:list[GoalAdviceItemSchema] = []

    for goal in current_user.goals:

        # get latest AI analysis for this goal
        analysis = (
            db.query(GoalAnalysis)
            .filter(GoalAnalysis.goal_id == goal.id)
            .order_by(GoalAnalysis.generated_at.desc())
            .first()
        )

        if not analysis:
            continue

        goals_data.append(
            GoalAdviceItemSchema(
                goal_id=goal.id,
                goal_name=goal.goal_name,

                is_possible=analysis.is_possible,
                priority=analysis.priority,
                required_monthly_saving=analysis.required_monthly_saving,
                months_remaining=analysis.months_remaining,
                ai_summary=analysis.ai_summary,

                simple_plan=[
                    step.step_text
                    for step in sorted(
                        analysis.steps,
                        key=lambda x: x.step_order
                    )
                ]
            )
        )


    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return FullAdviceData(

        fullDebtsUiData=debts_data,

        investementsAdvice=investments_data,

        goalsAdvice=goals_data
    )