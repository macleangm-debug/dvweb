from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Header, WebSocket, WebSocketDisconnect, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
import json
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

# Import from refactored modules (for future migration)
# from models import *  # Models are still defined below for now
# from services import calculate_match_score, calculate_verification_score

# Import WebSocket manager for real-time notifications
from websocket_manager import notification_manager, notify_expert_registration, notify_user_signup, notify_job_application, notify_new_lead

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

app = FastAPI(title="DataVision International API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================
# Note: Models are also available in /models/__init__.py for future refactoring

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str = "Administrator"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class DataVisionUserRegister(BaseModel):
    email: str
    password: str
    name: str
    referral_code: Optional[str] = None  # For user referral program

class DataVisionUserProfile(BaseModel):
    country: Optional[str] = None
    industry: Optional[str] = None
    organization: Optional[str] = None
    job_title: Optional[str] = None
    company_size: Optional[str] = None
    phone: Optional[str] = None
    how_heard: Optional[str] = None

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

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUser

class UserTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: DataVisionUser

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    client: str
    sector: str  # agriculture, education, health, wash
    country: str
    year: int
    featured: bool = False
    image_url: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectCreate(BaseModel):
    title: str
    description: str
    client: str
    sector: str
    country: str
    year: int
    featured: bool = False
    image_url: Optional[str] = None

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    bio: str
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TeamMemberCreate(BaseModel):
    name: str
    position: str
    bio: str
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order: int = 0

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quote: str
    author_name: str
    author_title: str
    organization: str
    image_url: Optional[str] = None
    featured: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TestimonialCreate(BaseModel):
    quote: str
    author_name: str
    author_title: str
    organization: str
    image_url: Optional[str] = None
    featured: bool = True

class Statistic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str
    value: int
    suffix: str = ""
    prefix: str = ""
    order: int = 0

class StatisticCreate(BaseModel):
    label: str
    value: int
    suffix: str = ""
    prefix: str = ""
    order: int = 0

class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    published: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NewsArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    published: bool = True

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    subject: str
    message: str
    inquiry_type: str = "general"  # general, partnership, consultation
    status: str = "new"  # new, read, responded
    honeypot: str = ""  # Should always be empty for real submissions
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    subject: str
    message: str
    inquiry_type: str = "general"
    honeypot: str = ""  # Bot trap - should be empty

class Partner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo_url: str
    website_url: Optional[str] = None
    order: int = 0

class PartnerCreate(BaseModel):
    name: str
    logo_url: str
    website_url: Optional[str] = None
    order: int = 0

# ==================== EXPERT NETWORK MODELS ====================

class ExpertSkill(BaseModel):
    name: str
    years_experience: int = 0
    proficiency: str = "intermediate"  # beginner, intermediate, advanced, expert

class ExpertEducation(BaseModel):
    degree: str
    field: str
    institution: str
    year: int

class ExpertRegistration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Personal Information
    full_name: str
    email: EmailStr
    phone: str
    location_country: str
    location_city: str
    nationality: str
    languages: List[str] = []
    
    # Professional Information
    current_title: str
    current_organization: Optional[str] = None
    years_experience: int
    education: List[ExpertEducation] = []
    certifications: List[str] = []
    
    # Expertise Areas (sectors)
    primary_sectors: List[str] = []  # agriculture, health, education, wash, etc.
    secondary_sectors: List[str] = []
    skills: List[ExpertSkill] = []
    
    # Geographic Expertise
    countries_experience: List[str] = []  # Countries they've worked in
    regional_expertise: List[str] = []  # East Africa, West Africa, etc.
    
    # Availability & Preferences
    availability: str = "available"  # available, limited, unavailable
    availability_start_date: Optional[str] = None
    engagement_type: List[str] = []  # short-term, long-term, remote, on-site
    daily_rate_min: Optional[float] = None
    daily_rate_max: Optional[float] = None
    rate_currency: str = "USD"
    willing_to_travel: bool = True
    
    # Portfolio
    cv_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    notable_projects: List[str] = []
    publications: List[str] = []
    
    # References
    references: List[str] = []
    
    # Administrative
    status: str = "pending"  # pending, approved, rejected, active, inactive, engaged
    match_score: float = 0.0  # Calculated matching score for projects
    last_engagement_date: Optional[str] = None
    total_engagements: int = 0
    rating: float = 0.0
    notes: str = ""
    
    # Verification System
    verification_status: str = "unverified"  # unverified, pending_verification, partially_verified, verified, trusted
    verification_score: float = 0.0  # 0-100 composite score
    trust_tier: str = "bronze"  # bronze, silver, gold, platinum
    
    # Verification Components
    skills_assessment_score: float = 0.0  # Score from skills tests
    skills_assessments_completed: List[str] = []  # List of completed assessment IDs
    reference_verification_score: float = 0.0  # Average score from references
    references_verified: int = 0  # Number of verified references
    document_verification_score: float = 0.0  # Score from document analysis
    documents_verified: List[str] = []  # List of verified document types
    linkedin_verified: bool = False
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ExpertRegistrationCreate(BaseModel):
    # Personal Information
    full_name: str
    email: EmailStr
    phone: str
    location_country: str
    location_city: str
    nationality: str
    languages: List[str] = []
    
    # Professional Information
    current_title: str
    current_organization: Optional[str] = None
    years_experience: int
    education: List[ExpertEducation] = []
    certifications: List[str] = []
    
    # Expertise Areas
    primary_sectors: List[str] = []
    secondary_sectors: List[str] = []
    skills: List[ExpertSkill] = []
    
    # Geographic Expertise
    countries_experience: List[str] = []
    regional_expertise: List[str] = []
    
    # Availability & Preferences
    availability: str = "available"
    availability_start_date: Optional[str] = None
    engagement_type: List[str] = []
    daily_rate_min: Optional[float] = None
    daily_rate_max: Optional[float] = None
    rate_currency: str = "USD"
    willing_to_travel: bool = True
    
    # Portfolio
    cv_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    notable_projects: List[str] = []
    publications: List[str] = []
    
    # References
    references: List[str] = []

class ExpertSearchQuery(BaseModel):
    sectors: List[str] = []
    skills: List[str] = []
    min_experience: int = 0
    countries: List[str] = []
    availability: List[str] = []
    engagement_type: List[str] = []
    max_daily_rate: Optional[float] = None
    willing_to_travel: Optional[bool] = None
    status: List[str] = ["approved", "active"]

class ProjectRequirement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    sectors: List[str] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    min_experience: int = 0
    countries: List[str] = []
    start_date: Optional[str] = None
    duration_months: int = 1
    engagement_type: str = "short-term"
    budget_max: Optional[float] = None
    positions_needed: int = 1
    status: str = "open"  # open, filled, cancelled
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectRequirementCreate(BaseModel):
    title: str
    description: str
    sectors: List[str] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    min_experience: int = 0
    countries: List[str] = []
    start_date: Optional[str] = None
    duration_months: int = 1
    engagement_type: str = "short-term"
    budget_max: Optional[float] = None
    positions_needed: int = 1

class ExpertMatch(BaseModel):
    expert_id: str
    expert_name: str
    expert_email: str
    match_score: float
    matching_sectors: List[str]
    matching_skills: List[str]
    years_experience: int
    availability: str
    daily_rate_min: Optional[float]
    daily_rate_max: Optional[float]
    verification_score: float = 0.0
    trust_tier: str = "bronze"

# ==================== VERIFICATION MODELS ====================

class SkillsAssessmentQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sector: str
    skill: str
    question: str
    options: List[str]
    correct_answer: int  # Index of correct option
    difficulty: str = "medium"  # easy, medium, hard
    points: int = 10

class SkillsAssessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sector: str
    title: str
    description: str
    questions: List[SkillsAssessmentQuestion] = []
    time_limit_minutes: int = 30
    passing_score: int = 70
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AssessmentSubmission(BaseModel):
    expert_id: str
    assessment_id: str
    answers: List[int]  # Index of selected answers

class AssessmentResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    assessment_id: str
    sector: str
    score: float
    passed: bool
    answers: List[int]
    correct_answers: int
    total_questions: int
    time_taken_seconds: int = 0
    submitted_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReferenceRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    expert_name: str
    reference_name: str
    reference_email: str
    reference_organization: Optional[str] = None
    status: str = "pending"  # pending, sent, completed, expired
    token: str = Field(default_factory=lambda: str(uuid.uuid4()))  # Unique token for reference to respond
    sent_at: Optional[str] = None
    completed_at: Optional[str] = None
    reminder_count: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReferenceResponse(BaseModel):
    # Verification questions
    knows_expert: bool = True
    relationship: str = ""  # colleague, supervisor, client, etc.
    years_known: int = 0
    
    # Competency ratings (1-5 scale)
    technical_skills: int = 0
    communication: int = 0
    reliability: int = 0
    quality_of_work: int = 0
    professionalism: int = 0
    
    # Verification of claims
    confirms_role: bool = False
    confirms_experience: bool = False
    confirms_skills: List[str] = []  # Skills they can vouch for
    
    # Open feedback
    strengths: str = ""
    areas_for_improvement: str = ""
    would_recommend: bool = True
    recommendation_level: int = 0  # 1-10 scale
    additional_comments: str = ""

class ReferenceSubmission(BaseModel):
    token: str
    response: ReferenceResponse

class DocumentVerification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    document_type: str  # cv, degree, certificate, id
    document_url: str
    status: str = "pending"  # pending, verified, rejected, needs_review
    verification_notes: str = ""
    verified_claims: List[str] = []  # What the document verifies
    score: float = 0.0
    verified_at: Optional[str] = None
    verified_by: Optional[str] = None  # admin email or "system"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VerificationSummary(BaseModel):
    expert_id: str
    expert_name: str
    verification_status: str
    verification_score: float
    trust_tier: str
    components: dict  # Breakdown of scores
    assessments_completed: int
    assessments_passed: int
    references_requested: int
    references_verified: int
    documents_submitted: int
    documents_verified: int

# ==================== AUTH HELPERS ====================

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

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify token and ensure user is an admin"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        # Check if user is admin
        admin = await db.admins.find_one({"email": user_email}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=403, detail="Admin access required")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=UserTokenResponse)
async def register_user(user_data: DataVisionUserRegister):
    """
    Register a new DataVision user.
    Users can then use SSO to access FieldForce and Survey360.
    Processes referral code if provided.
    """
    # Check if user already exists
    existing_user = await db.datavision_users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Also check admins collection
    existing_admin = await db.admins.find_one({"email": user_data.email})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "name": user_data.name,
        "is_admin": False,
        "referred_by": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Process referral code if provided (User Referral Program)
    if user_data.referral_code:
        referral_code = user_data.referral_code.upper().strip()
        # Find the referrer
        referrer = await db.referrals.find_one({"referral_code": referral_code})
        if referrer:
            new_user["referred_by"] = referrer["user_id"]
            
            # Update referrer's stats
            await db.referrals.update_one(
                {"referral_code": referral_code},
                {
                    "$push": {"referred_users": user_id},
                    "$inc": {"total_referrals": 1}
                }
            )
            
            # Award credit to referrer (default: $5 per referral)
            REFERRAL_CREDIT_AMOUNT = 5.0
            await db.user_credits.update_one(
                {"user_id": referrer["user_id"]},
                {
                    "$inc": {"balance": REFERRAL_CREDIT_AMOUNT},
                    "$push": {
                        "history": {
                            "id": str(uuid.uuid4()),
                            "type": "earned",
                            "amount": REFERRAL_CREDIT_AMOUNT,
                            "description": f"Referral bonus for {user_data.name}",
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        }
                    }
                },
                upsert=True
            )
    
    await db.datavision_users.insert_one(new_user)
    
    # Generate token
    token = create_access_token({"sub": user_data.email, "id": user_id, "is_admin": False})
    
    # TRIGGER: Send welcome email (non-blocking)
    from services.email_service import email_service
    asyncio.create_task(email_service.send_welcome_email(
        to_email=user_data.email,
        name=user_data.name
    ))
    
    return UserTokenResponse(
        access_token=token,
        user=DataVisionUser(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            is_admin=False
        )
    )

@api_router.post("/auth/login", response_model=UserTokenResponse)
async def login(credentials: AdminLogin):
    """
    Login for DataVision users and administrators.
    TRIGGER: Sends security alert on successful login (new device detection)
    """
    from services.email_service import email_service
    
    # First check DataVision users collection
    user = await db.datavision_users.find_one({"email": credentials.email}, {"_id": 0})
    if user and verify_password(credentials.password, user["password"]):
        token = create_access_token({"sub": user["email"], "id": user["id"], "is_admin": user.get("is_admin", False)})
        
        # Check if this is a new login and send security alert
        last_login = user.get("last_login")
        current_time = datetime.now(timezone.utc).isoformat()
        
        # Update last login time
        await db.datavision_users.update_one(
            {"email": credentials.email},
            {"$set": {"last_login": current_time}}
        )
        
        # TRIGGER: Send new login security alert (if not first login)
        if last_login:
            asyncio.create_task(email_service.send_security_alert(
                to_email=user["email"],
                name=user.get("name", "User"),
                alert_type="new_login",
                details={
                    "Time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                    "Platform": "DataVision Web"
                }
            ))
        
        return UserTokenResponse(
            access_token=token,
            user=DataVisionUser(
                id=user["id"],
                email=user["email"],
                name=user.get("name", "User"),
                is_admin=user.get("is_admin", False)
            )
        )
    
    # Then check admins collection (backward compatibility)
    admin = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    if admin and verify_password(credentials.password, admin["password"]):
        token = create_access_token({"sub": admin["email"], "id": admin["id"], "is_admin": True})
        
        # Update last login for admin
        current_time = datetime.now(timezone.utc).isoformat()
        last_login = admin.get("last_login")
        
        await db.admins.update_one(
            {"email": credentials.email},
            {"$set": {"last_login": current_time}}
        )
        
        # TRIGGER: Send new login security alert for admin (if not first login)
        if last_login:
            asyncio.create_task(email_service.send_security_alert(
                to_email=admin["email"],
                name=admin.get("name", "Administrator"),
                alert_type="new_login",
                details={
                    "Time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                    "Platform": "DataVision Admin"
                }
            ))
        
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


# ==================== PASSWORD RESET FLOW ====================
# NOTE: Password reset endpoints have been moved to routes/auth_routes.py

@api_router.put("/auth/profile")
async def update_user_profile(profile: DataVisionUserProfile, payload: dict = Depends(verify_token)):
    """
    Update user profile with additional details (Step 2 of registration).
    """
    user_email = payload.get("sub")
    
    update_data = {k: v for k, v in profile.dict().items() if v is not None}
    update_data["profile_completed"] = True
    
    # Update in datavision_users collection
    result = await db.datavision_users.update_one(
        {"email": user_email},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        # Try admins collection
        await db.admins.update_one(
            {"email": user_email},
            {"$set": update_data}
        )
    
    # Get updated user
    user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0, "password": 0})
    if not user:
        user = await db.admins.find_one({"email": user_email}, {"_id": 0, "password": 0})
    
    if user:
        return DataVisionUser(**user)
    
    raise HTTPException(status_code=404, detail="User not found")

