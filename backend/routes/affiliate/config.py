"""
Affiliate System Configuration
Edit these settings to customize your affiliate program
"""

# ==================== COMMISSION MODELS ====================
# Options: "lifetime", "capped_lifetime", "time_limited", "first_purchase"
DEFAULT_COMMISSION_MODEL = "time_limited"

# Commission settings
DEFAULT_COMMISSION_RATE = 10  # Base commission percentage (10% as requested)
DEFAULT_CAP_AMOUNT = 1000.0   # Max earnings per referral (for capped_lifetime)
DEFAULT_DURATION_MONTHS = 12  # Duration for time_limited model (1 year max earning period)

# ==================== TIER SYSTEM ====================
# Flat 10% commission for all affiliates (no tiered rates)
TIERS = [
    {
        "name": "Partner",
        "min_referrals": 0,
        "max_referrals": 10,
        "commission_rate": 10,
        "color": "#10b981",
        "benefits": ["10% commission on all referrals", "Monthly payouts", "Basic dashboard"]
    },
    {
        "name": "Pro Partner", 
        "min_referrals": 11,
        "max_referrals": 50,
        "commission_rate": 10,
        "color": "#3b82f6",
        "benefits": ["10% commission", "Bi-weekly payouts", "Priority support", "Custom referral links"]
    },
    {
        "name": "Elite Partner",
        "min_referrals": 51,
        "max_referrals": None,  # Unlimited
        "commission_rate": 10,
        "color": "#8b5cf6",
        "benefits": ["10% commission", "Weekly payouts", "Dedicated account manager", "Co-marketing opportunities"]
    }
]

# ==================== REFERRAL BENEFITS ====================
# Benefits for referred users (not affiliates)
REFERRAL_BENEFITS = {
    "discount_percent": 20,
    "extended_trial_days": 14,
    "bonus_features": ["Premium support for 30 days"]
}

# ==================== PAYOUT SETTINGS ====================
PAYOUT_SETTINGS = {
    "min_threshold": 50.0,      # Minimum balance for withdrawal
    "payment_methods": ["bank_transfer", "paypal", "mpesa", "crypto"],
    "processing_days": 3,        # Days to process payout
    "currency": "USD"
}

# ==================== PRODUCTS ====================
# Products available for affiliate program
AFFILIATE_PRODUCTS = [
    {
        "id": "fieldforce",
        "name": "FieldForce",
        "commission_rate": 15,
        "min_price": 49,
        "description": "Mobile data collection platform"
    },
    {
        "id": "survey360",
        "name": "Survey360", 
        "commission_rate": 15,
        "min_price": 29,
        "description": "Survey management platform"
    },
    {
        "id": "datapulse",
        "name": "DataPulse",
        "commission_rate": 20,  # Higher commission for enterprise
        "min_price": 199,
        "description": "Enterprise data platform"
    }
]

# ==================== COOKIE SETTINGS ====================
REFERRAL_COOKIE_DAYS = 90  # How long referral attribution lasts

# ==================== APPLICATION REQUIREMENTS ====================
APPLICATION_REQUIREMENTS = {
    "min_followers": 1000,  # Optional: minimum social following
    "require_website": False,
    "require_approval": True,  # Manual approval required
    "auto_approve_criteria": {
        "verified_email": True,
        "existing_customer": True
    }
}
