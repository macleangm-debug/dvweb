from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

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
    admin = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": admin["email"], "id": admin["id"]})
    return TokenResponse(
        access_token=token,
        user=AdminUser(id=admin["id"], email=admin["email"], name=admin.get("name", "Administrator"))
    )

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
                daily_rate_max=expert.get("daily_rate_max")
            ))
    
    # Sort by match score (highest first)
    matches.sort(key=lambda x: x.match_score, reverse=True)
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
            {"id": str(uuid.uuid4()), "name": "UK Aid", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/UK_aid.svg/2560px-UK_aid.svg.png", "order": 3},
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

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
