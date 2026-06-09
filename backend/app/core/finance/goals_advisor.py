import json
from datetime import date, datetime

# =========================================================
# DB MODELS (Aliased to avoid conflicts)
# =========================================================

from app.models.goal_models.goals import Goal as DBGoal
from app.models.goal_models.goal_analysis import GoalAnalysis
from app.models.goal_models.goal_Plan_step import GoalPlanStep

# =========================================================
# LLM + SCHEMAS
# =========================================================

from app.core.utils.llm_utils import call_llm

from app.schemas.questionnaire_schemas import Goal as GoalInput

from app.schemas.goals_schemas import (
    GoalAdviceItemSchema,
    GoalAdviceResponseSchema
)

# =========================================================
# HELPERS
# =========================================================

def calculate_months_remaining(deadline: date) -> int:
    today = date.today()

    months = (
        (deadline.year - today.year) * 12
        + deadline.month
        - today.month
    )

    if deadline.day < today.day:
        months -= 1

    return max(months, 1)


def calculate_required_monthly_saving(
    target_amount: float,
    months_remaining: int
) -> float:
    return round(target_amount / months_remaining, 2)


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """
You are a professional financial advisor AI.

Rules:
1. Return ONLY structured data.
2. Be conservative and realistic.
3. Prioritize emergency and essential goals.
4. If required monthly saving exceeds disposable income,
   mark goal as impossible.
5. Priorities allowed: high, medium, low
6. Advice must be beginner friendly.
7. Keep recommendations short and actionable.
8. Never return negative values.
9. Never invent goals.
10. Return ALL goals provided.
11. simple_plan must contain 3–5 steps.
"""


# =========================================================
# MAIN FUNCTION
# =========================================================

def generate_goals_advice(
    user_id: int,
    monthly_income: float,
    monthly_expenses: float,
    monthly_debt_payments: float,
    investments_total: float,
    goals_input: list[GoalInput]
):

    # -----------------------------------------------------
    # DISPOSABLE INCOME
    # -----------------------------------------------------

    disposable_income = max(
        monthly_income - monthly_expenses - monthly_debt_payments,
        0
    )

    # -----------------------------------------------------
    # PREPARE GOALS FOR LLM
    # -----------------------------------------------------

    goals_payload = []

    for goal in goals_input:

        parsed_deadline = datetime.strptime(
            goal.deadline,
            "%Y-%m-%d"
        ).date()

        months_remaining = calculate_months_remaining(parsed_deadline)

        required_monthly_saving = calculate_required_monthly_saving(
            goal.target_amount,
            months_remaining
        )

        goals_payload.append({
            "goal_id": goal.id,
            "goal_name": goal.goal_name,
            "target_amount": goal.target_amount,
            "deadline": goal.deadline,
            "description": goal.description,
            "months_remaining": months_remaining,
            "required_monthly_saving": required_monthly_saving
        })

    # -----------------------------------------------------
    # LLM CONTEXT
    # -----------------------------------------------------

    llm_context = {
        "financial_profile": {
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "monthly_debt_payments": monthly_debt_payments,
            "investments_total": investments_total,
            "disposable_income": disposable_income
        },
        "goals": goals_payload
    }

    prompt = """
Analyze the user's financial goals.

Return for each goal:
- is_possible
- priority (high/medium/low)
- ai_summary
- simple_plan (3–5 steps)

If disposable income is insufficient → mark impossible.

Return ALL goals.
"""

    # -----------------------------------------------------
    # CALL LLM
    # -----------------------------------------------------

    llm_response = call_llm(
        model="gpt-5.5",
        user_context=json.dumps(llm_context),
        system_prompt=SYSTEM_PROMPT,
        response_format=GoalAdviceResponseSchema,
        role="user",
        prompt=prompt
    )

    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if not llm_response.goalsAdvice:
        raise Exception("LLM returned empty goals")

    validated_goals = []

    valid_goal_ids = {g.id for g in goals_input}

    for advice in llm_response.goalsAdvice:

        # ensure correct goal
        if int(advice.goal_id) not in valid_goal_ids:
            continue

        if advice.priority not in ["high", "medium", "low"]:
            advice.priority = "low"

        if advice.required_monthly_saving <= 0:
            continue

        if advice.months_remaining <= 0:
            continue

        if not advice.simple_plan:
            advice.simple_plan = [
                "Review your financial situation monthly"
            ]

        validated_goals.append(advice)

    if not validated_goals:
        raise Exception("All LLM responses failed validation")

    return validated_goals



def save_goals_and_advice(
    db,
    user_id: int,
    goals_input: list[GoalInput],
    validated_goals: list[GoalAdviceItemSchema]
):

    db_goals_map = {}

    for goal in goals_input:

        parsed_deadline = datetime.strptime(
            goal.deadline,
            "%Y-%m-%d"
        ).date()

        db_goal = DBGoal(
            user_id=user_id,
            goal_name=goal.goal_name,
            target_amount=goal.target_amount,
            deadline=parsed_deadline,
            description=goal.description
        )

        db.add(db_goal)
        db.flush()

        db_goals_map[goal.id] = db_goal.id

    for advice in validated_goals:

        real_goal_id = db_goals_map.get(int(advice.goal_id))

        if not real_goal_id:
            continue

        analysis = GoalAnalysis(
            goal_id=real_goal_id,
            is_possible=advice.is_possible,
            priority=advice.priority,
            required_monthly_saving=advice.required_monthly_saving,
            months_remaining=advice.months_remaining,
            ai_summary=advice.ai_summary
        )

        db.add(analysis)
        db.flush()

        # -------------------------------------------------
        # SAVE PLAN STEPS
        # -------------------------------------------------

        for index, step in enumerate(advice.simple_plan):

            db_step = GoalPlanStep(
                analysis_id=analysis.id,
                step_order=index + 1,
                step_text=step
            )

            db.add(db_step)