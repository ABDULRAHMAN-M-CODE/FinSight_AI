import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship
import uuid
from datetime import datetime

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = sa.Column(sa.String(255), nullable=True)
    created_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    financial_data = relationship("UserFinancialData", back_populates="user", uselist=False)

class Goal(Base):
    __tablename__ = "goals"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    goal_name = sa.Column(sa.String(255), nullable=False)
    goal_type = sa.Column(sa.String(50), nullable=True)
    target_amount = sa.Column(sa.Numeric(), nullable=False)
    current_amount = sa.Column(sa.Numeric(), nullable=False, default=0)
    deadline = sa.Column(sa.Date(), nullable=True)
    created_at = sa.Column(sa.DateTime(), default=datetime.utcnow)
    updated_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

    user = relationship("User", back_populates="goals")
    insights = relationship("AIGoalInsight", back_populates="goal")

class AIGoalInsight(Base):
    __tablename__ = "ai_goal_insights"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("goals.id"), nullable=False)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    ai_insight = sa.Column(sa.Text(), nullable=True)
    generated_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

    goal = relationship("Goal", back_populates="insights")

class HealthScoreSnapshot(Base):
    __tablename__ = "health_score_snapshots"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    overall_score = sa.Column(sa.Integer(), nullable=False)
    calculated_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class AIReassuranceMessage(Base):
    __tablename__ = "ai_reassurance_messages"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    message_text = sa.Column(sa.Text(), nullable=True)
    generated_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class UserFinancialData(Base):
    __tablename__ = "user_financial_data"
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), primary_key=True)
    household_income = sa.Column(sa.Numeric(), nullable=True)
    income_sources = sa.Column(JSONB(), nullable=True)
    monthly_budget = sa.Column(sa.Numeric(), nullable=True)
    investment_accts = sa.Column(JSONB(), nullable=True)
    outstanding_debts = sa.Column(JSONB(), nullable=True)
    life_insurance = sa.Column(JSONB(), nullable=True)

    user = relationship("User", back_populates="financial_data")

class LimitedAdvice(Base):
    __tablename__ = "limited_advice"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    monthly_income = sa.Column(sa.Numeric(), nullable=True)
    monthly_expenses = sa.Column(sa.Numeric(), nullable=True)
    savings_rate = sa.Column(sa.Numeric(), nullable=True)
    savings_cta = sa.Column(sa.Text(), nullable=True)
    recommendations = sa.Column(JSONB(), nullable=True)
    projections = sa.Column(JSONB(), nullable=True)
    created_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class InvestmentPerformanceSnapshot(Base):
    __tablename__ = "investment_performance_snapshots"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    snapshot_year = sa.Column(sa.Integer(), nullable=True)
    snapshot_date = sa.Column(sa.Date(), nullable=True)
    portfolio_value = sa.Column(sa.Numeric(), nullable=True)
    return_percentage = sa.Column(sa.Numeric(), nullable=True)
    risk_level = sa.Column(sa.String(20), nullable=True)
    created_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class InvestmentAccount(Base):
    __tablename__ = "investment_accounts"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    account_name = sa.Column(sa.String(255), nullable=True)
    account_type = sa.Column(sa.String(50), nullable=True)
    current_value = sa.Column(sa.Numeric(), nullable=True)
    risk_level = sa.Column(sa.String(20), nullable=True)
    is_active = sa.Column(sa.Boolean(), default=True)
    created_at = sa.Column(sa.DateTime(), default=datetime.utcnow)
    updated_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class WhatIfSimulation(Base):
    __tablename__ = "what_if_simulation"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    scenario_text = sa.Column(sa.Text(), nullable=False)
    scenario_hash = sa.Column(sa.String(64), nullable=True)
    baseline_path = sa.Column(JSONB(), nullable=True)
    scenario_path = sa.Column(JSONB(), nullable=True)
    uncertainty_band = sa.Column(JSONB(), nullable=True)
    goal_impacts = sa.Column(JSONB(), nullable=True)
    ai_recommendation = sa.Column(sa.Text(), nullable=True)
    confidence_score = sa.Column(sa.Numeric(), nullable=True)
    iteration_count = sa.Column(sa.Integer(), nullable=True)
    simulation_params = sa.Column(JSONB(), nullable=True)
    created_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class FinancialAlert(Base):
    __tablename__ = "financial_alerts"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False)
    alert_type = sa.Column(sa.String(50), nullable=True)
    detected_pattern = sa.Column(JSONB(), nullable=True)
    message = sa.Column(sa.Text(), nullable=True)
    severity = sa.Column(sa.String(20), nullable=True)
    ai_reasoning = sa.Column(sa.Text(), nullable=True)
    is_read = sa.Column(sa.Boolean(), default=False)
    is_dismissed = sa.Column(sa.Boolean(), default=False)
    triggered_at = sa.Column(sa.DateTime(), default=datetime.utcnow)

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), primary_key=True)
    email_enabled = sa.Column(sa.Boolean(), default=True)
    push_enabled = sa.Column(sa.Boolean(), default=True)
    alert_frequency = sa.Column(sa.String(20), default="immediate")
    updated_at = sa.Column(sa.DateTime(), default=datetime.utcnow)