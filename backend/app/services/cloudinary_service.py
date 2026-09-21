import cloudinary
import cloudinary.uploader
from app.core.config import settings


def configure_cloudinary():
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def upload_screenshot(file_bytes: bytes, filename: str) -> str:
    """Upload payment screenshot to Cloudinary and return URL"""
    configure_cloudinary()
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="ganesh_chanda/screenshots",
        public_id=f"screenshot_{filename}",
        resource_type="image",
    )
    return result.get("secure_url", "")
