import uuid
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class GoalsAndInvestmentsAdvices(Base):
    __tablename__ = "goals_and_investements_advices"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    advice = Column(
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
        onupdate=text("NOW()"),
        nullable=False
    )

    # Relationship
    user = relationship(
        "User",
        back_populates="goals_and_investments_advices"
    )