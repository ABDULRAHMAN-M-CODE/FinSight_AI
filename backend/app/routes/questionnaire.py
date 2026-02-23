from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.registration import User
from app.core.dependencies import get_current_user
from app.schemas.questionnaire_schemas import QuestionnaireSubmit


#  neccessary imports to talk to the AI
from app.schemas.questionnarie_response_schemas import FullAiResponse
from app.system_prompts import full_service_system_prompt
from app.user_prompts import full_service_user_prompt
from app.reusable_functions.llm_utils import call_llm


# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")

@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
     data: QuestionnaireSubmit,
     current_user: User = Depends(get_current_user), #  Note : This must be designed to read the HTTPOnly cookie that includes the JWT, React Expect cookie that contain JWT, not raw JWT
     db: Session = Depends(get_db),
):
    try:
        print("recived data successfully")
        #pass
        if not current_user.is_first_login :
            print("if block was executed")
            raise HTTPException(
            status_code=400,
            detail="user already filled finance data ",
        )


        

        # just started , i will complete as soon as possible.

         
        # 1- Store all submitted user's info "data" in the  appropriate database tables.

#############################################################
        # 2- call the LLM and store it's result in varaible.
        model="gpt-5"
        user_context = data.model_dump_json()#LLM is native in dealing with strings
        system_prompt=full_service_system_prompt
        response_format=FullAiResponse
        role="user"
        prompt = full_service_user_prompt
        
        advice=call_llm(model ,user_context, system_prompt,response_format, role,  prompt)    
#############################################################################################    
        # 3- Store the AI result in the Database.

################################################################################################
        # 4- Return the advice to the frontend.
        return advice # if this is commented out, the part that recives  data in the frontend must also be commented out for testing purposes.


    except Exception as e:
               
        raise HTTPException(
           
            status_code=500,
            detail="Internal server error" 
        )

   
