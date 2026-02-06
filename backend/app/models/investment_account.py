import uuid
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DECIMAL,
    ForeignKey,
    TIMESTAMP,
    Integer,
    func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class InvestmentAccount(Base):
    __tablename__ = "investment_accounts"

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

    account_name = Column(String(255), nullable=False)
    account_type = Column(String(50), nullable=False)
    current_value = Column(DECIMAL(12, 2), nullable=False)

    # AI computed (can be NULL at first)
    risk_level = Column(String(20), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    user = relationship("User", back_populates="investment_accounts")
