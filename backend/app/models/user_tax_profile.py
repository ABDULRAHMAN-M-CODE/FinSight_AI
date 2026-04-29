from sqlalchemy import (
    Column, Integer, String, DECIMAL, CheckConstraint, 
    DateTime, func, ForeignKey
)
from sqlalchemy.orm import declarative_base

from app.database import Base

class UserTaxProfile(Base):
    __tablename__ = "users_tax_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    filing_status = Column(String(10), nullable=False)

    total_income = Column(DECIMAL(10, 2), nullable=False)
    number_of_children = Column(Integer, default=0)

    taxable_income = Column(DECIMAL(10, 2))
    tax = Column(DECIMAL(10, 2))
    net_income = Column(DECIMAL(10, 2))
    effective_tax_rate = Column(DECIMAL(5, 2))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("filing_status IN ('single', 'married')", name="check_filing_status"),
        CheckConstraint("number_of_children >= 0 AND number_of_children <= 3", name="check_children"),
    )