@api_router.get("/admin/users")
async def get_all_users(
    product: Optional[str] = None,
    country: Optional[str] = None,
    industry: Optional[str] = None,
    payload: dict = Depends(verify_token)
):
    """
    Get all registered users with optional filters for CMS.
    Only accessible by admins.
    """
    # Check if user is admin
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Build filter
    filter_query = {}
    if country:
        filter_query["country"] = country
    if industry:
        filter_query["industry"] = industry
    if product:
        filter_query["products_accessed"] = product
    
    # Get users from datavision_users
    users = await db.datavision_users.find(filter_query, {"_id": 0, "password": 0}).to_list(1000)
    
    # Get aggregated stats
    total_users = len(users)
    countries = {}
    industries = {}
    products = {"fieldforce": 0, "survey360": 0}
    
    for user in users:
        if user.get("country"):
            countries[user["country"]] = countries.get(user["country"], 0) + 1
        if user.get("industry"):
            industries[user["industry"]] = industries.get(user["industry"], 0) + 1
        for prod in user.get("products_accessed", []):
            if prod in products:
                products[prod] += 1
    
    return {
        "users": users,
        "stats": {
            "total": total_users,
            "by_country": countries,
            "by_industry": industries,
            "by_product": products
        }
    }

# ==================== CMS CONTENT MANAGEMENT ====================

@api_router.get("/cms/content/{content_type}")
async def get_cms_content(content_type: str, payload: dict = Depends(verify_token)):
    """Get content items by type for CMS."""
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection_map = {
        "homepage": "cms_homepage",
        "team": "cms_team",
        "projects": "cms_projects",
        "blog": "cms_blog",
        "testimonials": "cms_testimonials"
    }
    
    collection = collection_map.get(content_type)
    if not collection:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    items = await db[collection].find({}, {"_id": 0}).to_list(100)
    return {"items": items}

@api_router.post("/cms/content/{content_type}")
async def create_cms_content(content_type: str, data: dict, payload: dict = Depends(verify_token)):
    """Create new content item."""
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection_map = {
        "homepage": "cms_homepage",
        "team": "cms_team",
        "projects": "cms_projects",
        "blog": "cms_blog",
        "testimonials": "cms_testimonials"
    }
    
    collection = collection_map.get(content_type)
    if not collection:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    data["id"] = str(uuid.uuid4())
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    data["created_by"] = payload.get("sub")
    
    await db[collection].insert_one(data)
    return {"message": "Content created", "id": data["id"]}

