from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.questionnaire_schemas import QuestionnaireSubmit
from app.user_prompts import full_service_user_prompt
from app.core.utils.llm_utils import call_llm
from app.core.utils.json_safe_utils import json_safe
from app.models.registration import User
from app.models.user_financial_data import UserFinancialData
from app.models.portfolio_models.portfolios import Portfolios
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics
from app.models.debt_models.debts_advices import DebtsAdvices
from app.models.debt_models.debts_metrics import DebtMetrics
from app.schemas.questionnaire_schemas import Goal
from app.core.finance.successive_value_modeling import (
    full_debts_ui_data_orchestrator,
    FullDebtsUiData,
    choose_strategy_from_personality   
)
from app.schemas.questionnaire_schemas import DebtIn
from app.core.finance.portfolio_construction import InvestementsAdviceOrchestrator,InvestementsAdviceMocks,Asset
from pydantic import BaseModel
# when piece of code is used by one entity → keep it close to the entity, don't define other file for it.

class FullAdviceData(BaseModel):
    fullDebtsUiData:FullDebtsUiData   
    investementsAdvice:InvestementsAdviceMocks 

router = APIRouter(prefix="/onboarding")
@router.post("/questionnaire", status_code=status.HTTP_201_CREATED,response_model=FullAdviceData) #this router is executed after the user provide all his context 
def submit_questionnaire(
     data: QuestionnaireSubmit,
     current_user: User = Depends(get_current_user), 
     db: Session = Depends(get_db),
     
)->FullAdviceData:
    try:
        print("recived data successfully\n")
        print(f"visualizing first goal  :{data.goals[0]}")
        # check if user already filled finance data

        if not current_user.is_first_login :
            print("if block was executed")
            raise HTTPException(
                status_code=400,
                detail="user already filled finance data ",
            )

        # 1- Store all submitted user's info "data" in the  appropriate database tables.
        # Store User Financial Data
        total_income = sum(member.annual_income for member in data.household_income)
        user_financial_data = UserFinancialData(
            user_id=current_user.id,
            household_income=float(total_income),
            income_sources=json_safe([member.model_dump() for member in data.household_income]),
            monthly_budget=float(data.monthly_budget),
            outstanding_debts=json_safe([debt.model_dump() for debt in data.outstanding_debts])
        )
        db.add(user_financial_data) 

        

        score = 7   
        strategy = choose_strategy_from_personality(score)
        
        debts:list[DebtIn]=data.outstanding_debts
        balances = [d.balance for d in debts]
        interest_rates = [d.interest_rate for d in debts]
        fixed_monthly_payments = [d.monthly_payment for d in debts]
        debts_advice = full_debts_ui_data_orchestrator(
            strategy=strategy,   
            balances=balances,
            interest_rates=interest_rates,
            fixed_montlhy_payments=fixed_monthly_payments,
            user_validated_data=data
        )
        
        # 3- Store the AI results in the Database.
        db.add(DebtsAdvices(
            user_id=current_user.id,
            debts_advice=json_safe(debts_advice.advice.model_dump())
        ))
        db.add(
            DebtMetrics(
                user_id=current_user.id,
                metrics=json_safe(
                    debts_advice.model_dump(exclude={"advice"}))
        ))



     ####GOALS advice future update###########
        # I have made everything necessary to get the goals from frontend, frontend, pydantic, etc..
        
        goals:list[Goal]=data.goals # you can use this goals  for your future  logic.
    ##########################
        
        current_user.is_first_login = False

        print("debts type is  :",data.outstanding_debts[0].type,'\n')
        portfolio_advice:InvestementsAdviceMocks=InvestementsAdviceOrchestrator(
            answers_weights=data.subjective_answers_values_and_weights.questions_weights,
            questions_scores=data.subjective_answers_values_and_weights.answers_values,
            total_portfolio_value=data.subjective_answers_values_and_weights.investement_amount
        ).get_investement_advice()
        
        
        # is the following correct 
        portfolio_description=PortfoliosPerformanceMetrics(
            user_id=current_user.id,
            expected_annual_return=portfolio_advice.optimalPortfolio.metrics.expectedAnnualReturn,
            annual_volatility=portfolio_advice.optimalPortfolio.metrics.annualVolatility,
            sharpe_ratio=portfolio_advice.optimalPortfolio.metrics.sharpeRatio
        )
        assets:list[Asset]=portfolio_advice.optimalPortfolio.assets
        assets_names=[]
        for asset in assets:
            assets_names.append(asset.assetName)
        assets_percentages=[]
        for asset in assets:
            assets_percentages.append(asset.capitalAllocationPercentage)

        portfolio_description.assets=[Portfolios(asset_name=name,capital_allocation_percentage=percentage) for name,percentage in zip(assets_names,assets_percentages)]
        db.add(portfolio_description)
        db.commit()

     
        return FullAdviceData(fullDebtsUiData=debts_advice,investementsAdvice=portfolio_advice)
    
    except Exception as e:
        db.rollback()
        print("ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )