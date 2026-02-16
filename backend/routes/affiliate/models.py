"""
Affiliate System Models
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AffiliateStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class PayoutStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class CommissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    PAID = "paid"
    CANCELLED = "cancelled"


class PromoCodeType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"


class PromoCodeStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"


# ==================== PROMO CODE MODELS ====================

class PromoCodeCreate(BaseModel):
    """Create a promotional code (admin-only)"""
    code: str = Field(..., min_length=3, max_length=20)
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    discount_type: PromoCodeType = PromoCodeType.PERCENTAGE
    discount_value: float = Field(..., gt=0)  # Percentage or fixed amount
    max_uses: Optional[int] = None  # None = unlimited
    max_uses_per_user: int = 1
    min_order_value: Optional[float] = None
    applicable_products: List[str] = []  # Empty = all products
    start_date: str  # ISO format
    end_date: str    # ISO format
    is_active: bool = True


class PromoCodeUpdate(BaseModel):
    """Update a promotional code"""
    name: Optional[str] = None
    description: Optional[str] = None
    discount_type: Optional[PromoCodeType] = None
    discount_value: Optional[float] = None
    max_uses: Optional[int] = None
    max_uses_per_user: Optional[int] = None
    min_order_value: Optional[float] = None
    applicable_products: Optional[List[str]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_active: Optional[bool] = None


# ==================== REQUEST MODELS ====================

class PaymentInfoModel(BaseModel):
    """Payment information for affiliate payouts"""
    payment_method: str  # bank_transfer, paypal, mpesa, crypto
    # Bank details
    bank_name: Optional[str] = None
    account_name: Optional[str] = None
    account_number: Optional[str] = None
    swift_code: Optional[str] = None
    # PayPal
    paypal_email: Optional[str] = None
    # M-Pesa
    mpesa_phone: Optional[str] = None
    mpesa_name: Optional[str] = None
    # Crypto
    crypto_wallet: Optional[str] = None
    crypto_network: Optional[str] = None  # BTC, ETH, USDT, etc.


class AffiliateApplicationRequest(BaseModel):
    """Application to join affiliate program"""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    company_name: Optional[str] = None
    website_url: Optional[str] = None
    social_profiles: Optional[dict] = None  # {"linkedin": "...", "twitter": "..."}
    audience_size: Optional[int] = None
    audience_description: Optional[str] = None
    promotion_methods: List[str] = []  # ["blog", "social", "email", "youtube"]
    why_join: Optional[str] = None
    payment_info: Optional[PaymentInfoModel] = None  # Payment information for payouts
    agreed_to_terms: bool = False


class PayoutRequestModel(BaseModel):
    """Request for payout"""
    amount: float = Field(..., gt=0)
    payment_method: str
    payment_details: dict  # Bank details, PayPal email, etc.


class UpdateAffiliateRequest(BaseModel):
    """Admin update affiliate"""
    status: Optional[AffiliateStatus] = None
    tier: Optional[str] = None
    custom_commission_rate: Optional[float] = None
    notes: Optional[str] = None


# ==================== RESPONSE MODELS ====================

class AffiliateProfile(BaseModel):
    """Full affiliate profile"""
    id: str
    user_id: str
    referral_code: str
    referral_link: str
    status: AffiliateStatus
    tier: str
    commission_rate: float
    total_referrals: int
    active_referrals: int
    total_earnings: float
    pending_earnings: float
    available_balance: float
    paid_out: float
    created_at: datetime
    approved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ReferralRecord(BaseModel):
    """Individual referral record"""
    id: str
    referred_user_id: str
    referred_email: str
    product: str
    status: str
    signup_date: datetime
    first_purchase_date: Optional[datetime] = None
    total_revenue: float
    commission_earned: float
    commission_status: CommissionStatus


class CommissionRecord(BaseModel):
    """Commission transaction record"""
    id: str
    referral_id: str
    amount: float
    product: str
    order_id: Optional[str] = None
    status: CommissionStatus
    created_at: datetime
    paid_at: Optional[datetime] = None


class PayoutRecord(BaseModel):
    """Payout record"""
    id: str
    amount: float
    payment_method: str
    status: PayoutStatus
    requested_at: datetime
    processed_at: Optional[datetime] = None
    transaction_id: Optional[str] = None


class AffiliateDashboardStats(BaseModel):
    """Dashboard statistics"""
    total_clicks: int
    total_referrals: int
    conversion_rate: float
    total_earnings: float
    pending_earnings: float
    available_balance: float
    this_month_earnings: float
    this_month_referrals: int
    tier: str
    next_tier: Optional[str] = None
    referrals_to_next_tier: Optional[int] = None


class AffiliateLeaderboard(BaseModel):
    """Leaderboard entry"""
    rank: int
    affiliate_name: str
    tier: str
    total_referrals: int
    total_earnings: float


# ==================== DATABASE SCHEMAS ====================
# These define the MongoDB document structure

AFFILIATE_SCHEMA = {
    "id": str,
    "user_id": str,
    "email": str,
    "full_name": str,
    "referral_code": str,
    "status": str,  # AffiliateStatus
    "tier": str,
    "commission_rate": float,
    "custom_commission_rate": float,  # Optional override
    "company_name": str,
    "website_url": str,
    "social_profiles": dict,
    "audience_size": int,
    "promotion_methods": list,
    "total_clicks": int,
    "total_referrals": int,
    "active_referrals": int,
    "total_earnings": float,
    "pending_earnings": float,
    "available_balance": float,
    "paid_out": float,
    "application_data": dict,
    "notes": str,
    "created_at": datetime,
    "updated_at": datetime,
    "approved_at": datetime,
}

REFERRAL_SCHEMA = {
    "id": str,
    "affiliate_id": str,
    "referred_user_id": str,
    "referred_email": str,
    "referral_code": str,
    "product": str,
    "status": str,  # "signed_up", "converted", "churned"
    "signup_date": datetime,
    "first_purchase_date": datetime,
    "total_revenue": float,
    "commission_earned": float,
    "commission_status": str,
    "commission_cap_reached": bool,
    "ip_address": str,
    "user_agent": str,
}

COMMISSION_SCHEMA = {
    "id": str,
    "affiliate_id": str,
    "referral_id": str,
    "amount": float,
    "product": str,
    "order_id": str,
    "order_amount": float,
    "commission_rate": float,
    "status": str,
    "created_at": datetime,
    "approved_at": datetime,
    "paid_at": datetime,
}

PAYOUT_SCHEMA = {
    "id": str,
    "affiliate_id": str,
    "amount": float,
    "payment_method": str,
    "payment_details": dict,
    "status": str,
    "requested_at": datetime,
    "processed_at": datetime,
    "transaction_id": str,
    "notes": str,
}

CLICK_SCHEMA = {
    "id": str,
    "affiliate_id": str,
    "referral_code": str,
    "ip_address": str,
    "user_agent": str,
    "referer": str,
    "landing_page": str,
    "timestamp": datetime,
}
