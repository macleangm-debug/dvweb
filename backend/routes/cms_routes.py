"""
DataVision International - CMS Clients Routes
Admin routes for managing clients/users for marketing
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional

from .auth_routes import verify_token

router = APIRouter(prefix="/admin", tags=["CMS Clients"])


def create_cms_routes(db):
    """Factory function to create CMS routes with database dependency"""
    
    @router.get("/users")
    async def get_all_users(
        product: Optional[str] = None,
        country: Optional[str] = None,
        industry: Optional[str] = None,
        payload: dict = Depends(verify_token)
    ):
        """Get all registered clients with optional filters for CMS."""
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

    return router
