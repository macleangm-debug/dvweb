"""
Content Management Routes
Handles news articles, team members, testimonials, and partner logos
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

router = APIRouter(prefix="/content", tags=["Content Management"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"

# ==================== MODELS ====================

class Article(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    author: str
    tags: Optional[List[str]] = []
    image_url: Optional[str] = None
    status: str = "draft"  # draft, published, scheduled

class TeamMember(BaseModel):
    name: str
    role: str
    bio: str
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order: int = 0

class Testimonial(BaseModel):
    name: str
    role: str
    company: str
    content: str
    rating: int = 5
    image_url: Optional[str] = None

class Partner(BaseModel):
    name: str
    logo_url: str
    type: str  # client, partner, sponsor
    website_url: Optional[str] = None

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_content_routes(db):
    """Factory function to create content management routes with database dependency"""
    
    # ==================== ARTICLES ====================
    
    @router.get("/articles")
    async def get_articles(status: Optional[str] = None, category: Optional[str] = None, limit: int = 50):
        """Get all articles (public can see published only)."""
        query = {}
        if status:
            query["status"] = status
        if category:
            query["category"] = category
        
        articles = await db.articles.find(query, {"_id": 0}).sort("published_date", -1).to_list(limit)
        return articles
    
    @router.get("/articles/{article_id}")
    async def get_article(article_id: str):
        """Get a specific article."""
        article = await db.articles.find_one({"id": article_id}, {"_id": 0})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Increment view count
        await db.articles.update_one({"id": article_id}, {"$inc": {"views": 1}})
        
        return article
    
    @router.post("/articles")
    async def create_article(article_data: Article, payload: dict = Depends(verify_token)):
        """Create a new article."""
        article = {
            "id": str(uuid.uuid4()),
            "title": article_data.title,
            "excerpt": article_data.excerpt,
            "content": article_data.content,
            "category": article_data.category,
            "author": article_data.author,
            "tags": article_data.tags,
            "image_url": article_data.image_url,
            "status": article_data.status,
            "views": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "published_date": datetime.now(timezone.utc).isoformat() if article_data.status == "published" else None,
            "created_by": payload.get("email")
        }
        await db.articles.insert_one(article)
        return {"message": "Article created", "id": article["id"]}
    
    @router.put("/articles/{article_id}")
    async def update_article(article_id: str, article_data: dict, payload: dict = Depends(verify_token)):
        """Update an article."""
        article_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        # Set published_date if publishing for the first time
        if article_data.get("status") == "published":
            existing = await db.articles.find_one({"id": article_id})
            if existing and not existing.get("published_date"):
                article_data["published_date"] = datetime.now(timezone.utc).isoformat()
        
        result = await db.articles.update_one(
            {"id": article_id},
            {"$set": article_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"message": "Article updated"}
    
    @router.delete("/articles/{article_id}")
    async def delete_article(article_id: str, payload: dict = Depends(verify_token)):
        """Delete an article."""
        result = await db.articles.delete_one({"id": article_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"message": "Article deleted"}
    
    @router.post("/articles/{article_id}/publish")
    async def publish_article(article_id: str, payload: dict = Depends(verify_token)):
        """Publish an article."""
        result = await db.articles.update_one(
            {"id": article_id},
            {"$set": {
                "status": "published",
                "published_date": datetime.now(timezone.utc).isoformat()
            }}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Article not found")
        return {"message": "Article published"}
    
    # ==================== TEAM MEMBERS ====================
    
    @router.get("/team")
    async def get_team_members():
        """Get all team members (public endpoint)."""
        members = await db.team_members.find({}, {"_id": 0}).sort("order", 1).to_list(50)
        return members
    
    @router.post("/team")
    async def create_team_member(member_data: TeamMember, payload: dict = Depends(verify_token)):
        """Create a new team member."""
        member = {
            "id": str(uuid.uuid4()),
            "name": member_data.name,
            "role": member_data.role,
            "bio": member_data.bio,
            "image_url": member_data.image_url,
            "linkedin_url": member_data.linkedin_url,
            "order": member_data.order,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.team_members.insert_one(member)
        return {"message": "Team member created", "id": member["id"]}
    
    @router.put("/team/{member_id}")
    async def update_team_member(member_id: str, member_data: dict, payload: dict = Depends(verify_token)):
        """Update a team member."""
        result = await db.team_members.update_one(
            {"id": member_id},
            {"$set": member_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        return {"message": "Team member updated"}
    
    @router.delete("/team/{member_id}")
    async def delete_team_member(member_id: str, payload: dict = Depends(verify_token)):
        """Delete a team member."""
        result = await db.team_members.delete_one({"id": member_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        return {"message": "Team member deleted"}
    
    # ==================== TESTIMONIALS ====================
    
    @router.get("/testimonials")
    async def get_testimonials():
        """Get all testimonials (public endpoint)."""
        testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(50)
        return testimonials
    
    @router.post("/testimonials")
    async def create_testimonial(testimonial_data: Testimonial, payload: dict = Depends(verify_token)):
        """Create a new testimonial."""
        testimonial = {
            "id": str(uuid.uuid4()),
            "name": testimonial_data.name,
            "role": testimonial_data.role,
            "company": testimonial_data.company,
            "content": testimonial_data.content,
            "rating": testimonial_data.rating,
            "image_url": testimonial_data.image_url,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.testimonials.insert_one(testimonial)
        return {"message": "Testimonial created", "id": testimonial["id"]}
    
    @router.put("/testimonials/{testimonial_id}")
    async def update_testimonial(testimonial_id: str, testimonial_data: dict, payload: dict = Depends(verify_token)):
        """Update a testimonial."""
        result = await db.testimonials.update_one(
            {"id": testimonial_id},
            {"$set": testimonial_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial updated"}
    
    @router.delete("/testimonials/{testimonial_id}")
    async def delete_testimonial(testimonial_id: str, payload: dict = Depends(verify_token)):
        """Delete a testimonial."""
        result = await db.testimonials.delete_one({"id": testimonial_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        return {"message": "Testimonial deleted"}
    
    # ==================== PARTNERS ====================
    
    @router.get("/partners")
    async def get_partners(type: Optional[str] = None):
        """Get all partners (public endpoint)."""
        query = {}
        if type:
            query["type"] = type
        partners = await db.partners.find(query, {"_id": 0}).to_list(50)
        return partners
    
    @router.post("/partners")
    async def create_partner(partner_data: Partner, payload: dict = Depends(verify_token)):
        """Create a new partner."""
        partner = {
            "id": str(uuid.uuid4()),
            "name": partner_data.name,
            "logo_url": partner_data.logo_url,
            "type": partner_data.type,
            "website_url": partner_data.website_url,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.partners.insert_one(partner)
        return {"message": "Partner created", "id": partner["id"]}
    
    @router.put("/partners/{partner_id}")
    async def update_partner(partner_id: str, partner_data: dict, payload: dict = Depends(verify_token)):
        """Update a partner."""
        result = await db.partners.update_one(
            {"id": partner_id},
            {"$set": partner_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
        return {"message": "Partner updated"}
    
    @router.delete("/partners/{partner_id}")
    async def delete_partner(partner_id: str, payload: dict = Depends(verify_token)):
        """Delete a partner."""
        result = await db.partners.delete_one({"id": partner_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
        return {"message": "Partner deleted"}
    
    # ==================== CONTENT STATISTICS ====================
    
    @router.get("/stats")
    async def get_content_stats(payload: dict = Depends(verify_token)):
        """Get content statistics."""
        total_articles = await db.articles.count_documents({})
        published_articles = await db.articles.count_documents({"status": "published"})
        draft_articles = await db.articles.count_documents({"status": "draft"})
        
        # Get total views
        pipeline = [{"$group": {"_id": None, "total_views": {"$sum": "$views"}}}]
        views_result = await db.articles.aggregate(pipeline).to_list(1)
        total_views = views_result[0]["total_views"] if views_result else 0
        
        team_count = await db.team_members.count_documents({})
        testimonials_count = await db.testimonials.count_documents({})
        partners_count = await db.partners.count_documents({})
        
        return {
            "articles": {
                "total": total_articles,
                "published": published_articles,
                "drafts": draft_articles,
                "totalViews": total_views
            },
            "teamMembers": team_count,
            "testimonials": testimonials_count,
            "partners": partners_count
        }
    
    return router
