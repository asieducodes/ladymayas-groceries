from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: str
    price: float = Field(..., gt=0)
    emoji: Optional[str] = "🛒"
    image_url: Optional[str] = None
    description: Optional[str] = None
    purchase_type: List[str] = ["retail"]
    in_stock: bool = True
    is_visible: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    emoji: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    purchase_type: Optional[List[str]] = None
    in_stock: Optional[bool] = None
    is_visible: Optional[bool] = None


class ProductOut(ProductCreate):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UploadOut(BaseModel):
    image_url: str
    public_id: str