from sqlalchemy import Column, ForeignKey, DECIMAL, Text, Integer    
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class LimitedAdvice(Base):
    __tablename__ = "limited_advice"
    
    id = Column(
            UUID(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4
        )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    monthly_income = Column(DECIMAL(12, 2), nullable=False)
    monthly_expenses = Column(DECIMAL(12, 2), nullable=False)

    # backend computed
    savings_rate = Column(DECIMAL(5, 2), nullable=False)

    # AI computed
    savings_cta = Column(Text, nullable=True)
    recommendations = Column(JSONB, nullable=True)

    # backend computed
    projections = Column(JSONB, nullable=True)

    user = relationship("User", back_populates="limited_advice")
