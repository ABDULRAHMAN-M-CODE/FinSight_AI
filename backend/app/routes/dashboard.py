from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

# DB session dependency
from app.database import get_db

# Authentication dependency 
from app.core.dependencies import get_current_user

# import needed models and schemas for dashboard
from app.schemas.dashboard_schemas import DashboardSummaryResponse
from app.models.debt_models.debts_metrics import DebtMetrics
from app.models.debt_models.debts_advices import DebtsAdvices
from app.core.finance.successive_value_modeling import FullDebtsUiData
from app.models.registration import User


# Router for dashboard endpoint
router = APIRouter(prefix="/dashboard")

@router.get("/main-dashboard",response_model=DashboardSummaryResponse,  status_code=status.HTTP_200_OK)
def get_main_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns summary financial advice data for the main dashboard.

    This endpoint:
    - Requires authenticated user
    - Ensures onboarding is completed
    - Returns structured dashboard summary data

    We can change the returned data if needed, for now just returns the advices that are stored in DB. 
    
    """

    # If user has not completed onboarding (still first login),
    # block access to dashboard
    if current_user.is_first_login:
        raise HTTPException(
            status_code=400,
            detail="User did not fill finance data"
        )

    # get stored metrics
    metrics_record = (
        db.query(DebtMetrics)
        .filter(DebtMetrics.user_id == current_user.id)
        .order_by(DebtMetrics.created_at.desc())
        .first()
    )

    if not metrics_record:
        raise HTTPException(
            status_code=404,
            detail="Debt metrics not found"
        )

    # get stored advice
    advice_record = (
        db.query(DebtsAdvices)
        .filter(DebtsAdvices.user_id == current_user.id)
        .order_by(DebtsAdvices.created_at.desc())
        .first()
    )

    if not advice_record:
        raise HTTPException(
            status_code=404,
            detail="Debt advice not found"
        )

    # combine metrics with advice to reconstruct FullDebtsUiData
    full_data_dict = metrics_record.metrics.copy()
    full_data_dict["advice"] = advice_record.debts_advice

    full_debts_ui_data = FullDebtsUiData(**full_data_dict)

    # Build and return dashboard summary response
    return DashboardSummaryResponse(
        fullDebtsUiData=full_debts_ui_data
    )