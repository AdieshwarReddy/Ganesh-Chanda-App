from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr
    profile_picture: Optional[str] = None


class UserCreate(UserBase):
    google_id: str


class UserOut(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class GoogleAuthRequest(BaseModel):
    token: str


class DevLoginRequest(BaseModel):
    email: EmailStr
    name: str = "Admin User"
    role: UserRole = UserRole.ADMIN


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
