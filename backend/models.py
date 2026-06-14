from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ARRAY
from sqlalchemy.sql import func
from database import Base


class Product(Base):
    __tablename__ = "products"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(200), nullable=False, index=True)
    category      = Column(String(100), nullable=False)
    price         = Column(Float, nullable=False)
    emoji         = Column(String(10), default="🛒")
    image_url     = Column(String(500), nullable=True)
    description   = Column(Text, nullable=True)
    purchase_type = Column(ARRAY(String), default=["retail"])
    in_stock      = Column(Boolean, default=True)
    is_visible    = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), onupdate=func.now())


class Admin(Base):
    __tablename__ = "admins"

    id              = Column(Integer, primary_key=True, index=True)
    username        = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())