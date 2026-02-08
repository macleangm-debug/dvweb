"""
DataVision International - Public Content Routes
Public endpoints for projects, team, news, etc.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional

from models import (
    Project, TeamMember, Testimonial, Statistic, 
    NewsArticle, Partner, Inquiry, InquiryCreate
)

router = APIRouter(tags=["Public Content"])


def create_routes(db):
    """Factory function to create routes with database dependency"""
    
    @router.get("/")
    async def root():
        return {"message": "DataVision International API", "status": "online"}

    @router.get("/projects", response_model=List[Project])
    async def get_projects(featured: Optional[bool] = None, sector: Optional[str] = None):
        query = {}
        if featured is not None:
            query["featured"] = featured
        if sector:
            query["sector"] = sector
        projects = await db.projects.find(query, {"_id": 0}).to_list(100)
        return projects

    @router.get("/projects/{project_id}", response_model=Project)
    async def get_project(project_id: str):
        project = await db.projects.find_one({"id": project_id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    @router.get("/team", response_model=List[TeamMember])
    async def get_team():
        team = await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        return team

    @router.get("/testimonials", response_model=List[Testimonial])
    async def get_testimonials(featured: Optional[bool] = None):
        query = {"featured": featured} if featured is not None else {}
        testimonials = await db.testimonials.find(query, {"_id": 0}).to_list(100)
        return testimonials

    @router.get("/statistics", response_model=List[Statistic])
    async def get_statistics():
        stats = await db.statistics.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        return stats

    @router.get("/news", response_model=List[NewsArticle])
    async def get_news(limit: int = 10):
        news = await db.news.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(limit)
        return news

    @router.get("/news/{article_id}", response_model=NewsArticle)
    async def get_news_article(article_id: str):
        article = await db.news.find_one({"id": article_id}, {"_id": 0})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        return article

    @router.get("/partners", response_model=List[Partner])
    async def get_partners():
        partners = await db.partners.find({}, {"_id": 0}).sort("order", 1).to_list(100)
        return partners

    @router.post("/inquiries", response_model=Inquiry)
    async def create_inquiry(inquiry: InquiryCreate):
        # Check honeypot - if filled, it's likely a bot
        if inquiry.honeypot:
            # Silently accept but don't store
            return Inquiry(**inquiry.model_dump())
        
        inquiry_data = Inquiry(**inquiry.model_dump())
        await db.inquiries.insert_one(inquiry_data.model_dump())
        return inquiry_data
    
    return router
