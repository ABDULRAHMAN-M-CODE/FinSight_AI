from app.database import get_db
from app.core.dependencies import get_current_user
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.finance.portfolio_construction import InvestementsAdviceMocks
import traceback
from app.models.portfolio_models.portfolios import Portfolios # Note for later : why imported ? even if it's not used?
from app.models.user_financial_data import UserFinancialData  # Note for later : why imported ? even if it's not used?
from app.models.debt_models.debts_advices import DebtsAdvices # Note for later :  why imported ? even if it's not used?
from app.models.debt_models.debts_metrics import DebtMetrics  #  Note for later : why imported ? even if it's not used?
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics # Note for later : why imported ? even if it's not used?
from app.models.registration.user import User  # Note for later : why imported ? even if it's not used?
from app.models.goal_models.goals import Goal   # Note for later : why imported ? even if it's not used?
from app.models.goal_models.goal_analysis import GoalAnalysis # Note for later : why imported ? even if it's not used?
from app.models.goal_models.goal_Plan_step import GoalPlanStep# Note for later : why imported ? even if it's not used?
from app.core.finance.portfolio_construction import Metrics,Asset,OptimalPortfolio# Note for later :.....
from app.schemas.goals_schemas import GoalAdviceItemSchema


router = APIRouter(prefix="/mocks")
@router.get(
    "/get_goals_ui_mocks",
    status_code=status.HTTP_201_CREATED,
    response_model=list[GoalAdviceItemSchema]# we don't know yet, but we do not care for now
)

def get_investements_advice_mocks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) ->list[GoalAdviceItemSchema]: 
    try:
        print("started")


        result:list[GoalAdviceItemSchema] = []

        for goal in current_user.goals:

            
            analysis = (
                db.query(GoalAnalysis)
                .filter(GoalAnalysis.goal_id == goal.id)
                .order_by(GoalAnalysis.generated_at.desc())
                .first()
            )

            if not analysis:
                continue

            result.append(
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
        return result
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise