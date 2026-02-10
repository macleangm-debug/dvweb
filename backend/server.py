from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hashlib
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

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUser

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

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: AdminLogin):
    """
    Admin login - only for DataVision administrators.
    Regular Survey360 customers cannot login here.
    """
    # Only check DataVision admins
    admin = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    if admin and verify_password(credentials.password, admin["password"]):
        token = create_access_token({"sub": admin["email"], "id": admin["id"]})
        return TokenResponse(
            access_token=token,
            user=AdminUser(id=admin["id"], email=admin["email"], name=admin.get("name", "Administrator"))
        )
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

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

@api_router.get("/auth/me", response_model=AdminUser)
async def get_current_user(payload: dict = Depends(verify_token)):
    admin = await db.admins.find_one({"email": payload["sub"]}, {"_id": 0, "password": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="User not found")
    return AdminUser(**admin)

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "DataVision International API", "status": "operational"}

@api_router.get("/projects", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None, sector: Optional[str] = None):
    query = {}
    if featured is not None:
        query["featured"] = featured
    if sector:
        query["sector"] = sector
    projects = await db.projects.find(query, {"_id": 0}).sort("year", -1).to_list(100)
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@api_router.get("/team", response_model=List[TeamMember])
async def get_team():
    team = await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(50)
    return team

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(featured: Optional[bool] = None):
    query = {"featured": True} if featured else {}
    testimonials = await db.testimonials.find(query, {"_id": 0}).to_list(50)
    return testimonials

@api_router.get("/statistics", response_model=List[Statistic])
async def get_statistics():
    stats = await db.statistics.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    return stats

@api_router.get("/news", response_model=List[NewsArticle])
async def get_news(limit: int = 10):
    news = await db.news.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return news

@api_router.get("/news/{article_id}", response_model=NewsArticle)
async def get_news_article(article_id: str):
    article = await db.news.find_one({"id": article_id, "published": True}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@api_router.get("/partners", response_model=List[Partner])
async def get_partners():
    partners = await db.partners.find({}, {"_id": 0}).sort("order", 1).to_list(50)
    return partners

@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryCreate):
    # Bot protection: honeypot field should be empty
    if inquiry.honeypot:
        logger.warning(f"Bot detected: honeypot field filled")
        # Return success to not alert bot, but don't save
        return Inquiry(**inquiry.model_dump())
    
    inquiry_obj = Inquiry(**inquiry.model_dump())
    doc = inquiry_obj.model_dump()
    await db.inquiries.insert_one(doc)
    logger.info(f"New inquiry from {inquiry.email}: {inquiry.subject}")
    return inquiry_obj

# ==================== ADMIN ROUTES ====================

@api_router.post("/admin/projects", response_model=Project)
async def create_project(project: ProjectCreate, _: dict = Depends(verify_token)):
    project_obj = Project(**project.model_dump())
    doc = project_obj.model_dump()
    await db.projects.insert_one(doc)
    return project_obj

@api_router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate, _: dict = Depends(verify_token)):
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": project.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
    return Project(**updated)

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, _: dict = Depends(verify_token)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

@api_router.post("/admin/team", response_model=TeamMember)
async def create_team_member(member: TeamMemberCreate, _: dict = Depends(verify_token)):
    member_obj = TeamMember(**member.model_dump())
    doc = member_obj.model_dump()
    await db.team.insert_one(doc)
    return member_obj

