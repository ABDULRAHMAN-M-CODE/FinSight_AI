from fastapi import APIRouter, HTTPException, status

from app.schemas.demo_schemas import DemoSubmit


router = APIRouter(prefix="/demo")

# Demo Endpoint
# No authentication or database interaction is required.

@router.post("/demo", status_code=status.HTTP_201_CREATED)
def submit_demo(data: DemoSubmit):
    try:

        # Convert Pydantic model into JSON string
        # This is the format the LLM handles best
        user_context = data.model_dump_json()

        from langchain.agents import create_agent
        from app.prompts import SYSTEM_PROMPT
        from langchain.agents.structured_output import ToolStrategy
        from backend.app.schemas.demo_response_schemas import DemoResponse

        # Create LLM agent
        # Note: OPENAI_API_KEY is internally loaded via environment variables
        agent = create_agent(
            model="gpt-5-nano",
            system_prompt=SYSTEM_PROMPT,
            response_format=ToolStrategy(DemoResponse)
        )

        # Invoke the LLM with user financial data
        response = agent.invoke({
            "messages": [
                {
                    "role": "user",
                    "content": (
                        f"Analyze this financial data and provide "
                        f"Financial recommendations: {user_context}"
                    )
                }
            ]
        })

        # Return structured response to frontend
        return response["structured_response"]

    except Exception as e:
        print(f"Error submitting demo questionnaire: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )
