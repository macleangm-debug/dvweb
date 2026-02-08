"""
DataVision International - Authentication Routes
Handles login and user authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import bcrypt
import os
from datetime import datetime, timezone, timedelta

from models import AdminLogin, AdminUser, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_routes(db):
    """Factory function to create routes with database dependency"""
    
    @router.post("/login", response_model=TokenResponse)
    async def login(credentials: AdminLogin):
        user = await db.users.find_one({"email": credentials.email})
        if not user or not verify_password(credentials.password, user.get("password_hash", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        admin_user = AdminUser(id=str(user.get("_id", user.get("id", ""))), email=user["email"], name=user.get("name", "Administrator"))
        token = create_access_token({"sub": user["email"], "user_id": str(user.get("_id", user.get("id", "")))})
        return TokenResponse(access_token=token, user=admin_user)

    @router.get("/me", response_model=AdminUser)
    async def get_current_user(payload: dict = Depends(verify_token)):
        user = await db.users.find_one({"email": payload.get("sub")})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return AdminUser(id=str(user.get("_id", user.get("id", ""))), email=user["email"], name=user.get("name", "Administrator"))
    
    return router
