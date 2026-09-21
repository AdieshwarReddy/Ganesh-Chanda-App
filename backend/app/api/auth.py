from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.user import GoogleAuthRequest, AuthResponse, UserOut, DevLoginRequest
from app.services.auth_service import verify_google_token, get_or_create_user
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/google", response_model=AuthResponse)
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Exchange Google ID token for our JWT"""
    google_data = await verify_google_token(payload.token)
    if not google_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    email = google_data.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not available from Google",
        )

    user = get_or_create_user(db, google_data)
    access_token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        access_token=access_token,
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


@router.post("/dev-login", response_model=AuthResponse)
def dev_login(payload: DevLoginRequest, db: Session = Depends(get_db)):
    """Development / Demo login bypass (bypasses Google OAuth for testing)"""
    email = payload.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=payload.name,
            email=email,
            google_id=f"dev_{email}",
            role=payload.role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if payload.role and user.role != payload.role:
            user.role = payload.role
            db.commit()
            db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    return AuthResponse(
        access_token=access_token,
        user=UserOut.model_validate(user),
    )


@router.post("/logout")
def logout():
    """Logout — client should discard the JWT"""
    return {"message": "Logged out successfully"}
