from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.donation import PaymentStatus, PaymentMethod
import re


class DonationCreate(BaseModel):
    donor_name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    amount: Decimal
    payment_method: PaymentMethod
    transaction_id: Optional[str] = None
    message: Optional[str] = None
    is_anonymous: bool = False
    campaign_id: Optional[int] = None

    @validator("amount")
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Amount must be greater than 0")
        return v

    @validator("phone")
    def phone_must_be_valid(cls, v):
        cleaned = re.sub(r"[\s\-\+]", "", v)
        if not re.match(r"^\d{10,15}$", cleaned):
            raise ValueError("Please enter a valid phone number (10-15 digits)")
        return v

    @validator("donor_name")
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Donor name cannot be empty")
        return v.strip()

    @validator("transaction_id")
    def transaction_id_required_for_upi(cls, v, values):
        method = values.get("payment_method")
        if method in [PaymentMethod.UPI, PaymentMethod.BANK_TRANSFER]:
            if not v or not v.strip():
                raise ValueError(
                    "Transaction ID is required for UPI and Bank Transfer payments"
                )
        return v


class DonationUpdate(BaseModel):
    payment_status: Optional[PaymentStatus] = None
    admin_notes: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_screenshot_url: Optional[str] = None


class DonationPublic(BaseModel):
    """Safe fields for public listing — no private info"""
    id: int
    donor_name: str
    amount: Decimal
    payment_method: PaymentMethod
    is_anonymous: bool
    created_at: datetime
    payment_status: PaymentStatus

    class Config:
        from_attributes = True


class DonationOut(BaseModel):
    """Full donation — for owner or admin"""
    id: int
    receipt_number: Optional[str] = None
    campaign_id: Optional[int] = None
    user_id: Optional[int] = None
    donor_name: str
    email: Optional[str] = None
    phone: str
    address: Optional[str] = None
    amount: Decimal
    payment_method: PaymentMethod
    transaction_id: Optional[str] = None
    payment_status: PaymentStatus
    payment_screenshot_url: Optional[str] = None
    message: Optional[str] = None
    is_anonymous: bool
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DonationAdminOut(DonationOut):
    """For admin — all fields"""
    pass


class AdminStats(BaseModel):
    total_collection: Decimal
    today_collection: Decimal
    total_donors: int
    pending_count: int
    verified_count: int
    rejected_count: int
    target_amount: Decimal
    percentage_completed: float
