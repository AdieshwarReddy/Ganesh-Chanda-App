import io
import csv
from typing import Optional, List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, func, cast, Date

from app.database.database import get_db
from app.schemas.donation import DonationAdminOut, DonationUpdate, AdminStats
from app.models.donation import Donation, PaymentStatus, PaymentMethod
from app.models.user import User
from app.core.dependencies import require_admin
from app.services.donation_service import get_admin_stats

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=AdminStats)
def admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return get_admin_stats(db)


@router.get("/donations", response_model=List[DonationAdminOut])
def list_donations(
    skip: int = 0,
    limit: int = 50,
    status: Optional[PaymentStatus] = None,
    method: Optional[PaymentMethod] = None,
    search: Optional[str] = None,
    sort: str = "newest",
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """List all donations with search, filter, sort (admin only)"""
    query = db.query(Donation)

    if status:
        query = query.filter(Donation.payment_status == status)
    if method:
        query = query.filter(Donation.payment_method == method)
    if min_amount is not None:
        query = query.filter(Donation.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Donation.amount <= max_amount)
    if search:
        like = f"%{search}%"
        query = query.filter(
            Donation.donor_name.ilike(like)
            | Donation.phone.ilike(like)
            | Donation.transaction_id.ilike(like)
            | Donation.email.ilike(like)
        )

    sort_map = {
        "newest": desc(Donation.created_at),
        "oldest": asc(Donation.created_at),
        "highest": desc(Donation.amount),
        "lowest": asc(Donation.amount),
    }
    query = query.order_by(sort_map.get(sort, desc(Donation.created_at)))

    return query.offset(skip).limit(limit).all()


@router.get("/donations/{donation_id}", response_model=DonationAdminOut)
def get_donation_detail(
    donation_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation


@router.patch("/donations/{donation_id}/verify", response_model=DonationAdminOut)
def verify_donation(
    donation_id: int,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    donation.payment_status = PaymentStatus.VERIFIED
    if notes:
        donation.admin_notes = notes
    db.commit()
    db.refresh(donation)
    return donation


@router.patch("/donations/{donation_id}/reject", response_model=DonationAdminOut)
def reject_donation(
    donation_id: int,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    donation.payment_status = PaymentStatus.REJECTED
    if notes:
        donation.admin_notes = notes
    db.commit()
    db.refresh(donation)
    return donation


@router.patch("/donations/{donation_id}", response_model=DonationAdminOut)
def update_donation(
    donation_id: int,
    payload: DonationUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(donation, field, value)
    db.commit()
    db.refresh(donation)
    return donation


@router.delete("/donations/{donation_id}")
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    db.delete(donation)
    db.commit()
    return {"message": "Donation deleted successfully"}


@router.get("/donations/export/csv")
def export_donations_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Export all donations as CSV (admin only)"""
    donations = db.query(Donation).order_by(desc(Donation.created_at)).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Receipt ID", "Donor Name", "Phone", "Email", "Address",
        "Amount (₹)", "Payment Method", "Transaction ID",
        "Payment Status", "Message", "Anonymous", "Date",
    ])

    for d in donations:
        writer.writerow([
            d.receipt_number or d.id,
            d.donor_name,
            d.phone,
            d.email or "",
            d.address or "",
            float(d.amount),
            d.payment_method.value,
            d.transaction_id or "",
            d.payment_status.value,
            d.message or "",
            "Yes" if d.is_anonymous else "No",
            d.created_at.strftime("%Y-%m-%d %H:%M") if d.created_at else "",
        ])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8-sig")),  # utf-8-sig for Excel compatibility
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=ganesh_chanda_donations_{date.today()}.csv"
        },
    )


@router.get("/daily-stats")
def daily_stats(
    days: int = 30,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Get daily collection data for charts"""
    from sqlalchemy import text
    results = db.execute(
        text("""
            SELECT 
                DATE(created_at) as day,
                SUM(amount) as total,
                COUNT(*) as count
            FROM donations
            WHERE payment_status = 'VERIFIED'
              AND created_at >= CURRENT_DATE - INTERVAL ':days days'
            GROUP BY DATE(created_at)
            ORDER BY day
        """).bindparams(days=days)
    ).fetchall()
    return [
        {"date": str(r[0]), "amount": float(r[1]), "count": r[2]}
        for r in results
    ]


@router.get("/payment-method-stats")
def payment_method_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Distribution by payment method"""
    results = (
        db.query(
            Donation.payment_method,
            func.count(Donation.id).label("count"),
            func.sum(Donation.amount).label("total"),
        )
        .group_by(Donation.payment_method)
        .all()
    )
    return [
        {
            "method": r[0].value,
            "count": r[1],
            "total": float(r[2] or 0),
        }
        for r in results
    ]
