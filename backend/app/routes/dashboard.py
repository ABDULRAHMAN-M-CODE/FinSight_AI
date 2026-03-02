from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

# DB session dependency
from app.database import get_db

# Authentication dependency 
from app.core.dependencies import get_current_user

# the response schema for dashboard
from app.schemas.dashboard_schemas import DashboardSummaryResponse

# SQLAlchemy User model
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

    # Build and return dashboard summary response
    return DashboardSummaryResponse(
        protection_advices=current_user.protection_advices,
        debts_advices=current_user.debts_advices,
        goals_and_investments_advices=current_user.goals_and_investments_advices,
    )