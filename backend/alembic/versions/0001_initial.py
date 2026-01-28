"""initial

Revision ID: 0001_initial
Revises:
Create Date: 2026-01-21 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # users (minimal)
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # goals
    op.create_table(
        'goals',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('goal_name', sa.String(length=255), nullable=False),
        sa.Column('goal_type', sa.String(length=50), nullable=True),
        sa.Column('target_amount', sa.Numeric(), nullable=False),
        sa.Column('current_amount', sa.Numeric(), nullable=False, server_default='0'),
        sa.Column('deadline', sa.Date(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # ai_goal_insights
    op.create_table(
        'ai_goal_insights',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('goal_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('goals.id'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('ai_insight', sa.Text(), nullable=True),
        sa.Column('generated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # health_score_snapshots
    op.create_table(
        'health_score_snapshots',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('overall_score', sa.Integer(), nullable=False),
        sa.Column('calculated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # ai_reassurance_messages
    op.create_table(
        'ai_reassurance_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('message_text', sa.Text(), nullable=True),
        sa.Column('generated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # user_financial_data
    op.create_table(
        'user_financial_data',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), primary_key=True, nullable=False),
        sa.Column('household_income', sa.Numeric(), nullable=True),
        sa.Column('income_sources', postgresql.JSONB(), nullable=True),
        sa.Column('monthly_budget', sa.Numeric(), nullable=True),
        sa.Column('investment_accts', postgresql.JSONB(), nullable=True),
        sa.Column('outstanding_debts', postgresql.JSONB(), nullable=True),
        sa.Column('life_insurance', postgresql.JSONB(), nullable=True)
    )

    # limited_advice
    op.create_table(
        'limited_advice',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('monthly_income', sa.Numeric(), nullable=True),
        sa.Column('monthly_expenses', sa.Numeric(), nullable=True),
        sa.Column('savings_rate', sa.Numeric(), nullable=True),
        sa.Column('savings_cta', sa.Text(), nullable=True),
        sa.Column('recommendations', postgresql.JSONB(), nullable=True),
        sa.Column('projections', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # investment_performance_snapshots
    op.create_table(
        'investment_performance_snapshots',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('snapshot_year', sa.Integer(), nullable=True),
        sa.Column('snapshot_date', sa.Date(), nullable=True),
        sa.Column('portfolio_value', sa.Numeric(), nullable=True),
        sa.Column('return_percentage', sa.Numeric(), nullable=True),
        sa.Column('risk_level', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # investment_accounts
    op.create_table(
        'investment_accounts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('account_name', sa.String(length=255), nullable=True),
        sa.Column('account_type', sa.String(length=50), nullable=True),
        sa.Column('current_value', sa.Numeric(), nullable=True),
        sa.Column('risk_level', sa.String(length=20), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # what_if_simulation
    op.create_table(
        'what_if_simulation',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('scenario_text', sa.Text(), nullable=False),
        sa.Column('scenario_hash', sa.String(length=64), nullable=True),
        sa.Column('baseline_path', postgresql.JSONB(), nullable=True),
        sa.Column('scenario_path', postgresql.JSONB(), nullable=True),
        sa.Column('uncertainty_band', postgresql.JSONB(), nullable=True),
        sa.Column('goal_impacts', postgresql.JSONB(), nullable=True),
        sa.Column('ai_recommendation', sa.Text(), nullable=True),
        sa.Column('confidence_score', sa.Numeric(), nullable=True),
        sa.Column('iteration_count', sa.Integer(), nullable=True),
        sa.Column('simulation_params', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # financial_alerts
    op.create_table(
        'financial_alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('alert_type', sa.String(length=50), nullable=True),
        sa.Column('detected_pattern', postgresql.JSONB(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('severity', sa.String(length=20), nullable=True),
        sa.Column('ai_reasoning', sa.Text(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_dismissed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('triggered_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

    # notification_preferences
    op.create_table(
        'notification_preferences',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), primary_key=True, nullable=False),
        sa.Column('email_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('push_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('alert_frequency', sa.String(length=20), nullable=False, server_default="'immediate'"),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()'), nullable=False)
    )

def downgrade():
    op.drop_table('notification_preferences')
    op.drop_table('financial_alerts')
    op.drop_table('what_if_simulation')
    op.drop_table('investment_accounts')
    op.drop_table('investment_performance_snapshots')
    op.drop_table('limited_advice')
    op.drop_table('user_financial_data')
    op.drop_table('ai_reassurance_messages')
    op.drop_table('health_score_snapshots')
    op.drop_table('ai_goal_insights')
    op.drop_table('goals')
    op.drop_table('users')