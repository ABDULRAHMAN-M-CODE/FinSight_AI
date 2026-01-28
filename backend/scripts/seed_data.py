#!/usr/bin/env python3
"""
Seed script for development/testing.

Usage (from repo root):
  # inside the web container:
  python scripts/seed_data.py

This script:
- Creates a test user (if not exists)
- Inserts user_financial_data, investment_accounts, goals, investment_performance_snapshots, health_score_snapshots
- Prints the created user_id which you can use with /simulations/run

Important: this script reads DATABASE_URL from .env (via app.config.Settings).
"""

import asyncio
import uuid
from datetime import datetime, date
from decimal import Decimal

from app.db import async_session, engine
from app import models

TEST_EMAIL = "test.user@example.com"

async def seed():
    async with async_session() as session:
        # Check if a test user exists (by email)
        existing = None
        from sqlalchemy import select
        res = await session.execute(select(models.User).filter(models.User.email == TEST_EMAIL))
        existing = res.scalar_one_or_none()
        if existing:
            user = existing
            print("Test user already exists:", str(user.id))
        else:
            user = models.User(id=uuid.uuid4(), email=TEST_EMAIL, created_at=datetime.utcnow())
            session.add(user)
            await session.flush()
            print("Created test user:", str(user.id))

        user_id = user.id

        # Upsert user_financial_data
        ufd = await session.get(models.UserFinancialData, user_id)
        if not ufd:
            ufd = models.UserFinancialData(
                user_id=user_id,
                household_income=Decimal("6000.00"),
                income_sources=[{"source": "salary", "amount": 6000}],
                monthly_budget=Decimal("3500.00"),
                investment_accts=[{"account_name": "Brokerage", "current_value": 15000}],
                outstanding_debts=[{"name": "student_loan", "balance": 10000, "monthly_payment": 150, "interest_rate": 0.05}],
                life_insurance={"policy": "basic"}
            )
            session.add(ufd)
            await session.flush()
            print("Inserted user_financial_data")

        # Investment accounts
        acc = models.InvestmentAccount(
            id=uuid.uuid4(),
            user_id=user_id,
            account_name="Brokerage",
            account_type="taxable",
            current_value=Decimal("15000.00"),
            risk_level="medium",
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(acc)

        # Goals
        goal = models.Goal(
            id=uuid.uuid4(),
            user_id=user_id,
            goal_name="Emergency Fund",
            goal_type="short-term",
            target_amount=Decimal("10000.00"),
            current_amount=Decimal("2000.00"),
            deadline=date(2026, 12, 31),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(goal)

        # Investment performance snapshot
        ips = models.InvestmentPerformanceSnapshot(
            id=uuid.uuid4(),
            user_id=user_id,
            snapshot_year=2025,
            snapshot_date=date(2025, 12, 31),
            portfolio_value=Decimal("15000.00"),
            return_percentage=Decimal("0.08"),
            risk_level="medium",
            created_at=datetime.utcnow()
        )
        session.add(ips)

        # Health score
        h = models.HealthScoreSnapshot(
            id=uuid.uuid4(),
            user_id=user_id,
            overall_score=75,
            calculated_at=datetime.utcnow()
        )
        session.add(h)

        await session.commit()
        print("Seeding complete. Use user_id =", str(user_id))

if __name__ == "__main__":
    asyncio.run(seed())