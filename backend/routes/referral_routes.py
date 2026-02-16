"""
User Referral System Routes
Allows regular users to refer friends and earn credits (separate from affiliate commission system)
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import secrets

router = APIRouter(prefix="/referrals", tags=["User Referrals"])


class ReferralStats(BaseModel):
    total_referrals: int = 0
    successful_referrals: int = 0
    pending_referrals: int = 0
    total_credits_earned: float = 0
    credits_available: float = 0
    credits_used: float = 0


class ReferralInvite(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    message: Optional[str] = None


class CreditRedemption(BaseModel):
    amount: float
    product: str  # fieldforce, survey360, datapulse


# Credit rewards configuration
REFERRAL_REWARDS = {
    "referrer_signup_bonus": 10.0,    # Credits when referred user signs up
    "referrer_purchase_bonus": 25.0,   # Credits when referred user makes first purchase
    "referee_signup_bonus": 5.0,       # Credits for new user who was referred
    "max_referrals_per_month": 50,     # Rate limiting
}


def create_referral_routes(db, verify_token, email_service=None):
    """Create referral routes with database dependency"""
    
    @router.get("/my-stats", response_model=ReferralStats)
    async def get_my_referral_stats(payload: dict = Depends(verify_token)):
        """Get current user's referral statistics"""
        user_id = payload.get("user_id") or payload.get("id")
        
        # Get or create referral profile
        profile = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        
        if not profile:
            # Create new referral profile
            referral_code = secrets.token_urlsafe(8).upper()[:8]
            profile = {
                "user_id": user_id,
                "referral_code": referral_code,
                "total_referrals": 0,
                "successful_referrals": 0,
                "pending_referrals": 0,
                "total_credits_earned": 0,
                "credits_available": 0,
                "credits_used": 0,
                "referred_users": [],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.user_referrals.insert_one(profile)
        
        return ReferralStats(
            total_referrals=profile.get("total_referrals", 0),
            successful_referrals=profile.get("successful_referrals", 0),
            pending_referrals=profile.get("pending_referrals", 0),
            total_credits_earned=profile.get("total_credits_earned", 0),
            credits_available=profile.get("credits_available", 0),
            credits_used=profile.get("credits_used", 0)
        )
    
    @router.get("/my-code")
    async def get_my_referral_code(payload: dict = Depends(verify_token)):
        """Get current user's referral code and links"""
        user_id = payload.get("user_id") or payload.get("id")
        user_email = payload.get("sub")
        
        profile = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        
        if not profile:
            # Create new referral profile with code
            referral_code = secrets.token_urlsafe(8).upper()[:8]
            profile = {
                "user_id": user_id,
                "email": user_email,
                "referral_code": referral_code,
                "total_referrals": 0,
                "successful_referrals": 0,
                "pending_referrals": 0,
                "total_credits_earned": 0,
                "credits_available": 0,
                "credits_used": 0,
                "referred_users": [],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.user_referrals.insert_one(profile)
        
        code = profile.get("referral_code")
        base_url = "https://datavision.co.tz"
        
        return {
            "referral_code": code,
            "referral_links": {
                "main": f"{base_url}?ref={code}",
                "signup": f"{base_url}/login?ref={code}",
                "fieldforce": f"{base_url}/solutions/fieldforce?ref={code}",
                "survey360": f"{base_url}/solutions/survey360?ref={code}",
                "datapulse": f"{base_url}/solutions/datapulse?ref={code}"
            },
            "rewards": {
                "signup_bonus": REFERRAL_REWARDS["referrer_signup_bonus"],
                "purchase_bonus": REFERRAL_REWARDS["referrer_purchase_bonus"],
                "friend_gets": REFERRAL_REWARDS["referee_signup_bonus"]
            }
        }
    
    @router.post("/invite")
    async def send_referral_invite(
        invite: ReferralInvite,
        payload: dict = Depends(verify_token)
    ):
        """Send a referral invitation email"""
        user_id = payload.get("user_id") or payload.get("id")
        user_email = payload.get("sub")
        
        # Get user name
        user = await db.datavision_users.find_one({"id": user_id}, {"_id": 0, "name": 1})
        referrer_name = user.get("name", "A DataVision user") if user else "A DataVision user"
        
        # Check if already referred
        existing = await db.referral_invites.find_one({
            "referrer_id": user_id,
            "invitee_email": invite.email
        })
        
        if existing:
            raise HTTPException(status_code=400, detail="You've already invited this email address")
        
        # Check if email is already a user (check both user collections)
        existing_user = await db.datavision_users.find_one({"email": invite.email})
        if not existing_user:
            existing_user = await db.admins.find_one({"email": invite.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="This person already has an account")
        
        # Get referral code
        profile = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        referral_code = profile.get("referral_code") if profile else secrets.token_urlsafe(8).upper()[:8]
        
        # Create invite record
        invite_record = {
            "id": str(uuid.uuid4()),
            "referrer_id": user_id,
            "referrer_email": user_email,
            "referrer_name": referrer_name,
            "invitee_email": invite.email,
            "invitee_name": invite.name,
            "personal_message": invite.message,
            "referral_code": referral_code,
            "status": "pending",  # pending, signed_up, converted
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.referral_invites.insert_one(invite_record)
        
        # Update pending count
        await db.user_referrals.update_one(
            {"user_id": user_id},
            {
                "$inc": {"pending_referrals": 1, "total_referrals": 1},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        # Send email (if email service is available)
        if email_service:
            try:
                signup_link = f"https://datavision.co.tz/login?ref={referral_code}"
                await email_service.send_email(
                    to_email=invite.email,
                    subject=f"{referrer_name} invited you to try DataVision",
                    html=f"""
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>You've been invited!</h2>
                        <p>{referrer_name} thinks you'd love DataVision - the leading data collection and research platform.</p>
                        {f'<p><em>"{invite.message}"</em></p>' if invite.message else ''}
                        <p>Sign up now and you'll both get credits:</p>
                        <ul>
                            <li>You get ${REFERRAL_REWARDS["referee_signup_bonus"]} in credits</li>
                            <li>{referrer_name} gets ${REFERRAL_REWARDS["referrer_signup_bonus"]} in credits</li>
                        </ul>
                        <a href="{signup_link}" style="display: inline-block; background: #e63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                            Accept Invitation
                        </a>
                    </div>
                    """
                )
            except Exception as e:
                print(f"Failed to send referral email: {e}")
        
        return {
            "message": f"Invitation sent to {invite.email}",
            "invite_id": invite_record["id"]
        }
    
    @router.get("/my-invites")
    async def get_my_invites(payload: dict = Depends(verify_token)):
        """Get list of people I've invited"""
        user_id = payload.get("user_id") or payload.get("id")
        
        invites = await db.referral_invites.find(
            {"referrer_id": user_id},
            {"_id": 0}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        return {
            "invites": invites,
            "total": len(invites)
        }
    
    @router.get("/credits/history")
    async def get_credit_history(payload: dict = Depends(verify_token)):
        """Get credit transaction history"""
        user_id = payload.get("user_id") or payload.get("id")
        
        transactions = await db.credit_transactions.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        profile = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        
        return {
            "transactions": transactions,
            "current_balance": profile.get("credits_available", 0) if profile else 0
        }
    
    @router.post("/credits/redeem")
    async def redeem_credits(
        redemption: CreditRedemption,
        payload: dict = Depends(verify_token)
    ):
        """Redeem credits for a product discount"""
        user_id = payload.get("user_id") or payload.get("id")
        
        valid_products = ["fieldforce", "survey360", "datapulse"]
        if redemption.product not in valid_products:
            raise HTTPException(status_code=400, detail="Invalid product")
        
        if redemption.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be positive")
        
        profile = await db.user_referrals.find_one({"user_id": user_id}, {"_id": 0})
        
        if not profile or profile.get("credits_available", 0) < redemption.amount:
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        # Create redemption record
        transaction = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": "redemption",
            "amount": -redemption.amount,
            "product": redemption.product,
            "description": f"Credit redemption for {redemption.product}",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.credit_transactions.insert_one(transaction)
        
        # Update balance
        await db.user_referrals.update_one(
            {"user_id": user_id},
            {
                "$inc": {
                    "credits_available": -redemption.amount,
                    "credits_used": redemption.amount
                },
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        return {
            "message": f"${redemption.amount} credits applied to {redemption.product}",
            "transaction_id": transaction["id"],
            "new_balance": profile.get("credits_available", 0) - redemption.amount
        }
    
    # ==================== INTERNAL ENDPOINTS (called by auth system) ====================
    
    @router.post("/internal/process-signup")
    async def process_referral_signup(referral_code: str, new_user_id: str, new_user_email: str):
        """
        Internal endpoint called when a new user signs up with a referral code.
        Awards credits to both referrer and referee.
        """
        # Find referrer by code
        referrer = await db.user_referrals.find_one({"referral_code": referral_code}, {"_id": 0})
        
        if not referrer:
            return {"processed": False, "reason": "Invalid referral code"}
        
        referrer_id = referrer["user_id"]
        
        # Check if this email was invited
        invite = await db.referral_invites.find_one({
            "referrer_id": referrer_id,
            "invitee_email": new_user_email,
            "status": "pending"
        })
        
        # Award credits to referrer
        referrer_bonus = REFERRAL_REWARDS["referrer_signup_bonus"]
        await db.user_referrals.update_one(
            {"user_id": referrer_id},
            {
                "$inc": {
                    "successful_referrals": 1,
                    "pending_referrals": -1 if invite else 0,
                    "total_credits_earned": referrer_bonus,
                    "credits_available": referrer_bonus
                },
                "$push": {"referred_users": new_user_id},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        # Record referrer credit transaction
        await db.credit_transactions.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": referrer_id,
            "type": "referral_bonus",
            "amount": referrer_bonus,
            "description": f"Referral bonus - new user signup",
            "referred_user_id": new_user_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Create referral profile for new user with bonus
        referee_bonus = REFERRAL_REWARDS["referee_signup_bonus"]
        new_user_code = secrets.token_urlsafe(8).upper()[:8]
        await db.user_referrals.insert_one({
            "user_id": new_user_id,
            "email": new_user_email,
            "referral_code": new_user_code,
            "referred_by": referrer_id,
            "referred_by_code": referral_code,
            "total_referrals": 0,
            "successful_referrals": 0,
            "pending_referrals": 0,
            "total_credits_earned": referee_bonus,
            "credits_available": referee_bonus,
            "credits_used": 0,
            "referred_users": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Record referee credit transaction
        await db.credit_transactions.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": new_user_id,
            "type": "signup_bonus",
            "amount": referee_bonus,
            "description": "Welcome bonus - referred signup",
            "referred_by": referrer_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Update invite status if exists
        if invite:
            await db.referral_invites.update_one(
                {"id": invite["id"]},
                {"$set": {"status": "signed_up", "signed_up_at": datetime.now(timezone.utc).isoformat()}}
            )
        
        return {
            "processed": True,
            "referrer_credited": referrer_bonus,
            "referee_credited": referee_bonus
        }
    
    return router