@api_router.put("/admin/team/{member_id}", response_model=TeamMember)
async def update_team_member(member_id: str, member: TeamMemberCreate, _: dict = Depends(verify_token)):
    result = await db.team.update_one(
        {"id": member_id},
        {"$set": member.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    updated = await db.team.find_one({"id": member_id}, {"_id": 0})
    return TeamMember(**updated)

@api_router.delete("/admin/team/{member_id}")
async def delete_team_member(member_id: str, _: dict = Depends(verify_token)):
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted"}

@api_router.post("/admin/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate, _: dict = Depends(verify_token)):
    testimonial_obj = Testimonial(**testimonial.model_dump())
    doc = testimonial_obj.model_dump()
    await db.testimonials.insert_one(doc)
    return testimonial_obj

@api_router.put("/admin/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial: TestimonialCreate, _: dict = Depends(verify_token)):
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": testimonial.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    return Testimonial(**updated)

@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, _: dict = Depends(verify_token)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted"}

@api_router.post("/admin/statistics", response_model=Statistic)
async def create_statistic(stat: StatisticCreate, _: dict = Depends(verify_token)):
    stat_obj = Statistic(**stat.model_dump())
    doc = stat_obj.model_dump()
    await db.statistics.insert_one(doc)
    return stat_obj

@api_router.put("/admin/statistics/{stat_id}", response_model=Statistic)
async def update_statistic(stat_id: str, stat: StatisticCreate, _: dict = Depends(verify_token)):
    result = await db.statistics.update_one(
        {"id": stat_id},
        {"$set": stat.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Statistic not found")
    updated = await db.statistics.find_one({"id": stat_id}, {"_id": 0})
    return Statistic(**updated)

@api_router.delete("/admin/statistics/{stat_id}")
async def delete_statistic(stat_id: str, _: dict = Depends(verify_token)):
    result = await db.statistics.delete_one({"id": stat_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Statistic not found")
    return {"message": "Statistic deleted"}

@api_router.post("/admin/news", response_model=NewsArticle)
async def create_news(article: NewsArticleCreate, _: dict = Depends(verify_token)):
    article_obj = NewsArticle(**article.model_dump())
    doc = article_obj.model_dump()
    await db.news.insert_one(doc)
    return article_obj

@api_router.put("/admin/news/{article_id}", response_model=NewsArticle)
async def update_news(article_id: str, article: NewsArticleCreate, _: dict = Depends(verify_token)):
    result = await db.news.update_one(
        {"id": article_id},
        {"$set": article.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    updated = await db.news.find_one({"id": article_id}, {"_id": 0})
    return NewsArticle(**updated)

@api_router.delete("/admin/news/{article_id}")
async def delete_news(article_id: str, _: dict = Depends(verify_token)):
    result = await db.news.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted"}

@api_router.get("/admin/inquiries", response_model=List[Inquiry])
async def get_inquiries(_: dict = Depends(verify_token)):
    inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return inquiries

@api_router.put("/admin/inquiries/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str, _: dict = Depends(verify_token)):
    result = await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated"}

@api_router.post("/admin/partners", response_model=Partner)
async def create_partner(partner: PartnerCreate, _: dict = Depends(verify_token)):
    partner_obj = Partner(**partner.model_dump())
    doc = partner_obj.model_dump()
    await db.partners.insert_one(doc)
    return partner_obj

@api_router.delete("/admin/partners/{partner_id}")
async def delete_partner(partner_id: str, _: dict = Depends(verify_token)):
    result = await db.partners.delete_one({"id": partner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"message": "Partner deleted"}

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
SOFTWARE_PACKAGES = {
    # Survey360 - Subscription
    "survey360_monthly": {"name": "Survey360 Monthly", "amount": 99.00, "type": "subscription", "product_id": "survey360"},
    "survey360_annual": {"name": "Survey360 Annual", "amount": 990.00, "type": "subscription", "product_id": "survey360"},
    "survey360_enterprise": {"name": "Survey360 Enterprise", "amount": 0.00, "type": "enterprise", "product_id": "survey360"},
    
    # DataViz Studio - Subscription
    "dataviz_monthly": {"name": "DataViz Studio Monthly", "amount": 79.00, "type": "subscription", "product_id": "dataviz-studio"},
    "dataviz_annual": {"name": "DataViz Studio Annual", "amount": 790.00, "type": "subscription", "product_id": "dataviz-studio"},
    
    # M&E Tracker - Subscription
    "me_tracker_monthly": {"name": "M&E Tracker Monthly", "amount": 149.00, "type": "subscription", "product_id": "me-tracker"},
    "me_tracker_annual": {"name": "M&E Tracker Annual", "amount": 1490.00, "type": "subscription", "product_id": "me-tracker"},
    
    # FieldForce - Per-seat licensing
    "fieldforce_10seats": {"name": "FieldForce (10 seats)", "amount": 499.00, "type": "package", "product_id": "fieldforce"},
    "fieldforce_50seats": {"name": "FieldForce (50 seats)", "amount": 1999.00, "type": "package", "product_id": "fieldforce"},
    "fieldforce_unlimited": {"name": "FieldForce Unlimited", "amount": 4999.00, "type": "package", "product_id": "fieldforce"},
    
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
            # First time marking as paid - create product access
            access_record = {
                "id": str(uuid.uuid4()),
                "user_email": transaction.get("user_email"),
                "product_id": transaction.get("product_id"),
                "package_id": transaction.get("package_id"),
                "transaction_id": transaction.get("id"),
                "granted_at": datetime.now(timezone.utc).isoformat(),
                "expires_at": None,  # Will be set based on package type
                "status": "active"
            }
            await db.product_access.insert_one(access_record)
    
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

@api_router.get("/user/products")
async def get_user_products(email: str):
    """Get products a user has access to"""
    access_records = await db.product_access.find(
        {"user_email": email, "status": "active"},
        {"_id": 0}
    ).to_list(100)
    return {"products": access_records}

# Import and include Survey360 routes (ALL 46 route modules from GitHub)
from survey360.survey360_main import survey360_router as survey360_full_router, init_survey360_db
# Keep the basic routes for backward compatibility with existing frontend
from routes.survey360_routes import router as survey360_basic_router, create_survey360_demo_user

# Import and include FieldForce routes (original GitHub code)
from fieldforce.fieldforce_main import fieldforce_router

# Include Survey360 basic router (for existing frontend compatibility)
api_router.include_router(survey360_basic_router)

# Include Survey360 full router (all 46 modules from GitHub)
api_router.include_router(survey360_full_router)

# Include FieldForce router (all original routes from GitHub)
api_router.include_router(fieldforce_router)

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
