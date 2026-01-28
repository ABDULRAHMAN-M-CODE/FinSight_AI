from fastapi import APIRouter, Depends, HTTPException
from app.schemas import AlertMonitorRequest, APIResponse, AlertRecord
from app.db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models
from datetime import datetime

router = APIRouter()

@router.post("/monitor", response_model=APIResponse)
async def monitor_alerts(payload: AlertMonitorRequest, session: AsyncSession = Depends(get_async_session)):
    """
    POST /alerts/monitor
    Request body schema: AlertMonitorRequest { user_id }
    Response: APIResponse with created alert(s)
    Side effects:
      - reads: user_financial_data, goals, investment_accounts, investment_performance_snapshots
      - writes: financial_alerts table when an anomaly is detected
    Behavior:
      - This endpoint runs a single-pass anomaly check for the specified user and writes alerts to the DB.
    """
    # Simplified anomaly detection example: if monthly_budget decreased dramatically (placeholder)
    user_id = str(payload.user_id)
    # Fetch user's financial data
    from sqlalchemy import select
    q = select(models.UserFinancialData).filter(models.UserFinancialData.user_id == user_id)
    res = await session.execute(q)
    user_fin = res.scalar_one_or_none()

    alerts_created = []
    if user_fin and user_fin.monthly_budget:
        try:
            budget = float(user_fin.monthly_budget)
            # placeholder rule: if monthly_budget < 100 -> generate low budget alert
            if budget < 100:
                a = await crud.insert_financial_alert(
                    session=session,
                    user_id=user_id,
                    alert_type="low_monthly_budget",
                    detected_pattern={"monthly_budget": budget},
                    message="Your monthly budget is below $100; consider reviewing expenses.",
                    severity="medium",
                    ai_reasoning="Budget below threshold rule (Stage1)."
                )
                alerts_created.append({
                    "id": a.id,
                    "user_id": a.user_id,
                    "alert_type": a.alert_type,
                    "message": a.message,
                    "severity": a.severity,
                    "triggered_at": a.triggered_at
                })
                await session.commit()
        except Exception:
            pass

    return APIResponse(success=True, data=alerts_created or [], message="Monitoring completed")