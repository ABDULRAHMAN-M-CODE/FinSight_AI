from fastapi import APIRouter, HTTPException, status

from app.schemas.demo_schemas import DemoSubmit
from app.system_prompts import demo_service_system_prompt
from app.schemas.demo_response_schemas import DemoResponse
from app.reusable_functions.llm_utils import call_llm

# Demo router (demo service only).
router = APIRouter(prefix="/demo")

# No authentication or database interaction is required.

@router.post("/demo", status_code=status.HTTP_201_CREATED)
def submit_demo(data: DemoSubmit):
    try:

        #LLM is native in dealing with strings
        user_context = data.model_dump_json()
        
        
        # I rewrote the function to be reusable , the monitoring service will likely use it, because some LLM will monitor the Database to detect patterns inside it  !        
        role="user"
        user_prompt="I'm a Full Stack developer, I have some goals and investements detailed context, please give me most efficient Advice that tells me exactly what to do , given I have the following info "
        desired_output_shape=DemoResponse
        system_prompt=demo_service_system_prompt
        model="gpt-5"
        
        advice=call_llm(model ,user_context, system_prompt, desired_output_shape, role,  user_prompt)
        
        return advice

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Failed to run demo",
        )
