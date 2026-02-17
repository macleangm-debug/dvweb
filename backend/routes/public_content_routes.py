"""
Public Content API Routes
Endpoints for public website content - projects, team, news, testimonials, etc.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field
import uuid
import logging

logger = logging.getLogger(__name__)


# ==================== MODELS ====================

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    sector: str
    year: int
    client: str
    location: str
    featured: bool = False
    image_url: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectCreate(BaseModel):
    title: str
    description: str
    sector: str
    year: int
    client: str
    location: str
    featured: bool = False
    image_url: Optional[str] = None

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    bio: str
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order: int = 0

class TeamMemberCreate(BaseModel):
    name: str
    title: str
    bio: str
    photo_url: Optional[str] = None
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
    value: str
    icon: Optional[str] = None
    order: int = 0

class StatisticCreate(BaseModel):
    label: str
    value: str
    icon: Optional[str] = None
    order: int = 0

class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    author: str
    published: bool = True
    image_url: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NewsArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    author: str
    published: bool = True
    image_url: Optional[str] = None

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

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    subject: str
    message: str
    inquiry_type: str = "general"
    honeypot: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class InquiryCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    subject: str
    message: str
    inquiry_type: str = "general"
    honeypot: Optional[str] = None


def create_public_content_router(db, verify_admin_token):
    """
    Factory function to create public content router with injected dependencies
    """
    
    router = APIRouter(tags=["Public Content"])
    
    # ==================== PUBLIC ENDPOINTS ====================
    
    @router.get("/projects", response_model=List[Project])
    async def get_projects(featured: Optional[bool] = None, sector: Optional[str] = None):
        """Get all published projects"""
        query = {"title": {"$exists": True}}  # Filter out FieldForce projects (different schema)
        if featured is not None:
            query["featured"] = featured
        if sector:
            query["sector"] = sector
        projects = await db.projects.find(query, {"_id": 0}).sort("year", -1).to_list(100)
        return projects
    
    @router.get("/projects/{project_id}", response_model=Project)
    async def get_project(project_id: str):
        """Get a specific project by ID"""
        project = await db.projects.find_one({"id": project_id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    
    @router.get("/team", response_model=List[TeamMember])
    async def get_team():
        """Get all team members"""
        team = await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(50)
        return team
    
    @router.get("/testimonials", response_model=List[Testimonial])
    async def get_testimonials(featured: Optional[bool] = None):
        """Get testimonials, optionally filtered by featured status"""
        query = {"featured": True} if featured else {}
        testimonials = await db.testimonials.find(query, {"_id": 0}).to_list(50)
        return testimonials
    
    @router.get("/statistics", response_model=List[Statistic])
    async def get_statistics():
        """Get homepage statistics"""
        stats = await db.statistics.find({}, {"_id": 0}).sort("order", 1).to_list(20)
        return stats
    
    @router.get("/news", response_model=List[NewsArticle])
    async def get_news(limit: int = 10):
        """Get published news articles"""
        news = await db.news.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(limit)
        return news
    
    @router.get("/news/{article_id}", response_model=NewsArticle)
    async def get_news_article(article_id: str):
        """Get a specific news article by ID"""
        article = await db.news.find_one({"id": article_id, "published": True}, {"_id": 0})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        return article
    
    @router.get("/partners", response_model=List[Partner])
    async def get_partners():
        """Get all partners/clients"""
        partners = await db.partners.find({}, {"_id": 0}).sort("order", 1).to_list(50)
        return partners
    
    @router.post("/inquiries", response_model=Inquiry)
    async def create_inquiry(inquiry: InquiryCreate):
        """Submit a contact/inquiry form"""
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
    
    # ==================== ADMIN ENDPOINTS ====================
    
    @router.post("/admin/projects", response_model=Project)
    async def create_project(project: ProjectCreate, _: dict = Depends(verify_admin_token)):
        """Create a new project (admin only)"""
        project_obj = Project(**project.model_dump())
        doc = project_obj.model_dump()
        await db.projects.insert_one(doc)
        return project_obj
    
    @router.put("/admin/projects/{project_id}", response_model=Project)
    async def update_project(project_id: str, project: ProjectCreate, _: dict = Depends(verify_admin_token)):
        """Update an existing project (admin only)"""
        existing = await db.projects.find_one({"id": project_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Project not found")
        await db.projects.update_one({"id": project_id}, {"$set": project.model_dump()})
        updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
        return updated
    
    @router.delete("/admin/projects/{project_id}")
    async def delete_project(project_id: str, _: dict = Depends(verify_admin_token)):
        """Delete a project (admin only)"""
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted"}
    
    @router.post("/admin/team", response_model=TeamMember)
    async def create_team_member(member: TeamMemberCreate, _: dict = Depends(verify_admin_token)):
        """Add a new team member (admin only)"""
        member_obj = TeamMember(**member.model_dump())
        doc = member_obj.model_dump()
        await db.team.insert_one(doc)
        return member_obj
    
    @router.put("/admin/team/{member_id}", response_model=TeamMember)
    async def update_team_member(member_id: str, member: TeamMemberCreate, _: dict = Depends(verify_admin_token)):
        """Update a team member (admin only)"""
        existing = await db.team.find_one({"id": member_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Team member not found")
        await db.team.update_one({"id": member_id}, {"$set": member.model_dump()})
        updated = await db.team.find_one({"id": member_id}, {"_id": 0})
        return updated
    
    @router.delete("/admin/team/{member_id}")
    async def delete_team_member(member_id: str, _: dict = Depends(verify_admin_token)):
        """Delete a team member (admin only)"""
        result = await db.team.delete_one({"id": member_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        return {"message": "Team member deleted"}
    
    @router.post("/admin/testimonials", response_model=Testimonial)
    async def create_testimonial(testimonial: TestimonialCreate, _: dict = Depends(verify_admin_token)):
        """Add a new testimonial (admin only)"""
        testimonial_obj = Testimonial(**testimonial.model_dump())
        doc = testimonial_obj.model_dump()
        await db.testimonials.insert_one(doc)
        return testimonial_obj
    
    @router.put("/admin/testimonials/{testimonial_id}", response_model=Testimonial)
    async def update_testimonial(testimonial_id: str, testimonial: TestimonialCreate, _: dict = Depends(verify_admin_token)):
        """Update a testimonial (admin only)"""
        existing = await db.testimonials.find_one({"id": testimonial_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        await db.testimonials.update_one({"id": testimonial_id}, {"$set": testimonial.model_dump()})
        updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
        return updated
    
    @router.delete("/admin/testimonials/{testimonial_id}")
    async def delete_testimonial(testimonial_id: str, _: dict = Depends(verify_admin_token)):
        """Delete a testimonial (admin only)"""
        result = await db.testimonials.delete_one({"id": testimonial_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial deleted"}
    
    @router.post("/admin/statistics", response_model=Statistic)
    async def create_statistic(stat: StatisticCreate, _: dict = Depends(verify_admin_token)):
        """Add a new statistic (admin only)"""
        stat_obj = Statistic(**stat.model_dump())
        doc = stat_obj.model_dump()
        await db.statistics.insert_one(doc)
        return stat_obj
    
    @router.put("/admin/statistics/{stat_id}", response_model=Statistic)
    async def update_statistic(stat_id: str, stat: StatisticCreate, _: dict = Depends(verify_admin_token)):
        """Update a statistic (admin only)"""
        existing = await db.statistics.find_one({"id": stat_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Statistic not found")
        await db.statistics.update_one({"id": stat_id}, {"$set": stat.model_dump()})
        updated = await db.statistics.find_one({"id": stat_id}, {"_id": 0})
        return updated
    
    @router.delete("/admin/statistics/{stat_id}")
    async def delete_statistic(stat_id: str, _: dict = Depends(verify_admin_token)):
        """Delete a statistic (admin only)"""
        result = await db.statistics.delete_one({"id": stat_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Statistic not found")
        return {"message": "Statistic deleted"}
    
    @router.post("/admin/news", response_model=NewsArticle)
    async def create_news_article(article: NewsArticleCreate, _: dict = Depends(verify_admin_token)):
        """Create a new news article (admin only)"""
        article_obj = NewsArticle(**article.model_dump())
        doc = article_obj.model_dump()
        await db.news.insert_one(doc)
        return article_obj
    
    @router.put("/admin/news/{article_id}", response_model=NewsArticle)
    async def update_news_article(article_id: str, article: NewsArticleCreate, _: dict = Depends(verify_admin_token)):
        """Update a news article (admin only)"""
        existing = await db.news.find_one({"id": article_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Article not found")
        await db.news.update_one({"id": article_id}, {"$set": article.model_dump()})
        updated = await db.news.find_one({"id": article_id}, {"_id": 0})
        return updated
    
    @router.delete("/admin/news/{article_id}")
    async def delete_news_article(article_id: str, _: dict = Depends(verify_admin_token)):
        """Delete a news article (admin only)"""
        result = await db.news.delete_one({"id": article_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"message": "Article deleted"}
    
    @router.get("/admin/inquiries", response_model=List[Inquiry])
    async def get_inquiries(_: dict = Depends(verify_admin_token)):
        """Get all contact inquiries (admin only)"""
        inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        return inquiries
    
    @router.post("/admin/partners", response_model=Partner)
    async def create_partner(partner: PartnerCreate, _: dict = Depends(verify_admin_token)):
        """Add a new partner (admin only)"""
        partner_obj = Partner(**partner.model_dump())
        doc = partner_obj.model_dump()
        await db.partners.insert_one(doc)
        return partner_obj
    
    @router.put("/admin/partners/{partner_id}", response_model=Partner)
    async def update_partner(partner_id: str, partner: PartnerCreate, _: dict = Depends(verify_admin_token)):
        """Update a partner (admin only)"""
        existing = await db.partners.find_one({"id": partner_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Partner not found")
        await db.partners.update_one({"id": partner_id}, {"$set": partner.model_dump()})
        updated = await db.partners.find_one({"id": partner_id}, {"_id": 0})
        return updated
    
    @router.delete("/admin/partners/{partner_id}")
    async def delete_partner(partner_id: str, _: dict = Depends(verify_admin_token)):
        """Delete a partner (admin only)"""
        result = await db.partners.delete_one({"id": partner_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
        return {"message": "Partner deleted"}
    
    return router


# Add Depends import
from fastapi import Depends
