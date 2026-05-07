# GOALS SERVICE SCHEMAS

from typing import List

from pydantic import BaseModel, Field

class GoalAdviceItemSchema(BaseModel):

    goal_id: int

    goal_name: str

    is_possible: bool

    priority: str

    required_monthly_saving: float = Field(gt=0)

    months_remaining: int = Field(gt=0)

    ai_summary: str

    simple_plan: List[str]


class GoalAdviceResponseSchema(BaseModel):

    goals: List[GoalAdviceItemSchema]

