from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Product
from schemas import ProductCreate, ProductUpdate, ProductOut
from auth_utils import get_current_admin

router = APIRouter()


@router.get("/", response_model=List[ProductOut])
def list_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    purchase_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Product).filter(Product.is_visible == True)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    if category and category != "All":
        q = q.filter(Product.category == category)
    if purchase_type and purchase_type != "All":
        q = q.filter(Product.purchase_type.any(purchase_type))
    return q.order_by(Product.name).all()


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    rows = db.query(Product.category).filter(Product.is_visible == True).distinct().all()
    return sorted([r[0] for r in rows])


@router.get("/admin/all", response_model=List[ProductOut])
def admin_list(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Product).order_by(Product.created_at.desc()).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id, Product.is_visible == True).first()
    if not p:
        raise HTTPException(404, "Product not found")
    return p


@router.post("/", response_model=ProductOut, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    p = Product(**payload.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return p


@router.patch("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(p, field, value)
    db.commit(); db.refresh(p)
    return p


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    db.delete(p); db.commit()


@router.patch("/{product_id}/toggle-stock", response_model=ProductOut)
def toggle_stock(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    p.in_stock = not p.in_stock
    db.commit(); db.refresh(p)
    return p


@router.patch("/{product_id}/toggle-visibility", response_model=ProductOut)
def toggle_visibility(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    p.is_visible = not p.is_visible
    db.commit(); db.refresh(p)
    return p