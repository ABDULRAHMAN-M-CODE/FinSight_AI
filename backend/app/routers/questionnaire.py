from fastapi import APIRouter, Depends, HTTPException
from app.schemas import QuestionnaireJSON1, QuestionnaireJSON2, APIResponse, AIAdviceJSON3
from app.db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from uuid import uuid4
from app import crud, models

router = APIRouter()

@router.post("/submit", response_model=APIResponse)
async def submit_questionnaire(payload: QuestionnaireJSON1, session: AsyncSession = Depends(get_async_session)):
    """
    POST /questionnaire/submit
    Request body schema: QuestionnaireJSON1
    Response schema: APIResponse with data containing JSON2 (QuestionnaireJSON2)
    Side effects:
      - If payload.signup_completed == True: writes to user_financial_data (table) and may write a limited_advice record (if AI advice produced).
      - Otherwise: no DB write, only server-side validation.
    """
    # Server-side validation: require user_id if signup_completed
    if payload.signup_completed and not payload.user_id:
        raise HTTPException(status_code=400, detail="signup_completed requires user_id to persist data")

    # If user_id not provided, synthesize a new user id and create user record
    user_id = payload.user_id
    if not user_id:
        # create a minimal user record
        new_user = models.User(id=uuid4(), email=None)
        session.add(new_user)
        await session.flush()
        user_id = new_user.id

    json2 = QuestionnaireJSON2(
        user_id=user_id,
        household_income=payload.household_income,
        income_sources=payload.income_sources,
        monthly_budget=payload.monthly_budget,
        investment_accts=payload.investment_accts,
        outstanding_debts=payload.outstanding_debts,
        life_insurance=payload.life_insurance,
        validated_at=datetime.utcnow()
    )

    # If signup completed, persist into user_financial_data
    if payload.signup_completed:
        await crud.upsert_user_financial_data(session, json2)

        # Optionally create a limited_advice placeholder (AI step will be implemented in Stage 2)
        advice = AIAdviceJSON3(
            user_id=user_id,
            savings_cta="Limited advice placeholder: complete your profile for enriched advice.",
            recommendations=[{"note": "Complete signup to store recommendations"}],
            projections={},
            generated_at=datetime.utcnow()
        )
        await crud.store_limited_advice(session, advice)
        await session.commit()

    return APIResponse(success=True, message="Questionnaire processed", data=json2.dict())
