import uuid
from sqlalchemy import Integer, DECIMAL, String, Column, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base  
class Portfolios(Base):
    __tablename__ = "portfolios"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    portfolio_id = Column(
        UUID(as_uuid=True),
        ForeignKey("portfolios_performance_metrics.portfolio_id", ondelete="CASCADE"),
        nullable=False
    )
    asset_name = Column(String, nullable=False)
    capital_allocation_percentage = Column(DECIMAL(5, 2), nullable=False)
    
    __table_args__ = (
        CheckConstraint(
            "capital_allocation_percentage >= 0 AND capital_allocation_percentage <= 100",
            name="check_allocation_percentage"
        ),
    )
    
    # Relationship --> parent (metrics table)
    #asset belong to some portfolio
    portfolio = relationship(
        "PortfoliosPerformanceMetrics",
        back_populates="assets"
    )