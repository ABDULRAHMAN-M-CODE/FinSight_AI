from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.registration import User
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
#"http://localhost:8000/mocks/get_goals_ui_mocks"
router = APIRouter(prefix="/mocks")
@router.get(
    "/get_goals_ui_mocks",
    status_code=status.HTTP_201_CREATED,
    response_model=
)
def get_investements_advice_mocks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> FullDebtsUiData: 
    try:
        print("started")
        
        orm1:DebtsAdvices = db.query(DebtsAdvices).filter(DebtsAdvices.user_id == current_user.id).first()
        orm2:DebtMetrics=db.query(DebtMetrics).filter(DebtMetrics.user_id==current_user.id).first()
        return FullDebtsUiData(
                strategy= orm2.metrics["strategy"],
                startingTotalBalance=orm2.metrics["startingTotalBalance"],
                trajectory=orm2.metrics["trajectory"],
                monthsToTotalPayoff=orm2.metrics["monthsToTotalPayoff"],                        
                estimatedPayoffDate=orm2.metrics["estimatedPayoffDate"],
                debtKeys=orm2.metrics["debtKeys"],        
                advice=orm1.debts_advice  
        )      
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise