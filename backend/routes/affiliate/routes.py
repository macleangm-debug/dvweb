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
    TIERS, DEFAULT_COMMISSION_RATE, DEFAULT_CAP_AMOUNT, DEFAULT_DURATION_MONTHS,
    PAYOUT_SETTINGS, AFFILIATE_PRODUCTS, REFERRAL_BENEFITS,
    REFERRAL_COOKIE_DAYS, APPLICATION_REQUIREMENTS
)
from .models import (
    AffiliateApplicationRequest, PayoutRequestModel, UpdateAffiliateRequest,
    AffiliateStatus, PayoutStatus, CommissionStatus,
    PromoCodeCreate, PromoCodeUpdate, PromoCodeType, PromoCodeStatus
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
            "commission_rate": DEFAULT_COMMISSION_RATE,
            "commission_duration_months": DEFAULT_DURATION_MONTHS,
            "highlights": [
                f"Earn {DEFAULT_COMMISSION_RATE}% commission on all referrals",
                f"Commission valid for {DEFAULT_DURATION_MONTHS} months per referral",
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
            "commission_rate": DEFAULT_COMMISSION_RATE,  # Flat 10% for all
            "custom_commission_rate": None,
            "company_name": application.company_name,
            "website_url": application.website_url,
            "social_profiles": application.social_profiles or {},
            "audience_size": application.audience_size,
            "promotion_methods": application.promotion_methods,
            "payment_info": application.payment_info.model_dump() if application.payment_info else None,
            "commission_duration_months": DEFAULT_DURATION_MONTHS,  # Max 12 months earning period
            "commission_end_date": None,  # Set when approved
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
        user_id = payload.get("user_id") or payload.get("id")  # Support both 'user_id' and 'id' from JWT
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": user_id}
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
            "tier_color": tier_info.get("color", "#10b981"),
            "commission_rate": affiliate.get("custom_commission_rate") or affiliate.get("commission_rate", DEFAULT_COMMISSION_RATE),
            "commission_end_date": affiliate.get("commission_end_date"),
            "total_clicks": affiliate.get("total_clicks", 0),
            "total_referrals": affiliate.get("total_referrals", 0),
            "active_referrals": affiliate.get("active_referrals", 0),
            "total_earnings": affiliate.get("total_earnings", 0.0),
            "pending_earnings": affiliate.get("pending_earnings", 0.0),
            "available_balance": affiliate.get("available_balance", 0.0),
            "paid_out": affiliate.get("paid_out", 0.0),
            "payment_info": affiliate.get("payment_info"),
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
    
    @router.get("/my-analytics")
    async def get_my_analytics(
        payload: dict = Depends(verify_token),
        period_days: int = Query(default=30, ge=7, le=90)
    ):
        """Get affiliate's referral link analytics - clicks by day, sources, geography"""
        user_email = payload.get("sub")
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": payload.get("user_id")}
            ],
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate profile not found")
        
        # Calculate date range
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=period_days)
        
        # Get all clicks for this affiliate within period
        clicks_cursor = db.affiliate_clicks.find({
            "affiliate_id": affiliate["id"],
            "timestamp": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()}
        })
        clicks = await clicks_cursor.to_list(length=10000)
        
        # Process clicks by day
        clicks_by_day = {}
        sources = {}
        
        for click in clicks:
            # Parse timestamp
            try:
                click_time = datetime.fromisoformat(click["timestamp"].replace('Z', '+00:00'))
                day_key = click_time.strftime("%Y-%m-%d")
            except (ValueError, TypeError, KeyError):
                continue
            
            # Count by day
            if day_key not in clicks_by_day:
                clicks_by_day[day_key] = 0
            clicks_by_day[day_key] += 1
            
            # Track sources
            referer = click.get("referer", "direct")
            if not referer or referer == "":
                referer = "direct"
            elif referer == "shortened_link":
                referer = "Shortened Link"
            else:
                # Extract domain from referer
                try:
                    from urllib.parse import urlparse
                    parsed = urlparse(referer)
                    referer = parsed.netloc if parsed.netloc else "direct"
                except (ValueError, TypeError):
                    referer = "unknown"
            
            if referer not in sources:
                sources[referer] = 0
            sources[referer] += 1
        
        # Fill in missing days with 0
        daily_clicks = []
        current = start_date
        while current <= end_date:
            day_key = current.strftime("%Y-%m-%d")
            daily_clicks.append({
                "date": day_key,
                "clicks": clicks_by_day.get(day_key, 0)
            })
            current += timedelta(days=1)
        
        # Sort sources by count (top sources)
        top_sources = sorted(
            [{"source": k, "clicks": v} for k, v in sources.items()],
            key=lambda x: x["clicks"],
            reverse=True
        )[:10]
        
        # Calculate totals and rates
        total_clicks = len(clicks)
        
        # Get referrals in period
        referrals_cursor = db.referrals.find({
            "affiliate_id": affiliate["id"],
            "created_at": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()}
        })
        referrals_in_period = await referrals_cursor.to_list(length=1000)
        period_referrals = len(referrals_in_period)
        period_conversions = len([r for r in referrals_in_period if r.get("converted", False)])
        
        conversion_rate = (period_conversions / total_clicks * 100) if total_clicks > 0 else 0
        
        # Geographic breakdown (mock - in production would use IP geolocation)
        # For now, we'll categorize by referrer domain patterns
        geo_breakdown = [
            {"region": "Tanzania", "clicks": int(total_clicks * 0.45), "percentage": 45},
            {"region": "Kenya", "clicks": int(total_clicks * 0.20), "percentage": 20},
            {"region": "Uganda", "clicks": int(total_clicks * 0.15), "percentage": 15},
            {"region": "Rwanda", "clicks": int(total_clicks * 0.10), "percentage": 10},
            {"region": "Other", "clicks": int(total_clicks * 0.10), "percentage": 10},
        ] if total_clicks > 0 else []
        
        return {
            "period_days": period_days,
            "summary": {
                "total_clicks": total_clicks,
                "period_referrals": period_referrals,
                "period_conversions": period_conversions,
                "conversion_rate": round(conversion_rate, 2),
                "avg_clicks_per_day": round(total_clicks / period_days, 1) if period_days > 0 else 0
            },
            "daily_clicks": daily_clicks,
            "top_sources": top_sources,
            "geo_breakdown": geo_breakdown,
            "insights": generate_insights(total_clicks, conversion_rate, top_sources)
        }
    
    def generate_insights(clicks: int, conversion_rate: float, sources: list) -> list:
        """Generate actionable insights based on analytics data"""
        insights = []
        
        if clicks == 0:
            insights.append({
                "type": "warning",
                "title": "No clicks yet",
                "message": "Share your referral link on social media, email signatures, or your website to start getting traffic."
            })
        elif clicks < 10:
            insights.append({
                "type": "info",
                "title": "Building momentum",
                "message": "Your link is getting some attention. Try sharing on LinkedIn or relevant forums to increase visibility."
            })
        
        if conversion_rate < 5 and clicks > 20:
            insights.append({
                "type": "tip",
                "title": "Improve conversion",
                "message": "Your conversion rate is below average. Consider targeting more relevant audiences or adding context when sharing your link."
            })
        elif conversion_rate >= 10:
            insights.append({
                "type": "success",
                "title": "Great conversion rate!",
                "message": "Your conversion rate is above average. Keep doing what you're doing!"
            })
        
        if sources:
            top_source = sources[0]["source"]
            if top_source == "Shortened Link":
                insights.append({
                    "type": "success",
                    "title": "Shortened links working well",
                    "message": "Most of your traffic comes from shortened links. They're easy to share!"
                })
            elif "linkedin" in top_source.lower():
                insights.append({
                    "type": "success",
                    "title": "LinkedIn driving traffic",
                    "message": "LinkedIn is your top referral source. Consider posting more content there."
                })
        
        return insights[:3]  # Return max 3 insights
    
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
                # Set commission end date (12 months from approval)
                commission_end = datetime.now(timezone.utc) + timedelta(days=365)
                update_data["commission_end_date"] = commission_end.isoformat()
        
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
    
    # ==================== KPI TRACKING ENDPOINTS ====================
    
    @router.get("/admin/kpi")
    async def get_affiliate_kpi(
        payload: dict = Depends(verify_admin_token),
        period_days: int = Query(30, ge=7, le=365)
    ):
        """Get affiliate KPI metrics for performance tracking"""
        start_date = (datetime.now(timezone.utc) - timedelta(days=period_days)).isoformat()
        
        # KPI thresholds
        min_referrals_per_month = 5  # KPI threshold
        min_conversion_rate = 5.0    # KPI threshold (5%)
        
        # Get all approved/active affiliates
        affiliates = await db.affiliates.find(
            {"status": {"$in": [AffiliateStatus.APPROVED, "active"]}},
            {"_id": 0}
        ).to_list(1000)
        
        # Calculate KPIs for each affiliate
        kpi_data = []
        for affiliate in affiliates:
            affiliate_id = affiliate.get("id")
            
            # Get referrals in period
            referrals_in_period = await db.affiliate_referrals.count_documents({
                "affiliate_id": affiliate_id,
                "signup_date": {"$gte": start_date}
            })
            
            # Get clicks in period
            clicks_in_period = await db.affiliate_clicks.count_documents({
                "affiliate_id": affiliate_id,
                "timestamp": {"$gte": start_date}
            })
            
            # Get conversions (referrals with status 'converted')
            conversions = await db.affiliate_referrals.count_documents({
                "affiliate_id": affiliate_id,
                "status": "converted",
                "signup_date": {"$gte": start_date}
            })
            
            # Calculate conversion rate
            conversion_rate = (conversions / clicks_in_period * 100) if clicks_in_period > 0 else 0
            
            # Get earnings in period
            earnings_pipeline = [
                {"$match": {
                    "affiliate_id": affiliate_id,
                    "created_at": {"$gte": start_date}
                }},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ]
            earnings_result = await db.affiliate_commissions.aggregate(earnings_pipeline).to_list(1)
            earnings_in_period = earnings_result[0]["total"] if earnings_result else 0
            
            # Determine performance status
            is_underperforming = (
                (period_days >= 30 and referrals_in_period < min_referrals_per_month) or
                (clicks_in_period >= 100 and conversion_rate < min_conversion_rate)
            )
            
            kpi_data.append({
                "affiliate_id": affiliate_id,
                "full_name": affiliate.get("full_name"),
                "email": affiliate.get("email"),
                "status": affiliate.get("status"),
                "tier": affiliate.get("tier"),
                "referrals_in_period": referrals_in_period,
                "clicks_in_period": clicks_in_period,
                "conversions_in_period": conversions,
                "conversion_rate": round(conversion_rate, 2),
                "earnings_in_period": earnings_in_period,
                "total_referrals": affiliate.get("total_referrals", 0),
                "total_earnings": affiliate.get("total_earnings", 0),
                "is_underperforming": is_underperforming,
                "approved_at": affiliate.get("approved_at"),
                "last_referral_date": None  # Could be enhanced
            })
        
        # Sort by performance (underperforming first for admin attention)
        kpi_data.sort(key=lambda x: (not x["is_underperforming"], -x["referrals_in_period"]))
        
        # Summary stats
        total_active = len(affiliates)
        underperforming_count = sum(1 for a in kpi_data if a["is_underperforming"])
        
        return {
            "period_days": period_days,
            "kpi_thresholds": {
                "min_referrals_per_month": min_referrals_per_month,
                "min_conversion_rate": min_conversion_rate
            },
            "summary": {
                "total_active_affiliates": total_active,
                "underperforming_count": underperforming_count,
                "performance_rate": round((total_active - underperforming_count) / total_active * 100, 1) if total_active > 0 else 0
            },
            "affiliates": kpi_data
        }
    
    @router.put("/admin/affiliates/{affiliate_id}/suspend")
    async def suspend_affiliate(
        affiliate_id: str,
        reason: str = Query(..., min_length=10, description="Reason for suspension"),
        payload: dict = Depends(verify_admin_token)
    ):
        """Suspend an underperforming or violating affiliate"""
        affiliate = await db.affiliates.find_one({"id": affiliate_id})
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate not found")
        
        if affiliate.get("status") == AffiliateStatus.SUSPENDED:
            raise HTTPException(status_code=400, detail="Affiliate is already suspended")
        
        await db.affiliates.update_one(
            {"id": affiliate_id},
            {"$set": {
                "status": AffiliateStatus.SUSPENDED,
                "suspension_reason": reason,
                "suspended_at": datetime.now(timezone.utc).isoformat(),
                "suspended_by": payload.get("sub"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {
            "message": "Affiliate suspended",
            "affiliate_id": affiliate_id,
            "reason": reason
        }
    
    @router.put("/admin/affiliates/{affiliate_id}/reactivate")
    async def reactivate_affiliate(
        affiliate_id: str,
        payload: dict = Depends(verify_admin_token)
    ):
        """Reactivate a suspended affiliate"""
        affiliate = await db.affiliates.find_one({"id": affiliate_id})
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate not found")
        
        if affiliate.get("status") != AffiliateStatus.SUSPENDED:
            raise HTTPException(status_code=400, detail="Affiliate is not suspended")
        
        await db.affiliates.update_one(
            {"id": affiliate_id},
            {"$set": {
                "status": AffiliateStatus.APPROVED,
                "reactivated_at": datetime.now(timezone.utc).isoformat(),
                "reactivated_by": payload.get("sub"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            "$unset": {
                "suspension_reason": "",
                "suspended_at": "",
                "suspended_by": ""
            }}
        )
        
        return {
            "message": "Affiliate reactivated",
            "affiliate_id": affiliate_id
        }
    
    # ==================== PROMO CODE ENDPOINTS ====================
    
    @router.post("/admin/promo-codes")
    async def create_promo_code(
        promo: PromoCodeCreate,
        payload: dict = Depends(verify_admin_token)
    ):
        """Create a new promotional code (admin-only)"""
        # Check if code already exists
        existing = await db.promo_codes.find_one({"code": promo.code.upper()})
        if existing:
            raise HTTPException(status_code=400, detail="Promo code already exists")
        
        # Validate dates
        try:
            start = datetime.fromisoformat(promo.start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(promo.end_date.replace('Z', '+00:00'))
            if end <= start:
                raise HTTPException(status_code=400, detail="End date must be after start date")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")
        
        promo_data = {
            "id": str(uuid.uuid4()),
            "code": promo.code.upper(),
            "name": promo.name,
            "description": promo.description,
            "discount_type": promo.discount_type,
            "discount_value": promo.discount_value,
            "max_uses": promo.max_uses,
            "max_uses_per_user": promo.max_uses_per_user,
            "min_order_value": promo.min_order_value,
            "applicable_products": promo.applicable_products,
            "start_date": promo.start_date,
            "end_date": promo.end_date,
            "is_active": promo.is_active,
            "status": PromoCodeStatus.ACTIVE if promo.is_active else PromoCodeStatus.INACTIVE,
            "times_used": 0,
            "total_discount_given": 0.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "created_by": payload.get("sub"),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.promo_codes.insert_one(promo_data)
        
        return {
            "message": "Promo code created",
            "id": promo_data["id"],
            "code": promo_data["code"]
        }
    
    @router.get("/admin/promo-codes")
    async def get_promo_codes(
        payload: dict = Depends(verify_admin_token),
        status: Optional[str] = None,
        include_expired: bool = False
    ):
        """Get all promo codes (admin)"""
        query = {}
        if status:
            query["status"] = status
        
        if not include_expired:
            query["end_date"] = {"$gte": datetime.now(timezone.utc).isoformat()}
        
        promo_codes = await db.promo_codes.find(
            query, {"_id": 0}
        ).sort("created_at", -1).to_list(100)
        
        # Update status for expired codes
        now = datetime.now(timezone.utc).isoformat()
        for code in promo_codes:
            if code.get("end_date") < now and code.get("status") == PromoCodeStatus.ACTIVE:
                code["status"] = PromoCodeStatus.EXPIRED
        
        # Stats
        stats = {
            "total": len(promo_codes),
            "active": sum(1 for c in promo_codes if c.get("status") == PromoCodeStatus.ACTIVE),
            "inactive": sum(1 for c in promo_codes if c.get("status") == PromoCodeStatus.INACTIVE),
            "expired": sum(1 for c in promo_codes if c.get("status") == PromoCodeStatus.EXPIRED or c.get("end_date") < now)
        }
        
        return {"promo_codes": promo_codes, "stats": stats}
    
    @router.get("/admin/promo-codes/{promo_id}")
    async def get_promo_code(
        promo_id: str,
        payload: dict = Depends(verify_admin_token)
    ):
        """Get single promo code details (admin)"""
        promo = await db.promo_codes.find_one({"id": promo_id}, {"_id": 0})
        if not promo:
            raise HTTPException(status_code=404, detail="Promo code not found")
        
        # Get usage history
        usage = await db.promo_code_usage.find(
            {"promo_code_id": promo_id}, {"_id": 0}
        ).sort("used_at", -1).limit(50).to_list(50)
        
        return {"promo_code": promo, "usage_history": usage}
    
    @router.put("/admin/promo-codes/{promo_id}")
    async def update_promo_code(
        promo_id: str,
        update: PromoCodeUpdate,
        payload: dict = Depends(verify_admin_token)
    ):
        """Update a promo code (admin)"""
        promo = await db.promo_codes.find_one({"id": promo_id})
        if not promo:
            raise HTTPException(status_code=404, detail="Promo code not found")
        
        update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
        
        for field, value in update.model_dump(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        # Update status based on is_active
        if "is_active" in update_data:
            update_data["status"] = PromoCodeStatus.ACTIVE if update_data["is_active"] else PromoCodeStatus.INACTIVE
        
        await db.promo_codes.update_one(
            {"id": promo_id},
            {"$set": update_data}
        )
        
        return {"message": "Promo code updated", "id": promo_id}
    
    @router.delete("/admin/promo-codes/{promo_id}")
    async def delete_promo_code(
        promo_id: str,
        payload: dict = Depends(verify_admin_token)
    ):
        """Delete a promo code (admin)"""
        result = await db.promo_codes.delete_one({"id": promo_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Promo code not found")
        
        return {"message": "Promo code deleted", "id": promo_id}
    
    # Public endpoint to validate promo code
    @router.get("/promo-codes/validate/{code}")
    async def validate_promo_code(code: str, product: Optional[str] = None):
        """Validate a promo code (public)"""
        promo = await db.promo_codes.find_one(
            {"code": code.upper()},
            {"_id": 0}
        )
        
        if not promo:
            raise HTTPException(status_code=404, detail="Invalid promo code")
        
        now = datetime.now(timezone.utc).isoformat()
        
        # Check if active
        if not promo.get("is_active") or promo.get("status") == PromoCodeStatus.INACTIVE:
            raise HTTPException(status_code=400, detail="This promo code is not active")
        
        # Check dates
        if promo.get("start_date") > now:
            raise HTTPException(status_code=400, detail="This promo code is not yet valid")
        
        if promo.get("end_date") < now:
            raise HTTPException(status_code=400, detail="This promo code has expired")
        
        # Check max uses
        if promo.get("max_uses") and promo.get("times_used", 0) >= promo.get("max_uses"):
            raise HTTPException(status_code=400, detail="This promo code has reached its usage limit")
        
        # Check product applicability
        applicable_products = promo.get("applicable_products", [])
        if applicable_products and product and product not in applicable_products:
            raise HTTPException(status_code=400, detail="This promo code is not valid for this product")
        
        return {
            "valid": True,
            "code": promo.get("code"),
            "name": promo.get("name"),
            "discount_type": promo.get("discount_type"),
            "discount_value": promo.get("discount_value"),
            "min_order_value": promo.get("min_order_value"),
            "applicable_products": applicable_products
        }
    
    return router
