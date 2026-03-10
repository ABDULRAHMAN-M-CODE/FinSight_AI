from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime
)
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)

    is_first_login = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    financial_data = relationship(
        "UserFinancialData",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )
    debts_advices = relationship(
        "DebtsAdvices",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    debt_metrics = relationship(
    "DebtMetrics",
    back_populates="user",
    cascade="all, delete"
    )
    protection_advices = relationship(
        "ProtectionAdvices",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    goals_and_investments_advices = relationship(
        "GoalsAndInvestmentsAdvices",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    investment_accounts = relationship(
        "InvestmentAccount",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    goals = relationship(
        "Goal",
        back_populates="user",
        cascade="all, delete-orphan"
    )



