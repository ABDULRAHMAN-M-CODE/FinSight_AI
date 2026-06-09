from fastapi import APIRouter, HTTPException, status, Depends
from app.core.dependencies import get_current_user
from app.models.registration import User
from app.schemas.questionnaire_schemas import QuestionnaireSubmit
from app.worker import cel_app
import traceback
from pydantic import BaseModel

class Response1(BaseModel): 
    requestResult: str
from app.core.finance.successive_value_modeling import FullDebtsUiData
from app.core.finance.portfolio_construction import  InvestementsAdviceMocks
from app.schemas.goals_schemas import GoalAdviceItemSchema
class FullAdviceData(BaseModel):
    fullDebtsUiData: FullDebtsUiData
    investementsAdvice: InvestementsAdviceMocks
    goalsAdvice: list[GoalAdviceItemSchema]

router = APIRouter(prefix="/onboarding")
@router.post(
    "/questionnaire",
    status_code=status.HTTP_201_CREATED,
    response_model=Response1
)
def submit_questionnaire(data: QuestionnaireSubmit,current_user: User = Depends(get_current_user))->Response1:
    try:
        print("received questionnaire successfully")
        if not current_user.is_first_login:
            raise HTTPException(
                status_code=400,
                detail="user already filled finance data"
            )
        current_user.is_first_login = False
        total_income = sum(member.annual_income for member in data.household_income)

        cel_app.send_task("run_debts_orchestrator_task", args=[data.model_dump(),current_user.id,total_income])
        
        cel_app.send_task("run_goals_orchestrator_task", args=[data.model_dump(),current_user.id,total_income])

        cel_app.send_task("run_portfolio_orchestrator_task", args=[data.model_dump(),current_user.id])
        return Response1(requestResult="success")
    except Exception:
        traceback.print_exc()
        raise