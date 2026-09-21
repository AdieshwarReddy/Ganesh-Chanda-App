from sqlalchemy import (
    Column, Integer, String, Boolean, Numeric, DateTime, Text, func
)
from app.database.database import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    year = Column(Integer, nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    target_amount = Column(Numeric(12, 2), default=200000.00)
    upi_id = Column(String(255), nullable=True)
    upi_name = Column(String(255), nullable=True)
    qr_image_url = Column(String(500), nullable=True)
    organizer_name = Column(String(255), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    contact_email = Column(String(255), nullable=True)
    festival_description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
