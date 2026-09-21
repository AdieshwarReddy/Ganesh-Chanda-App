from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database.database import get_db
from app.schemas.campaign import CampaignOut, CampaignCreate, CampaignUpdate
from app.models.campaign import Campaign
from app.core.dependencies import require_admin
from app.models.user import User

router = APIRouter(tags=["Campaigns"])


@router.get("/campaign/current", response_model=Optional[CampaignOut])
def get_current_campaign(db: Session = Depends(get_db)):
    """Get the currently active campaign"""
    campaign = db.query(Campaign).filter(Campaign.is_active == True).first()
    return campaign


@router.get("/campaign/{campaign_id}", response_model=CampaignOut)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.post("/admin/campaign", response_model=CampaignOut)
def create_campaign(
    payload: CampaignCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new campaign (admin only)"""
    campaign = Campaign(**payload.model_dump())
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


@router.put("/admin/campaign/{campaign_id}", response_model=CampaignOut)
def update_campaign(
    campaign_id: int,
    payload: CampaignUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update campaign settings (admin only)"""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(campaign, field, value)

    db.commit()
    db.refresh(campaign)
    return campaign
