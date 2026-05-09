from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    ForeignKey, Date, DateTime, Text
)
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class GoalAnalysis(Base):
    __tablename__ = "goal_analysis"

    id = Column(Integer, primary_key=True, index=True)

    goal_id = Column(Integer, ForeignKey("goals.id"))

    is_possible = Column(Boolean, nullable=False)

    priority = Column(String(20))  # high / medium / low

    required_monthly_saving = Column(Float)

    months_remaining = Column(Integer)

    ai_summary = Column(Text)

    generated_at = Column(DateTime, default=datetime.utcnow)

    # relationship
    goal = relationship(
        "Goal",
        back_populates="analyses"
    )

    steps = relationship(
        "GoalPlanStep",
        back_populates="analysis",
        cascade="all, delete"
    )