import io
import csv
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.database.database import get_db
from app.schemas.donation import (
    DonationCreate, DonationOut, DonationPublic, DonationUpdate
)
from app.models.donation import Donation, PaymentStatus, PaymentMethod
from app.models.user import User
from app.core.dependencies import get_current_user, get_current_user_optional
from app.services.donation_service import create_donation
from app.services.cloudinary_service import upload_screenshot

router = APIRouter(prefix="/donations", tags=["Donations"])


@router.post("", response_model=DonationOut, status_code=status.HTTP_201_CREATED)
async def submit_donation(
    payload: DonationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Submit a donation — no login required"""
    user_id = current_user.id if current_user else None
    donation = create_donation(db, payload, user_id=user_id)
    return donation


@router.get("/public", response_model=List[DonationPublic])
def get_public_donations(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Public donor list — safe fields only, no private info"""
    donations = (
        db.query(Donation)
        .filter(Donation.payment_status == PaymentStatus.VERIFIED)
        .order_by(desc(Donation.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    # Mask anonymous donors
    result = []
    for d in donations:
        public = DonationPublic.model_validate(d)
        if d.is_anonymous:
            public.donor_name = "Anonymous"
        result.append(public)
    return result


@router.get("/my", response_model=List[DonationOut])
def get_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get donations for the currently logged-in user"""
    donations = (
        db.query(Donation)
        .filter(Donation.user_id == current_user.id)
        .order_by(desc(Donation.created_at))
        .all()
    )
    return donations


@router.get("/{donation_id}", response_model=DonationOut)
def get_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single donation — owner or admin"""
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.user_id != current_user.id and current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Access denied")
    return donation


@router.post("/upload-screenshot")
async def upload_payment_screenshot(file: UploadFile = File(...)):
    """Upload payment screenshot to Cloudinary"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, detail="Only image files are allowed"
        )
    # Limit to 5MB
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    try:
        url = upload_screenshot(contents, file.filename or "screenshot")
        return {"url": url}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload screenshot: {str(e)}",
        )
