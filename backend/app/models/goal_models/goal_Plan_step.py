from sqlalchemy import (
    Column, Integer,
    ForeignKey,Text
)
from sqlalchemy.orm import relationship
from app.database import Base



class GoalPlanStep(Base):
    __tablename__ = "goal_plan_steps"

    id = Column(Integer, primary_key=True)

    analysis_id = Column(
        Integer,
        ForeignKey("goal_analysis.id", ondelete="CASCADE")
    )

    step_order = Column(Integer)

    step_text = Column(Text)

    analysis = relationship(
        "GoalAnalysis",
        back_populates="steps"
    )