

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.registration.user import User
from app.models.user_financial_data import UserFinancialData

from app.models.limited_advice import LimitedAdvice  # Need attention

from app.models.investment_account import InvestmentAccount
from app.models.goal import Goal


from app.core.utils.finance_calculations_utils import (
    compute_savings_rate,
    compute_projections,
)
from app.core.utils.json_safe_utils import json_safe

router = APIRouter(prefix="/onboarding")


from app.schemas.questionnaire_schemas import QuestionnaireSubmit
@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)

def submit_questionnaire(
    data: QuestionnaireSubmit,
    #db: Session = Depends(get_db),    # commented for testing purposes.
    #current_user: User = Depends(get_current_user), # commented for testing purposes.
):
   
    
  #  if not current_user.is_first_login:                        # commented for testing purposes.
   #     raise HTTPException(                                   # commented for testing purposes.
    #        status_code=400,                                   # commented for testing purposes.
     #       detail="Questionnaire already completed",          # commented for testing purposes.
     #   )
    
    try:
        pass     # this pass must be deleted once logic is ready      

        #Logic
        #stroe JSON1 in the database .
        #backend will not compute any thing .
        #send pompt to the LLM , the prompt will contain : 1.contex , 2. structured output 
        #send data 2 to the frontend


    except Exception as e:
        db.rollback()
        print(f"Error submitting questionnaire: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}




# Demo endpoint, no authorization required.

from app.schemas.demo_questionnaire_schemas  import LimitedQuestionnaireShape
@router.post("/demo-questionnaire", status_code=status.HTTP_201_CREATED)
def submit_demo_questionnaire(    
    data: LimitedQuestionnaireShape 
    ):
    
    try: 
        
      # turn the data to data type that the LLM is expert to deal with
      user_context = data.model_dump_json()                     
    
      
        
      from langchain.agents import create_agent
      from app.prompts import SYSTEM_PROMPT
      from langchain.agents.structured_output import ToolStrategy
      from app.schemas.demo_ai_response_schemas import DemoResponseFormat
      
      agent = create_agent(                              # Abstraction note : inside the Agent, the os.getenv("OPENAI_API_KEY") is called, this is hidden from us.                                 
        model="gpt-5-nano",                             
        system_prompt=SYSTEM_PROMPT,                    
        response_format=ToolStrategy(DemoResponseFormat) 
      )

      
      response = agent.invoke({                          # call the LLM
            "messages": [
                {
                    "role": "user", 
                    "content": f"Analyze this financial data and provide Financial recommendations: {user_context}"
                }
            ]
      })

      return response['structured_response']             # returned to the FrontEnd
      
      
    except Exception as e:
            print(f"Error submitting questionnaire: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to submit questionnaire",
            )
      

