import uuid
from sqlalchemy import Integer, DECIMAL, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class PortfoliosPerformanceMetrics(Base):
    __tablename__ = "portfolios_performance_metrics"

    portfolio_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    expected_annual_return = Column(DECIMAL(12, 2), nullable=False)
    annual_volatility = Column(DECIMAL(12, 2), nullable=False)
    sharpe_ratio = Column(DECIMAL(12, 2), nullable=False)

    # Relationships
    user = relationship("User", back_populates="portfolios")

    assets = relationship(
        "Portfolios",
        back_populates="portfolio",
        cascade="all, delete-orphan"
    )