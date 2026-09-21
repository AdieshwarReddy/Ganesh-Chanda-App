import enum
from sqlalchemy import (
    Column, Integer, String, Boolean, Numeric, DateTime, Text,
    Enum, ForeignKey, func
)
from app.database.database import Base


class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class PaymentMethod(str, enum.Enum):
    UPI = "UPI"
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"
    OTHER = "OTHER"


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    receipt_number = Column(String(50), unique=True, index=True, nullable=True)

    # Campaign relationship
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)

    # Donor info (nullable for non-logged-in donors)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    donor_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=False)
    address = Column(String(500), nullable=True)

    # Donation details
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    transaction_id = Column(String(255), nullable=True)
    payment_status = Column(
        Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False
    )
    payment_screenshot_url = Column(String(500), nullable=True)
    message = Column(Text, nullable=True)
    is_anonymous = Column(Boolean, default=False)

    # Admin notes
    admin_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
