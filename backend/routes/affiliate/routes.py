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
        """Track affiliate link click with IP geolocation"""
        import httpx
        
        affiliate = await db.affiliates.find_one({
            "referral_code": referral_code,
            "status": AffiliateStatus.APPROVED
        })
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Invalid referral code")
        
        # Get IP address
        ip_address = request.client.host if request.client else "unknown"
        
        # Get geolocation from IP (using free ip-api.com service)
        geo_data = {"country": "Unknown", "city": "Unknown", "region": "Unknown"}
        try:
            if ip_address and ip_address not in ["127.0.0.1", "localhost", "unknown"]:
                async with httpx.AsyncClient(timeout=2.0) as client:
                    geo_response = await client.get(f"http://ip-api.com/json/{ip_address}?fields=status,country,regionName,city")
                    if geo_response.status_code == 200:
                        geo_json = geo_response.json()
                        if geo_json.get("status") == "success":
                            geo_data = {
                                "country": geo_json.get("country", "Unknown"),
                                "city": geo_json.get("city", "Unknown"),
                                "region": geo_json.get("regionName", "Unknown")
                            }
        except Exception:
            pass  # Silently fail geolocation - don't block click tracking
        
        # Log click with geo data
        click_data = {
            "id": str(uuid.uuid4()),
            "affiliate_id": affiliate["id"],
            "referral_code": referral_code,
            "ip_address": ip_address,
            "user_agent": request.headers.get("user-agent", ""),
            "referer": request.headers.get("referer", ""),
            "landing_page": str(request.url),
            "geo": geo_data,
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
        user_id = payload.get("user_id") or payload.get("id")  # Support both 'user_id' and 'id' from JWT
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": user_id}
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
        
        # Geographic breakdown from stored geo data in clicks
        geo_counts = {}
        for click in clicks:
            geo = click.get("geo", {})
            country = geo.get("country", "Unknown")
            if country not in geo_counts:
                geo_counts[country] = 0
            geo_counts[country] += 1
        
        # Sort by count and create breakdown
        if geo_counts and total_clicks > 0:
            sorted_geo = sorted(geo_counts.items(), key=lambda x: x[1], reverse=True)
            geo_breakdown = []
            for country, count in sorted_geo[:5]:  # Top 5 countries
                percentage = round((count / total_clicks) * 100, 1)
                geo_breakdown.append({
                    "region": country,
                    "clicks": count,
                    "percentage": percentage
                })
            # Add "Other" if there are more countries
            other_count = sum(c for _, c in sorted_geo[5:])
            if other_count > 0:
                geo_breakdown.append({
                    "region": "Other",
                    "clicks": other_count,
                    "percentage": round((other_count / total_clicks) * 100, 1)
                })
        else:
            geo_breakdown = []
        
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
    
    # ==================== PARTNER PERFORMANCE & GAMIFICATION ====================
    
    # Badge definitions
    BADGES = [
        {"id": "first_referral", "name": "First Referral", "description": "Made your first successful referral", "icon": "star", "color": "#f59e0b", "requirement": "1 referral"},
        {"id": "five_referrals", "name": "Rising Star", "description": "Reached 5 successful referrals", "icon": "trending-up", "color": "#3b82f6", "requirement": "5 referrals"},
        {"id": "ten_referrals", "name": "Growth Champion", "description": "Reached 10 successful referrals", "icon": "award", "color": "#8b5cf6", "requirement": "10 referrals"},
        {"id": "twenty_five_referrals", "name": "Elite Partner", "description": "Reached 25 successful referrals", "icon": "crown", "color": "#f97316", "requirement": "25 referrals"},
        {"id": "fifty_referrals", "name": "Legend", "description": "Reached 50 successful referrals", "icon": "zap", "color": "#ef4444", "requirement": "50 referrals"},
        {"id": "high_converter", "name": "Conversion Master", "description": "Achieved 20%+ conversion rate", "icon": "target", "color": "#10b981", "requirement": "20%+ conversion"},
        {"id": "consistent_performer", "name": "Consistent Performer", "description": "Made referrals 3 months in a row", "icon": "calendar", "color": "#6366f1", "requirement": "3 months active"},
        {"id": "top_earner", "name": "Top Earner", "description": "Earned $1,000+ in commissions", "icon": "dollar-sign", "color": "#22c55e", "requirement": "$1,000+ earned"},
        {"id": "quick_starter", "name": "Quick Starter", "description": "Made 5 referrals in first month", "icon": "rocket", "color": "#ec4899", "requirement": "5 referrals in month 1"},
        {"id": "top_10_percent", "name": "Top 10%", "description": "In the top 10% of all partners", "icon": "trophy", "color": "#eab308", "requirement": "Top 10% performance"},
    ]
    
    def calculate_badges(affiliate: dict, all_affiliates_stats: dict) -> list:
        """Calculate which badges an affiliate has earned"""
        earned_badges = []
        total_referrals = affiliate.get("total_referrals", 0)
        total_clicks = affiliate.get("total_clicks", 0)
        total_earnings = affiliate.get("total_earnings", 0)
        conversion_rate = (total_referrals / total_clicks * 100) if total_clicks > 0 else 0
        
        # Referral milestones
        if total_referrals >= 1:
            earned_badges.append("first_referral")
        if total_referrals >= 5:
            earned_badges.append("five_referrals")
        if total_referrals >= 10:
            earned_badges.append("ten_referrals")
        if total_referrals >= 25:
            earned_badges.append("twenty_five_referrals")
        if total_referrals >= 50:
            earned_badges.append("fifty_referrals")
        
        # Performance badges
        if conversion_rate >= 20:
            earned_badges.append("high_converter")
        if total_earnings >= 1000:
            earned_badges.append("top_earner")
        
        # Consistent Performer - check monthly activity
        monthly_activity = affiliate.get("monthly_activity", [])
        if len(monthly_activity) >= 3:
            # Check if last 3 months all have referrals
            consecutive_months = 0
            for month_data in sorted(monthly_activity, key=lambda x: x.get("month", ""), reverse=True)[:3]:
                if month_data.get("referrals", 0) > 0:
                    consecutive_months += 1
            if consecutive_months >= 3:
                earned_badges.append("consistent_performer")
        
        # Quick Starter - 5 referrals in first month
        first_month_referrals = affiliate.get("first_month_referrals", 0)
        if first_month_referrals >= 5:
            earned_badges.append("quick_starter")
        
        # Top 10% badge
        if all_affiliates_stats.get("top_10_threshold", 0) > 0:
            if total_referrals >= all_affiliates_stats["top_10_threshold"]:
                earned_badges.append("top_10_percent")
        
        return earned_badges
    
    @router.get("/my-performance")
    async def get_my_performance(
        payload: dict = Depends(verify_token),
        period_days: int = Query(default=30, ge=7, le=90)
    ):
        """Get partner's performance compared to platform average with badges"""
        user_email = payload.get("sub")
        user_id = payload.get("user_id") or payload.get("id")
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": user_id}
            ],
            "status": AffiliateStatus.APPROVED
        }, {"_id": 0})
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate profile not found")
        
        # Get all approved affiliates for comparison
        all_affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "total_referrals": 1, "total_clicks": 1, "total_earnings": 1}
        ).to_list(length=1000)
        
        # Calculate platform averages
        total_affiliates = len(all_affiliates)
        if total_affiliates > 0:
            avg_referrals = sum(a.get("total_referrals", 0) for a in all_affiliates) / total_affiliates
            avg_clicks = sum(a.get("total_clicks", 0) for a in all_affiliates) / total_affiliates
            avg_earnings = sum(a.get("total_earnings", 0) for a in all_affiliates) / total_affiliates
            
            # Calculate conversion rates
            total_platform_clicks = sum(a.get("total_clicks", 0) for a in all_affiliates)
            total_platform_referrals = sum(a.get("total_referrals", 0) for a in all_affiliates)
            platform_conversion_rate = (total_platform_referrals / total_platform_clicks * 100) if total_platform_clicks > 0 else 0
            
            # Top 10% threshold
            sorted_by_referrals = sorted([a.get("total_referrals", 0) for a in all_affiliates], reverse=True)
            top_10_index = max(0, int(len(sorted_by_referrals) * 0.1) - 1)
            top_10_threshold = sorted_by_referrals[top_10_index] if sorted_by_referrals else 0
            
            # Calculate rank
            my_referrals = affiliate.get("total_referrals", 0)
            rank = sum(1 for a in all_affiliates if a.get("total_referrals", 0) > my_referrals) + 1
        else:
            avg_referrals = avg_clicks = avg_earnings = 0
            platform_conversion_rate = 0
            top_10_threshold = 0
            rank = 1
        
        # Partner's stats
        my_clicks = affiliate.get("total_clicks", 0)
        my_referrals = affiliate.get("total_referrals", 0)
        my_earnings = affiliate.get("total_earnings", 0)
        my_conversion_rate = (my_referrals / my_clicks * 100) if my_clicks > 0 else 0
        
        # Performance comparison (percentage vs platform average)
        referrals_vs_avg = ((my_referrals / avg_referrals) * 100 - 100) if avg_referrals > 0 else 0
        clicks_vs_avg = ((my_clicks / avg_clicks) * 100 - 100) if avg_clicks > 0 else 0
        earnings_vs_avg = ((my_earnings / avg_earnings) * 100 - 100) if avg_earnings > 0 else 0
        conversion_vs_avg = my_conversion_rate - platform_conversion_rate
        
        # Calculate badges
        all_affiliates_stats = {"top_10_threshold": top_10_threshold}
        earned_badge_ids = calculate_badges(affiliate, all_affiliates_stats)
        
        # Get full badge details for earned badges
        earned_badges = [b for b in BADGES if b["id"] in earned_badge_ids]
        next_badges = []
        
        # Determine next badges to earn
        if my_referrals < 1:
            next_badges.append({"badge": BADGES[0], "progress": 0, "target": 1})
        elif my_referrals < 5:
            next_badges.append({"badge": BADGES[1], "progress": my_referrals, "target": 5})
        elif my_referrals < 10:
            next_badges.append({"badge": BADGES[2], "progress": my_referrals, "target": 10})
        elif my_referrals < 25:
            next_badges.append({"badge": BADGES[3], "progress": my_referrals, "target": 25})
        elif my_referrals < 50:
            next_badges.append({"badge": BADGES[4], "progress": my_referrals, "target": 50})
        
        if my_conversion_rate < 20 and my_clicks > 10:
            next_badges.append({"badge": BADGES[5], "progress": round(my_conversion_rate, 1), "target": 20})
        
        if my_earnings < 1000:
            next_badges.append({"badge": BADGES[7], "progress": round(my_earnings, 2), "target": 1000})
        
        return {
            "your_stats": {
                "total_referrals": my_referrals,
                "total_clicks": my_clicks,
                "total_earnings": round(my_earnings, 2),
                "conversion_rate": round(my_conversion_rate, 2),
                "rank": rank,
                "total_partners": total_affiliates,
                "percentile": round((1 - (rank / total_affiliates)) * 100 if total_affiliates > 0 else 0, 1)
            },
            "platform_average": {
                "avg_referrals": round(avg_referrals, 1),
                "avg_clicks": round(avg_clicks, 1),
                "avg_earnings": round(avg_earnings, 2),
                "avg_conversion_rate": round(platform_conversion_rate, 2)
            },
            "comparison": {
                "referrals_vs_avg": round(referrals_vs_avg, 1),
                "clicks_vs_avg": round(clicks_vs_avg, 1),
                "earnings_vs_avg": round(earnings_vs_avg, 1),
                "conversion_vs_avg": round(conversion_vs_avg, 2),
                "is_above_average": referrals_vs_avg >= 0
            },
            "badges": {
                "earned": earned_badges,
                "total_earned": len(earned_badges),
                "total_available": len(BADGES),
                "next_to_earn": next_badges[:3]  # Show up to 3 upcoming badges
            },
            "leaderboard_position": {
                "rank": rank,
                "total": total_affiliates,
                "is_top_10_percent": my_referrals >= top_10_threshold if top_10_threshold > 0 else False
            }
        }
    
    @router.get("/badges")
    async def get_all_badges(payload: dict = Depends(verify_token)):
        """Get all available badges with their requirements"""
        user_email = payload.get("sub")
        user_id = payload.get("user_id") or payload.get("id")
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": user_id}
            ],
            "status": AffiliateStatus.APPROVED
        }, {"_id": 0})
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate profile not found")
        
        # Get stats for badge calculation
        all_affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "total_referrals": 1}
        ).to_list(length=1000)
        
        sorted_by_referrals = sorted([a.get("total_referrals", 0) for a in all_affiliates], reverse=True)
        top_10_index = max(0, int(len(sorted_by_referrals) * 0.1) - 1)
        top_10_threshold = sorted_by_referrals[top_10_index] if sorted_by_referrals else 0
        
        all_affiliates_stats = {"top_10_threshold": top_10_threshold}
        earned_badge_ids = calculate_badges(affiliate, all_affiliates_stats)
        
        # Return all badges with earned status
        badges_with_status = []
        for badge in BADGES:
            badge_copy = badge.copy()
            badge_copy["earned"] = badge["id"] in earned_badge_ids
            badges_with_status.append(badge_copy)
        
        return {
            "badges": badges_with_status,
            "total_earned": len(earned_badge_ids),
            "total_available": len(BADGES)
        }
    
    @router.get("/badge-share/{badge_id}")
    async def get_badge_share_data(badge_id: str, payload: dict = Depends(verify_token)):
        """Get shareable badge data for social media"""
        user_email = payload.get("sub")
        user_id = payload.get("user_id") or payload.get("id")
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": user_id}
            ],
            "status": AffiliateStatus.APPROVED
        }, {"_id": 0})
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate profile not found")
        
        # Find the badge
        badge = next((b for b in BADGES if b["id"] == badge_id), None)
        if not badge:
            raise HTTPException(status_code=404, detail="Badge not found")
        
        # Check if user has earned this badge
        all_affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "total_referrals": 1}
        ).to_list(length=1000)
        
        sorted_by_referrals = sorted([a.get("total_referrals", 0) for a in all_affiliates], reverse=True)
        top_10_index = max(0, int(len(sorted_by_referrals) * 0.1) - 1)
        top_10_threshold = sorted_by_referrals[top_10_index] if sorted_by_referrals else 0
        
        all_affiliates_stats = {"top_10_threshold": top_10_threshold}
        earned_badge_ids = calculate_badges(affiliate, all_affiliates_stats)
        
        if badge_id not in earned_badge_ids:
            raise HTTPException(status_code=403, detail="You haven't earned this badge yet")
        
        # Generate share data
        partner_name = affiliate.get("company_name") or affiliate.get("name", "Partner")
        
        share_text = {
            "twitter": f"🏆 I just earned the '{badge['name']}' badge on @DataVisionTZ Partner Program! {badge['description']} #DataVisionPartner #Achievement",
            "linkedin": f"Excited to share that I've earned the '{badge['name']}' badge as a DataVision Partner! {badge['description']}. Join the program and start earning: https://datavision.co.tz/affiliate",
            "facebook": f"🎉 Achievement Unlocked! I earned the '{badge['name']}' badge on DataVision Partner Program. {badge['description']}",
            "whatsapp": f"🏆 Just earned the '{badge['name']}' badge on DataVision Partner Program! {badge['description']} Join here: https://datavision.co.tz/affiliate"
        }
        
        return {
            "badge": badge,
            "partner_name": partner_name,
            "share_text": share_text,
            "share_url": "https://datavision.co.tz/affiliate",
            "image_url": f"https://datavision.co.tz/badges/{badge_id}.png"  # Badge image for OG tags
        }
    
    @router.get("/leaderboard")
    async def get_public_leaderboard(
        period: str = Query(default="all_time", regex="^(weekly|monthly|all_time)$"),
        limit: int = Query(default=20, ge=5, le=50)
    ):
        """Get public partner leaderboard - no auth required"""
        
        # Calculate date range based on period
        end_date = datetime.now(timezone.utc)
        if period == "weekly":
            start_date = end_date - timedelta(days=7)
            period_label = "This Week"
        elif period == "monthly":
            start_date = end_date - timedelta(days=30)
            period_label = "This Month"
        else:
            start_date = None
            period_label = "All Time"
        
        # Get all approved affiliates
        affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "id": 1, "company_name": 1, "name": 1, "tier": 1, "tier_color": 1,
             "total_referrals": 1, "total_earnings": 1, "created_at": 1}
        ).to_list(length=1000)
        
        # If period-based, calculate period stats from referrals collection
        if start_date:
            leaderboard_data = []
            for affiliate in affiliates:
                # Count referrals in period
                period_referrals = await db.referrals.count_documents({
                    "affiliate_id": affiliate["id"],
                    "created_at": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()}
                })
                
                if period_referrals > 0:  # Only include active partners
                    leaderboard_data.append({
                        "id": affiliate["id"],
                        "name": affiliate.get("company_name") or affiliate.get("name", "Partner"),
                        "tier": affiliate.get("tier", "Bronze"),
                        "tier_color": affiliate.get("tier_color", "#3b82f6"),
                        "referrals": period_referrals,
                        "total_referrals": affiliate.get("total_referrals", 0)
                    })
            
            # Sort by period referrals
            leaderboard_data.sort(key=lambda x: x["referrals"], reverse=True)
        else:
            # All time - use total_referrals
            leaderboard_data = []
            for affiliate in affiliates:
                if affiliate.get("total_referrals", 0) > 0:
                    leaderboard_data.append({
                        "id": affiliate["id"],
                        "name": affiliate.get("company_name") or affiliate.get("name", "Partner"),
                        "tier": affiliate.get("tier", "Bronze"),
                        "tier_color": affiliate.get("tier_color", "#3b82f6"),
                        "referrals": affiliate.get("total_referrals", 0),
                        "total_referrals": affiliate.get("total_referrals", 0)
                    })
            
            leaderboard_data.sort(key=lambda x: x["referrals"], reverse=True)
        
        # Add rank
        for i, entry in enumerate(leaderboard_data[:limit]):
            entry["rank"] = i + 1
        
        # Calculate stats
        total_partners = len(affiliates)
        active_partners = len([a for a in affiliates if a.get("total_referrals", 0) > 0])
        total_referrals = sum(a.get("total_referrals", 0) for a in affiliates)
        
        return {
            "period": period,
            "period_label": period_label,
            "leaderboard": leaderboard_data[:limit],
            "stats": {
                "total_partners": total_partners,
                "active_partners": active_partners,
                "total_referrals": total_referrals
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    
    @router.get("/leaderboard/my-position")
    async def get_my_leaderboard_position(
        payload: dict = Depends(verify_token),
        period: str = Query(default="all_time", regex="^(weekly|monthly|all_time)$")
    ):
        """Get authenticated partner's position on leaderboard"""
        user_email = payload.get("sub")
        user_id = payload.get("user_id") or payload.get("id")
        
        affiliate = await db.affiliates.find_one({
            "$or": [
                {"email": user_email},
                {"user_id": user_id}
            ],
            "status": AffiliateStatus.APPROVED
        }, {"_id": 0})
        
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate profile not found")
        
        # Get all affiliates for ranking
        all_affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "id": 1, "total_referrals": 1}
        ).to_list(length=1000)
        
        # Calculate rank
        my_referrals = affiliate.get("total_referrals", 0)
        rank = sum(1 for a in all_affiliates if a.get("total_referrals", 0) > my_referrals) + 1
        total = len(all_affiliates)
        
        # Find neighbors on leaderboard
        sorted_affiliates = sorted(all_affiliates, key=lambda x: x.get("total_referrals", 0), reverse=True)
        my_index = next((i for i, a in enumerate(sorted_affiliates) if a["id"] == affiliate["id"]), -1)
        
        above = None
        below = None
        if my_index > 0:
            above_affiliate = await db.affiliates.find_one({"id": sorted_affiliates[my_index - 1]["id"]}, {"_id": 0})
            if above_affiliate:
                above = {
                    "rank": my_index,
                    "name": above_affiliate.get("company_name") or above_affiliate.get("name", "Partner"),
                    "referrals": above_affiliate.get("total_referrals", 0),
                    "gap": above_affiliate.get("total_referrals", 0) - my_referrals
                }
        
        if my_index < len(sorted_affiliates) - 1:
            below_affiliate = await db.affiliates.find_one({"id": sorted_affiliates[my_index + 1]["id"]}, {"_id": 0})
            if below_affiliate:
                below = {
                    "rank": my_index + 2,
                    "name": below_affiliate.get("company_name") or below_affiliate.get("name", "Partner"),
                    "referrals": below_affiliate.get("total_referrals", 0),
                    "gap": my_referrals - below_affiliate.get("total_referrals", 0)
                }
        
        return {
            "your_position": {
                "rank": rank,
                "total": total,
                "referrals": my_referrals,
                "percentile": round((1 - (rank / total)) * 100 if total > 0 else 0, 1)
            },
            "above_you": above,
            "below_you": below,
            "referrals_to_next_rank": above["gap"] if above else 0
        }
    
    # ==================== MONTHLY REWARDS SYSTEM ====================
    
    # Monthly reward configurations
    MONTHLY_REWARDS = {
        1: {  # 1st Place
            "type": "Bonus Credits + Tier Upgrade",
            "credits": 100.0,
            "tier_upgrade": True,
            "featured": True,
            "description": "$100 bonus credits + tier upgrade + Featured Partner spotlight"
        },
        2: {  # 2nd Place
            "type": "Bonus Credits",
            "credits": 50.0,
            "tier_upgrade": False,
            "featured": False,
            "description": "$50 bonus credits"
        },
        3: {  # 3rd Place
            "type": "Bonus Credits",
            "credits": 25.0,
            "tier_upgrade": False,
            "featured": False,
            "description": "$25 bonus credits"
        }
    }
    
    # Tier progression for upgrades
    TIER_PROGRESSION = {
        "Bronze": "Silver",
        "Silver": "Gold",
        "Gold": "Platinum",
        "Platinum": "Platinum"  # Max tier
    }
    
    TIER_COLORS = {
        "Bronze": "#CD7F32",
        "Silver": "#C0C0C0",
        "Gold": "#FFD700",
        "Platinum": "#E5E4E2"
    }
    
    @router.get("/leaderboard/previous-winners")
    async def get_previous_winners(months: int = Query(default=3, ge=1, le=12)):
        """Get previous months' leaderboard winners (public)"""
        
        winners_history = await db.monthly_rewards.find(
            {},
            {"_id": 0}
        ).sort("month", -1).to_list(months * 3)  # Up to 3 winners per month
        
        # Group by month
        grouped = {}
        for winner in winners_history:
            month = winner.get("month", "")
            if month not in grouped:
                grouped[month] = []
            grouped[month].append(winner)
        
        return {
            "history": [
                {
                    "month": month,
                    "winners": sorted(winners, key=lambda x: x.get("rank", 99))
                }
                for month, winners in sorted(grouped.items(), reverse=True)
            ]
        }
    
    @router.get("/featured-partner")
    async def get_featured_partner():
        """Get current featured partner for homepage display (public)"""
        
        featured = await db.affiliates.find_one(
            {"is_featured": True, "status": AffiliateStatus.APPROVED},
            {"_id": 0, "id": 1, "company_name": 1, "name": 1, "tier": 1, "tier_color": 1,
             "total_referrals": 1, "featured_month": 1}
        )
        
        if not featured:
            return {"featured_partner": None}
        
        return {
            "featured_partner": {
                "id": featured["id"],
                "name": featured.get("company_name") or featured.get("name", "Partner"),
                "tier": featured.get("tier", "Bronze"),
                "tier_color": featured.get("tier_color", "#3b82f6"),
                "total_referrals": featured.get("total_referrals", 0),
                "featured_month": featured.get("featured_month")
            }
        }
    
    @router.post("/admin/process-monthly-rewards")
    async def process_monthly_rewards(
        payload: dict = Depends(verify_admin_token),
        month: Optional[str] = None,  # Format: "2026-02" - defaults to previous month
        dry_run: bool = Query(default=True)  # Safety: dry_run by default
    ):
        """
        Process monthly leaderboard rewards for top 3 partners (admin only).
        Awards bonus credits, tier upgrades, and featured partner status.
        Sends congratulatory emails to winners.
        """
        from services.email_service import email_service
        
        # Determine which month to process
        if month:
            # Parse provided month
            try:
                year, month_num = map(int, month.split("-"))
                target_date = datetime(year, month_num, 1, tzinfo=timezone.utc)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
        else:
            # Default to previous month
            today = datetime.now(timezone.utc)
            if today.month == 1:
                target_date = datetime(today.year - 1, 12, 1, tzinfo=timezone.utc)
            else:
                target_date = datetime(today.year, today.month - 1, 1, tzinfo=timezone.utc)
        
        month_str = target_date.strftime("%Y-%m")
        month_display = target_date.strftime("%B %Y")
        
        # Check if already processed
        existing = await db.monthly_rewards.find_one({"month": month_str})
        if existing and not dry_run:
            raise HTTPException(
                status_code=400, 
                detail=f"Rewards for {month_display} have already been processed"
            )
        
        # Calculate date range for the month
        if target_date.month == 12:
            end_date = datetime(target_date.year + 1, 1, 1, tzinfo=timezone.utc)
        else:
            end_date = datetime(target_date.year, target_date.month + 1, 1, tzinfo=timezone.utc)
        
        # Get referrals for the month
        pipeline = [
            {
                "$match": {
                    "created_at": {
                        "$gte": target_date.isoformat(),
                        "$lt": end_date.isoformat()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$affiliate_id",
                    "referrals": {"$sum": 1}
                }
            },
            {"$sort": {"referrals": -1}},
            {"$limit": 10}
        ]
        
        monthly_stats = await db.referrals.aggregate(pipeline).to_list(10)
        
        if not monthly_stats:
            return {
                "month": month_display,
                "dry_run": dry_run,
                "message": "No referrals found for this month",
                "winners": []
            }
        
        # Get top 3 winners
        winners = []
        emails_sent = []
        
        for rank, stat in enumerate(monthly_stats[:3], 1):
            affiliate = await db.affiliates.find_one(
                {"id": stat["_id"], "status": AffiliateStatus.APPROVED},
                {"_id": 0}
            )
            
            if not affiliate:
                continue
            
            reward = MONTHLY_REWARDS.get(rank, MONTHLY_REWARDS[3])
            
            winner_data = {
                "rank": rank,
                "affiliate_id": affiliate["id"],
                "name": affiliate.get("company_name") or affiliate.get("name", "Partner"),
                "email": affiliate.get("email"),
                "referrals": stat["referrals"],
                "reward": reward,
                "month": month_str,
                "processed_at": datetime.now(timezone.utc).isoformat()
            }
            
            if not dry_run:
                # Award credits
                if reward["credits"] > 0:
                    await db.affiliates.update_one(
                        {"id": affiliate["id"]},
                        {"$inc": {"available_balance": reward["credits"]}}
                    )
                    
                    # Log commission
                    await db.affiliate_commissions.insert_one({
                        "id": str(uuid.uuid4()),
                        "affiliate_id": affiliate["id"],
                        "amount": reward["credits"],
                        "type": "monthly_reward",
                        "description": f"Monthly leaderboard reward - {rank} place ({month_display})",
                        "status": "paid",
                        "created_at": datetime.now(timezone.utc).isoformat()
                    })
                
                # Tier upgrade for 1st place
                if reward.get("tier_upgrade"):
                    current_tier = affiliate.get("tier", "Bronze")
                    new_tier = TIER_PROGRESSION.get(current_tier, current_tier)
                    if new_tier != current_tier:
                        await db.affiliates.update_one(
                            {"id": affiliate["id"]},
                            {
                                "$set": {
                                    "tier": new_tier,
                                    "tier_color": TIER_COLORS.get(new_tier, "#3b82f6")
                                }
                            }
                        )
                        winner_data["tier_upgraded"] = f"{current_tier} → {new_tier}"
                
                # Featured partner for 1st place
                if reward.get("featured"):
                    # Remove previous featured
                    await db.affiliates.update_many(
                        {"is_featured": True},
                        {"$set": {"is_featured": False}}
                    )
                    # Set new featured
                    await db.affiliates.update_one(
                        {"id": affiliate["id"]},
                        {"$set": {"is_featured": True, "featured_month": month_display}}
                    )
                
                # Store reward record
                await db.monthly_rewards.insert_one({
                    **winner_data,
                    "id": str(uuid.uuid4())
                })
                
                # Send email
                try:
                    email_result = await email_service.send_leaderboard_winner_email(
                        to_email=affiliate.get("email"),
                        name=affiliate.get("name", "Partner"),
                        rank=rank,
                        month=month_display,
                        referrals=stat["referrals"],
                        reward_type=reward["type"],
                        reward_value=reward["description"],
                        total_earnings=affiliate.get("total_earnings", 0)
                    )
                    emails_sent.append({
                        "email": affiliate.get("email"),
                        "status": email_result.get("status")
                    })
                    
                    # Send featured partner email for 1st place
                    if reward.get("featured"):
                        await email_service.send_featured_partner_email(
                            to_email=affiliate.get("email"),
                            name=affiliate.get("name", "Partner"),
                            month=month_display
                        )
                except Exception as e:
                    emails_sent.append({
                        "email": affiliate.get("email"),
                        "status": "error",
                        "error": str(e)
                    })
            
            winners.append(winner_data)
        
        return {
            "month": month_display,
            "month_code": month_str,
            "dry_run": dry_run,
            "message": "Dry run - no changes made" if dry_run else f"Successfully processed rewards for {len(winners)} winners",
            "winners": winners,
            "emails_sent": emails_sent if not dry_run else [],
            "reward_config": MONTHLY_REWARDS
        }
    
    @router.get("/admin/monthly-rewards-history")
    async def get_monthly_rewards_history(
        payload: dict = Depends(verify_admin_token),
        limit: int = Query(default=20, ge=1, le=100)
    ):
        """Get history of all monthly reward distributions (admin)"""
        
        rewards = await db.monthly_rewards.find(
            {},
            {"_id": 0}
        ).sort("processed_at", -1).to_list(limit)
        
        # Group by month
        grouped = {}
        for reward in rewards:
            month = reward.get("month", "")
            if month not in grouped:
                grouped[month] = {
                    "month": month,
                    "processed_at": reward.get("processed_at"),
                    "winners": []
                }
            grouped[month]["winners"].append(reward)
        
        return {
            "history": list(grouped.values()),
            "total_months_processed": len(grouped),
            "reward_config": MONTHLY_REWARDS
        }
    
    # Performance tips based on partner stats
    PERFORMANCE_TIPS = [
        {
            "id": "share_more",
            "title": "Share on social media",
            "description": "Partners who share on 3+ platforms get 40% more referrals",
            "condition": lambda stats: stats.get("total_clicks", 0) < 50
        },
        {
            "id": "optimize_link",
            "title": "Use your shortened link",
            "description": "Short links get 25% higher click-through rates on social",
            "condition": lambda stats: True  # Always relevant
        },
        {
            "id": "increase_conversion",
            "title": "Improve your conversion rate",
            "description": "Try targeting audiences who already know DataVision products",
            "condition": lambda stats: stats.get("conversion_rate", 0) < 10
        },
        {
            "id": "reach_next_tier",
            "title": "Push for the next tier",
            "description": "Higher tiers mean higher commission rates - you're close!",
            "condition": lambda stats: stats.get("referrals_to_next_tier", 100) < 10
        },
        {
            "id": "consistency",
            "title": "Stay consistent",
            "description": "Partners who refer weekly earn 3x more than sporadic referrers",
            "condition": lambda stats: True
        },
        {
            "id": "leverage_content",
            "title": "Create content about DataVision",
            "description": "Blog posts and tutorials convert 5x better than direct links",
            "condition": lambda stats: stats.get("total_referrals", 0) < 20
        },
        {
            "id": "email_list",
            "title": "Build an email list",
            "description": "Email referrals have the highest conversion rates",
            "condition": lambda stats: stats.get("conversion_rate", 0) < 15
        },
    ]
    
    def get_tips_for_partner(stats: dict, count: int = 3) -> list:
        """Get personalized tips based on partner's performance"""
        relevant_tips = []
        for tip in PERFORMANCE_TIPS:
            if tip["condition"](stats):
                relevant_tips.append({
                    "title": tip["title"],
                    "description": tip["description"]
                })
            if len(relevant_tips) >= count:
                break
        return relevant_tips
    
    @router.post("/admin/send-monthly-digest")
    async def send_monthly_digest(
        payload: dict = Depends(verify_admin_token),
        month: Optional[str] = None,  # Format: "2026-02" - defaults to previous month
        dry_run: bool = Query(default=True),
        partner_id: Optional[str] = None  # Optional: send to specific partner only
    ):
        """
        Send monthly digest emails to all partners (or a specific partner).
        Includes: rank, stats, tips, tier progress.
        """
        from services.email_service import email_service
        
        # Determine which month
        if month:
            try:
                year, month_num = map(int, month.split("-"))
                target_date = datetime(year, month_num, 1, tzinfo=timezone.utc)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
        else:
            today = datetime.now(timezone.utc)
            if today.month == 1:
                target_date = datetime(today.year - 1, 12, 1, tzinfo=timezone.utc)
            else:
                target_date = datetime(today.year, today.month - 1, 1, tzinfo=timezone.utc)
        
        month_str = target_date.strftime("%Y-%m")
        month_display = target_date.strftime("%B %Y")
        
        # Get all approved affiliates (or specific one)
        query = {"status": AffiliateStatus.APPROVED}
        if partner_id:
            query["id"] = partner_id
        
        affiliates = await db.affiliates.find(query, {"_id": 0}).to_list(1000)
        
        if not affiliates:
            return {"message": "No affiliates found", "emails_sent": 0}
        
        # Get all affiliates for ranking
        all_affiliates = await db.affiliates.find(
            {"status": AffiliateStatus.APPROVED},
            {"_id": 0, "id": 1, "total_referrals": 1}
        ).to_list(1000)
        
        sorted_affiliates = sorted(all_affiliates, key=lambda x: x.get("total_referrals", 0), reverse=True)
        total_partners = len(sorted_affiliates)
        
        # Create ranking map
        rank_map = {a["id"]: i + 1 for i, a in enumerate(sorted_affiliates)}
        
        emails_to_send = []
        emails_sent = []
        
        for affiliate in affiliates:
            # Calculate stats for this partner
            affiliate_id = affiliate["id"]
            rank = rank_map.get(affiliate_id, total_partners)
            
            # Get monthly stats (from commissions or referrals)
            month_referrals = 0
            month_earnings = 0.0
            
            # Count referrals in the target month
            if target_date.month == 12:
                end_date = datetime(target_date.year + 1, 1, 1, tzinfo=timezone.utc)
            else:
                end_date = datetime(target_date.year, target_date.month + 1, 1, tzinfo=timezone.utc)
            
            month_referrals = await db.referrals.count_documents({
                "affiliate_id": affiliate_id,
                "created_at": {"$gte": target_date.isoformat(), "$lt": end_date.isoformat()}
            })
            
            # Get earnings for the month
            month_commissions = await db.affiliate_commissions.find({
                "affiliate_id": affiliate_id,
                "created_at": {"$gte": target_date.isoformat(), "$lt": end_date.isoformat()}
            }, {"_id": 0, "amount": 1}).to_list(100)
            month_earnings = sum(c.get("amount", 0) for c in month_commissions)
            
            # Calculate conversion rate
            total_clicks = affiliate.get("total_clicks", 0)
            total_referrals = affiliate.get("total_referrals", 0)
            conversion_rate = (total_referrals / total_clicks * 100) if total_clicks > 0 else 0
            
            # Get tier info
            tier = affiliate.get("tier", "Bronze")
            tier_color = affiliate.get("tier_color", "#CD7F32")
            commission_rate = affiliate.get("commission_rate", 10)
            
            # Find current and next tier
            current_tier_idx = next((i for i, t in enumerate(TIERS) if t["name"] == tier), 0)
            next_tier = TIERS[current_tier_idx + 1] if current_tier_idx < len(TIERS) - 1 else None
            
            referrals_to_next = 0
            if next_tier:
                referrals_to_next = max(0, next_tier["min_referrals"] - total_referrals)
            
            stats = {
                "month_referrals": month_referrals,
                "month_earnings": month_earnings,
                "total_referrals": total_referrals,
                "total_clicks": total_clicks,
                "conversion_rate": conversion_rate,
                "commission_rate": commission_rate,
                "referrals_to_next_tier": referrals_to_next
            }
            
            # Get personalized tips
            tips = get_tips_for_partner(stats)
            
            email_data = {
                "to_email": affiliate.get("email"),
                "name": affiliate.get("name", "Partner"),
                "month": month_display,
                "stats": stats,
                "rank": rank,
                "total_partners": total_partners,
                "tips": tips,
                "tier": tier,
                "tier_color": tier_color,
                "next_tier": next_tier
            }
            
            emails_to_send.append(email_data)
        
        if dry_run:
            return {
                "month": month_display,
                "dry_run": True,
                "message": f"Would send {len(emails_to_send)} digest emails",
                "preview": emails_to_send[:3],  # Preview first 3
                "total_partners": total_partners
            }
        
        # Actually send emails
        for email_data in emails_to_send:
            try:
                result = await email_service.send_monthly_digest_email(**email_data)
                emails_sent.append({
                    "email": email_data["to_email"],
                    "status": result.get("status"),
                    "rank": email_data["rank"]
                })
            except Exception as e:
                emails_sent.append({
                    "email": email_data["to_email"],
                    "status": "error",
                    "error": str(e)
                })
        
        # Record digest was sent
        await db.digest_history.insert_one({
            "id": str(uuid.uuid4()),
            "month": month_str,
            "month_display": month_display,
            "total_sent": len([e for e in emails_sent if e.get("status") != "error"]),
            "total_failed": len([e for e in emails_sent if e.get("status") == "error"]),
            "sent_at": datetime.now(timezone.utc).isoformat(),
            "sent_by": payload.get("sub")
        })
        
        return {
            "month": month_display,
            "dry_run": False,
            "message": f"Successfully sent {len([e for e in emails_sent if e.get('status') != 'error'])} digest emails",
            "emails_sent": emails_sent,
            "total_partners": total_partners
        }
    
    @router.get("/admin/digest-history")
    async def get_digest_history(
        payload: dict = Depends(verify_admin_token),
        limit: int = Query(default=12, ge=1, le=50)
    ):
        """Get history of sent monthly digests"""
        
        history = await db.digest_history.find(
            {},
            {"_id": 0}
        ).sort("sent_at", -1).to_list(limit)
        
        return {
            "history": history,
            "total_digests_sent": len(history)
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
            # Parse dates and ensure they're timezone-aware for comparison
            start_str = promo.start_date.replace('Z', '+00:00')
            end_str = promo.end_date.replace('Z', '+00:00')
            
            # Handle dates with or without timezone info
            start = datetime.fromisoformat(start_str)
            end = datetime.fromisoformat(end_str)
            
            # Make both timezone-aware if one is naive
            if start.tzinfo is None:
                start = start.replace(tzinfo=timezone.utc)
            if end.tzinfo is None:
                end = end.replace(tzinfo=timezone.utc)
                
            if end <= start:
                raise HTTPException(status_code=400, detail="End date must be after start date")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid date format. Use ISO format. Error: {str(e)}")
        
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
