from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    ForeignKey, Date, DateTime, Text
)
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
    )

    goal_name = Column(String(255), nullable=False)

    target_amount = Column(Float, nullable=False)

    deadline = Column(Date, nullable=False)

    description = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship(
        "User",
        back_populates="goals"
    )

    analyses = relationship(
        "GoalAnalysis",
        back_populates="goal",
        cascade="all, delete"
    )