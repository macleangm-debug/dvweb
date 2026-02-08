"""
DataVision International - Admin Content Routes
Protected admin endpoints for managing content
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List

from models import (
    Project, ProjectCreate, TeamMember, TeamMemberCreate,
    Testimonial, TestimonialCreate, Statistic, StatisticCreate,
    NewsArticle, NewsArticleCreate, Partner, PartnerCreate, Inquiry
)
from routes.auth import verify_token

router = APIRouter(prefix="/admin", tags=["Admin Content"])


def create_routes(db):
    """Factory function to create routes with database dependency"""
    
    # ==================== PROJECTS ====================
    
    @router.post("/projects", response_model=Project)
    async def create_project(project: ProjectCreate, _: dict = Depends(verify_token)):
        project_data = Project(**project.model_dump())
        await db.projects.insert_one(project_data.model_dump())
        return project_data

    @router.put("/projects/{project_id}", response_model=Project)
    async def update_project(project_id: str, project: ProjectCreate, _: dict = Depends(verify_token)):
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": project.model_dump()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
        return updated

    @router.delete("/projects/{project_id}")
    async def delete_project(project_id: str, _: dict = Depends(verify_token)):
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted"}

    # ==================== TEAM ====================
    
    @router.post("/team", response_model=TeamMember)
    async def create_team_member(member: TeamMemberCreate, _: dict = Depends(verify_token)):
        member_data = TeamMember(**member.model_dump())
        await db.team.insert_one(member_data.model_dump())
        return member_data

    @router.put("/team/{member_id}", response_model=TeamMember)
    async def update_team_member(member_id: str, member: TeamMemberCreate, _: dict = Depends(verify_token)):
        result = await db.team.update_one(
            {"id": member_id},
            {"$set": member.model_dump()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        updated = await db.team.find_one({"id": member_id}, {"_id": 0})
        return updated

    @router.delete("/team/{member_id}")
    async def delete_team_member(member_id: str, _: dict = Depends(verify_token)):
        result = await db.team.delete_one({"id": member_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        return {"message": "Team member deleted"}

    # ==================== TESTIMONIALS ====================
    
    @router.post("/testimonials", response_model=Testimonial)
    async def create_testimonial(testimonial: TestimonialCreate, _: dict = Depends(verify_token)):
        testimonial_data = Testimonial(**testimonial.model_dump())
        await db.testimonials.insert_one(testimonial_data.model_dump())
        return testimonial_data

    @router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
    async def update_testimonial(testimonial_id: str, testimonial: TestimonialCreate, _: dict = Depends(verify_token)):
        result = await db.testimonials.update_one(
            {"id": testimonial_id},
            {"$set": testimonial.model_dump()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
        return updated

    @router.delete("/testimonials/{testimonial_id}")
    async def delete_testimonial(testimonial_id: str, _: dict = Depends(verify_token)):
        result = await db.testimonials.delete_one({"id": testimonial_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial deleted"}

    # ==================== STATISTICS ====================
    
    @router.post("/statistics", response_model=Statistic)
    async def create_statistic(statistic: StatisticCreate, _: dict = Depends(verify_token)):
        stat_data = Statistic(**statistic.model_dump())
        await db.statistics.insert_one(stat_data.model_dump())
        return stat_data

    @router.put("/statistics/{stat_id}", response_model=Statistic)
    async def update_statistic(stat_id: str, statistic: StatisticCreate, _: dict = Depends(verify_token)):
        result = await db.statistics.update_one(
            {"id": stat_id},
            {"$set": statistic.model_dump()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Statistic not found")
        updated = await db.statistics.find_one({"id": stat_id}, {"_id": 0})
        return updated

    @router.delete("/statistics/{stat_id}")
    async def delete_statistic(stat_id: str, _: dict = Depends(verify_token)):
        result = await db.statistics.delete_one({"id": stat_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Statistic not found")
        return {"message": "Statistic deleted"}

    # ==================== NEWS ====================
    
    @router.get("/news", response_model=List[NewsArticle])
    async def get_all_news(_: dict = Depends(verify_token)):
        news = await db.news.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        return news

    @router.post("/news", response_model=NewsArticle)
    async def create_news(article: NewsArticleCreate, _: dict = Depends(verify_token)):
        article_data = NewsArticle(**article.model_dump())
        await db.news.insert_one(article_data.model_dump())
        return article_data

    @router.put("/news/{article_id}", response_model=NewsArticle)
    async def update_news(article_id: str, article: NewsArticleCreate, _: dict = Depends(verify_token)):
        result = await db.news.update_one(
            {"id": article_id},
            {"$set": article.model_dump()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        updated = await db.news.find_one({"id": article_id}, {"_id": 0})
        return updated

    @router.delete("/news/{article_id}")
    async def delete_news(article_id: str, _: dict = Depends(verify_token)):
        result = await db.news.delete_one({"id": article_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"message": "Article deleted"}

    # ==================== PARTNERS ====================
    
    @router.post("/partners", response_model=Partner)
    async def create_partner(partner: PartnerCreate, _: dict = Depends(verify_token)):
        partner_data = Partner(**partner.model_dump())
        await db.partners.insert_one(partner_data.model_dump())
        return partner_data

    @router.put("/partners/{partner_id}", response_model=Partner)
    async def update_partner(partner_id: str, partner: PartnerCreate, _: dict = Depends(verify_token)):
        result = await db.partners.update_one(
            {"id": partner_id},
            {"$set": partner.model_dump()}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
        updated = await db.partners.find_one({"id": partner_id}, {"_id": 0})
        return updated

    @router.delete("/partners/{partner_id}")
    async def delete_partner(partner_id: str, _: dict = Depends(verify_token)):
        result = await db.partners.delete_one({"id": partner_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
        return {"message": "Partner deleted"}

    # ==================== INQUIRIES ====================
    
    @router.get("/inquiries", response_model=List[Inquiry])
    async def get_inquiries(_: dict = Depends(verify_token)):
        inquiries = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        return inquiries

    @router.put("/inquiries/{inquiry_id}/status")
    async def update_inquiry_status(inquiry_id: str, status: str, _: dict = Depends(verify_token)):
        result = await db.inquiries.update_one(
            {"id": inquiry_id},
            {"$set": {"status": status}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return {"message": "Status updated"}

    @router.delete("/inquiries/{inquiry_id}")
    async def delete_inquiry(inquiry_id: str, _: dict = Depends(verify_token)):
        result = await db.inquiries.delete_one({"id": inquiry_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return {"message": "Inquiry deleted"}
    
    return router
