from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import datetime
from decimal import Decimal


class CampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    year: int
    target_amount: Optional[Decimal] = Decimal("200000.00")
    upi_id: Optional[str] = None
    upi_name: Optional[str] = None
    qr_image_url: Optional[str] = None
    organizer_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    festival_description: Optional[str] = None
    is_active: bool = True


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None
    target_amount: Optional[Decimal] = None
    upi_id: Optional[str] = None
    upi_name: Optional[str] = None
    qr_image_url: Optional[str] = None
    organizer_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    festival_description: Optional[str] = None
    is_active: Optional[bool] = None


class CampaignOut(CampaignBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
