import random
import string
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date

from app.models.donation import Donation, PaymentStatus
from app.models.campaign import Campaign
from app.schemas.donation import DonationCreate, AdminStats


def generate_receipt_number() -> str:
    """Generate unique receipt number like GC2026-XXXX"""
    year = datetime.now().year
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"GC{year}-{suffix}"


def create_donation(
    db: Session, donation_data: DonationCreate, user_id: Optional[int] = None
) -> Donation:
    """Create a new donation record"""
    receipt_number = generate_receipt_number()
    # Ensure uniqueness
    while db.query(Donation).filter(Donation.receipt_number == receipt_number).first():
        receipt_number = generate_receipt_number()

    # Get active campaign if no campaign_id provided
    campaign_id = donation_data.campaign_id
    if not campaign_id:
        active_campaign = db.query(Campaign).filter(Campaign.is_active == True).first()
        if active_campaign:
            campaign_id = active_campaign.id

    db_donation = Donation(
        receipt_number=receipt_number,
        campaign_id=campaign_id,
        user_id=user_id,
        donor_name=donation_data.donor_name,
        email=donation_data.email,
        phone=donation_data.phone,
        address=donation_data.address,
        amount=donation_data.amount,
        payment_method=donation_data.payment_method,
        transaction_id=donation_data.transaction_id,
        message=donation_data.message,
        is_anonymous=donation_data.is_anonymous,
    )
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation


def get_admin_stats(db: Session) -> AdminStats:
    """Calculate dashboard statistics"""
    # Total verified collection
    total = (
        db.query(func.sum(Donation.amount))
        .filter(Donation.payment_status == PaymentStatus.VERIFIED)
        .scalar()
        or Decimal("0")
    )

    # Today's verified collection
    today = date.today()
    today_total = (
        db.query(func.sum(Donation.amount))
        .filter(
            Donation.payment_status == PaymentStatus.VERIFIED,
            cast(Donation.created_at, Date) == today,
        )
        .scalar()
        or Decimal("0")
    )

    total_donors = db.query(func.count(Donation.id)).scalar() or 0
    pending = (
        db.query(func.count(Donation.id))
        .filter(Donation.payment_status == PaymentStatus.PENDING)
        .scalar()
        or 0
    )
    verified = (
        db.query(func.count(Donation.id))
        .filter(Donation.payment_status == PaymentStatus.VERIFIED)
        .scalar()
        or 0
    )
    rejected = (
        db.query(func.count(Donation.id))
        .filter(Donation.payment_status == PaymentStatus.REJECTED)
        .scalar()
        or 0
    )

    # Get target from active campaign
    campaign = db.query(Campaign).filter(Campaign.is_active == True).first()
    target = Decimal(str(campaign.target_amount)) if campaign else Decimal("200000")

    percentage = float((total / target * 100)) if target > 0 else 0.0

    return AdminStats(
        total_collection=total,
        today_collection=today_total,
        total_donors=total_donors,
        pending_count=pending,
        verified_count=verified,
        rejected_count=rejected,
        target_amount=target,
        percentage_completed=round(percentage, 2),
    )
