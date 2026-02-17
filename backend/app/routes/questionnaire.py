from fastapi import APIRouter, HTTPException, status

from app.schemas.questionnaire_schemas import QuestionnaireSubmit

# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")

@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
    data: QuestionnaireSubmit,
):
    try:
        pass  # remove once business logic is implemented

        # Future logic:
        # 1. Store questionnaire JSON in database
        # 2. Send context + structured output prompt to LLM
        # 3. Return generated financial plan to frontend

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}
