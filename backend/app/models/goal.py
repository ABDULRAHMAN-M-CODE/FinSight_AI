import uuid
from sqlalchemy import (
    Column,
    String,
    DECIMAL,
    Date,
    ForeignKey,
    TIMESTAMP,
    Integer,
    func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False
    )

    goal_name = Column(String(255), nullable=False)
    goal_type = Column(String(50), nullable=False)  

    target_amount = Column(DECIMAL(12, 2), nullable=False)

    current_amount = Column(DECIMAL(12, 2), default=0, nullable=False)

    deadline = Column(Date, nullable=True)

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

    user = relationship("User", back_populates="goals")
