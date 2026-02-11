"""
DataPulse - Enterprise Data Collection Platform Routes
Handles authentication and basic DataPulse API functionality
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import bcrypt
import os
import uuid
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field
from typing import Optional, List

router = APIRouter(prefix="/datapulse", tags=["DataPulse"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# ==================== MODELS ====================

class DataPulseLogin(BaseModel):
    email: str
    password: str

class DataPulseRegister(BaseModel):
    email: str
    password: str
    name: str
    organization: Optional[str] = None

class DataPulseUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    organization: Optional[str] = None
    role: str = "user"
    products_accessed: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_login: Optional[str] = None

class DataPulseTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: DataPulseUser

# ==================== HELPERS ====================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire, "product": "datapulse"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_datapulse_routes(db):
    """Factory function to create DataPulse routes with database dependency"""
    
    @router.post("/auth/register", response_model=DataPulseTokenResponse)
    async def register_datapulse_user(user_data: DataPulseRegister):
        """Register a new DataPulse user."""
        existing_user = await db.datapulse_users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        new_user = {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "organization": user_data.organization,
            "hashed_password": hash_password(user_data.password),
            "role": "user",
            "products_accessed": ["datapulse"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": datetime.now(timezone.utc).isoformat()
        }
        
        await db.datapulse_users.insert_one(new_user)
        
        # Also add to DataVision users for SSO
        dv_user = {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "organization": user_data.organization,
            "hashed_password": new_user["hashed_password"],
            "products_accessed": ["datapulse"],
            "created_at": new_user["created_at"]
        }
        existing_dv = await db.datavision_users.find_one({"email": user_data.email})
        if not existing_dv:
            await db.datavision_users.insert_one(dv_user)
        else:
            await db.datavision_users.update_one(
                {"email": user_data.email},
                {"$addToSet": {"products_accessed": "datapulse"}}
            )
        
        token = create_access_token({
            "sub": user_id,
            "email": user_data.email,
            "name": user_data.name
        })
        
        return DataPulseTokenResponse(
            access_token=token,
            user=DataPulseUser(
                id=user_id,
                email=user_data.email,
                name=user_data.name,
                organization=user_data.organization,
                products_accessed=["datapulse"]
            )
        )
    
    @router.post("/auth/login", response_model=DataPulseTokenResponse)
    async def login_datapulse_user(login_data: DataPulseLogin):
        """Login to DataPulse."""
        user = await db.datapulse_users.find_one({"email": login_data.email})
        if not user:
            # Try DataVision users
            user = await db.datavision_users.find_one({"email": login_data.email})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not verify_password(login_data.password, user.get("hashed_password", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update last login
        await db.datapulse_users.update_one(
            {"email": login_data.email},
            {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
        )
        
        token = create_access_token({
            "sub": user.get("id", str(uuid.uuid4())),
            "email": user["email"],
            "name": user.get("name", "User")
        })
        
        return DataPulseTokenResponse(
            access_token=token,
            user=DataPulseUser(
                id=user.get("id", str(uuid.uuid4())),
                email=user["email"],
                name=user.get("name", "User"),
                organization=user.get("organization"),
                products_accessed=user.get("products_accessed", ["datapulse"])
            )
        )
    
    @router.get("/auth/me")
    async def get_current_datapulse_user(payload: dict = Depends(verify_token)):
        """Get current logged in user."""
        user = await db.datapulse_users.find_one({"email": payload.get("email")})
        if not user:
            user = await db.datavision_users.find_one({"email": payload.get("email")})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user.get("id"),
            "email": user["email"],
            "name": user.get("name", "User"),
            "organization": user.get("organization"),
            "products_accessed": user.get("products_accessed", ["datapulse"])
        }
    
    @router.get("/dashboard/stats")
    async def get_dashboard_stats(payload: dict = Depends(verify_token)):
        """Get DataPulse dashboard statistics."""
        # Mock stats for now - can be extended
        return {
            "total_projects": 12,
            "active_forms": 45,
            "total_submissions": 15420,
            "team_members": 28,
            "quality_score": 94.5,
            "recent_activity": [
                {"user": "John Doe", "action": "Created form", "form": "Household Survey", "time": "2 hours ago"},
                {"user": "Jane Smith", "action": "Submitted response", "form": "Health Assessment", "time": "3 hours ago"},
                {"user": "Bob Wilson", "action": "Exported data", "form": "Agricultural Survey", "time": "5 hours ago"}
            ]
        }
    
    return router
