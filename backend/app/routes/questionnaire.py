from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.questionnarie_response_schemas import FullAdviceData
# DB session dependency
from app.database import get_db

# Authentication dependency 
from app.core.dependencies import get_current_user

#  import the necessary schemas
from app.schemas.questionnaire_schemas import QuestionnaireSubmit

#  necessary imports to talk to the AI

#from app.system_prompts import full_service_system_prompt
from app.user_prompts import full_service_user_prompt
from app.core.utils.llm_utils import call_llm

# import  json_safe from utils
from app.core.utils.json_safe_utils import json_safe

# import the needed models 
from app.models.registration import User
from app.models.user_financial_data import UserFinancialData
from app.models.portfolio_models.portfolios import Portfolios
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics


from app.models.debt_models.debts_advices import DebtsAdvices

from app.models.debt_models.debts_metrics import DebtMetrics
from app.core.finance.successive_value_modeling import (
    full_debts_ui_data_orchestrator,
    FullDebtsUiData,
    choose_strategy_from_personality   
)
from app.schemas.questionnaire_schemas import DebtIn
from app.core.finance.portfolio_construction import InvestementsAdviceOrchestrator,InvestementsAdviceMocks,Asset


# questionnaire router (questionnaire only).
router = APIRouter(prefix="/onboarding")


@router.post("/questionnaire", status_code=status.HTTP_201_CREATED,response_model=FullAdviceData) #this router is executed after the user provide all his context 
def submit_questionnaire(
     data: QuestionnaireSubmit,
     current_user: User = Depends(get_current_user), 
     db: Session = Depends(get_db),
     
)->FullAdviceData:
    try:
        print("recived data successfully")

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

        # 2- Perform all the required computations and data modeling
        # first, we model the Successive value formula which is : b(k)=(b(k-1)*(1+interestRate))-p, the inputs to this equation is exlicitly  provided by user info
        # all the results of this equation or function call  must be passed to the full_service_user_prompt (or define that prompt in the same file containing  the function implmentation)

        score = 7 # avalanche method is fixed.  
        strategy = choose_strategy_from_personality(score)
        
        debts:list[DebtIn]=data.outstanding_debts
        balances = [d.balance for d in debts]
        interest_rates = [d.interest_rate for d in debts]
        fixed_monthly_payments = [d.monthly_payment for d in debts]
        debts_ui_data = full_debts_ui_data_orchestrator(
            strategy=strategy,   
            balances=balances,
            interest_rates=interest_rates,
            fixed_montlhy_payments=fixed_monthly_payments,
            user_validated_data=data
        )
        
        # 3- Store the AI results in the Database.
        db.add(DebtsAdvices(
            user_id=current_user.id,
            debts_advice=json_safe(debts_ui_data.advice.model_dump())
        ))
        db.add(
            DebtMetrics(
                user_id=current_user.id,
                metrics=json_safe(
                    debts_ui_data.model_dump(exclude={"advice"}))
        ))
        # # 4- Investement advice
        # portfolio_advice:InvestementsAdviceMocks=InvestementsAdviceOrchestrator(
        #     answers_weights=data.subjective_answers_values_and_weights.questions_weights,
        #     questions_scores=data.subjective_answers_values_and_weights.answers_values,
        #     total_portfolio_value=data.subjective_answers_values_and_weights.investement_amount
        # ).get_investement_advice()
        
        
        # # is the following correct 
        # portfolio_description=PortfoliosPerformanceMetrics(
        #     user_id=current_user.id,
        #     expected_annual_return=portfolio_advice.optimalPortfolio.metrics.expectedAnnualReturn,
        #     annual_volatility=portfolio_advice.optimalPortfolio.metrics.annualVolatility,
        #     sharpe_ratio=portfolio_advice.optimalPortfolio.metrics.sharpeRatio
        # )
        # assets:list[Asset]=portfolio_advice.optimalPortfolio.assets
        # assets_names=[]
        # for asset in assets:
        #     assets_names.append(asset.assetName)
        # assets_percentages=[]
        # for asset in assets:
        #     assets_percentages.append(asset.capitalAllocationPercentage)

        # portfolio_description.assets=[Portfolios(asset_name=name,capital_allocation_percentage=percentage) for name,percentage in zip(assets_names,assets_percentages)]
        # db.add(portfolio_description)

     # goals advice
        # future update

     # 6- Mark first login as completed
        current_user.is_first_login = False

<<<<<<< Updated upstream
     # 7- commit changes to DB.
=======

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
>>>>>>> Stashed changes
        db.commit()

     # 8- return data to frontend.
        return FullAdviceData(fullDebtsUiData=debts_ui_data)
    
    except Exception as e:
        db.rollback()
        print("ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )