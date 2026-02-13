

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


from app.core.utils.finance_calculations import (
    compute_savings_rate,
    compute_projections,
)
from app.core.utils.json_safe import json_safe

from app.schemas.full_ai_response_shape import (
    ProtectionAdvice,
    DebtsAdvice
)

router = APIRouter(prefix="/onboarding")


from app.schemas.Questionnaire import QuestionnaireSubmit

@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
    data: QuestionnaireSubmit,
    #db: Session = Depends(get_db),
    #current_user: User = Depends(get_current_user),
):
    # I intentionally commented this logic for testing. Most of this logic must be changed to match the frontend.
    
   # if not current_user.is_first_login:   
    #    raise HTTPException(
     #       status_code=400,
     #       detail="Questionnaire already completed",
      #  )
    
    try:
        pass
        # You can put commented code here using either `#` per line
        # Example:
        # total_household_income = sum(member.annual_income for member in data.household_income)
        # ... other logic ...
        
    except Exception as e:
        db.rollback()
        print(f"Error submitting questionnaire: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )

    return {"message": "Questionnaire submitted successfully"}




# Demo endpoint, no authorization required.


from app.schemas.limited_questionnaire_shape  import LimitedQuestionnaireShape
@router.post("/limited-questionnaire", status_code=status.HTTP_201_CREATED)
def submit_limited_questionnaire(    
    data: LimitedQuestionnaireShape 
    ):
    
    try: 
        
      # turn the data to data type that the LLM is expert to deal with
      user_context = data.model_dump_json()                     
    
      
        
      from langchain.agents import create_agent
      from app.prompts import SYSTEM_PROMPT
      from langchain.agents.structured_output import ToolStrategy
      from app.schemas.demo_ai_response_shape import DemoResponseFormat
      
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
      

