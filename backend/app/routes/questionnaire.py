from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.registration import User
from app.core.dependencies import get_current_user
from app.schemas.questionnaire_schemas import QuestionnaireSubmit


#  neccessary imports to talk to the AI
from app.schemas.questionnarie_response_schemas import FullAiResponse
from app.reusable_functions.llm_utils import call_llm

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
        model="gpt-5"
        #LLM is native in dealing with strings
        user_context = data.model_dump_json()
        system_prompt=
        response_format=FullAiResponse
        role="user"
        prompt=" I Will provide you with my financial context, please give me  the most efficient Advice that tells me exactly what to do , given I have the following info "
        
        advice=call_llm(model ,user_context, system_prompt,response_format, role,  prompt)

        # 2- call the LLM and store it's result in varaible.
        
    
        # 3- Store the AI result in the Database.


        # 4- Return the advice to the frontend.
        return advice


    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}
