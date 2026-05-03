from sqlalchemy import Column, ForeignKey, DECIMAL, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class UserFinancialData(Base):
    __tablename__ = "user_financial_data"
    
    id = Column(
            UUID(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4
        )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
        index= True
    )
    
    household_income = Column(DECIMAL(12, 2), nullable=False)
    income_sources = Column(JSONB, nullable=False)
    monthly_budget = Column(DECIMAL(12, 2), nullable=False)
    #problem : total_investement_amount must be added, portfolio construction and rebalancing service depends on it .
    outstanding_debts = Column(JSONB, nullable=True)
    user = relationship("User", back_populates="financial_data")
