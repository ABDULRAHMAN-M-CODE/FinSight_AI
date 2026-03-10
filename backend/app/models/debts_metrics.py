import uuid
from sqlalchemy import Column, ForeignKey, TIMESTAMP, text, Index, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class DebtMetrics(Base):
    __tablename__ = "debt_metrics"

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

    metrics = Column(
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

    __table_args__ = (
        Index(
            "idx_debt_metrics_user_created",
            "user_id",
            created_at.desc()
        ),
    )

    user = relationship("User", back_populates="debt_metrics")