@api_router.put("/cms/content/{content_type}/{item_id}")
async def update_cms_content(content_type: str, item_id: str, data: dict, payload: dict = Depends(verify_token)):
    """Update existing content item."""
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection_map = {
        "homepage": "cms_homepage",
        "team": "cms_team",
        "projects": "cms_projects",
        "blog": "cms_blog",
        "testimonials": "cms_testimonials"
    }
    
    collection = collection_map.get(content_type)
    if not collection:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    data["updated_by"] = payload.get("sub")
    
    result = await db[collection].update_one({"id": item_id}, {"$set": data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {"message": "Content updated"}

@api_router.delete("/cms/content/{content_type}/{item_id}")
async def delete_cms_content(content_type: str, item_id: str, payload: dict = Depends(verify_token)):
    """Delete content item."""
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection_map = {
        "homepage": "cms_homepage",
        "team": "cms_team",
        "projects": "cms_projects",
        "blog": "cms_blog",
        "testimonials": "cms_testimonials"
    }
    
    collection = collection_map.get(content_type)
    if not collection:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    result = await db[collection].delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {"message": "Content deleted"}

# ==================== EXPERT NETWORK ====================

# Expert categories for backend management
EXPERT_CATEGORIES = [
    {"id": "research_me", "name": "Research & M&E", "description": "Surveys, evaluations, impact assessments"},
    {"id": "data_science", "name": "Data Science & AI/ML", "description": "Machine learning, predictive analytics, NLP"},
    {"id": "data_analytics", "name": "Data Analytics", "description": "BI dashboards, data visualization, reporting"},
    {"id": "public_health", "name": "Public Health", "description": "Health systems, epidemiology, HMIS"},
    {"id": "agriculture", "name": "Agriculture & Food Security", "description": "Agricultural research, food systems"},
    {"id": "education", "name": "Education & EdTech", "description": "Learning assessments, curriculum, EdTech"},
    {"id": "climate", "name": "Climate & Environment", "description": "Environmental impact, climate adaptation"},
    {"id": "governance", "name": "Governance & Policy", "description": "Institutional assessments, policy analysis"},
    {"id": "economics", "name": "Economics & Finance", "description": "Economic modeling, cost-benefit analysis"},
    {"id": "gis", "name": "GIS & Geospatial", "description": "Mapping, spatial analysis, remote sensing"},
    {"id": "software", "name": "Software Development", "description": "Web, mobile, database development"},
    {"id": "statistics", "name": "Statistics", "description": "Statistical analysis, sampling, modeling"},
    {"id": "wash", "name": "WASH", "description": "Water, sanitation, hygiene research"},
    {"id": "inclusion_equality", "name": "Inclusion & Equality", "description": "Social inclusion, gender equality, diversity"},
    {"id": "oil_gas", "name": "Oil & Gas", "description": "Energy sector research, petroleum economics"},
    {"id": "nutrition", "name": "Nutrition", "description": "Nutrition surveys, food security assessments"},
    {"id": "digital_transformation", "name": "Digital Transformation", "description": "Digitization, process automation"},
]

@api_router.get("/experts/categories")
async def get_expert_categories():
    """Get all expert categories."""
    return {"categories": EXPERT_CATEGORIES}

@api_router.post("/experts/apply")
async def apply_to_expert_network(application: dict):
    """Submit application to join expert network."""
    required_fields = ["name", "email", "expertise", "experience", "location"]
    for field in required_fields:
        if not application.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    # Check if already applied
    existing = await db.expert_applications.find_one({"email": application["email"]}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Application already submitted with this email")
    
    application["id"] = str(uuid.uuid4())
    application["status"] = "pending"
    application["applied_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.expert_applications.insert_one(application)
    
    return {"message": "Application submitted successfully", "id": application["id"]}

@api_router.get("/admin/expert-applications")
async def get_expert_applications(status: str = None, payload: dict = Depends(verify_token)):
    """Get expert network applications (admin only)."""
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    applications = await db.expert_applications.find(filter_query, {"_id": 0}).to_list(100)
    
    # Get stats
    total = len(applications)
    pending = len([a for a in applications if a.get("status") == "pending"])
    approved = len([a for a in applications if a.get("status") == "approved"])
    rejected = len([a for a in applications if a.get("status") == "rejected"])
    
    return {
        "applications": applications,
        "stats": {
            "total": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected
        }
    }

@api_router.put("/admin/expert-applications/{application_id}")
async def update_expert_application(application_id: str, data: dict, payload: dict = Depends(verify_token)):
    """Update expert application status (admin only)."""
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    data["updated_by"] = payload.get("sub")
    
    result = await db.expert_applications.update_one(
        {"id": application_id},
        {"$set": data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {"message": "Application updated"}

@api_router.post("/auth/sso-exchange")
async def datavision_sso_exchange(authorization: str = Header(None)):
    """
    Exchange a Survey360 token for DataVision admin access.
    ONLY works if the user is already a DataVision admin.
    Regular Survey360 customers cannot access admin panel.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        # Check if this is a Survey360 token (has user_id) or DataVision token (has sub)
        user_email = None
        
        if "user_id" in payload:
            # This is a Survey360 token - get the user email
            survey360_user = await db.survey360_users.find_one({"id": payload["user_id"]}, {"_id": 0})
            if survey360_user:
                user_email = survey360_user.get("email")
        elif "sub" in payload:
            # This is already a DataVision token
            user_email = payload["sub"]
        
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # IMPORTANT: Only allow access if user is ALREADY a DataVision admin
        # Regular Survey360 customers should NOT get admin access
        admin = await db.admins.find_one({"email": user_email}, {"_id": 0})
        
        if not admin:
            # User is not a DataVision admin - deny access
            raise HTTPException(
                status_code=403, 
                detail="Access denied. Only DataVision administrators can access the admin panel."
            )
        
        # Generate DataVision token for existing admin
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

@api_router.get("/auth/me")
async def get_current_user(payload: dict = Depends(verify_token)):
    # Check datavision_users first
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
    
    # Then check admins
    admin = await db.admins.find_one({"email": payload["sub"]}, {"_id": 0, "password": 0})
    if admin:
        return DataVisionUser(
            id=admin["id"],
            email=admin["email"],
            name=admin.get("name", "Administrator"),
            is_admin=True
        )
    
    raise HTTPException(status_code=404, detail="User not found")

# ==================== DATAVISION SSO FOR PRODUCTS ====================

async def get_user_subscription(user_email: str, product_id: str):
    """
    Get active subscription for a user and product.
    Returns subscription details including plan, expiry, and features.
    """
    subscription = await db.user_subscriptions.find_one(
        {
            "user_email": user_email,
            "product_id": product_id,
            "status": "active"
        },
        {"_id": 0}
    )
    
    if subscription:
        # Check if subscription is expired
        expires_at = subscription.get("expires_at")
        if expires_at:
            expiry_date = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
            if expiry_date < datetime.now(timezone.utc):
                # Subscription expired
                await db.user_subscriptions.update_one(
                    {"id": subscription["id"]},
                    {"$set": {"status": "expired"}}
                )
                return None
        
        # Get plan features
        plan = subscription.get("plan", "free")
        plan_features = PRODUCT_PLANS.get(product_id, {}).get(plan, {})
        
        return {
            "subscription_id": subscription.get("id"),
            "plan": plan,
            "plan_name": subscription.get("plan_name"),
            "status": "active",
            "started_at": subscription.get("started_at"),
            "expires_at": subscription.get("expires_at"),
            "auto_renew": subscription.get("auto_renew", False),
            "features": plan_features.get("features", []),
            "limits": {k: v for k, v in plan_features.items() if k != "features" and k != "name"}
        }
    
    return None

@api_router.post("/auth/sso/survey360")
async def datavision_to_survey360_sso(authorization: str = Header(None)):
    """
    DataVision SSO to Survey360.
    Allows DataVision authenticated users to access Survey360 without re-login.
    Creates Survey360 user if doesn't exist.
    Includes subscription information from centralized billing.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_email = payload.get("sub")
        user_id = payload.get("id")
        
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user's subscription for Survey360
        subscription = await get_user_subscription(user_email, "survey360")
        plan = subscription["plan"] if subscription else "free"
        
        # Track product access for marketing
        await db.datavision_users.update_one(
            {"email": user_email},
            {
                "$addToSet": {"products_accessed": "survey360"},
                "$set": {"last_login": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        # Check if user exists in Survey360
        survey360_user = await db.survey360_users.find_one({"email": user_email}, {"_id": 0})
        
        if not survey360_user:
            # Get user info from DataVision users or admins
            dv_user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0})
            if not dv_user:
                dv_user = await db.admins.find_one({"email": user_email}, {"_id": 0})
            user_name = dv_user.get("name", user_email.split("@")[0]) if dv_user else user_email.split("@")[0]
            
            # Create Survey360 user with SSO
            new_user_id = str(uuid.uuid4())
            org_id = str(uuid.uuid4())
            
            # Create organization for the user with plan from subscription
            await db.survey360_orgs.insert_one({
                "id": org_id,
                "name": f"{user_name}'s Organization",
                "plan": plan,
                "owner_id": new_user_id,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
            
            # Create the user
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
        else:
            # Update existing org plan if subscription changed
            if subscription:
                await db.survey360_orgs.update_one(
                    {"id": survey360_user.get("org_id")},
                    {"$set": {"plan": plan}}
                )
        
        # Generate Survey360 token with subscription info
        survey360_token = jwt.encode(
            {
                "user_id": survey360_user["id"],
                "exp": datetime.now(timezone.utc).timestamp() + 86400,
                "product": "survey360",
                "plan": plan,
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
            "subscription": subscription,
            "sso": True,
            "provider": "datavision"
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/sso/fieldforce")
async def datavision_to_fieldforce_sso(authorization: str = Header(None)):
    """
    DataVision SSO to FieldForce.
    Allows DataVision authenticated users to access FieldForce without re-login.
    Creates FieldForce user if doesn't exist.
    Includes subscription information from centralized billing.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_email = payload.get("sub")
        
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user's subscription for FieldForce
        subscription = await get_user_subscription(user_email, "fieldforce")
        plan = subscription["plan"] if subscription else "starter"
        
        # Track product access for marketing
        await db.datavision_users.update_one(
            {"email": user_email},
            {
                "$addToSet": {"products_accessed": "fieldforce"},
                "$set": {"last_login": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        # Check if user exists in FieldForce
        ff_user = await db.users.find_one({"email": user_email}, {"_id": 0})
        
        if not ff_user:
            # Get user info from DataVision users or admins
            dv_user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0})
            if not dv_user:
                dv_user = await db.admins.find_one({"email": user_email}, {"_id": 0})
            user_name = dv_user.get("name", user_email.split("@")[0]) if dv_user else user_email.split("@")[0]
            
            # Get seat limit from plan
            plan_info = PRODUCT_PLANS.get("fieldforce", {}).get(plan, {})
            seats = plan_info.get("seats", 10)
            
            # Create FieldForce user with SSO
            new_user_id = str(uuid.uuid4())
            org_id = str(uuid.uuid4())
            
            # Create organization with plan info
            await db.organizations.insert_one({
                "id": org_id,
                "name": f"{user_name}'s Organization",
                "slug": f"{user_email.split('@')[0]}-org",
                "owner_id": new_user_id,
                "plan": plan,
                "seats_limit": seats,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
            
            # Create the user
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
        else:
            # Update existing org plan if subscription changed
            if subscription:
                plan_info = PRODUCT_PLANS.get("fieldforce", {}).get(plan, {})
                await db.organizations.update_one(
                    {"id": ff_user.get("organization_id")},
                    {"$set": {"plan": plan, "seats_limit": plan_info.get("seats", 10)}}
                )
        
        # Generate FieldForce token with subscription info
        ff_token = jwt.encode(
            {
                "user_id": ff_user["id"],
                "exp": datetime.now(timezone.utc).timestamp() + 86400,
                "product": "fieldforce",
                "plan": plan,
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
            "subscription": subscription,
            "sso": True,
            "provider": "datavision"
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/auth/sso/dataviz")
async def datavision_to_dataviz_sso(authorization: str = Header(None)):
    """Exchange DataVision token for DataViz Studio token"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="No authorization token provided")
    
    dv_token = authorization.replace('Bearer ', '')
    
    try:
        # Verify DataVision token
        payload = jwt.decode(dv_token, SECRET_KEY, algorithms=["HS256"])
        user_email = payload.get("sub")
        
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Get user from datavision_users collection first, then try admins
        user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0, "password": 0})
        if not user:
            user = await db.admins.find_one({"email": user_email}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create DataViz-specific token
        dv_token_data = {
            "sub": user_email,
            "email": user["email"],
            "name": user.get("name", ""),
            "product": "dataviz",
            "sso": True,
            "exp": datetime.now(timezone.utc) + timedelta(days=7)
        }
        dataviz_token = jwt.encode(dv_token_data, SECRET_KEY, algorithm="HS256")
        
        return {
            "user": {
                "id": user.get("id", user_email),
                "email": user["email"],
                "name": user.get("name", "DataViz User"),
                "avatar": user.get("avatar"),
                "sso_provider": "datavision",
                "sso_linked": True,
            },
            "access_token": dataviz_token,
            "sso": True,
            "provider": "datavision"
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/sso/datapulse")
async def datavision_to_datapulse_sso(authorization: str = Header(None)):
    """Exchange DataVision token for DataPulse token"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="No authorization token provided")
    
    dp_token = authorization.replace('Bearer ', '')
    
    try:
        # Verify DataVision token
        payload = jwt.decode(dp_token, SECRET_KEY, algorithms=["HS256"])
        user_email = payload.get("sub")
        
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Get user from datavision_users collection first, then try admins
        user = await db.datavision_users.find_one({"email": user_email}, {"_id": 0, "password": 0})
        if not user:
            user = await db.admins.find_one({"email": user_email}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create DataPulse-specific token
        dp_token_data = {
            "sub": user_email,
            "email": user["email"],
            "name": user.get("name", ""),
            "product": "datapulse",
            "sso": True,
            "exp": datetime.now(timezone.utc) + timedelta(days=7)
        }
        datapulse_token = jwt.encode(dp_token_data, SECRET_KEY, algorithm="HS256")
        
        return {
            "user": {
                "id": user.get("id", user_email),
                "email": user["email"],
                "name": user.get("name", "DataPulse User"),
                "avatar": user.get("avatar"),
                "sso_provider": "datavision",
                "sso_linked": True,
            },
            "access_token": datapulse_token,
            "sso": True,
            "provider": "datavision"
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "DataVision International API", "status": "operational"}

# Solution Inquiries - Demo requests and sales inquiries
@api_router.post("/inquiries")
async def create_inquiry(request: Request):
    """Create a new solution inquiry / demo request"""
    try:
        data = await request.json()
        inquiry = {
            "name": data.get("name"),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "organization": data.get("organization"),
            "organization_type": data.get("organizationType"),
            "country": data.get("country"),
            "employee_count": data.get("employeeCount"),
            "message": data.get("message"),
            "solution": data.get("solution"),
            "solution_name": data.get("solutionName"),
            "type": data.get("type", "demo_request"),
            "status": "new",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        result = await db.inquiries.insert_one(inquiry)
        logger.info(f"New inquiry received for {data.get('solutionName')} from {data.get('email')}")
        return {"success": True, "message": "Inquiry submitted successfully"}
    except Exception as e:
        logger.error(f"Failed to create inquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit inquiry")

@api_router.get("/inquiries")
async def get_inquiries(payload: dict = Depends(verify_admin_token)):
    """Get all inquiries (admin only)"""
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Calculate stats
    total = len(inquiries)
    new_count = len([i for i in inquiries if i.get("status") == "new"])
    contacted_count = len([i for i in inquiries if i.get("status") == "contacted"])
    converted_count = len([i for i in inquiries if i.get("status") == "converted"])
    
    return {
        "inquiries": inquiries,
        "stats": {
            "total": total,
            "new": new_count,
            "contacted": contacted_count,
            "converted": converted_count
        }
    }

@api_router.put("/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, request: Request, payload: dict = Depends(verify_admin_token)):
    """Update inquiry status (admin only)"""
    try:
        data = await request.json()
        new_status = data.get("status")
        notes = data.get("notes", "")
        
        valid_statuses = ["new", "contacted", "qualified", "converted", "closed"]
        if new_status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        update_data = {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "updated_by": payload.get("sub")
        }
        if notes:
            update_data["notes"] = notes
        
        result = await db.inquiries.update_one(
            {"solution": {"$exists": True}, "email": {"$exists": True}},
            {"$set": update_data}
        )
        
        # Try to find by other means if the first approach didn't work
        # Since we don't have an id field, use email + solution as unique identifier
        if result.modified_count == 0:
            # Try finding with a more specific query
            inquiry = await db.inquiries.find_one({"email": inquiry_id}, {"_id": 0})
            if inquiry:
                await db.inquiries.update_one(
                    {"email": inquiry_id, "solution": inquiry.get("solution")},
                    {"$set": update_data}
                )
        
        return {"message": "Inquiry status updated", "status": new_status}
    except Exception as e:
        logger.error(f"Failed to update inquiry status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update inquiry status")

# NOTE: Projects, team, testimonials, statistics, news, partners, and inquiries 
# routes have been moved to routes/public_content_routes.py

# ==================== EXPERT NETWORK ROUTES ====================

# Public: Register as an expert
@api_router.post("/experts/register", response_model=ExpertRegistration)
async def register_expert(expert: ExpertRegistrationCreate):
    """Public endpoint for experts to register"""
    # Check if email already exists
    existing = await db.experts.find_one({"email": expert.email})
    if existing:
        raise HTTPException(status_code=400, detail="An expert with this email already exists")
    
    expert_obj = ExpertRegistration(**expert.model_dump())
    doc = expert_obj.model_dump()
    await db.experts.insert_one(doc)
    logger.info(f"New expert registration: {expert.full_name} ({expert.email})")
    return expert_obj

# Public: Get expert sectors and skills options
@api_router.get("/experts/options")
async def get_expert_options():
    """Get available options for expert registration form"""
    return {
        "sectors": [
            {"id": "agriculture", "name": "Agriculture & Food Security"},
            {"id": "health", "name": "Health & Pharmaceuticals"},
            {"id": "education", "name": "Education & Training"},
            {"id": "wash", "name": "Water, Sanitation & Hygiene"},
            {"id": "governance", "name": "Governance & Public Policy"},
            {"id": "energy", "name": "Energy & Environment"},
            {"id": "finance", "name": "Financial Services & Inclusion"},
            {"id": "gender", "name": "Gender & Social Development"},
            {"id": "data", "name": "Data Science & Analytics"},
            {"id": "me", "name": "Monitoring & Evaluation"},
            {"id": "nutrition", "name": "Food & Nutrition"},
            {"id": "infrastructure", "name": "Infrastructure & Construction"},
            {"id": "transport", "name": "Transport & Logistics"},
            {"id": "technology", "name": "Technology & Telecommunications"},
            {"id": "retail", "name": "Retail & Consumer Goods"}
        ],
        "skills": [
            "Survey Design", "Data Collection", "Statistical Analysis", "Qualitative Research",
            "Focus Group Facilitation", "Key Informant Interviews", "GIS Mapping", "Data Visualization",
            "M&E Framework Design", "Impact Evaluation", "Cost-Benefit Analysis", "Policy Analysis",
            "Program Evaluation", "Baseline Studies", "Endline Studies", "Household Surveys",
            "Mobile Data Collection", "CAPI/CATI", "Stata", "SPSS", "R", "Python",
            "Power BI", "Tableau", "Excel Advanced", "Report Writing", "Proposal Writing",
            "Project Management", "Team Leadership", "Training Facilitation", "Capacity Building"
        ],
        "engagement_types": [
            {"id": "short-term", "name": "Short-term (< 3 months)"},
            {"id": "long-term", "name": "Long-term (3+ months)"},
            {"id": "remote", "name": "Remote Work"},
            {"id": "on-site", "name": "On-site"},
            {"id": "hybrid", "name": "Hybrid"}
        ],
        "regions": [
            "East Africa", "West Africa", "Southern Africa", "Central Africa", "North Africa",
            "Sub-Saharan Africa", "Global"
        ],
        "countries": [
            "Tanzania", "Kenya", "Uganda", "Rwanda", "Burundi", "Ethiopia", "Somalia",
            "South Sudan", "DRC", "Mozambique", "Malawi", "Zambia", "Zimbabwe",
            "South Africa", "Nigeria", "Ghana", "Senegal", "Mali", "Burkina Faso",
            "Cameroon", "Ivory Coast", "Other"
        ],
        "proficiency_levels": ["beginner", "intermediate", "advanced", "expert"],
        "availability_status": ["available", "limited", "unavailable"]
    }

# Admin: Get all experts with filtering
@api_router.get("/admin/experts", response_model=List[ExpertRegistration])
async def get_experts(
    sector: Optional[str] = None,
    status: Optional[str] = None,
    min_experience: Optional[int] = None,
    country: Optional[str] = None,
    availability: Optional[str] = None,
    search: Optional[str] = None,
    _: dict = Depends(verify_token)
):
    """Get all experts with optional filtering"""
    query = {}
    
    if sector:
        query["$or"] = [
            {"primary_sectors": sector},
            {"secondary_sectors": sector}
        ]
    if status:
        query["status"] = status
    if min_experience:
        query["years_experience"] = {"$gte": min_experience}
    if country:
        query["countries_experience"] = country
    if availability:
        query["availability"] = availability
    if search:
        query["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"current_title": {"$regex": search, "$options": "i"}}
        ]
    
    experts = await db.experts.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return experts

# Admin: Get single expert
@api_router.get("/admin/experts/{expert_id}", response_model=ExpertRegistration)
async def get_expert(expert_id: str, _: dict = Depends(verify_token)):
    expert = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    return expert

# Admin: Update expert status
@api_router.put("/admin/experts/{expert_id}/status")
async def update_expert_status(expert_id: str, status: str, notes: Optional[str] = None, _: dict = Depends(verify_token)):
    """Update expert status (approve, reject, etc.)"""
    valid_statuses = ["pending", "approved", "rejected", "active", "inactive", "engaged"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    update_data = {
        "status": status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if notes:
        update_data["notes"] = notes
    
    result = await db.experts.update_one(
        {"id": expert_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    logger.info(f"Expert {expert_id} status updated to {status}")
    return {"message": f"Expert status updated to {status}"}

# Admin: Update expert details
@api_router.put("/admin/experts/{expert_id}", response_model=ExpertRegistration)
async def update_expert(expert_id: str, expert: ExpertRegistrationCreate, _: dict = Depends(verify_token)):
    update_data = expert.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.experts.update_one(
        {"id": expert_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    updated = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    return ExpertRegistration(**updated)

# Admin: Delete expert
@api_router.delete("/admin/experts/{expert_id}")
async def delete_expert(expert_id: str, _: dict = Depends(verify_token)):
    result = await db.experts.delete_one({"id": expert_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expert not found")
    return {"message": "Expert deleted"}

# Admin: Search experts with advanced criteria
@api_router.post("/admin/experts/search", response_model=List[ExpertRegistration])
async def search_experts(query: ExpertSearchQuery, _: dict = Depends(verify_token)):
    """Advanced search for experts"""
    mongo_query = {}
    
    if query.sectors:
        mongo_query["$or"] = [
            {"primary_sectors": {"$in": query.sectors}},
            {"secondary_sectors": {"$in": query.sectors}}
        ]
    
    if query.skills:
        mongo_query["skills.name"] = {"$in": query.skills}
    
    if query.min_experience > 0:
        mongo_query["years_experience"] = {"$gte": query.min_experience}
    
    if query.countries:
        mongo_query["countries_experience"] = {"$in": query.countries}
    
    if query.availability:
        mongo_query["availability"] = {"$in": query.availability}
    
    if query.engagement_type:
        mongo_query["engagement_type"] = {"$in": query.engagement_type}
    
    if query.max_daily_rate:
        mongo_query["daily_rate_min"] = {"$lte": query.max_daily_rate}
    
    if query.willing_to_travel is not None:
        mongo_query["willing_to_travel"] = query.willing_to_travel
    
    if query.status:
        mongo_query["status"] = {"$in": query.status}
    
    experts = await db.experts.find(mongo_query, {"_id": 0}).to_list(500)
    return experts

# ==================== PROJECT REQUIREMENTS & MATCHING ====================

# Admin: Create project requirement
@api_router.post("/admin/project-requirements", response_model=ProjectRequirement)
async def create_project_requirement(req: ProjectRequirementCreate, _: dict = Depends(verify_token)):
    req_obj = ProjectRequirement(**req.model_dump())
    doc = req_obj.model_dump()
    await db.project_requirements.insert_one(doc)
    return req_obj

# Admin: Get all project requirements
@api_router.get("/admin/project-requirements", response_model=List[ProjectRequirement])
async def get_project_requirements(status: Optional[str] = None, _: dict = Depends(verify_token)):
    query = {}
    if status:
        query["status"] = status
    reqs = await db.project_requirements.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return reqs

# Admin: Get matched experts for a project requirement
@api_router.get("/admin/project-requirements/{req_id}/matches", response_model=List[ExpertMatch])
async def get_expert_matches(req_id: str, _: dict = Depends(verify_token)):
    """Find and rank experts matching a project requirement"""
    # Get the project requirement
    req = await db.project_requirements.find_one({"id": req_id}, {"_id": 0})
    if not req:
        raise HTTPException(status_code=404, detail="Project requirement not found")
    
    # Find experts with matching criteria
    experts = await db.experts.find(
        {"status": {"$in": ["approved", "active"]}},
        {"_id": 0}
    ).to_list(500)
    
    matches = []
    for expert in experts:
        score = calculate_match_score(expert, req)
        if score > 0:
            # Find matching sectors
            matching_sectors = []
            for sector in req.get("sectors", []):
                if sector in expert.get("primary_sectors", []):
                    matching_sectors.append(sector)
                elif sector in expert.get("secondary_sectors", []):
                    matching_sectors.append(sector)
            
            # Find matching skills
            expert_skill_names = [s.get("name", "") for s in expert.get("skills", [])]
            matching_skills = []
            for skill in req.get("required_skills", []) + req.get("preferred_skills", []):
                if skill in expert_skill_names:
                    matching_skills.append(skill)
            
            matches.append(ExpertMatch(
                expert_id=expert["id"],
                expert_name=expert["full_name"],
                expert_email=expert["email"],
                match_score=score,
                matching_sectors=matching_sectors,
                matching_skills=matching_skills,
                years_experience=expert.get("years_experience", 0),
                availability=expert.get("availability", "unknown"),
                daily_rate_min=expert.get("daily_rate_min"),
                daily_rate_max=expert.get("daily_rate_max"),
                verification_score=expert.get("verification_score", 0),
                trust_tier=expert.get("trust_tier", "bronze")
            ))
    
    # Sort by combined score: match_score (70%) + verification_score (30%)
    matches.sort(key=lambda x: (x.match_score * 0.7 + x.verification_score * 0.3), reverse=True)
    return matches[:20]  # Return top 20 matches

def calculate_match_score(expert: dict, requirement: dict) -> float:
    """Calculate matching score between an expert and project requirement"""
    score = 0.0
    max_score = 100.0
    
    # Sector match (30 points)
    req_sectors = set(requirement.get("sectors", []))
    expert_primary = set(expert.get("primary_sectors", []))
    expert_secondary = set(expert.get("secondary_sectors", []))
    
    primary_matches = len(req_sectors & expert_primary)
    secondary_matches = len(req_sectors & expert_secondary)
    
    if req_sectors:
        sector_score = (primary_matches * 30 + secondary_matches * 15) / len(req_sectors)
        score += min(sector_score, 30)
    
    # Skills match (30 points)
    required_skills = set(requirement.get("required_skills", []))
    preferred_skills = set(requirement.get("preferred_skills", []))
    expert_skills = set([s.get("name", "") for s in expert.get("skills", [])])
    
    required_matches = len(required_skills & expert_skills)
    preferred_matches = len(preferred_skills & expert_skills)
    
    if required_skills:
        req_skill_score = (required_matches / len(required_skills)) * 20
        score += req_skill_score
    
    if preferred_skills:
        pref_skill_score = (preferred_matches / len(preferred_skills)) * 10
        score += pref_skill_score
    
    # Experience match (20 points)
    min_exp = requirement.get("min_experience", 0)
    expert_exp = expert.get("years_experience", 0)
    
    if expert_exp >= min_exp:
        exp_bonus = min((expert_exp - min_exp) * 2, 10)  # Bonus for extra experience
        score += 10 + exp_bonus
    elif min_exp > 0:
        score += max(0, 10 - (min_exp - expert_exp) * 2)  # Partial credit
    else:
        score += 10  # Full points if no minimum specified
    
    # Country/regional match (10 points)
    req_countries = set(requirement.get("countries", []))
    expert_countries = set(expert.get("countries_experience", []))
    
    if req_countries:
        country_matches = len(req_countries & expert_countries)
        score += (country_matches / len(req_countries)) * 10
    else:
        score += 10  # Full points if no specific country required
    
    # Availability match (10 points)
    if expert.get("availability") == "available":
        score += 10
    elif expert.get("availability") == "limited":
        score += 5
    
    # Engagement type match (bonus)
    req_type = requirement.get("engagement_type", "")
    expert_types = expert.get("engagement_type", [])
    if req_type in expert_types:
        score += 5
    
    # Budget match (bonus/penalty)
    budget_max = requirement.get("budget_max")
    expert_rate_min = expert.get("daily_rate_min")
    
    if budget_max and expert_rate_min:
        if expert_rate_min <= budget_max:
            score += 5
        else:
            score -= 10
    
    return min(max(score, 0), max_score + 10)  # Allow up to 110 with bonuses

# Admin: Get expert statistics
@api_router.get("/admin/experts/stats/summary")
async def get_expert_stats(_: dict = Depends(verify_token)):
    """Get summary statistics for expert network"""
    pipeline = [
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }
        }
    ]
    status_counts = await db.experts.aggregate(pipeline).to_list(10)
    
    # Get sector distribution
    sector_pipeline = [
        {"$unwind": "$primary_sectors"},
        {"$group": {"_id": "$primary_sectors", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    sector_counts = await db.experts.aggregate(sector_pipeline).to_list(20)
    
    # Get country distribution
    country_pipeline = [
        {"$unwind": "$countries_experience"},
        {"$group": {"_id": "$countries_experience", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    country_counts = await db.experts.aggregate(country_pipeline).to_list(10)
    
    # Get availability distribution
    avail_pipeline = [
        {"$group": {"_id": "$availability", "count": {"$sum": 1}}}
    ]
    avail_counts = await db.experts.aggregate(avail_pipeline).to_list(5)
    
    total = await db.experts.count_documents({})
    
    return {
        "total_experts": total,
        "by_status": {item["_id"]: item["count"] for item in status_counts},
        "by_sector": {item["_id"]: item["count"] for item in sector_counts},
        "by_country": {item["_id"]: item["count"] for item in country_counts},
        "by_availability": {item["_id"]: item["count"] for item in avail_counts}
    }

# ==================== VERIFICATION SYSTEM ====================

# Skills Assessment Questions Bank (Auto-generated per sector)
ASSESSMENT_QUESTIONS = {
    "agriculture": [
        {"question": "What is the primary purpose of a value chain analysis in agriculture?", 
         "options": ["To identify pest control methods", "To map production to consumption flow and identify bottlenecks", "To measure soil quality", "To calculate crop yields"],
         "correct": 1, "difficulty": "medium"},
        {"question": "Which sampling method is most appropriate for a large-scale agricultural household survey?",
         "options": ["Convenience sampling", "Stratified random sampling", "Snowball sampling", "Purposive sampling"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What does GAP stand for in agricultural certification?",
         "options": ["General Agricultural Products", "Good Agricultural Practices", "Global Agriculture Protocol", "Growth Assessment Program"],
         "correct": 1, "difficulty": "easy"},
        {"question": "In agricultural impact evaluation, what is a 'counterfactual'?",
         "options": ["A measure of crop failure", "What would have happened without the intervention", "A type of fertilizer analysis", "A farming technique"],
         "correct": 1, "difficulty": "hard"},
        {"question": "Which indicator is most relevant for measuring food security at household level?",
         "options": ["GDP per capita", "Household Dietary Diversity Score (HDDS)", "Total crop production", "Market prices"],
         "correct": 1, "difficulty": "medium"},
    ],
    "health": [
        {"question": "What does HMIS stand for in health systems?",
         "options": ["Health Medical Insurance System", "Health Management Information System", "Hospital Monitoring Integration Service", "Healthcare Medicine Inventory System"],
         "correct": 1, "difficulty": "easy"},
        {"question": "Which study design provides the strongest evidence for causal inference?",
         "options": ["Cross-sectional survey", "Case-control study", "Randomized controlled trial", "Cohort study"],
         "correct": 2, "difficulty": "medium"},
        {"question": "What is the primary purpose of a health facility assessment?",
         "options": ["To count patients", "To evaluate service readiness and quality of care", "To distribute medicines", "To train doctors"],
         "correct": 1, "difficulty": "medium"},
        {"question": "In disease surveillance, what is a 'sentinel site'?",
         "options": ["A quarantine facility", "A selected location for systematic data collection", "A hospital emergency room", "A vaccination center"],
         "correct": 1, "difficulty": "hard"},
        {"question": "What is the WHO's recommended method for assessing healthcare quality?",
         "options": ["Patient satisfaction only", "Donabedian's structure-process-outcome framework", "Cost analysis", "Staff interviews"],
         "correct": 1, "difficulty": "hard"},
    ],
    "education": [
        {"question": "What does EMIS stand for in education systems?",
         "options": ["Educational Management Information System", "Elementary Monitoring Integration Service", "Education Ministry Information Service", "E-learning Management Integration System"],
         "correct": 0, "difficulty": "easy"},
        {"question": "Which assessment measures learning outcomes at system level?",
         "options": ["Teacher evaluation", "National Learning Assessment (NLA)", "Attendance records", "Textbook distribution"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is the 'learning poverty' indicator measuring?",
         "options": ["School fees affordability", "Percentage of children unable to read by age 10", "Teacher salaries", "Classroom infrastructure"],
         "correct": 1, "difficulty": "medium"},
        {"question": "In education research, what is 'test-retest reliability'?",
         "options": ["Testing different students", "Consistency of results when same test is administered twice", "Comparing two different tests", "Testing at different schools"],
         "correct": 1, "difficulty": "hard"},
        {"question": "Which framework is commonly used for teacher effectiveness evaluation?",
         "options": ["Bloom's Taxonomy", "Danielson Framework", "SWOT Analysis", "Theory of Change"],
         "correct": 1, "difficulty": "hard"},
    ],
    "wash": [
        {"question": "What does JMP stand for in WASH sector?",
         "options": ["Joint Management Program", "Joint Monitoring Programme", "Junior Management Protocol", "Jurisdictional Monitoring Plan"],
         "correct": 1, "difficulty": "easy"},
        {"question": "What is 'safely managed drinking water' according to SDG 6?",
         "options": ["Any piped water", "Water from improved source, on premises, available when needed, free from contamination", "Bottled water only", "Water from public taps"],
         "correct": 1, "difficulty": "medium"},
        {"question": "Which indicator measures sanitation access at household level?",
         "options": ["Water quality index", "Proportion using safely managed sanitation services", "Number of latrines built", "Distance to water source"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is the 'sanitation ladder' in JMP classification?",
         "options": ["Physical ladder for pit latrines", "Hierarchy of sanitation service levels from open defecation to safely managed", "Steps for building toilets", "Ladder for water tanks"],
         "correct": 1, "difficulty": "hard"},
        {"question": "In WASH surveys, what does 'E. coli presence' indicate?",
         "options": ["Safe water", "Fecal contamination", "Mineral content", "Water hardness"],
         "correct": 1, "difficulty": "medium"},
    ],
    "me": [
        {"question": "What is a 'Theory of Change' in M&E?",
         "options": ["A financial audit method", "A logical framework showing how activities lead to outcomes", "A change management process", "A type of survey"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is the difference between outputs and outcomes in M&E?",
         "options": ["They are the same", "Outputs are immediate products, outcomes are changes resulting from outputs", "Outputs are long-term, outcomes are short-term", "Outputs are qualitative, outcomes are quantitative"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is 'contribution analysis' in impact evaluation?",
         "options": ["Calculating project costs", "Assessing causal contribution when experimental designs aren't possible", "Measuring donor contributions", "Analyzing team member contributions"],
         "correct": 1, "difficulty": "hard"},
        {"question": "In Results-Based Management, what does 'SMART' indicators mean?",
         "options": ["Strategic, Measured, Accurate, Reliable, Timely", "Specific, Measurable, Achievable, Relevant, Time-bound", "Simple, Managed, Appropriate, Responsive, Targeted", "Standard, Monitored, Assessed, Reviewed, Tested"],
         "correct": 1, "difficulty": "easy"},
        {"question": "What is the purpose of a 'baseline study'?",
         "options": ["To evaluate project completion", "To establish reference point before intervention for comparison", "To design project activities", "To train staff"],
         "correct": 1, "difficulty": "easy"},
    ],
    "data": [
        {"question": "What is the primary purpose of data normalization?",
         "options": ["To make data larger", "To organize data to reduce redundancy and improve integrity", "To visualize data", "To delete duplicates"],
         "correct": 1, "difficulty": "medium"},
        {"question": "Which statistical test is appropriate for comparing means of two independent groups?",
         "options": ["Chi-square test", "Independent samples t-test", "ANOVA", "Correlation analysis"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What does 'p-value < 0.05' indicate in statistical analysis?",
         "options": ["The result is meaningless", "Statistical significance at 95% confidence level", "The sample size is too small", "The data is normally distributed"],
         "correct": 1, "difficulty": "easy"},
        {"question": "In machine learning, what is 'overfitting'?",
         "options": ["Model performs well on all data", "Model performs well on training data but poorly on new data", "Model takes too long to train", "Model uses too little data"],
         "correct": 1, "difficulty": "hard"},
        {"question": "What is the purpose of 'cross-validation' in model development?",
         "options": ["To increase training speed", "To assess model performance on unseen data", "To visualize results", "To clean data"],
         "correct": 1, "difficulty": "hard"},
    ],
    "governance": [
        {"question": "What is 'Public Expenditure Review' (PER)?",
         "options": ["Personal expense tracking", "Systematic analysis of government spending patterns and efficiency", "Private sector audit", "Employee performance review"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What does PEFA stand for in public finance?",
         "options": ["Public Economic Financial Analysis", "Public Expenditure and Financial Accountability", "Private Enterprise Funding Assessment", "Public Education Finance Authority"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is 'citizen report card' in governance research?",
         "options": ["National ID system", "Tool to gather citizen feedback on public services", "Government report to citizens", "Voting registration card"],
         "correct": 1, "difficulty": "hard"},
        {"question": "In governance indicators, what does 'voice and accountability' measure?",
         "options": ["Audio quality in meetings", "Citizens' ability to participate in governance and hold leaders accountable", "Government announcements", "Financial accountability"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is 'devolution' in governance context?",
         "options": ["Economic decline", "Transfer of powers from central to local government", "Political revolution", "Government dissolution"],
         "correct": 1, "difficulty": "easy"},
    ],
    "finance": [
        {"question": "What is 'financial inclusion'?",
         "options": ["Including financial data in reports", "Access to useful and affordable financial services", "Tax inclusion policies", "Financial literacy training"],
         "correct": 1, "difficulty": "easy"},
        {"question": "What is a 'financial diary' methodology?",
         "options": ["Bank account statement", "Longitudinal tracking of household financial transactions", "Business accounting ledger", "Personal finance app"],
         "correct": 1, "difficulty": "hard"},
        {"question": "What does 'FinScope' survey measure?",
         "options": ["Bank profits", "Financial sector development and inclusion levels", "Investment returns", "Currency exchange rates"],
         "correct": 1, "difficulty": "medium"},
        {"question": "In microfinance, what is 'PAR30' indicator?",
         "options": ["Interest rate", "Portfolio at Risk - loans overdue by 30+ days", "Profit margin", "Number of borrowers"],
         "correct": 1, "difficulty": "hard"},
        {"question": "What is 'mobile money' in financial services context?",
         "options": ["Online banking only", "Financial transactions via mobile phones without bank accounts", "Money for mobile phones", "Banking apps"],
         "correct": 1, "difficulty": "easy"},
    ],
    "gender": [
        {"question": "What is 'gender mainstreaming'?",
         "options": ["Hiring more women", "Integrating gender perspective into all policies and programs", "Separate programs for women", "Gender-specific marketing"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What does GBV stand for in development context?",
         "options": ["Government Budget Variance", "Gender-Based Violence", "General Business Value", "Global Business Venture"],
         "correct": 1, "difficulty": "easy"},
        {"question": "What is the 'Gender Inequality Index' (GII)?",
         "options": ["Women's salary comparison", "Composite measure of gender-based disadvantage across health, empowerment, labor", "Female education rates", "Women in parliament"],
         "correct": 1, "difficulty": "hard"},
        {"question": "In gender analysis, what is 'intersectionality'?",
         "options": ["Road traffic analysis", "How multiple identities (gender, race, class) combine to create unique experiences", "International relations", "Sector coordination"],
         "correct": 1, "difficulty": "hard"},
        {"question": "What is 'unpaid care work' in gender economics?",
         "options": ["Volunteer work", "Domestic and caregiving work typically done by women without pay", "Part-time employment", "Internships"],
         "correct": 1, "difficulty": "medium"},
    ],
    "energy": [
        {"question": "What does SDG 7 focus on?",
         "options": ["Clean water", "Affordable and clean energy", "Quality education", "Good health"],
         "correct": 1, "difficulty": "easy"},
        {"question": "What is 'energy poverty'?",
         "options": ["Low energy production", "Lack of access to modern energy services", "High energy prices", "Energy inefficiency"],
         "correct": 1, "difficulty": "medium"},
        {"question": "In energy surveys, what does 'MTF' stand for?",
         "options": ["Mobile Transfer Facility", "Multi-Tier Framework for measuring energy access", "Main Transmission Frequency", "Metric Ton Factor"],
         "correct": 1, "difficulty": "hard"},
        {"question": "What is 'clean cooking' in energy context?",
         "options": ["Kitchen hygiene", "Use of fuels and technologies that produce low household air pollution", "Food safety", "Restaurant management"],
         "correct": 1, "difficulty": "medium"},
        {"question": "What is the primary challenge of renewable energy in rural Africa?",
         "options": ["Too much sunshine", "High upfront costs and limited financing", "Excess wind", "Over-supply of energy"],
         "correct": 1, "difficulty": "medium"},
    ]
}

def generate_assessment_questions(sector: str, num_questions: int = 5) -> List[dict]:
    """Generate assessment questions for a sector"""
    import random
    questions = ASSESSMENT_QUESTIONS.get(sector, [])
    if len(questions) < num_questions:
        return questions
    return random.sample(questions, num_questions)

def calculate_verification_score(expert: dict) -> tuple:
    """Calculate composite verification score and trust tier"""
    # Component weights
    weights = {
        "skills": 40,      # 40% weight for skills assessment
        "references": 35,  # 35% weight for reference verification
        "documents": 25    # 25% weight for document verification
    }
    
    skills_score = expert.get("skills_assessment_score", 0)
    reference_score = expert.get("reference_verification_score", 0)
    document_score = expert.get("document_verification_score", 0)
    
    # Calculate weighted score
    composite_score = (
        skills_score * weights["skills"] / 100 +
        reference_score * weights["references"] / 100 +
        document_score * weights["documents"] / 100
    )
    
    # Determine trust tier
    if composite_score >= 85:
        tier = "platinum"
    elif composite_score >= 70:
        tier = "gold"
    elif composite_score >= 50:
        tier = "silver"
    else:
        tier = "bronze"
    
    # Determine verification status
    if composite_score >= 70:
        status = "verified"
    elif composite_score >= 40:
        status = "partially_verified"
    elif skills_score > 0 or reference_score > 0 or document_score > 0:
        status = "pending_verification"
    else:
        status = "unverified"
    
    return composite_score, tier, status

async def update_expert_verification(expert_id: str):
    """Recalculate and update expert's verification score"""
    expert = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    if not expert:
        return None
    
    score, tier, status = calculate_verification_score(expert)
    
    await db.experts.update_one(
        {"id": expert_id},
        {"$set": {
            "verification_score": score,
            "trust_tier": tier,
            "verification_status": status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"score": score, "tier": tier, "status": status}

# Admin: Get available assessments for a sector
@api_router.get("/admin/assessments/sectors")
async def get_assessment_sectors(_: dict = Depends(verify_token)):
    """Get sectors with available assessments"""
    return {
        "sectors": list(ASSESSMENT_QUESTIONS.keys()),
        "questions_per_sector": {k: len(v) for k, v in ASSESSMENT_QUESTIONS.items()}
    }

# Public: Get skills assessment for expert
@api_router.get("/experts/{expert_id}/assessment/{sector}")
async def get_skills_assessment(expert_id: str, sector: str):
    """Get a skills assessment test for an expert"""
    # Verify expert exists
    expert = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    # Check if already completed this sector
    completed = expert.get("skills_assessments_completed", [])
    if sector in completed:
        raise HTTPException(status_code=400, detail="Assessment already completed for this sector")
    
    # Generate assessment
    questions = generate_assessment_questions(sector, 5)
    if not questions:
        raise HTTPException(status_code=404, detail="No assessment available for this sector")
    
    # Create assessment record
    assessment = {
        "id": str(uuid.uuid4()),
        "expert_id": expert_id,
        "sector": sector,
        "questions": [
            {
                "id": str(uuid.uuid4()),
                "question": q["question"],
                "options": q["options"],
                "difficulty": q["difficulty"]
            }
            for q in questions
        ],
        "_correct_answers": [q["correct"] for q in questions],  # Hidden from response
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
    }
    
    await db.assessments.insert_one(assessment)
    
    # Return without correct answers
    return {
        "assessment_id": assessment["id"],
        "sector": sector,
        "time_limit_minutes": 30,
        "questions": assessment["questions"]
    }

# Public: Submit assessment answers
@api_router.post("/experts/{expert_id}/assessment/submit")
async def submit_assessment(expert_id: str, submission: AssessmentSubmission):
    """Submit answers for a skills assessment"""
    # Get assessment
    assessment = await db.assessments.find_one({"id": submission.assessment_id})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if assessment["expert_id"] != expert_id:
        raise HTTPException(status_code=403, detail="Assessment not for this expert")
    
    # Check if already submitted
    existing_result = await db.assessment_results.find_one({
        "expert_id": expert_id,
        "assessment_id": submission.assessment_id
    })
    if existing_result:
        raise HTTPException(status_code=400, detail="Assessment already submitted")
    
    # Calculate score
    correct_answers = assessment["_correct_answers"]
    num_correct = sum(1 for i, ans in enumerate(submission.answers) if i < len(correct_answers) and ans == correct_answers[i])
    total = len(correct_answers)
    score = (num_correct / total) * 100 if total > 0 else 0
    passed = score >= 70
    
    # Save result
    result = {
        "id": str(uuid.uuid4()),
        "expert_id": expert_id,
        "assessment_id": submission.assessment_id,
        "sector": assessment["sector"],
        "score": score,
        "passed": passed,
        "correct_answers": num_correct,
        "total_questions": total,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    await db.assessment_results.insert_one(result)
    
    # Update expert's assessment score
    all_results = await db.assessment_results.find({"expert_id": expert_id}).to_list(100)
    avg_score = sum(r["score"] for r in all_results) / len(all_results) if all_results else 0
    
    await db.experts.update_one(
        {"id": expert_id},
        {"$set": {
            "skills_assessment_score": avg_score,
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        "$addToSet": {"skills_assessments_completed": assessment["sector"]}}
    )
    
    # Recalculate verification score
    await update_expert_verification(expert_id)
    
    return {
        "score": score,
        "passed": passed,
        "correct_answers": num_correct,
        "total_questions": total,
        "message": "Congratulations! You passed." if passed else "You did not reach the passing score of 70%."
    }

# Admin: Request reference verification
@api_router.post("/admin/experts/{expert_id}/request-reference")
async def request_reference_verification(
    expert_id: str, 
    reference_name: str, 
    reference_email: str, 
    reference_organization: Optional[str] = None,
    _: dict = Depends(verify_token)
):
    """Send reference verification request"""
    expert = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    # Create reference request
    ref_request = ReferenceRequest(
        expert_id=expert_id,
        expert_name=expert["full_name"],
        reference_name=reference_name,
        reference_email=reference_email,
        reference_organization=reference_organization,
        status="sent",
        sent_at=datetime.now(timezone.utc).isoformat()
    )
    
    await db.reference_requests.insert_one(ref_request.model_dump())
    
    # In production, send email here
    # For now, return the verification link
    verification_link = f"/verify-reference/{ref_request.token}"
    
    logger.info(f"Reference request created for expert {expert_id}: {reference_email}")
    
    return {
        "message": "Reference request created",
        "request_id": ref_request.id,
        "verification_link": verification_link,
        "note": "In production, an email would be sent to the reference"
    }

# Public: Submit reference response (accessed via unique token)
@api_router.post("/verify-reference/{token}")
async def submit_reference_response(token: str, response: ReferenceResponse):
    """Submit reference verification response"""
    ref_request = await db.reference_requests.find_one({"token": token})
    if not ref_request:
        raise HTTPException(status_code=404, detail="Invalid verification link")
    
    if ref_request["status"] == "completed":
        raise HTTPException(status_code=400, detail="Reference already submitted")
    
    # Calculate reference score (1-5 ratings averaged and normalized to 0-100)
    ratings = [
        response.technical_skills,
        response.communication,
        response.reliability,
        response.quality_of_work,
        response.professionalism
    ]
    avg_rating = sum(r for r in ratings if r > 0) / len([r for r in ratings if r > 0]) if any(r > 0 for r in ratings) else 0
    normalized_score = (avg_rating / 5) * 100
    
    # Add recommendation bonus
    if response.would_recommend:
        normalized_score = min(100, normalized_score + 10)
    
    # Update reference request
    await db.reference_requests.update_one(
        {"token": token},
        {"$set": {
            "status": "completed",
            "response": response.model_dump(),
            "score": normalized_score,
            "completed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Update expert's reference score
    expert_id = ref_request["expert_id"]
    all_refs = await db.reference_requests.find({
        "expert_id": expert_id, 
        "status": "completed"
    }).to_list(100)
    
    avg_ref_score = sum(r.get("score", 0) for r in all_refs) / len(all_refs) if all_refs else 0
    
    await db.experts.update_one(
        {"id": expert_id},
        {"$set": {
            "reference_verification_score": avg_ref_score,
            "references_verified": len(all_refs),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Recalculate verification score
    await update_expert_verification(expert_id)
    
    return {"message": "Thank you for your feedback!", "score": normalized_score}

# Public: Get reference request details (for reference to fill)
@api_router.get("/verify-reference/{token}")
async def get_reference_request(token: str):
    """Get reference request details for the reference to review"""
    ref_request = await db.reference_requests.find_one({"token": token}, {"_id": 0})
    if not ref_request:
        raise HTTPException(status_code=404, detail="Invalid verification link")
    
    if ref_request["status"] == "completed":
        return {"message": "This reference has already been submitted", "completed": True}
    
    # Get expert info for context
    expert = await db.experts.find_one({"id": ref_request["expert_id"]}, {"_id": 0})
    
    return {
        "expert_name": ref_request["expert_name"],
        "expert_title": expert.get("current_title", "") if expert else "",
        "expert_sectors": expert.get("primary_sectors", []) if expert else [],
        "expert_skills": [s.get("name", "") for s in expert.get("skills", [])] if expert else [],
        "reference_name": ref_request["reference_name"],
        "completed": False
    }

# Admin: Get expert verification summary
@api_router.get("/admin/experts/{expert_id}/verification", response_model=VerificationSummary)
async def get_expert_verification(expert_id: str, _: dict = Depends(verify_token)):
    """Get detailed verification status for an expert"""
    expert = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    # Get assessment results
    assessments = await db.assessment_results.find({"expert_id": expert_id}).to_list(100)
    passed_assessments = [a for a in assessments if a.get("passed", False)]
    
    # Get reference requests
    ref_requests = await db.reference_requests.find({"expert_id": expert_id}).to_list(100)
    completed_refs = [r for r in ref_requests if r.get("status") == "completed"]
    
    # Get document verifications
    documents = await db.document_verifications.find({"expert_id": expert_id}).to_list(100)
    verified_docs = [d for d in documents if d.get("status") == "verified"]
    
    return VerificationSummary(
        expert_id=expert_id,
        expert_name=expert["full_name"],
        verification_status=expert.get("verification_status", "unverified"),
        verification_score=expert.get("verification_score", 0),
        trust_tier=expert.get("trust_tier", "bronze"),
        components={
            "skills_assessment": {
                "score": expert.get("skills_assessment_score", 0),
                "weight": 40,
                "sectors_completed": expert.get("skills_assessments_completed", [])
            },
            "references": {
                "score": expert.get("reference_verification_score", 0),
                "weight": 35,
                "verified_count": len(completed_refs)
            },
            "documents": {
                "score": expert.get("document_verification_score", 0),
                "weight": 25,
                "verified_count": len(verified_docs)
            }
        },
        assessments_completed=len(assessments),
        assessments_passed=len(passed_assessments),
        references_requested=len(ref_requests),
        references_verified=len(completed_refs),
        documents_submitted=len(documents),
        documents_verified=len(verified_docs)
    )

# Admin: Get all experts ranked by verification score
@api_router.get("/admin/experts/verified/ranked")
async def get_ranked_verified_experts(
    sector: Optional[str] = None,
    min_score: float = 0,
    tier: Optional[str] = None,
    _: dict = Depends(verify_token)
):
    """Get experts ranked by verification score - filtered by top talent"""
    query = {"verification_score": {"$gte": min_score}}
    
    if sector:
        query["$or"] = [
            {"primary_sectors": sector},
            {"secondary_sectors": sector}
        ]
    
    if tier:
        query["trust_tier"] = tier
    
    experts = await db.experts.find(query, {"_id": 0}).sort("verification_score", -1).to_list(100)
    
    return {
        "total": len(experts),
        "experts": [
            {
                "id": e["id"],
                "name": e["full_name"],
                "email": e["email"],
                "title": e.get("current_title", ""),
                "sectors": e.get("primary_sectors", []),
                "years_experience": e.get("years_experience", 0),
                "verification_score": e.get("verification_score", 0),
                "trust_tier": e.get("trust_tier", "bronze"),
                "verification_status": e.get("verification_status", "unverified"),
                "skills_score": e.get("skills_assessment_score", 0),
                "reference_score": e.get("reference_verification_score", 0),
                "availability": e.get("availability", "unknown")
            }
            for e in experts
        ]
    }

# Admin: Bulk send reference requests
@api_router.post("/admin/experts/{expert_id}/request-all-references")
async def request_all_references(expert_id: str, _: dict = Depends(verify_token)):
    """Parse expert's references and send verification requests to all"""
    expert = await db.experts.find_one({"id": expert_id}, {"_id": 0})
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    references = expert.get("references", [])
    if not references:
        raise HTTPException(status_code=400, detail="No references provided by expert")
    
    created_requests = []
    for ref_str in references:
        # Parse reference string (expected format: "Name, Organization, email@example.com")
        parts = [p.strip() for p in ref_str.split(",")]
        if len(parts) >= 3:
            name = parts[0]
            org = parts[1] if len(parts) > 2 else None
            email = parts[-1]  # Email should be last
            
            # Check if already requested
            existing = await db.reference_requests.find_one({
                "expert_id": expert_id,
                "reference_email": email
            })
            if existing:
                continue
            
            # Create request
            ref_request = ReferenceRequest(
                expert_id=expert_id,
                expert_name=expert["full_name"],
                reference_name=name,
                reference_email=email,
                reference_organization=org,
                status="sent",
                sent_at=datetime.now(timezone.utc).isoformat()
            )
            await db.reference_requests.insert_one(ref_request.model_dump())
            created_requests.append({
                "name": name,
                "email": email,
                "token": ref_request.token
            })
    
    return {
        "message": f"Created {len(created_requests)} reference requests",
        "requests": created_requests
    }

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_database():
    """Seed initial data for the website"""
    
    # Check if admin exists
    existing_admin = await db.admins.find_one({"email": "info@datavision.co.tz"})
    if not existing_admin:
        admin = {
            "id": str(uuid.uuid4()),
            "email": "info@datavision.co.tz",
            "password": hash_password("walkthetalkdvi1998"),
            "name": "DataVision Admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.admins.insert_one(admin)
    
    # Seed statistics
    stats_count = await db.statistics.count_documents({})
    if stats_count == 0:
        stats = [
            {"id": str(uuid.uuid4()), "label": "Years of Excellence", "value": 25, "suffix": "+", "order": 0},
            {"id": str(uuid.uuid4()), "label": "Projects Completed", "value": 1000, "suffix": "+", "order": 1},
            {"id": str(uuid.uuid4()), "label": "African Countries", "value": 15, "suffix": "+", "order": 2},
            {"id": str(uuid.uuid4()), "label": "Partner Organizations", "value": 50, "suffix": "+", "order": 3},
        ]
        await db.statistics.insert_many(stats)
    
    # Seed testimonials
    testimonials_count = await db.testimonials.count_documents({})
    if testimonials_count == 0:
        testimonials = [
            {
                "id": str(uuid.uuid4()),
                "quote": "Ecorys partnered with DataVision International on the four-year UK aid project 'Independent Data Verification of the Payment by Results Scheme in the Rural Water Sub-Sector in Tanzania'. DataVision successfully completed data collection for four annual verification surveys. During the COVID-19 pandemic, DataVision International managed to adapt to a remote survey of water points. Over the four years of the project, DataVision International provided high-quality outputs, on time and to budget.",
                "author_name": "Amy Weaving",
                "author_title": "Associate Director",
                "organization": "Ecorys International Development",
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "quote": "On behalf of our team, I'd like to offer our sincere thanks for your efforts in completing the work and for the high-quality data you have produced. I have been very impressed with DataVision's attention to detail and commitment throughout the assignment.",
                "author_name": "Ron Wendt",
                "author_title": "Senior Research Director",
                "organization": "NORC at the University of Chicago",
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "quote": "As I operate globally, I have not found the quality of DataVision's data capture anywhere else.",
                "author_name": "Kate Anderson",
                "author_title": "CEO and Founder",
                "organization": "Unbounded Associates",
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.testimonials.insert_many(testimonials)
    
    # Seed projects
    projects_count = await db.projects.count_documents({})
    if projects_count == 0:
        projects = [
            {
                "id": str(uuid.uuid4()),
                "title": "Primary Safe Schools Program (PSSP) Evaluation",
                "description": "DataVision partnered with the World Bank to evaluate the Primary Safe Schools Program, conducting surveys across 40 schools in Tanzania to assess its impact on creating safer learning environments and empowering students with vital life skills.",
                "client": "World Bank",
                "sector": "education",
                "country": "Tanzania",
                "year": 2024,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Room to Read Literacy Program Evaluation",
                "description": "Evaluating Room to Read's Literacy Program in Tanzania by assessing Early Grade Literacy Skills among 1,200 Grade 2 students across 50 schools, aiming to uncover insights that will enhance literacy instruction.",
                "client": "Room to Read",
                "sector": "education",
                "country": "Tanzania",
                "year": 2024,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "USAID Jifunze Uelewe Midterm Review",
                "description": "Conducted the midterm review of the education-related USAID-funded programme with training of 85 data collectors to administer different evaluation tools.",
                "client": "USAID",
                "sector": "education",
                "country": "Tanzania",
                "year": 2023,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Rural Water Sub-Sector Data Verification",
                "description": "Four-year UK aid project verifying 129,949 water points across Tanzania with a team of 124 enumerators over six weeks.",
                "client": "Ecorys / UK Aid",
                "sector": "wash",
                "country": "Tanzania",
                "year": 2022,
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.projects.insert_many(projects)
    
    # Seed team members
    team_count = await db.team.count_documents({})
    if team_count == 0:
        team = [
            {
                "id": str(uuid.uuid4()),
                "name": "G. MacLeans Mwaijonga",
                "position": "Chairman",
                "bio": "Founder and Chairman with over 25 years of experience leading DataVision International's strategic vision and growth across Africa.",
                "order": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "William Kihula",
                "position": "CEO, Head of Research and Statistics",
                "bio": "Leading our research and statistics division with extensive experience in complex quantitative and qualitative surveys.",
                "order": 1,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Stella Elia",
                "position": "Data Manager",
                "bio": "Expert in data management, quality assurance, and processing for large-scale research projects.",
                "order": 2,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Stefanie Henke",
                "position": "Business Developer",
                "bio": "Driving partnerships and business growth across the African continent.",
                "order": 3,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Patrick S. Ngowi",
                "position": "Education Specialist",
                "bio": "Specialist in education research methodologies and program evaluation.",
                "order": 4,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.team.insert_many(team)
    
    # Seed partners
    partners_count = await db.partners.count_documents({})
    if partners_count == 0:
        partners = [
            {"id": str(uuid.uuid4()), "name": "World Bank", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_World_Bank_logo.svg/2560px-The_World_Bank_logo.svg.png", "order": 0},
            {"id": str(uuid.uuid4()), "name": "USAID", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/USAID-Identity.svg/2560px-USAID-Identity.svg.png", "order": 1},
            {"id": str(uuid.uuid4()), "name": "UNICEF", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/2560px-Logo_of_UNICEF.svg.png", "order": 2},
            {"id": str(uuid.uuid4()), "name": "UK Aid", "logo_url": "/uk-aid-logo.png", "order": 3},
        ]
        await db.partners.insert_many(partners)
    
    # Seed news
    news_count = await db.news.count_documents({})
    if news_count == 0:
        news = [
            {
                "id": str(uuid.uuid4()),
                "title": "DataVision Celebrates 25th Anniversary",
                "excerpt": "From that visionary spark in 1998, we've grown into a company that's touched countless lives across Africa.",
                "content": "DataVision International marks 25 years of excellence in research and statistics. Since our founding in 1998, we have grown from a small Tanzanian consultancy to a leading research partner serving organizations across the African continent. Our journey has been marked by continuous innovation, unwavering commitment to quality, and deep partnerships with international development organizations.",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.news.insert_many(news)
    
    return {"message": "Database seeded successfully"}

# ==================== STRIPE PAYMENT INTEGRATION ====================
from typing import Dict
from fastapi import Request

# Software Product Packages - defined server-side for security
# ==================== CENTRALIZED PRICING ====================
# This is the SINGLE SOURCE OF TRUTH for all product pricing
# Products fetch their pricing from /api/pricing/{product_id}

PRODUCT_PRICING = {
    "survey360": {
        "product_id": "survey360",
        "product_name": "Survey360",
        "description": "End-to-end survey management platform",
        "currency": "usd",
        "plans": [
            {
                "id": "survey360_free",
                "name": "Free",
                "price": 0,
                "period": "forever",
                "description": "For individuals getting started",
                "package_id": None,  # No Stripe checkout for free
                "features": [
                    "3 surveys",
                    "100 responses/month",
                    "10 question types",
                    "Basic analytics",
                    "Community support",
                    "Survey360 branding"
                ],
                "limits": {"surveys": 3, "responses_per_month": 100},
                "popular": False
            },
            {
                "id": "survey360_starter",
                "name": "Starter",
                "price": 19,
                "annual_price": 190,
                "period": "/month",
                "description": "For freelancers and small teams",
                "package_id": "survey360_starter_monthly",
                "annual_package_id": "survey360_starter_annual",
                "features": [
                    "Unlimited surveys",
                    "1,000 responses/month",
                    "All question types",
                    "Skip logic",
                    "Basic analytics",
                    "Email support",
                    "Remove branding"
                ],
                "limits": {"surveys": -1, "responses_per_month": 1000},
                "popular": False
            },
            {
                "id": "survey360_professional",
                "name": "Professional",
                "price": 49,
                "annual_price": 490,
                "period": "/month",
                "description": "For growing businesses",
                "package_id": "survey360_monthly",
                "annual_package_id": "survey360_annual",
                "features": [
                    "Unlimited surveys",
                    "10,000 responses/month",
                    "Everything in Starter",
                    "Custom branding",
                    "Advanced analytics",
                    "Priority support",
                    "API access"
                ],
                "limits": {"surveys": -1, "responses_per_month": 10000},
                "popular": True,
                "savings": "Save 17% annually"
            },
            {
                "id": "survey360_business",
                "name": "Business",
                "price": 99,
                "annual_price": 990,
                "period": "/month",
                "description": "For larger teams and agencies",
                "package_id": "survey360_business_monthly",
                "annual_package_id": "survey360_business_annual",
                "features": [
                    "Unlimited surveys",
                    "Unlimited responses",
                    "Everything in Professional",
                    "Unlimited team members",
                    "Custom integrations",
                    "Dedicated support",
                    "White-label option",
                    "SSO"
                ],
                "limits": {"surveys": -1, "responses_per_month": -1},
                "popular": False
            }
        ]
    },
    "fieldforce": {
        "product_id": "fieldforce",
        "product_name": "FieldForce",
        "description": "Mobile data collection suite",
        "currency": "usd",
        "plans": [
            {
                "id": "fieldforce_starter",
                "name": "Starter",
                "price": 49,
                "annual_price": 499,
                "period": "/month",
                "description": "For small field teams",
                "package_id": "fieldforce_starter_monthly",
                "annual_package_id": "fieldforce_10seats",
                "features": [
                    "Up to 10 field agents",
                    "Offline data collection",
                    "Basic form builder",
                    "GPS tracking",
                    "5 GB storage",
                    "Email support"
                ],
                "limits": {"seats": 10, "storage_gb": 5},
                "popular": False
            },
            {
                "id": "fieldforce_professional",
                "name": "Professional",
                "price": 149,
                "annual_price": 1499,
                "period": "/month",
                "description": "For growing organizations",
                "package_id": "fieldforce_pro_monthly",
                "annual_package_id": "fieldforce_50seats",
                "features": [
                    "Up to 50 field agents",
                    "Everything in Starter",
                    "Advanced forms",
                    "Photo/video capture",
                    "Real-time sync",
                    "25 GB storage",
                    "Priority support"
                ],
                "limits": {"seats": 50, "storage_gb": 25},
                "popular": True,
                "savings": "Save 17% annually"
            },
            {
                "id": "fieldforce_enterprise",
                "name": "Enterprise",
                "price": 399,
                "annual_price": 3999,
                "period": "/month",
                "description": "For large deployments",
                "package_id": "fieldforce_enterprise_monthly",
                "annual_package_id": "fieldforce_unlimited",
                "features": [
                    "Unlimited field agents",
                    "Everything in Professional",
                    "Custom integrations",
                    "API access",
                    "100 GB storage",
                    "Dedicated support",
                    "On-premise option"
                ],
                "limits": {"seats": -1, "storage_gb": 100},
                "popular": False
            }
        ]
    },
    "datapulse": {
        "product_id": "datapulse",
        "product_name": "DataPulse",
        "description": "Real-time analytics and visualization",
        "currency": "usd",
        "plans": [
            {
                "id": "datapulse_starter",
                "name": "Starter",
                "price": 29,
                "annual_price": 290,
                "period": "/month",
                "description": "For individuals and small teams",
                "package_id": "datapulse_starter_monthly",
                "annual_package_id": "datapulse_starter_annual",
                "features": [
                    "5 dashboards",
                    "Basic charts",
                    "CSV import",
                    "Email support"
                ],
                "limits": {"dashboards": 5},
                "popular": False
            },
            {
                "id": "datapulse_professional",
                "name": "Professional",
                "price": 79,
                "annual_price": 790,
                "period": "/month",
                "description": "For data-driven teams",
                "package_id": "dataviz_monthly",
                "annual_package_id": "dataviz_annual",
                "features": [
                    "Unlimited dashboards",
                    "Advanced visualizations",
                    "Real-time data",
                    "API connections",
                    "Export to PDF/PNG",
                    "Priority support"
                ],
                "limits": {"dashboards": -1},
                "popular": True,
                "savings": "Save 17% annually"
            }
        ]
    }
}

# Plan tiers for each product (used by SSO)
PRODUCT_PLANS = {
    "survey360": {
        "free": {"name": "Free", "surveys_limit": 3, "responses_limit": 100, "features": ["basic_analytics"]},
        "starter": {"name": "Starter", "surveys_limit": -1, "responses_limit": 1000, "features": ["basic_analytics", "export", "skip_logic"]},
        "professional": {"name": "Professional", "surveys_limit": -1, "responses_limit": 10000, "features": ["advanced_analytics", "export", "branching", "api_access", "custom_branding"]},
        "business": {"name": "Business", "surveys_limit": -1, "responses_limit": -1, "features": ["all"]}
    },
    "fieldforce": {
        "starter": {"name": "Starter", "seats": 10, "features": ["offline_mode", "basic_forms", "gps"]},
        "professional": {"name": "Professional", "seats": 50, "features": ["offline_mode", "advanced_forms", "gps_tracking", "photo_capture", "real_time_sync"]},
        "enterprise": {"name": "Enterprise", "seats": -1, "features": ["all"]}
    },
    "datapulse": {
        "starter": {"name": "Starter", "dashboards": 5, "features": ["basic_charts", "csv_import"]},
        "professional": {"name": "Professional", "dashboards": -1, "features": ["advanced_charts", "real_time", "export", "api"]},
        "enterprise": {"name": "Enterprise", "dashboards": -1, "features": ["all"]}
    }
}

# Package to plan mapping
PACKAGE_TO_PLAN = {
    # Survey360
    "survey360_starter_monthly": {"product_id": "survey360", "plan": "starter", "duration_days": 30},
    "survey360_starter_annual": {"product_id": "survey360", "plan": "starter", "duration_days": 365},
    "survey360_monthly": {"product_id": "survey360", "plan": "professional", "duration_days": 30},
    "survey360_annual": {"product_id": "survey360", "plan": "professional", "duration_days": 365},
    "survey360_business_monthly": {"product_id": "survey360", "plan": "business", "duration_days": 30},
    "survey360_business_annual": {"product_id": "survey360", "plan": "business", "duration_days": 365},
    # FieldForce
    "fieldforce_starter_monthly": {"product_id": "fieldforce", "plan": "starter", "duration_days": 30},
    "fieldforce_10seats": {"product_id": "fieldforce", "plan": "starter", "duration_days": 365},
    "fieldforce_pro_monthly": {"product_id": "fieldforce", "plan": "professional", "duration_days": 30},
    "fieldforce_50seats": {"product_id": "fieldforce", "plan": "professional", "duration_days": 365},
    "fieldforce_enterprise_monthly": {"product_id": "fieldforce", "plan": "enterprise", "duration_days": 30},
    "fieldforce_unlimited": {"product_id": "fieldforce", "plan": "enterprise", "duration_days": 365},
    # DataPulse
    "datapulse_starter_monthly": {"product_id": "datapulse", "plan": "starter", "duration_days": 30},
    "datapulse_starter_annual": {"product_id": "datapulse", "plan": "starter", "duration_days": 365},
    "dataviz_monthly": {"product_id": "datapulse", "plan": "professional", "duration_days": 30},
    "dataviz_annual": {"product_id": "datapulse", "plan": "professional", "duration_days": 365},
    # Other products
    "me_tracker_monthly": {"product_id": "me-tracker", "plan": "professional", "duration_days": 30},
    "me_tracker_annual": {"product_id": "me-tracker", "plan": "professional", "duration_days": 365},
    "agridata_annual": {"product_id": "agridata-pro", "plan": "professional", "duration_days": 365},
    "eduinsights_annual": {"product_id": "eduinsights", "plan": "professional", "duration_days": 365},
    "healthpulse_annual": {"product_id": "healthpulse", "plan": "professional", "duration_days": 365},
    "wash_monitor_annual": {"product_id": "wash-monitor", "plan": "professional", "duration_days": 365},
}

SOFTWARE_PACKAGES = {
    # Survey360 - Subscription (prices match PRODUCT_PRICING)
    "survey360_starter_monthly": {"name": "Survey360 Starter Monthly", "amount": 19.00, "type": "subscription", "product_id": "survey360"},
    "survey360_starter_annual": {"name": "Survey360 Starter Annual", "amount": 190.00, "type": "subscription", "product_id": "survey360"},
    "survey360_monthly": {"name": "Survey360 Professional Monthly", "amount": 49.00, "type": "subscription", "product_id": "survey360"},
    "survey360_annual": {"name": "Survey360 Professional Annual", "amount": 490.00, "type": "subscription", "product_id": "survey360"},
    "survey360_business_monthly": {"name": "Survey360 Business Monthly", "amount": 99.00, "type": "subscription", "product_id": "survey360"},
    "survey360_business_annual": {"name": "Survey360 Business Annual", "amount": 990.00, "type": "subscription", "product_id": "survey360"},
    
    # FieldForce - Per-seat licensing (prices match PRODUCT_PRICING)
    "fieldforce_starter_monthly": {"name": "FieldForce Starter Monthly", "amount": 49.00, "type": "subscription", "product_id": "fieldforce"},
    "fieldforce_10seats": {"name": "FieldForce Starter Annual (10 seats)", "amount": 499.00, "type": "package", "product_id": "fieldforce"},
    "fieldforce_pro_monthly": {"name": "FieldForce Professional Monthly", "amount": 149.00, "type": "subscription", "product_id": "fieldforce"},
    "fieldforce_50seats": {"name": "FieldForce Professional Annual (50 seats)", "amount": 1499.00, "type": "package", "product_id": "fieldforce"},
    "fieldforce_enterprise_monthly": {"name": "FieldForce Enterprise Monthly", "amount": 399.00, "type": "subscription", "product_id": "fieldforce"},
    "fieldforce_unlimited": {"name": "FieldForce Enterprise Annual (Unlimited)", "amount": 3999.00, "type": "package", "product_id": "fieldforce"},
    
    # DataPulse - Subscription (prices match PRODUCT_PRICING)
    "datapulse_starter_monthly": {"name": "DataPulse Starter Monthly", "amount": 29.00, "type": "subscription", "product_id": "datapulse"},
    "datapulse_starter_annual": {"name": "DataPulse Starter Annual", "amount": 290.00, "type": "subscription", "product_id": "datapulse"},
    "dataviz_monthly": {"name": "DataPulse Professional Monthly", "amount": 79.00, "type": "subscription", "product_id": "datapulse"},
    "dataviz_annual": {"name": "DataPulse Professional Annual", "amount": 790.00, "type": "subscription", "product_id": "datapulse"},
    
    # M&E Tracker - Subscription
    "me_tracker_monthly": {"name": "M&E Tracker Monthly", "amount": 149.00, "type": "subscription", "product_id": "me-tracker"},
    "me_tracker_annual": {"name": "M&E Tracker Annual", "amount": 1490.00, "type": "subscription", "product_id": "me-tracker"},
    
    # Sectoral Solutions - Annual license
    "agridata_annual": {"name": "AgriData Pro Annual", "amount": 1999.00, "type": "subscription", "product_id": "agridata-pro"},
    "eduinsights_annual": {"name": "EduInsights Annual", "amount": 1499.00, "type": "subscription", "product_id": "eduinsights"},
    "healthpulse_annual": {"name": "HealthPulse Annual", "amount": 1799.00, "type": "subscription", "product_id": "healthpulse"},
    "wash_monitor_annual": {"name": "WASH Monitor Annual", "amount": 1299.00, "type": "subscription", "product_id": "wash-monitor"},
}

class CheckoutRequest(BaseModel):
    package_id: str
    origin_url: str
    user_email: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None

class CheckoutResponse(BaseModel):
    url: str
    session_id: str

@api_router.post("/payments/checkout", response_model=CheckoutResponse)
async def create_checkout_session(request: CheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for a software package"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    # Validate package exists
    if request.package_id not in SOFTWARE_PACKAGES:
        raise HTTPException(status_code=400, detail=f"Invalid package: {request.package_id}")
    
    package = SOFTWARE_PACKAGES[request.package_id]
    
    # Enterprise packages require contact
    if package["type"] == "enterprise":
        raise HTTPException(status_code=400, detail="Enterprise packages require direct contact. Please reach out to sales.")
    
    # Get amount from server-side definition (security)
    amount = package["amount"]
    
    # Build dynamic URLs from frontend origin
    success_url = f"{request.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.origin_url}/solutions"
    
    # Initialize Stripe
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    # Prepare metadata
    checkout_metadata = {
        "package_id": request.package_id,
        "product_id": package["product_id"],
        "package_name": package["name"],
        "package_type": package["type"],
        "user_email": request.user_email or "anonymous"
    }
    if request.metadata:
        checkout_metadata.update(request.metadata)
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=checkout_metadata
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Store transaction in database
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "package_id": request.package_id,
        "product_id": package["product_id"],
        "package_name": package["name"],
        "amount": amount,
        "currency": "usd",
        "user_email": request.user_email,
        "payment_status": "pending",
        "status": "initiated",
        "metadata": checkout_metadata,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction)
    
    return CheckoutResponse(url=session.url, session_id=session.session_id)

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    """Get the status of a payment session"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    # Get status from Stripe
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction in database
    update_data = {
        "payment_status": status.payment_status,
        "status": status.status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    # If payment is successful, grant product access
    if status.payment_status == "paid":
        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        if transaction and transaction.get("payment_status") != "paid":
            package_id = transaction.get("package_id")
            plan_info = PACKAGE_TO_PLAN.get(package_id, {})
            
            # Calculate expiry date
            duration_days = plan_info.get("duration_days", 365)
            expires_at = (datetime.now(timezone.utc) + timedelta(days=duration_days)).isoformat()
            
            # First time marking as paid - create/update subscription
            subscription_record = {
                "id": str(uuid.uuid4()),
                "user_email": transaction.get("user_email"),
                "product_id": transaction.get("product_id"),
                "package_id": package_id,
                "plan": plan_info.get("plan", "professional"),
                "plan_name": SOFTWARE_PACKAGES.get(package_id, {}).get("name", "Unknown"),
                "amount_paid": transaction.get("amount"),
                "currency": "usd",
                "transaction_id": transaction.get("id"),
                "stripe_session_id": session_id,
                "started_at": datetime.now(timezone.utc).isoformat(),
                "expires_at": expires_at,
                "status": "active",
                "auto_renew": True
            }
            
            # Upsert - update existing or create new subscription
            await db.user_subscriptions.update_one(
                {"user_email": transaction.get("user_email"), "product_id": transaction.get("product_id")},
                {"$set": subscription_record},
                upsert=True
            )
            
            # Also create product_access record for backward compatibility
            access_record = {
                "id": str(uuid.uuid4()),
                "user_email": transaction.get("user_email"),
                "product_id": transaction.get("product_id"),
                "package_id": package_id,
                "plan": plan_info.get("plan", "professional"),
                "transaction_id": transaction.get("id"),
                "granted_at": datetime.now(timezone.utc).isoformat(),
                "expires_at": expires_at,
                "status": "active"
            }
            await db.product_access.update_one(
                {"user_email": transaction.get("user_email"), "product_id": transaction.get("product_id")},
                {"$set": access_record},
                upsert=True
            )
    
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": update_data}
    )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "metadata": status.metadata
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction based on webhook event
        if webhook_response.session_id:
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "payment_status": webhook_response.payment_status,
                    "webhook_event_id": webhook_response.event_id,
                    "webhook_event_type": webhook_response.event_type,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return {"status": "success", "event_id": webhook_response.event_id}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/payments/packages")
async def get_available_packages():
    """Get all available software packages for purchase"""
    packages = []
    for pkg_id, pkg_data in SOFTWARE_PACKAGES.items():
        packages.append({
            "id": pkg_id,
            "name": pkg_data["name"],
            "amount": pkg_data["amount"],
            "type": pkg_data["type"],
            "product_id": pkg_data["product_id"]
        })
    return {"packages": packages}

# ==================== CENTRALIZED PRICING API ====================

@api_router.get("/pricing")
async def get_all_pricing():
    """Get pricing for all products - single source of truth"""
    return {
        "products": PRODUCT_PRICING,
        "currency": "usd",
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

@api_router.get("/pricing/{product_id}")
async def get_product_pricing(product_id: str):
    """
    Get pricing for a specific product.
    Products should fetch their pricing from this endpoint to ensure consistency.
    """
    if product_id not in PRODUCT_PRICING:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    
    pricing = PRODUCT_PRICING[product_id]
    
    # Add package amounts from SOFTWARE_PACKAGES for verification
    for plan in pricing["plans"]:
        if plan.get("package_id") and plan["package_id"] in SOFTWARE_PACKAGES:
            plan["verified_amount"] = SOFTWARE_PACKAGES[plan["package_id"]]["amount"]
        if plan.get("annual_package_id") and plan["annual_package_id"] in SOFTWARE_PACKAGES:
            plan["verified_annual_amount"] = SOFTWARE_PACKAGES[plan["annual_package_id"]]["amount"]
    
    return {
        **pricing,
        "currency": "usd",
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

@api_router.get("/user/products")
async def get_user_products(email: str):
    """Get products a user has access to"""
    access_records = await db.product_access.find(
        {"user_email": email, "status": "active"},
        {"_id": 0}
    ).to_list(100)
    return {"products": access_records}

@api_router.get("/user/subscriptions")
async def get_user_subscriptions(email: str):
    """Get all active subscriptions for a user"""
    subscriptions = await db.user_subscriptions.find(
        {"user_email": email, "status": "active"},
        {"_id": 0}
    ).to_list(100)
    return {"subscriptions": subscriptions}

# ==================== ADMIN REVENUE ANALYTICS ====================

@api_router.get("/admin/revenue/overview")
async def get_revenue_overview(_: dict = Depends(verify_admin_token)):
    """Get overall revenue statistics"""
    # Get all paid transactions
    transactions = await db.payment_transactions.find(
        {"payment_status": "paid"},
        {"_id": 0}
    ).to_list(1000)
    
    total_revenue = sum(t.get("amount", 0) for t in transactions)
    
    # Revenue by product
    revenue_by_product = {}
    for t in transactions:
        product_id = t.get("product_id", "unknown")
        if product_id not in revenue_by_product:
            revenue_by_product[product_id] = {"revenue": 0, "transactions": 0}
        revenue_by_product[product_id]["revenue"] += t.get("amount", 0)
        revenue_by_product[product_id]["transactions"] += 1
    
    # Active subscriptions count
    active_subs = await db.user_subscriptions.count_documents({"status": "active"})
    
    # Monthly revenue (last 12 months)
    monthly_revenue = []
    for i in range(11, -1, -1):
        month_start = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i*30)
        month_end = month_start + timedelta(days=30)
        month_txns = [t for t in transactions 
                      if t.get("created_at") and 
                      month_start.isoformat() <= t.get("created_at", "") < month_end.isoformat()]
        monthly_revenue.append({
            "month": month_start.strftime("%b %Y"),
            "revenue": sum(t.get("amount", 0) for t in month_txns),
            "transactions": len(month_txns)
        })
    
    return {
        "total_revenue": total_revenue,
        "total_transactions": len(transactions),
        "active_subscriptions": active_subs,
        "revenue_by_product": revenue_by_product,
        "monthly_revenue": monthly_revenue
    }

@api_router.get("/admin/revenue/by-product")
async def get_revenue_by_product(_: dict = Depends(verify_admin_token)):
    """Get detailed revenue breakdown by product"""
    transactions = await db.payment_transactions.find(
        {"payment_status": "paid"},
        {"_id": 0}
    ).to_list(1000)
    
    products = {}
    for t in transactions:
        product_id = t.get("product_id", "unknown")
        if product_id not in products:
            products[product_id] = {
                "product_id": product_id,
                "product_name": SOFTWARE_PACKAGES.get(t.get("package_id", ""), {}).get("name", product_id),
                "total_revenue": 0,
                "transactions": [],
                "packages": {}
            }
        
        products[product_id]["total_revenue"] += t.get("amount", 0)
        products[product_id]["transactions"].append({
            "id": t.get("id"),
            "amount": t.get("amount"),
            "package_id": t.get("package_id"),
            "user_email": t.get("user_email"),
            "created_at": t.get("created_at")
        })
        
        pkg_id = t.get("package_id", "unknown")
        if pkg_id not in products[product_id]["packages"]:
            products[product_id]["packages"][pkg_id] = {"count": 0, "revenue": 0}
        products[product_id]["packages"][pkg_id]["count"] += 1
        products[product_id]["packages"][pkg_id]["revenue"] += t.get("amount", 0)
    
    # Add subscription counts
    for product_id in products:
        sub_count = await db.user_subscriptions.count_documents({
            "product_id": product_id, 
            "status": "active"
        })
        products[product_id]["active_subscriptions"] = sub_count
        # Keep only last 10 transactions
        products[product_id]["transactions"] = products[product_id]["transactions"][-10:]
    
    return {"products": list(products.values())}

@api_router.get("/admin/subscriptions")
async def get_all_subscriptions(
    product_id: Optional[str] = None,
    status: Optional[str] = "active",
    _: dict = Depends(verify_admin_token)
):
    """Get all subscriptions with optional filters"""
    query = {}
    if product_id:
        query["product_id"] = product_id
    if status:
        query["status"] = status
    
    subscriptions = await db.user_subscriptions.find(
        query,
        {"_id": 0}
    ).sort("started_at", -1).to_list(500)
    
    return {"subscriptions": subscriptions, "total": len(subscriptions)}

# ==================== USER BILLING ENDPOINTS ====================

@api_router.get("/billing/subscription")
async def get_user_subscription_details(
    product_id: str,
    payload: dict = Depends(verify_token)
):
    """Get user's current subscription for a product"""
    user_email = payload.get("sub")
    
    subscription = await db.user_subscriptions.find_one(
        {"user_email": user_email, "product_id": product_id},
        {"_id": 0}
    )
    
    if not subscription:
        return None
    
    # Check for pending downgrade
    pending = await db.pending_plan_changes.find_one(
        {"user_email": user_email, "product_id": product_id, "status": "pending"},
        {"_id": 0}
    )
    
    if pending:
        subscription["pending_downgrade"] = {
            "new_plan": pending.get("new_plan"),
            "effective_date": pending.get("effective_date")
        }
    
    # Get amount from plan
    plan_id = subscription.get("plan")
    if product_id in PRODUCT_PRICING:
        for plan in PRODUCT_PRICING[product_id]["plans"]:
            if plan.get("id") == subscription.get("plan_id") or plan.get("name", "").lower() == plan_id:
                subscription["amount"] = plan.get("price", 0)
                subscription["plan_name"] = plan.get("name")
                break
    
    return subscription

@api_router.get("/billing/invoices")
async def get_user_invoices(
    product_id: Optional[str] = None,
    payload: dict = Depends(verify_token)
):
    """Get user's invoice/payment history"""
    user_email = payload.get("sub")
    
    query = {"user_email": user_email, "payment_status": "paid"}
    if product_id:
        query["product_id"] = product_id
    
    transactions = await db.payment_transactions.find(
        query,
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    # Add package names
    for t in transactions:
        pkg_id = t.get("package_id")
        if pkg_id and pkg_id in SOFTWARE_PACKAGES:
            t["package_name"] = SOFTWARE_PACKAGES[pkg_id]["name"]
    
    return {"invoices": transactions}

@api_router.post("/billing/upgrade")
async def upgrade_subscription(
    request: dict,
    payload: dict = Depends(verify_token)
):
    """
    Upgrade to a higher plan.
    Calculates prorate and charges the difference via Stripe.
    """
    user_email = payload.get("sub")
    product_id = request.get("product_id")
    new_plan_id = request.get("new_plan_id")
    package_id = request.get("package_id")
    
    if not all([product_id, new_plan_id]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # Get current subscription
    current_sub = await db.user_subscriptions.find_one(
        {"user_email": user_email, "product_id": product_id, "status": "active"}
    )
    
    if not current_sub:
        raise HTTPException(status_code=400, detail="No active subscription found")
    
    # Get current and new plan prices
    current_price = 0
    new_price = 0
    new_plan_name = ""
    
    if product_id in PRODUCT_PRICING:
        for plan in PRODUCT_PRICING[product_id]["plans"]:
            if plan.get("id") == current_sub.get("plan_id") or plan.get("name", "").lower() == current_sub.get("plan", "").lower():
                current_price = plan.get("price", 0)
            if plan.get("id") == new_plan_id:
                new_price = plan.get("price", 0)
                new_plan_name = plan.get("name", "")
                if not package_id:
                    package_id = plan.get("package_id")
    
    if new_price <= current_price:
        raise HTTPException(status_code=400, detail="New plan must be higher tier. Use downgrade endpoint instead.")
    
    # Calculate days remaining and prorate
    expires_at = current_sub.get("expires_at")
    if expires_at:
        expiry_date = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
        days_remaining = (expiry_date - datetime.now(timezone.utc)).days
        days_remaining = max(0, days_remaining)
    else:
        days_remaining = 30
    
    # Prorate calculation (simple: difference * days_remaining / 30)
    prorate_amount = ((new_price - current_price) * days_remaining) / 30
    prorate_amount = round(prorate_amount, 2)
    
    if prorate_amount <= 0:
        # No charge needed, just upgrade
        await db.user_subscriptions.update_one(
            {"_id": current_sub["_id"]},
            {"$set": {
                "plan": new_plan_name.lower(),
                "plan_id": new_plan_id,
                "plan_name": new_plan_name,
                "upgraded_at": datetime.now(timezone.utc).isoformat(),
                "upgraded_from": current_sub.get("plan")
            }}
        )
        return {"message": f"Upgraded to {new_plan_name} successfully!", "prorated_amount": 0}
    
    # Create Stripe checkout for the prorated amount
    if package_id and package_id in SOFTWARE_PACKAGES:
        # Create a special prorate transaction
        transaction_id = str(uuid.uuid4())
        
        # Store pending upgrade
        await db.pending_plan_changes.insert_one({
            "id": transaction_id,
            "user_email": user_email,
            "product_id": product_id,
            "change_type": "upgrade",
            "current_plan": current_sub.get("plan"),
            "new_plan": new_plan_name.lower(),
            "new_plan_id": new_plan_id,
            "prorate_amount": prorate_amount,
            "status": "pending_payment",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Create checkout session
        try:
            from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
            api_key = os.environ.get("STRIPE_SECRET_KEY") or os.environ.get("STRIPE_API_KEY")
            if not api_key:
                raise HTTPException(status_code=500, detail="Payment system not configured")
            
            success_url = f"{request.get('origin_url', 'https://datavision.co.tz')}/billing?upgrade=success"
            cancel_url = f"{request.get('origin_url', 'https://datavision.co.tz')}/billing?upgrade=cancelled"
            
            stripe_checkout = StripeCheckout(api_key=api_key)
            checkout_request = CheckoutSessionRequest(
                product_name=f"Upgrade to {new_plan_name} (Prorated)",
                unit_amount=int(prorate_amount * 100),
                currency="usd",
                quantity=1,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "type": "upgrade",
                    "transaction_id": transaction_id,
                    "user_email": user_email,
                    "product_id": product_id,
                    "new_plan_id": new_plan_id
                }
            )
            
            session = await stripe_checkout.create_checkout_session(checkout_request)
            
            # Update pending change with session ID
            await db.pending_plan_changes.update_one(
                {"id": transaction_id},
                {"$set": {"stripe_session_id": session.session_id}}
            )
            
            return {
                "checkout_url": session.url,
                "prorated_amount": prorate_amount,
                "message": f"Pay ${prorate_amount} to upgrade to {new_plan_name}"
            }
        except Exception as e:
            logger.error(f"Stripe checkout error: {e}")
            raise HTTPException(status_code=500, detail="Failed to create checkout session")
    
    raise HTTPException(status_code=400, detail="Invalid package configuration")

@api_router.post("/billing/downgrade")
async def downgrade_subscription(
    request: dict,
    payload: dict = Depends(verify_token)
):
    """
    Schedule a downgrade to a lower plan.
    Takes effect at the end of current billing period.
    """
    user_email = payload.get("sub")
    product_id = request.get("product_id")
    new_plan_id = request.get("new_plan_id")
    
    if not all([product_id, new_plan_id]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # Get current subscription
    current_sub = await db.user_subscriptions.find_one(
        {"user_email": user_email, "product_id": product_id, "status": "active"}
    )
    
    if not current_sub:
        raise HTTPException(status_code=400, detail="No active subscription found")
    
    # Verify it's actually a downgrade
    current_price = 0
    new_price = 0
    new_plan_name = ""
    
    if product_id in PRODUCT_PRICING:
        for plan in PRODUCT_PRICING[product_id]["plans"]:
            if plan.get("id") == current_sub.get("plan_id") or plan.get("name", "").lower() == current_sub.get("plan", "").lower():
                current_price = plan.get("price", 0)
            if plan.get("id") == new_plan_id:
                new_price = plan.get("price", 0)
                new_plan_name = plan.get("name", "")
    
    if new_price >= current_price:
        raise HTTPException(status_code=400, detail="New plan must be lower tier. Use upgrade endpoint instead.")
    
    # Check for existing pending downgrade
    existing = await db.pending_plan_changes.find_one(
        {"user_email": user_email, "product_id": product_id, "status": "pending"}
    )
    
    if existing:
        # Update existing pending downgrade
        await db.pending_plan_changes.update_one(
            {"_id": existing["_id"]},
            {"$set": {
                "new_plan": new_plan_name.lower(),
                "new_plan_id": new_plan_id,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        # Create pending downgrade
        await db.pending_plan_changes.insert_one({
            "id": str(uuid.uuid4()),
            "user_email": user_email,
            "product_id": product_id,
            "change_type": "downgrade",
            "current_plan": current_sub.get("plan"),
            "new_plan": new_plan_name.lower(),
            "new_plan_id": new_plan_id,
            "effective_date": current_sub.get("expires_at"),
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    return {
        "message": f"Downgrade to {new_plan_name} scheduled",
        "effective_date": current_sub.get("expires_at"),
        "current_plan": current_sub.get("plan"),
        "new_plan": new_plan_name
    }

@api_router.post("/billing/cancel")
async def cancel_subscription(
    request: dict,
    payload: dict = Depends(verify_token)
):
    """
    Cancel subscription.
    Access continues until end of billing period.
    """
    user_email = payload.get("sub")
    product_id = request.get("product_id")
    
    if not product_id:
        raise HTTPException(status_code=400, detail="Product ID required")
    
    # Get current subscription
    current_sub = await db.user_subscriptions.find_one(
        {"user_email": user_email, "product_id": product_id, "status": "active"}
    )
    
    if not current_sub:
        raise HTTPException(status_code=400, detail="No active subscription found")
    
    # Mark as cancelled (will not renew)
    await db.user_subscriptions.update_one(
        {"_id": current_sub["_id"]},
        {"$set": {
            "status": "cancelled",
            "cancelled_at": datetime.now(timezone.utc).isoformat(),
            "cancellation_effective_date": current_sub.get("expires_at")
        }}
    )
    
    # Remove any pending plan changes
    await db.pending_plan_changes.delete_many(
        {"user_email": user_email, "product_id": product_id}
    )
    
    return {
        "message": "Subscription cancelled",
        "access_until": current_sub.get("expires_at")
    }

@api_router.post("/billing/reactivate")
async def reactivate_subscription(
    request: dict,
    payload: dict = Depends(verify_token)
):
    """Reactivate a cancelled subscription before it expires"""
    user_email = payload.get("sub")
    product_id = request.get("product_id")
    
    if not product_id:
        raise HTTPException(status_code=400, detail="Product ID required")
    
    result = await db.user_subscriptions.update_one(
        {"user_email": user_email, "product_id": product_id, "status": "cancelled"},
        {"$set": {
            "status": "active",
            "reactivated_at": datetime.now(timezone.utc).isoformat()
        },
        "$unset": {"cancelled_at": "", "cancellation_effective_date": ""}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No cancelled subscription found to reactivate")
    
    return {"message": "Subscription reactivated"}

# Import and include Survey360 routes (ALL 46 route modules from GitHub)
from survey360.survey360_main import survey360_router as survey360_full_router, init_survey360_db
# Keep the basic routes for backward compatibility with existing frontend
from routes.survey360_routes import router as survey360_basic_router, create_survey360_demo_user

# Import and include FieldForce routes (original GitHub code)
from fieldforce.fieldforce_main import fieldforce_router

# Import and include DataPulse routes
from routes.datapulse_routes import router as datapulse_router, create_datapulse_routes

# Import and include DataViz Studio routes
from dataviz_studio.dataviz_main import dataviz_router

# Import Admin Dashboard routes
from routes.admin_dashboard_routes import router as admin_dashboard_router, create_admin_dashboard_routes

# Import Careers routes
from routes.careers_routes import router as careers_router, create_careers_routes

# Import Content Management routes
from routes.content_routes import router as content_router, create_content_routes

# Import Projects & Clients routes
from routes.projects_routes import router as projects_router, create_projects_routes

# Include Survey360 basic router (for existing frontend compatibility)
api_router.include_router(survey360_basic_router)

# Include Survey360 full router (all 46 modules from GitHub)
api_router.include_router(survey360_full_router)

# Include FieldForce router (all original routes from GitHub)
api_router.include_router(fieldforce_router)

# Include DataPulse router
create_datapulse_routes(db)
api_router.include_router(datapulse_router)

# Include DataViz Studio router
api_router.include_router(dataviz_router)

# Include Admin Dashboard routes
create_admin_dashboard_routes(db)
api_router.include_router(admin_dashboard_router)

# Include Careers routes
create_careers_routes(db)
api_router.include_router(careers_router)

# Include Content Management routes
create_content_routes(db)
api_router.include_router(content_router)

# Include Projects & Clients routes
create_projects_routes(db)
api_router.include_router(projects_router)

# ==================== WEBSOCKET NOTIFICATIONS ====================

@app.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket):
    """
    WebSocket endpoint for real-time admin notifications.
    Connect from frontend: new WebSocket('ws://host/ws/notifications')
    """
    admin_email = None
    try:
        # Accept connection
        await notification_manager.connect(websocket, admin_email)
        
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                # Handle authentication message
                if message.get("type") == "auth" and message.get("token"):
                    try:
                        payload = jwt.decode(message["token"], SECRET_KEY, algorithms=[ALGORITHM])
                        admin_email = payload.get("sub")
                        # Re-register with email
                        notification_manager.disconnect(websocket, None)
                        await notification_manager.connect(websocket, admin_email)
                        await websocket.send_json({"type": "auth", "status": "authenticated", "email": admin_email})
                    except:
                        await websocket.send_json({"type": "auth", "status": "failed"})
                # Handle ping/pong for keepalive
                elif message.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": datetime.now(timezone.utc).isoformat()})
            except:
                pass
                
    except WebSocketDisconnect:
        notification_manager.disconnect(websocket, admin_email)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        notification_manager.disconnect(websocket, admin_email)


@api_router.get("/notifications/test")
async def test_notification(payload: dict = Depends(verify_token)):
    """Test endpoint to trigger a sample notification."""
    await notification_manager.send_notification(
        notification_type="test",
        title="Test Notification",
        description="This is a test notification from the admin panel.",
        data={"test": True},
        priority="normal"
    )
    return {"message": "Test notification sent", "connections": notification_manager.get_connection_count()}


@api_router.get("/notifications/status")
async def notification_status(payload: dict = Depends(verify_token)):
    """Get WebSocket connection status."""
    return {
        "active_connections": notification_manager.get_connection_count(),
        "connected_admins": notification_manager.get_connected_admins()
    }

# ==================== PUBLIC CONTENT ROUTES (MODULARIZED) ====================
from routes.public_content_routes import create_public_content_router

public_content_router = create_public_content_router(db, verify_admin_token)
api_router.include_router(public_content_router)

# ==================== AFFILIATE PROGRAM ROUTES ====================
from routes.affiliate import create_affiliate_router

affiliate_router = create_affiliate_router(db, verify_token, verify_admin_token)
api_router.include_router(affiliate_router, prefix="/affiliates")

# ==================== AUTH ROUTES (MODULARIZED) ====================
from routes.auth_routes import create_auth_routes
auth_router = create_auth_routes(db)
api_router.include_router(auth_router)

# ==================== EMAIL SERVICE ROUTES ====================
from routes.email_routes import router as email_router
api_router.include_router(email_router)

# ==================== EMAIL PREFERENCES ROUTES ====================
from routes.email_preferences_routes import create_email_preferences_router
email_prefs_router = create_email_preferences_router(db, verify_token)
api_router.include_router(email_prefs_router)

# ==================== USER REFERRAL ROUTES ====================
from routes.referral_routes import create_referral_routes
from services.email_service import email_service
referral_router = create_referral_routes(db, verify_token, email_service)
api_router.include_router(referral_router)

# ==================== ADMIN REFERRAL MANAGEMENT ROUTES ====================
from routes.admin_referral_routes import create_admin_referral_routes
admin_referral_router = create_admin_referral_routes(db, verify_admin_token)
api_router.include_router(admin_referral_router)

# ==================== SHORTENED REFERRAL LINK REDIRECT ====================
from fastapi.responses import RedirectResponse

@api_router.get("/r/{referral_code}")
async def redirect_referral_link(referral_code: str):
    """
    Shortened referral link redirect.
    /api/r/CODE -> tracks click and redirects to main site with ref parameter
    """
    # Find affiliate by referral code
    affiliate = await db.affiliates.find_one({
        "referral_code": referral_code.upper(),
        "status": "approved"
    })
    
    if not affiliate:
        # If code not found, still redirect to main site (graceful degradation)
        return RedirectResponse(url="https://datavision.co.tz", status_code=302)
    
    # Log the click
    click_data = {
        "id": str(uuid.uuid4()),
        "affiliate_id": affiliate["id"],
        "referral_code": referral_code.upper(),
        "ip_address": "redirect",
        "user_agent": "",
        "referer": "shortened_link",
        "landing_page": f"/api/r/{referral_code}",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.affiliate_clicks.insert_one(click_data)
    
    # Update click count
    await db.affiliates.update_one(
        {"id": affiliate["id"]},
        {"$inc": {"total_clicks": 1}}
    )
    
    # Redirect to main site with ref parameter
    redirect_url = f"https://datavision.co.tz/?ref={referral_code.upper()}"
    return RedirectResponse(url=redirect_url, status_code=302)

# Then include api_router in app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    # Store db reference for survey360 routes
    app.state.db = db
    # Create demo user for Survey360
    await create_survey360_demo_user(db)
    
    # Initialize Survey360 full database (from GitHub)
    await init_survey360_db(db)
    
    # Create FieldForce database indexes (from original GitHub code)
    try:
        # Users
        await db.users.create_index("email", unique=True)
        await db.users.create_index("id", unique=True)
        
        # Organizations
        await db.organizations.create_index("slug", unique=True)
        await db.organizations.create_index("id", unique=True)
        
        # Org Members
        await db.org_members.create_index([("org_id", 1), ("user_id", 1)], unique=True)
        
        # Projects
        await db.projects.create_index("id", unique=True)
        await db.projects.create_index([("org_id", 1), ("status", 1)])
        
        # Forms
        await db.forms.create_index("id", unique=True)
        await db.forms.create_index([("project_id", 1), ("status", 1)])
        
        # Submissions
        await db.submissions.create_index("id", unique=True)
        await db.submissions.create_index([("form_id", 1), ("submitted_at", -1)])
        await db.submissions.create_index([("org_id", 1), ("submitted_at", -1)])
        await db.submissions.create_index([("project_id", 1), ("status", 1)])
        
        # Cases
        await db.cases.create_index("id", unique=True)
        await db.cases.create_index([("project_id", 1), ("respondent_id", 1)], unique=True)
        
        # Lookup Datasets
        await db.lookup_datasets.create_index("id", unique=True)
        await db.lookup_datasets.create_index([("org_id", 1), ("is_active", 1)])
        
        # Device Management
        await db.devices.create_index("id", unique=True)
        await db.devices.create_index([("org_id", 1), ("user_id", 1)])
        await db.devices.create_index([("org_id", 1), ("status", 1)])
        await db.device_activity_logs.create_index([("device_id", 1), ("timestamp", -1)])
        
        # Paradata Sessions
        await db.paradata_sessions.create_index("id", unique=True)
        await db.paradata_sessions.create_index([("submission_id", 1)])
        
        # Quality Alerts
        await db.quality_alerts.create_index("id", unique=True)
        await db.quality_alerts.create_index([("org_id", 1), ("status", 1)])
        
    except Exception as e:
        print(f"Error creating FieldForce indexes: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
