from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.database.database import Base, engine
from app.api import auth, donations, campaigns, admin

# Create tables on startup (use Alembic in production)
import app.models.user  # noqa: F401
import app.models.donation  # noqa: F401
import app.models.campaign  # noqa: F401
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ganesh Chanda API",
    description="Donation management system for Ganesh festival",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(campaigns.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Ganesh Chanda API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# Seed default campaign on first run
@app.on_event("startup")
async def startup_event():
    from app.database.database import SessionLocal
    from app.models.campaign import Campaign

    db = SessionLocal()
    try:
        existing = db.query(Campaign).first()
        if not existing:
            campaign = Campaign(
                title="Ganesh Chanda 2026",
                description="Join us in celebrating Ganesh Utsav 2026! Your contribution helps make our festival grand and joyful.",
                year=2026,
                target_amount=200000.00,
                upi_id="ganeshchanda@upi",
                upi_name="Ganesh Utsav Committee",
                organizer_name="Ganesh Utsav Committee",
                contact_phone="9999999999",
                contact_email="contact@ganeshchanda.com",
                festival_description="Ganesh Chaturthi is one of the most celebrated festivals in India. Your donation helps us organize cultural programs, decorations, prasad distribution, and community events.",
                is_active=True,
            )
            db.add(campaign)
            db.commit()
    finally:
        db.close()
