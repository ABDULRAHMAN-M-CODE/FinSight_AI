import uuid
from sqlalchemy import Column, ForeignKey, TIMESTAMP, text, Index, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class DebtsAdvices(Base):
    __tablename__ = "debts_advices"

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

    debts_advice = Column(
        JSONB,
        nullable=False
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("NOW()"),
        nullable=False
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("NOW()"),
        onupdate=text("NOW()")
    )

    # Composite Index
    __table_args__ = (
        Index(
            "idx_debts_advices_user_created",
            "user_id",
            created_at.desc()
        ),
    )

    user = relationship("User", back_populates="debts_advices")
