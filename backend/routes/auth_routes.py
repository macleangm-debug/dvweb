"""
DataVision International - Authentication Routes
Handles user registration, login, profile, SSO, and password management
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import bcrypt
import os
import uuid
import secrets
import asyncio
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

router = APIRouter(tags=["Authentication"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# ==================== MODELS ====================

class AdminLogin(BaseModel):
    email: str
    password: str

class DataVisionUserRegister(BaseModel):
    email: str
    password: str
    name: str

class DataVisionUserProfile(BaseModel):
    country: Optional[str] = None
    industry: Optional[str] = None
    organization: Optional[str] = None
    job_title: Optional[str] = None
    company_size: Optional[str] = None
    phone: Optional[str] = None
    how_heard: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class DataVisionUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    is_admin: bool = False
    country: Optional[str] = None
    industry: Optional[str] = None
    organization: Optional[str] = None
    job_title: Optional[str] = None
    company_size: Optional[str] = None
    phone: Optional[str] = None
    how_heard: Optional[str] = None
    profile_completed: bool = False
    products_accessed: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_login: Optional[str] = None

class UserTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: DataVisionUser

# ==================== HELPERS ====================

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
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_auth_routes(db):
    """Factory function to create auth routes with database dependency"""
    
    @router.post("/auth/register", response_model=UserTokenResponse)
    async def register_user(user_data: DataVisionUserRegister):
        """Register a new DataVision user."""
        existing_user = await db.datavision_users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        existing_admin = await db.admins.find_one({"email": user_data.email})
        if existing_admin:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(user_data.password)
        
        new_user = {
            "id": user_id,
            "email": user_data.email,
            "password": hashed_password,
            "name": user_data.name,
            "is_admin": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.datavision_users.insert_one(new_user)
        
        token = create_access_token({"sub": user_data.email, "id": user_id, "is_admin": False})
        
        return UserTokenResponse(
            access_token=token,
            user=DataVisionUser(
                id=user_id,
                email=user_data.email,
                name=user_data.name,
                is_admin=False
            )
        )

    @router.post("/auth/login", response_model=UserTokenResponse)
    async def login(credentials: AdminLogin):
        """Login for DataVision users and administrators."""
        # Check DataVision users
        user = await db.datavision_users.find_one({"email": credentials.email}, {"_id": 0})
        if user and verify_password(credentials.password, user["password"]):
            token = create_access_token({"sub": user["email"], "id": user["id"], "is_admin": user.get("is_admin", False)})
            return UserTokenResponse(
                access_token=token,
                user=DataVisionUser(
                    id=user["id"],
                    email=user["email"],
                    name=user.get("name", "User"),
                    is_admin=user.get("is_admin", False),
                    country=user.get("country"),
                    industry=user.get("industry"),
                    organization=user.get("organization"),
                    profile_completed=user.get("profile_completed", False),
                    products_accessed=user.get("products_accessed", [])
                )
            )
        
        # Check admins collection
        admin = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
        if admin and verify_password(credentials.password, admin["password"]):
            token = create_access_token({"sub": admin["email"], "id": admin["id"], "is_admin": True})
            return UserTokenResponse(
                access_token=token,
                user=DataVisionUser(
                    id=admin["id"],
                    email=admin["email"],
                    name=admin.get("name", "Administrator"),
                    is_admin=True
                )
            )
        
        raise HTTPException(status_code=401, detail="Invalid credentials")

    @router.put("/auth/profile")
    async def update_user_profile(profile: DataVisionUserProfile, payload: dict = Depends(verify_token)):
        """Update user profile with additional details."""
        user_email = payload.get("sub")
        
        update_data = {k: v for k, v in profile.dict().items() if v is not None}
        update_data["profile_completed"] = True
        
        result = await db.datavision_users.update_one(
            {"email": user_email},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            await db.admins.update_one(
                {"email": user_email},
                {"$set": update_data}
            )
        
        user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0, "password": 0})
        if not user:
            user = await db.admins.find_one({"email": user_email}, {"_id": 0, "password": 0})
        
        if user:
            return DataVisionUser(**user)
        
        raise HTTPException(status_code=404, detail="User not found")

    @router.get("/auth/me")
    async def get_current_user(payload: dict = Depends(verify_token)):
        user = await db.datavision_users.find_one({"email": payload["sub"]}, {"_id": 0, "password": 0})
        if user:
            return DataVisionUser(
                id=user["id"],
                email=user["email"],
                name=user.get("name", "User"),
                is_admin=user.get("is_admin", False),
                country=user.get("country"),
                industry=user.get("industry"),
                organization=user.get("organization"),
                job_title=user.get("job_title"),
                company_size=user.get("company_size"),
                phone=user.get("phone"),
                how_heard=user.get("how_heard"),
                profile_completed=user.get("profile_completed", False),
                products_accessed=user.get("products_accessed", []),
                last_login=user.get("last_login")
            )
        
        admin = await db.admins.find_one({"email": payload["sub"]}, {"_id": 0, "password": 0})
        if admin:
            return DataVisionUser(
                id=admin["id"],
                email=admin["email"],
                name=admin.get("name", "Administrator"),
                is_admin=True
            )
        
        raise HTTPException(status_code=404, detail="User not found")

    @router.post("/auth/sso/fieldforce")
    async def datavision_to_fieldforce_sso(authorization: str = Header(None)):
        """SSO to FieldForce - creates user if doesn't exist."""
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        token = authorization.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_email = payload.get("sub")
            
            if not user_email:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            # Track product access
            await db.datavision_users.update_one(
                {"email": user_email},
                {
                    "$addToSet": {"products_accessed": "fieldforce"},
                    "$set": {"last_login": datetime.now(timezone.utc).isoformat()}
                }
            )
            
            # Check/create FieldForce user
            ff_user = await db.users.find_one({"email": user_email}, {"_id": 0})
            
            if not ff_user:
                dv_user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0})
                if not dv_user:
                    dv_user = await db.admins.find_one({"email": user_email}, {"_id": 0})
                user_name = dv_user.get("name", user_email.split("@")[0]) if dv_user else user_email.split("@")[0]
                
                new_user_id = str(uuid.uuid4())
                org_id = str(uuid.uuid4())
                
                await db.organizations.insert_one({
                    "id": org_id,
                    "name": f"{user_name}'s Organization",
                    "slug": f"{user_email.split('@')[0]}-org",
                    "owner_id": new_user_id,
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
                
                ff_user = {
                    "id": new_user_id,
                    "email": user_email,
                    "name": user_name,
                    "organization_id": org_id,
                    "role": "admin",
                    "sso_provider": "datavision",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.users.insert_one(ff_user)
            
            ff_token = jwt.encode(
                {
                    "user_id": ff_user["id"],
                    "exp": datetime.now(timezone.utc).timestamp() + 86400,
                    "product": "fieldforce",
                    "sso": True
                },
                SECRET_KEY,
                algorithm="HS256"
            )
            
            return {
                "user": {
                    "id": ff_user["id"],
                    "email": ff_user["email"],
                    "name": ff_user["name"],
                    "organization_id": ff_user.get("organization_id")
                },
                "access_token": ff_token,
                "sso": True,
                "provider": "datavision"
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

    @router.post("/auth/sso/survey360")
    async def datavision_to_survey360_sso(authorization: str = Header(None)):
        """SSO to Survey360 - creates user if doesn't exist."""
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        token = authorization.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_email = payload.get("sub")
            
            if not user_email:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            # Track product access
            await db.datavision_users.update_one(
                {"email": user_email},
                {
                    "$addToSet": {"products_accessed": "survey360"},
                    "$set": {"last_login": datetime.now(timezone.utc).isoformat()}
                }
            )
            
            # Check/create Survey360 user
            survey360_user = await db.survey360_users.find_one({"email": user_email}, {"_id": 0})
            
            if not survey360_user:
                dv_user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0})
                if not dv_user:
                    dv_user = await db.admins.find_one({"email": user_email}, {"_id": 0})
                user_name = dv_user.get("name", user_email.split("@")[0]) if dv_user else user_email.split("@")[0]
                
                new_user_id = str(uuid.uuid4())
                org_id = str(uuid.uuid4())
                
                await db.survey360_orgs.insert_one({
                    "id": org_id,
                    "name": f"{user_name}'s Organization",
                    "plan": "professional",
                    "owner_id": new_user_id,
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
                
                survey360_user = {
                    "id": new_user_id,
                    "email": user_email,
                    "name": user_name,
                    "org_id": org_id,
                    "sso_provider": "datavision",
                    "sso_linked": True,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.survey360_users.insert_one(survey360_user)
            
            survey360_token = jwt.encode(
                {
                    "user_id": survey360_user["id"],
                    "exp": datetime.now(timezone.utc).timestamp() + 86400,
                    "product": "survey360",
                    "sso": True
                },
                SECRET_KEY,
                algorithm="HS256"
            )
            
            return {
                "user": {
                    "id": survey360_user["id"],
                    "email": survey360_user["email"],
                    "name": survey360_user["name"],
                    "org_id": survey360_user.get("org_id")
                },
                "access_token": survey360_token,
                "sso": True,
                "provider": "datavision"
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

    @router.post("/auth/sso-exchange")
    async def datavision_sso_exchange(authorization: str = Header(None)):
        """Exchange a Survey360 token for DataVision admin access."""
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        token = authorization.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            
            user_email = None
            if "user_id" in payload:
                survey360_user = await db.survey360_users.find_one({"id": payload["user_id"]}, {"_id": 0})
                if survey360_user:
                    user_email = survey360_user.get("email")
            elif "sub" in payload:
                user_email = payload["sub"]
            
            if not user_email:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            admin = await db.admins.find_one({"email": user_email}, {"_id": 0})
            
            if not admin:
                raise HTTPException(
                    status_code=403, 
                    detail="Access denied. Only DataVision administrators can access the admin panel."
                )
            
            dv_token = create_access_token({"sub": admin["email"], "id": admin["id"]})
            
            return {
                "access_token": dv_token,
                "token_type": "bearer",
                "user": {
                    "id": admin["id"],
                    "email": admin["email"],
                    "name": admin.get("name", "Administrator")
                },
                "sso": True
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

    return router
