import os
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from schemas import UploadOut
from auth_utils import get_current_admin

router = APIRouter()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "uploads")
ALLOWED = {"image/jpeg", "image/png", "image/webp"}


@router.post("/image", response_model=UploadOut)
async def upload_image(
    file: UploadFile = File(...),
    _=Depends(get_current_admin),
):
    if file.content_type not in ALLOWED:
        raise HTTPException(400, "Only JPEG, PNG, WebP allowed.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(400, "Max file size is 5MB.")

    result = cloudinary.uploader.upload(
        contents,
        folder=CLOUDINARY_FOLDER,          # ← pulled from .env
        transformation=[
            {"width": 600, "height": 600, "crop": "fill", "gravity": "auto"},
            {"quality": "auto", "fetch_format": "auto"},
        ],
    )

    return {
        "image_url": result["secure_url"],
        "public_id": result["public_id"],
    }