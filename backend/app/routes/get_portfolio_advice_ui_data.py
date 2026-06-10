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
from app.core.finance.portfolio_construction import Metrics,Asset,OptimalPortfolio
router = APIRouter(prefix="/mocks")
@router.get(
    "/get_investements_advice_mocks",
    status_code=status.HTTP_201_CREATED,
    response_model=InvestementsAdviceMocks
)
def get_investements_advice_mocks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> InvestementsAdviceMocks:
    try:
        print("started")
        
        y:PortfoliosPerformanceMetrics = db.query(
        PortfoliosPerformanceMetrics
        ).filter(
            PortfoliosPerformanceMetrics.user_id == current_user.id
        ).first()
        if y is None:
            print("portfolio is not ready yet.")
            raise HTTPException(
                status_code=404,
                detail="Portfolio not ready yet"
            )

        metrics:Metrics=Metrics(
            expectedAnnualReturn=y.expected_annual_return,
            annualVolatility=y.annual_volatility,
            sharpeRatio=y.sharpe_ratio
            )


        a:list[Asset]=[]
        x:list[Portfolios]=y.assets
        for p in x:
            a.append(Asset(assetName=p.asset_name,capitalAllocationPercentage=p.capital_allocation_percentage,quantity=p.quantity))
                
        return InvestementsAdviceMocks(optimalPortfolio=OptimalPortfolio(assets=a,metrics=metrics))
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise