from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Admin
from schemas import LoginRequest, TokenOut
from auth_utils import verify_password, create_token, hash_password

router = APIRouter()


@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == payload.username).first()
    if not admin or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong credentials")
    return {"access_token": create_token(admin.username)}


@router.post("/seed", include_in_schema=False)
def seed_admin(db: Session = Depends(get_db)):
    """Call once after first deploy to create the admin account."""
    if db.query(Admin).filter(Admin.username == "admin").first():
        return {"message": "Admin already exists"}
    db.add(Admin(username="admin", hashed_password=hash_password("maya2024")))
    db.commit()
    return {"message": "Admin created — username: admin, password: maya2024"}