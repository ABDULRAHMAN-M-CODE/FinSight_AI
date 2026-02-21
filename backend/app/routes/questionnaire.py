from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.registration import User
from app.core.dependencies import get_current_user

from app.schemas.questionnaire_schemas import QuestionnaireSubmit
from app.schemas.questionnarie_response_schemas import FullAiResponse

# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")

@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
     data: QuestionnaireSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if not current_user.is_first_login :
            raise HTTPException(
            status_code=400,
            detail="user already filled finance data ",
        )
        # just started , i will complete as soon as possible.
         
        # 1- Store all submitted user's info "data" in the  appropriate database tables.


        # 2- call the LLM and store it's result in varaible.
        
    
        # 3- Store the AI result in the Database.


        # 4- Return the advice to the frontend.



    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}
