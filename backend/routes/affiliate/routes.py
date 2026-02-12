"""
Affiliate System API Routes
FastAPI router for affiliate program functionality
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Query
from typing import Optional, List
from datetime import datetime, timezone, timedelta
import uuid
import hashlib
import random
import string

from .config import (
    TIERS, DEFAULT_COMMISSION_RATE, DEFAULT_CAP_AMOUNT,
    PAYOUT_SETTINGS, AFFILIATE_PRODUCTS, REFERRAL_BENEFITS,
    REFERRAL_COOKIE_DAYS, APPLICATION_REQUIREMENTS
)
from .models import (
    AffiliateApplicationRequest, PayoutRequestModel, UpdateAffiliateRequest,
    AffiliateStatus, PayoutStatus, CommissionStatus
)


def create_affiliate_router(db, verify_token, verify_admin_token):
    """
    Factory function to create affiliate router with injected dependencies
    
    Args:
        db: MongoDB database instance
        verify_token: Dependency for user authentication
        verify_admin_token: Dependency for admin authentication
    """
    
    router = APIRouter(tags=["Affiliates"])
    
    # ==================== HELPER FUNCTIONS ====================
    
    def generate_referral_code(email: str) -> str:
        """Generate unique referral code"""
        base = email.split('@')[0][:6].upper()
        suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"{base}{suffix}"
    
    def get_tier_for_referrals(referral_count: int) -> dict:
        """Get tier based on referral count"""
        for tier in TIERS:
            max_ref = tier.get("max_referrals")
            if max_ref is None or referral_count <= max_ref:
                if referral_count >= tier["min_referrals"]:
                    return tier
        return TIERS[0]  # Default to first tier
    
    def get_next_tier(current_tier: str, referral_count: int) -> tuple:
        """Get next tier and referrals needed"""
        current_idx = next((i for i, t in enumerate(TIERS) if t["name"] == current_tier), 0)
        if current_idx < len(TIERS) - 1:
            next_tier = TIERS[current_idx + 1]
            needed = next_tier["min_referrals"] - referral_count
            return next_tier["name"], max(0, needed)
        return None, 0
    
    # ==================== PUBLIC ENDPOINTS ====================
    
    @router.get("/program-info")
    async def get_program_info():
        """Get public affiliate program information"""
        return {
            "tiers": TIERS,
            "products": AFFILIATE_PRODUCTS,
            "referral_benefits": REFERRAL_BENEFITS,
            "payout_settings": {
                "min_threshold": PAYOUT_SETTINGS["min_threshold"],
                "payment_methods": PAYOUT_SETTINGS["payment_methods"],
                "currency": PAYOUT_SETTINGS["currency"]
            },
            "cookie_duration_days": REFERRAL_COOKIE_DAYS,
            "highlights": [
                f"Earn up to {TIERS[-1]['commission_rate']}% commission",
                f"Get paid via {', '.join(PAYOUT_SETTINGS['payment_methods'][:3])}",
                f"{REFERRAL_COOKIE_DAYS}-day cookie duration",
                f"Referred users get {REFERRAL_BENEFITS['discount_percent']}% off"
            ]
        }
    
    @router.post("/apply")
    async def apply_to_program(application: AffiliateApplicationRequest):
        """Submit affiliate program application"""
        if not application.agreed_to_terms:
            raise HTTPException(status_code=400, detail="You must agree to the terms")
        
        # Check if already applied
        existing = await db.affiliates.find_one({"email": application.email})
        if existing:
            if existing["status"] == AffiliateStatus.APPROVED:
                raise HTTPException(status_code=400, detail="Already an approved affiliate")
            elif existing["status"] == AffiliateStatus.PENDING:
                raise HTTPException(status_code=400, detail="Application already pending")
            elif existing["status"] == AffiliateStatus.REJECTED:
                # Allow re-application after rejection
                pass
        
        referral_code = generate_referral_code(application.email)
        
        # Check for code collision
        while await db.affiliates.find_one({"referral_code": referral_code}):
            referral_code = generate_referral_code(application.email)
        
        affiliate_data = {
            "id": str(uuid.uuid4()),
            "user_id": None,  # Will be linked when user logs in
            "email": application.email,
            "full_name": application.full_name,
            "phone": application.phone,
            "referral_code": referral_code,
            "status": AffiliateStatus.PENDING,
            "tier": TIERS[0]["name"],
            "commission_rate": TIERS[0]["commission_rate"],
            "custom_commission_rate": None,
            "company_name": application.company_name,
            "website_url": application.website_url,
            "social_profiles": application.social_profiles or {},
            "audience_size": application.audience_size,
            "promotion_methods": application.promotion_methods,
            "total_clicks": 0,
            "total_referrals": 0,
            "active_referrals": 0,
            "total_earnings": 0.0,
            "pending_earnings": 0.0,
            "available_balance": 0.0,
            "paid_out": 0.0,
            "application_data": {
                "why_join": application.why_join,
                "audience_description": application.audience_description
            },
            "notes": "",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "approved_at": None
        }
        
        if existing:
            await db.affiliates.update_one(
                {"email": application.email},
                {"$set": affiliate_data}
            )
        else:
            await db.affiliates.insert_one(affiliate_data)
        
        return {
            "message": "Application submitted successfully",
            "status": "pending",
            "referral_code": referral_code
        }
    
    @router.get("/track/{referral_code}")
    async def track_click(referral_code: str, request: Request):
        """Track affiliate link click"""
        affiliate = await db.affiliates.find_one({
            "referral_code": referral_code,
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Invalid referral code")
        
        # Log click
        click_data = {
            "id": str(uuid.uuid4()),
            "affiliate_id": affiliate["id"],
            "referral_code": referral_code,
            "ip_address": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", ""),
            "referer": request.headers.get("referer", ""),
            "landing_page": str(request.url),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.affiliate_clicks.insert_one(click_data)
        
        # Update click count
        await db.affiliates.update_one(
            {"id": affiliate["id"]},
            {"$inc": {"total_clicks": 1}}
        )
        
        return {
            "success": True,
            "referral_code": referral_code,
            "benefits": REFERRAL_BENEFITS
        }
    
    # ==================== AUTHENTICATED ENDPOINTS ====================
    
    @router.get("/my-profile")
    async def get_my_affiliate_profile(payload: dict = Depends(verify_token)):
        """Get current user's affiliate profile"""
        user_email = payload.get("sub")
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": payload.get("user_id")}
            ],
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            return {"is_affiliate": False, "message": "Not an affiliate"}
        
        # Calculate stats
        tier_info = get_tier_for_referrals(affiliate.get("total_referrals", 0))
        next_tier, referrals_needed = get_next_tier(
            affiliate.get("tier", TIERS[0]["name"]),
            affiliate.get("total_referrals", 0)
        )
        
        return {
            "is_affiliate": True,
            "id": affiliate["id"],
            "referral_code": affiliate["referral_code"],
            "referral_link": f"https://datavision.co.tz/?ref={affiliate['referral_code']}",
            "status": affiliate["status"],
            "tier": affiliate.get("tier", TIERS[0]["name"]),
            "tier_color": tier_info.get("color", "#CD7F32"),
            "commission_rate": affiliate.get("custom_commission_rate") or affiliate.get("commission_rate", DEFAULT_COMMISSION_RATE),
            "total_clicks": affiliate.get("total_clicks", 0),
            "total_referrals": affiliate.get("total_referrals", 0),
            "active_referrals": affiliate.get("active_referrals", 0),
            "total_earnings": affiliate.get("total_earnings", 0.0),
            "pending_earnings": affiliate.get("pending_earnings", 0.0),
            "available_balance": affiliate.get("available_balance", 0.0),
            "paid_out": affiliate.get("paid_out", 0.0),
            "next_tier": next_tier,
            "referrals_to_next_tier": referrals_needed,
            "created_at": affiliate.get("created_at"),
            "tier_benefits": tier_info.get("benefits", [])
        }
    
    @router.get("/my-referrals")
    async def get_my_referrals(
        payload: dict = Depends(verify_token),
        status: Optional[str] = None,
        limit: int = Query(50, le=100),
        offset: int = 0
    ):
        """Get affiliate's referrals"""
        user_email = payload.get("sub")
        
        affiliate = await db.affiliates.find_one({
            "email": user_email,
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Not an affiliate")
        
        query = {"affiliate_id": affiliate["id"]}
        if status:
            query["status"] = status
        
        referrals = await db.affiliate_referrals.find(
            query, {"_id": 0}
        ).sort("signup_date", -1).skip(offset).limit(limit).to_list(limit)
        
        total = await db.affiliate_referrals.count_documents(query)
        
        return {
            "referrals": referrals,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    @router.get("/my-commissions")
    async def get_my_commissions(
        payload: dict = Depends(verify_token),
        status: Optional[str] = None,
        limit: int = Query(50, le=100)
    ):
        """Get affiliate's commission history"""
        user_email = payload.get("sub")
        
        affiliate = await db.affiliates.find_one({
            "email": user_email,
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Not an affiliate")
        
        query = {"affiliate_id": affiliate["id"]}
        if status:
            query["status"] = status
        
        commissions = await db.affiliate_commissions.find(
            query, {"_id": 0}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        
        return {"commissions": commissions}
    
    @router.get("/my-payouts")
    async def get_my_payouts(payload: dict = Depends(verify_token)):
        """Get affiliate's payout history"""
        user_email = payload.get("sub")
        
        affiliate = await db.affiliates.find_one({
            "email": user_email,
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Not an affiliate")
        
        payouts = await db.affiliate_payouts.find(
            {"affiliate_id": affiliate["id"]}, {"_id": 0}
        ).sort("requested_at", -1).to_list(50)
        
        return {"payouts": payouts}
    
    @router.post("/request-payout")
    async def request_payout(
        request: PayoutRequestModel,
        payload: dict = Depends(verify_token)
    ):
        """Request a payout"""
        user_email = payload.get("sub")
        
        affiliate = await db.affiliates.find_one({
            "email": user_email,
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Not an affiliate")
        
        available = affiliate.get("available_balance", 0.0)
        
        if request.amount > available:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient balance. Available: ${available:.2f}"
            )
        
        if request.amount < PAYOUT_SETTINGS["min_threshold"]:
            raise HTTPException(
                status_code=400,
                detail=f"Minimum payout is ${PAYOUT_SETTINGS['min_threshold']}"
            )
        
        if request.payment_method not in PAYOUT_SETTINGS["payment_methods"]:
            raise HTTPException(status_code=400, detail="Invalid payment method")
        
        # Check for pending payout
        pending = await db.affiliate_payouts.find_one({
            "affiliate_id": affiliate["id"],
            "status": {"$in": [PayoutStatus.PENDING, PayoutStatus.PROCESSING]}
        })
        
        if pending:
            raise HTTPException(
                status_code=400,
                detail="You have a pending payout request"
            )
        
        payout_data = {
            "id": str(uuid.uuid4()),
            "affiliate_id": affiliate["id"],
            "amount": request.amount,
            "payment_method": request.payment_method,
            "payment_details": request.payment_details,
            "status": PayoutStatus.PENDING,
            "requested_at": datetime.now(timezone.utc).isoformat(),
            "processed_at": None,
            "transaction_id": None,
            "notes": ""
        }
        
        await db.affiliate_payouts.insert_one(payout_data)
        
        # Deduct from available balance
        await db.affiliates.update_one(
            {"id": affiliate["id"]},
            {"$inc": {"available_balance": -request.amount}}
        )
        
        return {
            "message": "Payout requested successfully",
            "payout_id": payout_data["id"],
            "amount": request.amount,
            "estimated_processing": f"{PAYOUT_SETTINGS['processing_days']} business days"
        }
    
    # ==================== ADMIN ENDPOINTS ====================
    
    @router.get("/admin/applications")
    async def get_affiliate_applications(
        payload: dict = Depends(verify_admin_token),
        status: Optional[str] = None,
        limit: int = 50
    ):
        """Get all affiliate applications (admin)"""
        query = {}
        if status:
            query["status"] = status
        
        applications = await db.affiliates.find(
            query, {"_id": 0}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        
        stats = {
            "total": await db.affiliates.count_documents({}),
            "pending": await db.affiliates.count_documents({"status": AffiliateStatus.PENDING}),
            "approved": await db.affiliates.count_documents({"status": AffiliateStatus.APPROVED}),
            "rejected": await db.affiliates.count_documents({"status": AffiliateStatus.REJECTED})
        }
        
        return {"applications": applications, "stats": stats}
    
    @router.put("/admin/affiliates/{affiliate_id}")
    async def update_affiliate(
        affiliate_id: str,
        update: UpdateAffiliateRequest,
        payload: dict = Depends(verify_admin_token)
    ):
        """Update affiliate status/settings (admin)"""
        affiliate = await db.affiliates.find_one({"id": affiliate_id})
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate not found")
        
        update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
        
        if update.status:
            update_data["status"] = update.status
            if update.status == AffiliateStatus.APPROVED:
                update_data["approved_at"] = datetime.now(timezone.utc).isoformat()
        
        if update.tier:
            tier = next((t for t in TIERS if t["name"] == update.tier), None)
            if tier:
                update_data["tier"] = update.tier
                update_data["commission_rate"] = tier["commission_rate"]
        
        if update.custom_commission_rate is not None:
            update_data["custom_commission_rate"] = update.custom_commission_rate
        
        if update.notes is not None:
            update_data["notes"] = update.notes
        
        await db.affiliates.update_one(
            {"id": affiliate_id},
            {"$set": update_data}
        )
        
        return {"message": "Affiliate updated", "affiliate_id": affiliate_id}
    
    @router.get("/admin/payouts")
    async def get_pending_payouts(
        payload: dict = Depends(verify_admin_token),
        status: Optional[str] = None
    ):
        """Get payout requests (admin)"""
        query = {}
        if status:
            query["status"] = status
        
        payouts = await db.affiliate_payouts.find(
            query, {"_id": 0}
        ).sort("requested_at", -1).to_list(100)
        
        # Enrich with affiliate info
        for payout in payouts:
            affiliate = await db.affiliates.find_one(
                {"id": payout["affiliate_id"]},
                {"full_name": 1, "email": 1}
            )
            if affiliate:
                payout["affiliate_name"] = affiliate.get("full_name")
                payout["affiliate_email"] = affiliate.get("email")
        
        return {"payouts": payouts}
    
    @router.put("/admin/payouts/{payout_id}")
    async def process_payout(
        payout_id: str,
        status: PayoutStatus,
        transaction_id: Optional[str] = None,
        payload: dict = Depends(verify_admin_token)
    ):
        """Process a payout request (admin)"""
        payout = await db.affiliate_payouts.find_one({"id": payout_id})
        if not payout:
            raise HTTPException(status_code=404, detail="Payout not found")
        
        update_data = {
            "status": status,
            "processed_at": datetime.now(timezone.utc).isoformat()
        }
        
        if transaction_id:
            update_data["transaction_id"] = transaction_id
        
        await db.affiliate_payouts.update_one(
            {"id": payout_id},
            {"$set": update_data}
        )
        
        # If completed, update affiliate paid_out
        if status == PayoutStatus.COMPLETED:
            await db.affiliates.update_one(
                {"id": payout["affiliate_id"]},
                {"$inc": {"paid_out": payout["amount"]}}
            )
        # If failed, refund to available balance
        elif status == PayoutStatus.FAILED:
            await db.affiliates.update_one(
                {"id": payout["affiliate_id"]},
                {"$inc": {"available_balance": payout["amount"]}}
            )
        
        return {"message": f"Payout {status}", "payout_id": payout_id}
    
    @router.get("/admin/stats")
    async def get_affiliate_stats(payload: dict = Depends(verify_admin_token)):
        """Get overall affiliate program statistics (admin)"""
        total_affiliates = await db.affiliates.count_documents({"status": AffiliateStatus.APPROVED})
        total_referrals = await db.affiliate_referrals.count_documents({})
        
        # Calculate total commissions
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        commission_result = await db.affiliate_commissions.aggregate(pipeline).to_list(1)
        total_commissions = commission_result[0]["total"] if commission_result else 0
        
        # Pending payouts
        pending_pipeline = [
            {"$match": {"status": PayoutStatus.PENDING}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        pending_result = await db.affiliate_payouts.aggregate(pending_pipeline).to_list(1)
        pending_payouts = pending_result[0]["total"] if pending_result else 0
        
        # Top affiliates
        top_affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "full_name": 1, "tier": 1, "total_referrals": 1, "total_earnings": 1}
        ).sort("total_earnings", -1).limit(10).to_list(10)
        
        return {
            "total_affiliates": total_affiliates,
            "total_referrals": total_referrals,
            "total_commissions_paid": total_commissions,
            "pending_payouts": pending_payouts,
            "top_affiliates": top_affiliates,
            "tier_distribution": {
                tier["name"]: await db.affiliates.count_documents({
                    "status": AffiliateStatus.APPROVED,
                    "tier": tier["name"]
                }) for tier in TIERS
            }
        }
    
    return router
