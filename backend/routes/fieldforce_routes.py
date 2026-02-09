"""FieldForce - API Routes for the FieldForce Mobile Data Collection Product"""
from fastapi import APIRouter, HTTPException, Depends, Header, Request
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone, timedelta
import uuid
import bcrypt
import jwt
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/fieldforce", tags=["FieldForce"])

# JWT settings - Unified with DataVision
JWT_SECRET = os.environ.get("JWT_SECRET", "datavision-secret-key-2024")

# Database connection
_db = None

def get_db():
    global _db
    if _db is None:
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'test_database')
        client = AsyncIOMotorClient(mongo_url)
        _db = client[db_name]
    return _db


# ==================== Models ====================

class FieldForceLoginRequest(BaseModel):
    email: EmailStr
    password: str


class FieldForceRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class FieldForceUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    organization_id: Optional[str] = None
    role: str = "user"
    is_superadmin: bool = False
    locale: str = "en"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_login: Optional[str] = None


class FieldForceOrganization(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    owner_id: str
    logo_url: Optional[str] = None
    settings: dict = {}
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FieldForceProject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    org_id: str
    name: str
    description: Optional[str] = None
    status: str = "active"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    settings: dict = {}
    created_by: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FieldForceForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    org_id: str
    name: str
    description: Optional[str] = None
    version: int = 1
    status: str = "draft"
    fields: List[dict] = []
    settings: dict = {}
    created_by: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FieldForceSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    form_id: str
    project_id: str
    org_id: str
    data: dict = {}
    gps_coordinates: Optional[dict] = None
    device_info: dict = {}
    enumerator_id: str
    status: str = "submitted"
    submitted_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    synced_at: Optional[str] = None


# ==================== Auth Helpers ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_ff_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")


async def get_current_ff_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== Auth Routes ====================

@router.post("/auth/register")
async def ff_register(data: FieldForceRegisterRequest):
    """Register a new FieldForce user"""
    db = get_db()
    
    # Check if email exists
    existing = await db.fieldforce_users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = FieldForceUser(
        email=data.email,
        name=data.name
    )
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hash_password(data.password)
    
    await db.fieldforce_users.insert_one(user_dict)
    
    # Create token
    token = create_ff_access_token({
        "user_id": user.id,
        "email": user.email,
        "name": user.name
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "organization_id": None
        }
    }


@router.post("/auth/login")
async def ff_login(data: FieldForceLoginRequest):
    """Login to FieldForce"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update last login
    await db.fieldforce_users.update_one(
        {"email": data.email},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Create token
    token = create_ff_access_token({
        "user_id": user["id"],
        "email": user["email"],
        "name": user.get("name", "")
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "organization_id": user.get("organization_id"),
            "role": user.get("role", "user")
        }
    }


@router.get("/auth/me")
async def ff_get_current_user(payload: dict = Depends(get_current_ff_user)):
    """Get current user profile"""
    db = get_db()
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/auth/sso-exchange")
async def ff_sso_exchange(authorization: str = Header(None)):
    """Exchange DataVision admin token for FieldForce session (SSO)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    db = get_db()
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        admin_email = payload.get("sub")
        
        if not admin_email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Check if this is a DataVision admin
        admin = await db.admins.find_one({"email": admin_email}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=403, detail="SSO requires DataVision admin access")
        
        # Find or create FieldForce user for this admin
        ff_user = await db.fieldforce_users.find_one({"email": admin_email}, {"_id": 0})
        
        if not ff_user:
            # Create FieldForce user for admin
            ff_user = {
                "id": str(uuid.uuid4()),
                "email": admin_email,
                "name": admin.get("name", "Admin"),
                "role": "admin",
                "is_superadmin": True,
                "sso_linked": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.fieldforce_users.insert_one(ff_user)
        
        # Create FieldForce token
        ff_token = create_ff_access_token({
            "user_id": ff_user["id"],
            "email": ff_user["email"],
            "name": ff_user.get("name", ""),
            "is_superadmin": True,
            "sso": True
        })
        
        return {
            "access_token": ff_token,
            "token_type": "bearer",
            "user": {
                "id": ff_user["id"],
                "email": ff_user["email"],
                "name": ff_user.get("name", ""),
                "organization_id": ff_user.get("organization_id"),
                "role": ff_user.get("role", "admin"),
                "is_superadmin": True
            },
            "sso": True
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== Organization Routes ====================

@router.post("/organizations")
async def ff_create_organization(
    name: str,
    payload: dict = Depends(get_current_ff_user)
):
    """Create a new organization"""
    db = get_db()
    
    # Generate slug
    slug = name.lower().replace(" ", "-")
    
    # Check if slug exists
    existing = await db.fieldforce_orgs.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{str(uuid.uuid4())[:8]}"
    
    org = FieldForceOrganization(
        name=name,
        slug=slug,
        owner_id=payload["user_id"]
    )
    
    await db.fieldforce_orgs.insert_one(org.model_dump())
    
    # Update user's organization
    await db.fieldforce_users.update_one(
        {"id": payload["user_id"]},
        {"$set": {"organization_id": org.id, "role": "admin"}}
    )
    
    return org


@router.get("/organizations")
async def ff_get_organizations(payload: dict = Depends(get_current_ff_user)):
    """Get user's organizations"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        return []
    
    org = await db.fieldforce_orgs.find_one({"id": user["organization_id"]}, {"_id": 0})
    return [org] if org else []


@router.get("/organizations/{org_id}")
async def ff_get_organization(org_id: str, payload: dict = Depends(get_current_ff_user)):
    """Get organization by ID"""
    db = get_db()
    org = await db.fieldforce_orgs.find_one({"id": org_id}, {"_id": 0})
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


# ==================== Project Routes ====================

@router.post("/projects")
async def ff_create_project(
    name: str,
    description: Optional[str] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Create a new project"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        raise HTTPException(status_code=400, detail="User must belong to an organization")
    
    project = FieldForceProject(
        org_id=user["organization_id"],
        name=name,
        description=description,
        created_by=payload["user_id"]
    )
    
    await db.fieldforce_projects.insert_one(project.model_dump())
    return project


@router.get("/projects")
async def ff_get_projects(payload: dict = Depends(get_current_ff_user)):
    """Get all projects for user's organization"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        return []
    
    projects = await db.fieldforce_projects.find(
        {"org_id": user["organization_id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return projects


@router.get("/projects/{project_id}")
async def ff_get_project(project_id: str, payload: dict = Depends(get_current_ff_user)):
    """Get project by ID"""
    db = get_db()
    project = await db.fieldforce_projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ==================== Form Routes ====================

@router.post("/forms")
async def ff_create_form(
    project_id: str,
    name: str,
    description: Optional[str] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Create a new form"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        raise HTTPException(status_code=400, detail="User must belong to an organization")
    
    form = FieldForceForm(
        project_id=project_id,
        org_id=user["organization_id"],
        name=name,
        description=description,
        created_by=payload["user_id"]
    )
    
    await db.fieldforce_forms.insert_one(form.model_dump())
    return form


@router.get("/forms")
async def ff_get_forms(
    project_id: Optional[str] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Get all forms for user's organization"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        return []
    
    query = {"org_id": user["organization_id"]}
    if project_id:
        query["project_id"] = project_id
    
    forms = await db.fieldforce_forms.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return forms


@router.get("/forms/{form_id}")
async def ff_get_form(form_id: str, payload: dict = Depends(get_current_ff_user)):
    """Get form by ID"""
    db = get_db()
    form = await db.fieldforce_forms.find_one({"id": form_id}, {"_id": 0})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


@router.put("/forms/{form_id}")
async def ff_update_form(
    form_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None,
    fields: Optional[List[dict]] = None,
    settings: Optional[dict] = None,
    status: Optional[str] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Update a form"""
    db = get_db()
    
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if name:
        update_data["name"] = name
    if description:
        update_data["description"] = description
    if fields is not None:
        update_data["fields"] = fields
    if settings is not None:
        update_data["settings"] = settings
    if status:
        update_data["status"] = status
    
    result = await db.fieldforce_forms.update_one(
        {"id": form_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    
    return await db.fieldforce_forms.find_one({"id": form_id}, {"_id": 0})


# ==================== Submission Routes ====================

@router.post("/submissions")
async def ff_create_submission(
    form_id: str,
    data: dict,
    gps_coordinates: Optional[dict] = None,
    device_info: Optional[dict] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Create a new submission"""
    db = get_db()
    
    # Get form to get project_id and org_id
    form = await db.fieldforce_forms.find_one({"id": form_id}, {"_id": 0})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    submission = FieldForceSubmission(
        form_id=form_id,
        project_id=form["project_id"],
        org_id=form["org_id"],
        data=data,
        gps_coordinates=gps_coordinates,
        device_info=device_info or {},
        enumerator_id=payload["user_id"]
    )
    
    await db.fieldforce_submissions.insert_one(submission.model_dump())
    return submission


@router.get("/submissions")
async def ff_get_submissions(
    form_id: Optional[str] = None,
    project_id: Optional[str] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Get all submissions for user's organization"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        return []
    
    query = {"org_id": user["organization_id"]}
    if form_id:
        query["form_id"] = form_id
    if project_id:
        query["project_id"] = project_id
    
    submissions = await db.fieldforce_submissions.find(query, {"_id": 0}).sort("submitted_at", -1).to_list(500)
    return submissions


@router.get("/submissions/{submission_id}")
async def ff_get_submission(submission_id: str, payload: dict = Depends(get_current_ff_user)):
    """Get submission by ID"""
    db = get_db()
    submission = await db.fieldforce_submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission


# ==================== Dashboard/Analytics Routes ====================

@router.get("/dashboard/stats")
async def ff_get_dashboard_stats(payload: dict = Depends(get_current_ff_user)):
    """Get dashboard statistics"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        return {
            "projects": 0,
            "forms": 0,
            "submissions": 0,
            "enumerators": 0
        }
    
    org_id = user["organization_id"]
    
    projects_count = await db.fieldforce_projects.count_documents({"org_id": org_id})
    forms_count = await db.fieldforce_forms.count_documents({"org_id": org_id})
    submissions_count = await db.fieldforce_submissions.count_documents({"org_id": org_id})
    
    # Get team members count
    members_count = await db.fieldforce_users.count_documents({"organization_id": org_id})
    
    return {
        "projects": projects_count,
        "forms": forms_count,
        "submissions": submissions_count,
        "enumerators": members_count
    }


@router.get("/dashboard/recent-activity")
async def ff_get_recent_activity(payload: dict = Depends(get_current_ff_user)):
    """Get recent activity"""
    db = get_db()
    
    user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("organization_id"):
        return []
    
    # Get recent submissions
    submissions = await db.fieldforce_submissions.find(
        {"org_id": user["organization_id"]},
        {"_id": 0}
    ).sort("submitted_at", -1).limit(10).to_list(10)
    
    return submissions


@router.get("/dashboard/submission-trends")
async def ff_get_submission_trends(
    org_id: Optional[str] = None,
    days: int = 14,
    payload: dict = Depends(get_current_ff_user)
):
    """Get submission trends over time for dashboard chart"""
    db = get_db()
    
    # Get org_id from user if not provided
    if not org_id:
        user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user or not user.get("organization_id"):
            return []
        org_id = user["organization_id"]
    
    # Calculate date range
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)
    
    # Generate date labels for the period
    trends = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        
        # Count submissions for this date
        day_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        count = await db.fieldforce_submissions.count_documents({
            "org_id": org_id,
            "submitted_at": {
                "$gte": day_start.isoformat(),
                "$lt": day_end.isoformat()
            }
        })
        
        trends.append({
            "date": date_str,
            "label": date.strftime("%b %d"),
            "count": count
        })
    
    return trends


@router.get("/dashboard/quality-metrics")
async def ff_get_quality_metrics(
    org_id: Optional[str] = None,
    payload: dict = Depends(get_current_ff_user)
):
    """Get data quality metrics for dashboard"""
    db = get_db()
    
    # Get org_id from user if not provided
    if not org_id:
        user = await db.fieldforce_users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user or not user.get("organization_id"):
            return {
                "avg_quality_score": 0,
                "approved_count": 0,
                "rejected_count": 0,
                "flagged_count": 0
            }
        org_id = user["organization_id"]
    
    # Get submissions for quality analysis
    submissions = await db.fieldforce_submissions.find(
        {"org_id": org_id},
        {"_id": 0}
    ).to_list(1000)
    
    if not submissions:
        return {
            "avg_quality_score": 0,
            "approved_count": 0,
            "rejected_count": 0,
            "flagged_count": 0
        }
    
    # Calculate quality metrics
    total_submissions = len(submissions)
    
    # Count by status
    approved_count = sum(1 for s in submissions if s.get("status") == "approved")
    rejected_count = sum(1 for s in submissions if s.get("status") == "rejected")
    flagged_count = sum(1 for s in submissions if s.get("status") in ["flagged", "pending_review"])
    
    # Calculate quality scores based on data completeness and GPS
    quality_scores = []
    for s in submissions:
        score = 100
        # Check for data completeness
        if not s.get("data") or len(s.get("data", {})) == 0:
            score -= 30
        # Check for GPS coordinates
        if not s.get("gps_coordinates"):
            score -= 20
        # Check for submission time
        if not s.get("submitted_at"):
            score -= 10
        quality_scores.append(max(0, score))
    
    avg_quality_score = round(sum(quality_scores) / len(quality_scores)) if quality_scores else 0
    
    return {
        "avg_quality_score": avg_quality_score,
        "approved_count": approved_count,
        "rejected_count": rejected_count,
        "flagged_count": flagged_count,
        "total_submissions": total_submissions
    }


# ==================== Health Check ====================

@router.get("/health")
async def ff_health_check():
    """Health check endpoint"""
    db = get_db()
    try:
        await db.command("ping")
        return {"status": "healthy", "service": "FieldForce", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "service": "FieldForce", "database": str(e)}


# ==================== Demo User Creation ====================

async def create_fieldforce_demo_user(db):
    """Create demo user for FieldForce testing"""
    demo_email = "demo@fieldforce.io"
    
    existing = await db.fieldforce_users.find_one({"email": demo_email})
    if not existing:
        demo_user = {
            "id": str(uuid.uuid4()),
            "email": demo_email,
            "name": "FieldForce Demo",
            "hashed_password": hash_password("Test123!"),
            "role": "admin",
            "is_superadmin": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.fieldforce_users.insert_one(demo_user)
        
        # Create demo organization
        demo_org = {
            "id": str(uuid.uuid4()),
            "name": "Demo Organization",
            "slug": "demo-org",
            "owner_id": demo_user["id"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.fieldforce_orgs.insert_one(demo_org)
        
        # Update user with organization
        await db.fieldforce_users.update_one(
            {"id": demo_user["id"]},
            {"$set": {"organization_id": demo_org["id"]}}
        )
        
        print(f"Created FieldForce demo user: {demo_email} / Test123!")
