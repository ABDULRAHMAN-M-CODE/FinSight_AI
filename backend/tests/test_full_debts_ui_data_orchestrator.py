#get enviroment variables.,must always be in the top of the test file
from dotenv import load_dotenv
load_dotenv() 

from app.schemas.questionnaire_schemas import QuestionnaireSubmit
from app.core.finance.successive_value_modeling import (
    full_debts_ui_data_orchestrator,
    FullDebtsUiData,
    
)

def test_the_full_debts_ui_data_orchestrator()->None:
 
    # A- Define input data
    user_data={
    "household_income": [
        {
            "id": 1773001758937,
            "member_name": "Abd",
            "annual_income": 10000,
            "income_source": "Salary"
        },
        {
            "id": 1773001785036,
            "member_name": "Ahmad ",
            "annual_income": 1000000,
            "income_source": "investment"
        }
    ],
    "monthly_budget": 1000,
    "investment_accounts": [
        {
            "id": 1773001758937,
            "name": "Abd",
            "type": "SimpleIRA",
            "current_balance": 100000,
            "is_active": True
        },
        {
            "id": 1773001839270,
            "name": "Ahmad",
            "type": "IRA",
            "current_balance": 8798798,
            "is_active": True
        }
    ],
    "outstanding_debts": [
        {
            "id": 1773001758937,
            "type": "First credit card",
            "balance": 4500,
            "monthly_payment": 1126,
            "interest_rate": 0.25
        },
        {
            "id": 1773003543299,
            "type": "Second credit Card ",
            "balance": 10000,
            "monthly_payment": 1101,
            "interest_rate": 0.11
        },
        {
            "id": 1773003554725,
            "type": "Third credit card",
            "balance": 1500,
            "monthly_payment": 77,
            "interest_rate": 0.05
        }
    ],
    "life_insurance": [
        {
            "insurance_type": "Term",
            "death_benefit": 11111,
            "cash_value": 111,
            "monthly_premium": 111
        }
    ],
    "financial_goals": [
        {
            "id": 1773001758937,
            "name": "Build a house",
            "type": "long-term",
            "target_amount": 11111111,
            "deadline": "2030-07-12"
        }
    ]
}

    user_data_pydantic_model=QuestionnaireSubmit(**user_data)
    debts = user_data["outstanding_debts"]
    balances = [d["balance"] for d in debts]
    interest_rates = [d["interest_rate"] for d in debts]
    fixed_monthly_payments = [d["monthly_payment"] for d in debts]

    # B-execute the function

    result=full_debts_ui_data_orchestrator( balances ,interest_rates, fixed_monthly_payments,user_data_pydantic_model)



    #C- Verify phase
    
    # 1. verify the  shape of the data
    assert isinstance(result, FullDebtsUiData)


    # 2. visualize the content of the data 
    print(result.advice.textualAdvice)
    
