"""
Admin Referral Management Routes
Provides admin endpoints for managing the user referral program
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone, timedelta
import uuid

router = APIRouter(prefix="/admin/referrals", tags=["Admin - Referrals"])


class CreditAdjustment(BaseModel):
    user_id: str
    amount: float
    reason: str


class ReferralConfig(BaseModel):
    signup_bonus: float
    purchase_bonus: float
    referee_bonus: float
    max_referrals_per_month: int


def create_admin_referral_routes(db, verify_admin_token):
    """Create admin referral routes with database dependency"""
    
    @router.get("/stats")
    async def get_referral_program_stats(payload: dict = Depends(verify_admin_token)):
        """Get overall referral program statistics"""
        # Total referrers
        total_referrers = await db.user_referrals.count_documents({})
        
        # Active referrers (made at least 1 referral)
        active_referrers = await db.user_referrals.count_documents({"total_referrals": {"$gte": 1}})
        
        # Total referrals made
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$total_referrals"}}}
        ]
        result = await db.user_referrals.aggregate(pipeline).to_list(1)
        total_referrals = result[0]["total"] if result else 0
        
        # Successful conversions
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$successful_referrals"}}}
        ]
        result = await db.user_referrals.aggregate(pipeline).to_list(1)
        successful_referrals = result[0]["total"] if result else 0
        
        # Total credits issued
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$total_credits_earned"}}}
        ]
        result = await db.user_referrals.aggregate(pipeline).to_list(1)
        total_credits_issued = result[0]["total"] if result else 0
        
        # Total credits redeemed
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$credits_used"}}}
        ]
        result = await db.user_referrals.aggregate(pipeline).to_list(1)
        total_credits_redeemed = result[0]["total"] if result else 0
        
        # This month's stats
        month_start = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        month_referrals = await db.referral_invites.count_documents({
            "created_at": {"$gte": month_start.isoformat()}
        })
        month_signups = await db.referral_invites.count_documents({
            "status": {"$in": ["signed_up", "converted"]},
            "signed_up_at": {"$gte": month_start.isoformat()}
        })
        
        return {
            "overview": {
                "total_referrers": total_referrers,
                "active_referrers": active_referrers,
                "total_referrals": total_referrals,
                "successful_conversions": successful_referrals,
                "conversion_rate": round((successful_referrals / total_referrals * 100) if total_referrals > 0 else 0, 1)
            },
            "credits": {
                "total_issued": total_credits_issued,
                "total_redeemed": total_credits_redeemed,
                "outstanding": total_credits_issued - total_credits_redeemed
            },
            "this_month": {
                "referrals": month_referrals,
                "signups": month_signups,
                "conversion_rate": round((month_signups / month_referrals * 100) if month_referrals > 0 else 0, 1)
            }
        }
    
    @router.get("/leaderboard")
    async def get_referral_leaderboard(
        limit: int = Query(20, ge=1, le=100),
        sort_by: str = Query("successful_referrals", enum=["successful_referrals", "total_referrals", "total_credits_earned"]),
        payload: dict = Depends(verify_admin_token)
    ):
        """Get top referrers leaderboard"""
        # Get top referrers
        referrers = await db.user_referrals.find(
            {"total_referrals": {"$gte": 1}},
            {"_id": 0}
        ).sort(sort_by, -1).limit(limit).to_list(limit)
        
        # Enrich with user info
        leaderboard = []
        for idx, referrer in enumerate(referrers):
            user = await db.datavision_users.find_one(
                {"id": referrer["user_id"]},
                {"_id": 0, "name": 1, "email": 1, "created_at": 1}
            )
            if not user:
                user = await db.admins.find_one(
                    {"id": referrer["user_id"]},
                    {"_id": 0, "name": 1, "email": 1, "created_at": 1}
                )
            
            leaderboard.append({
                "rank": idx + 1,
                "user_id": referrer["user_id"],
                "name": user.get("name", "Unknown") if user else "Unknown",
                "email": user.get("email", "") if user else "",
                "referral_code": referrer.get("referral_code"),
                "total_referrals": referrer.get("total_referrals", 0),
                "successful_referrals": referrer.get("successful_referrals", 0),
                "pending_referrals": referrer.get("pending_referrals", 0),
                "total_credits_earned": referrer.get("total_credits_earned", 0),
                "credits_available": referrer.get("credits_available", 0),
                "conversion_rate": round(
                    (referrer.get("successful_referrals", 0) / referrer.get("total_referrals", 1)) * 100, 1
                ),
                "affiliate_potential": referrer.get("successful_referrals", 0) >= 5,
                "member_since": user.get("created_at") if user else None
            })
        
        return {
            "leaderboard": leaderboard,
            "total_count": len(leaderboard)
        }
    
    @router.get("/users")
    async def get_all_referral_users(
        page: int = Query(1, ge=1),
        limit: int = Query(20, ge=1, le=100),
        search: Optional[str] = None,
        payload: dict = Depends(verify_admin_token)
    ):
        """Get all users with referral profiles"""
        query = {}
        if search:
            query["$or"] = [
                {"referral_code": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        
        skip = (page - 1) * limit
        total = await db.user_referrals.count_documents(query)
        
        referrers = await db.user_referrals.find(
            query,
            {"_id": 0}
        ).sort("total_credits_earned", -1).skip(skip).limit(limit).to_list(limit)
        
        # Enrich with user info
        users = []
        for referrer in referrers:
            user = await db.datavision_users.find_one(
                {"id": referrer["user_id"]},
                {"_id": 0, "name": 1, "email": 1}
            )
            if not user:
                user = await db.admins.find_one(
                    {"id": referrer["user_id"]},
                    {"_id": 0, "name": 1, "email": 1}
                )
            
            users.append({
                **referrer,
                "name": user.get("name") if user else "Unknown",
                "email": user.get("email") if user else ""
            })
        
        return {
            "users": users,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    
    @router.get("/user/{user_id}")
    async def get_user_referral_details(user_id: str, payload: dict = Depends(verify_admin_token)):
        """Get detailed referral info for a specific user"""
        referral = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        
        if not referral:
            raise HTTPException(status_code=404, detail="Referral profile not found")
        
        # Get user info
        user = await db.datavision_users.find_one({"id": user_id}, {"_id": 0, "name": 1, "email": 1})
        if not user:
            user = await db.admins.find_one({"id": user_id}, {"_id": 0, "name": 1, "email": 1})
        
        # Get invites sent
        invites = await db.referral_invites.find(
            {"referrer_id": user_id},
            {"_id": 0}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        # Get credit transactions
        transactions = await db.credit_transactions.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        return {
            "profile": referral,
            "user": user,
            "invites": invites,
            "transactions": transactions
        }
    
    @router.post("/credits/adjust")
    async def adjust_user_credits(
        adjustment: CreditAdjustment,
        payload: dict = Depends(verify_admin_token)
    ):
        """Manually adjust a user's credits (add or subtract)"""
        admin_id = payload.get("user_id") or payload.get("id")
        
        referral = await db.user_referrals.find_one({"user_id": adjustment.user_id})
        
        if not referral:
            raise HTTPException(status_code=404, detail="Referral profile not found")
        
        current_balance = referral.get("credits_available", 0)
        new_balance = current_balance + adjustment.amount
        
        if new_balance < 0:
            raise HTTPException(status_code=400, detail="Cannot reduce balance below zero")
        
        # Update balance
        update_fields = {
            "credits_available": new_balance,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if adjustment.amount > 0:
            update_fields["total_credits_earned"] = referral.get("total_credits_earned", 0) + adjustment.amount
        
        await db.user_referrals.update_one(
            {"user_id": adjustment.user_id},
            {"$set": update_fields}
        )
        
        # Record transaction
        await db.credit_transactions.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": adjustment.user_id,
            "type": "admin_adjustment",
            "amount": adjustment.amount,
            "description": f"Admin adjustment: {adjustment.reason}",
            "admin_id": admin_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {
            "message": "Credits adjusted successfully",
            "previous_balance": current_balance,
            "adjustment": adjustment.amount,
            "new_balance": new_balance
        }
    
    @router.get("/conversions")
    async def get_conversion_timeline(
        days: int = Query(30, ge=7, le=90),
        payload: dict = Depends(verify_admin_token)
    ):
        """Get conversion data over time"""
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        # Get daily conversion data
        pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": start_date.isoformat()}
                }
            },
            {
                "$project": {
                    "date": {"$substr": ["$created_at", 0, 10]},
                    "status": 1
                }
            },
            {
                "$group": {
                    "_id": "$date",
                    "invites_sent": {"$sum": 1},
                    "signups": {
                        "$sum": {
                            "$cond": [{"$in": ["$status", ["signed_up", "converted"]]}, 1, 0]
                        }
                    },
                    "conversions": {
                        "$sum": {"$cond": [{"$eq": ["$status", "converted"]}, 1, 0]}
                    }
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        daily_data = await db.referral_invites.aggregate(pipeline).to_list(100)
        
        return {
            "timeline": [
                {
                    "date": item["_id"],
                    "invites_sent": item["invites_sent"],
                    "signups": item["signups"],
                    "conversions": item["conversions"]
                }
                for item in daily_data
            ],
            "period_days": days
        }
    
    @router.get("/potential-affiliates")
    async def get_potential_affiliates(
        min_referrals: int = Query(5, ge=1),
        payload: dict = Depends(verify_admin_token)
    ):
        """Get users who could be promoted to affiliates based on referral performance"""
        # Find high-performing referrers who are not yet affiliates
        potential = await db.user_referrals.find(
            {"successful_referrals": {"$gte": min_referrals}},
            {"_id": 0}
        ).sort("successful_referrals", -1).to_list(50)
        
        results = []
        for referrer in potential:
            # Check if already an affiliate
            is_affiliate = await db.affiliates.find_one({"user_id": referrer["user_id"]})
            if is_affiliate:
                continue
            
            # Get user info
            user = await db.datavision_users.find_one(
                {"id": referrer["user_id"]},
                {"_id": 0, "name": 1, "email": 1}
            )
            if not user:
                user = await db.admins.find_one(
                    {"id": referrer["user_id"]},
                    {"_id": 0, "name": 1, "email": 1}
                )
            
            results.append({
                "user_id": referrer["user_id"],
                "name": user.get("name") if user else "Unknown",
                "email": user.get("email") if user else "",
                "referral_code": referrer.get("referral_code"),
                "successful_referrals": referrer.get("successful_referrals", 0),
                "total_credits_earned": referrer.get("total_credits_earned", 0),
                "conversion_rate": round(
                    (referrer.get("successful_referrals", 0) / max(referrer.get("total_referrals", 1), 1)) * 100, 1
                )
            })
        
        return {
            "potential_affiliates": results,
            "count": len(results),
            "threshold": min_referrals
        }
    
    @router.post("/promote-to-affiliate/{user_id}")
    async def promote_to_affiliate(user_id: str, payload: dict = Depends(verify_admin_token)):
        """Promote a top referrer to affiliate status"""
        import secrets
        
        # Check if already an affiliate
        existing = await db.affiliates.find_one({"user_id": user_id})
        if existing:
            raise HTTPException(status_code=400, detail="User is already an affiliate")
        
        # Get user info
        user = await db.datavision_users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            user = await db.admins.find_one({"id": user_id}, {"_id": 0})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get referral profile
        referral = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        
        # Create affiliate record
        affiliate_code = secrets.token_urlsafe(6).upper()[:8]
        affiliate = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "email": user.get("email"),
            "name": user.get("name"),
            "referral_code": affiliate_code,
            "status": "approved",  # Auto-approve since promoted
            "commission_rate": 15,  # 15% default
            "total_earnings": 0,
            "pending_earnings": 0,
            "paid_earnings": 0,
            "referred_sales": 0,
            "promoted_from_referral": True,
            "original_referral_code": referral.get("referral_code") if referral else None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "approved_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.affiliates.insert_one(affiliate)
        
        return {
            "message": "User promoted to affiliate successfully",
            "affiliate_id": affiliate["id"],
            "affiliate_code": affiliate_code,
            "commission_rate": 15
        }
    
    return router
