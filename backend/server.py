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
