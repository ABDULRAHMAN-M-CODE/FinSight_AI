from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from decimal import Decimal
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.registration.user import User
from app.models.user_financial_data import UserFinancialData
from app.models.limited_advice import LimitedAdvice
from app.models.investment_account import InvestmentAccount
from app.models.goal import Goal

from app.schemas.Questionnaire import QuestionnaireSubmit
from app.core.utils.finance_calculations import (
    compute_savings_rate,
    compute_projections,
)
from app.core.utils.json_safe import json_safe   

router = APIRouter(prefix="/onboarding")


@router.post("/questionnaire", status_code=status.HTTP_201_CREATED)
def submit_questionnaire(
    data: QuestionnaireSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_first_login:
        raise HTTPException(
            status_code=400,
            detail="Questionnaire already completed",
        )

    try:
        # Calculate total household income from members
        total_household_income = sum(
            Decimal(str(member.annual_income)) for member in data.household_members
        )
        
        # Aggregate income sources
        income_sources = {}
        for member in data.household_members:
            source = member.income_source
            if source in income_sources:
                income_sources[source] += Decimal(str(member.annual_income))
            else:
                income_sources[source] = Decimal(str(member.annual_income))
        
        # 1. Save UserFinancialData (with JSON fields)
        financial_data = UserFinancialData(
            user_id=current_user.id,
            household_income=total_household_income,
            income_sources=json_safe(income_sources), 
            monthly_budget=data.monthly_budget,
            # Store lists as JSONB
            investment_accounts=json_safe(
                [acc.dict() for acc in data.investment_accounts]
            ),  
            outstanding_debts=json_safe(
                [debt.dict() for debt in data.outstanding_debts]
            ),  
            life_insurance=json_safe(
                [ins.dict() for ins in data.life_insurance]
            ),  
        )
        
        # 2. Save LimitedAdvice
        savings_rate = compute_savings_rate(
            data.monthly_income,
            data.monthly_expenses,
        )
        
        projections = compute_projections(
            data.monthly_income,
            data.monthly_expenses,
        )
        
        limited_advice = LimitedAdvice(
            user_id=current_user.id,
            monthly_income=data.monthly_income,
            monthly_expenses=data.monthly_expenses,
            savings_rate=float(savings_rate),        
            projections=json_safe(projections),      
        )
        
        # 3. Save InvestmentAccounts as separate table rows
        investment_rows = [
            InvestmentAccount(
                user_id=current_user.id,
                account_name=acc.account_name,
                account_type=acc.account_type,
                current_value=acc.current_value,
                is_active=acc.is_active,
            )
            for acc in data.investment_accounts
        ]
        
        # 4. Save Goals
        # Calculate total investments
        total_investments = sum(
            acc.current_value for acc in data.investment_accounts
        ) if data.investment_accounts else Decimal('0')
        
        # NOTE: This logic might need revision - should all goals have same current_amount?
        goal_rows = [
            Goal(
                user_id=current_user.id,
                goal_name=goal.goal_name,
                goal_type=goal.goal_type,
                target_amount=goal.target_amount,
                current_amount=Decimal('0'),  # Start at 0, not total_investments
                deadline=goal.deadline,
            )
            for goal in data.goals
        ]
        
        # 5. Mark onboarding complete
        current_user.is_first_login = False
        
        # 6. Save everything
        db.add(financial_data)
        db.add(limited_advice)
        db.add_all(investment_rows)
        db.add_all(goal_rows)
        db.commit()
        
    except Exception as e:
        db.rollback()
        # Log the actual error for debugging
        print(f"Error submitting questionnaire: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit questionnaire",
        )
    
    return {"message": "Questionnaire submitted successfully"}
