from typing import Optional
import httpx
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.core.config import settings


async def verify_google_token(token: str) -> Optional[dict]:
    """Verify Google ID token and return user info"""
    async with httpx.AsyncClient() as client:
        # First try Google tokeninfo endpoint
        resp = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        )
        if resp.status_code == 200:
            data = resp.json()
            # Verify audience matches our client ID
            if settings.GOOGLE_CLIENT_ID and data.get("aud") != settings.GOOGLE_CLIENT_ID:
                # In development, skip audience check if no client ID configured
                if settings.APP_ENV != "development":
                    return None
            return data
        return None


def get_or_create_user(db: Session, google_data: dict) -> User:
    """Get existing user or create new one from Google data"""
    email = google_data.get("email", "").lower()
    google_id = google_data.get("sub")
    name = google_data.get("name", email.split("@")[0])
    picture = google_data.get("picture")

    # Check if user exists by google_id or email
    user = db.query(User).filter(
        (User.google_id == google_id) | (User.email == email)
    ).first()

    if user:
        # Update fields if needed
        if not user.google_id:
            user.google_id = google_id
        if picture and not user.profile_picture:
            user.profile_picture = picture
        db.commit()
        db.refresh(user)
    else:
        # Determine role based on admin email list
        role = UserRole.ADMIN if email in settings.get_admin_emails() else UserRole.USER
        user = User(
            name=name,
            email=email,
            google_id=google_id,
            profile_picture=picture,
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Promote to admin if in admin list (for existing users)
    if email in settings.get_admin_emails() and user.role != UserRole.ADMIN:
        user.role = UserRole.ADMIN
        db.commit()
        db.refresh(user)

    return user
