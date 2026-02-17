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
# Commission rates increase with tier level
TIERS = [
    {
        "name": "Bronze",
        "min_referrals": 0,
        "max_referrals": 10,
        "commission_rate": 10,
        "color": "#CD7F32",
        "benefits": ["10% commission on all referrals", "Monthly payouts", "Basic dashboard"]
    },
    {
        "name": "Silver", 
        "min_referrals": 11,
        "max_referrals": 25,
        "commission_rate": 12,
        "color": "#C0C0C0",
        "benefits": ["12% commission", "Bi-weekly payouts", "Priority support", "Custom referral links"]
    },
    {
        "name": "Gold",
        "min_referrals": 26,
        "max_referrals": 50,
        "commission_rate": 15,
        "color": "#FFD700",
        "benefits": ["15% commission", "Weekly payouts", "Dedicated account manager", "Early access to features"]
    },
    {
        "name": "Platinum",
        "min_referrals": 51,
        "max_referrals": None,  # Unlimited
        "commission_rate": 20,
        "color": "#E5E4E2",
        "benefits": ["20% commission", "Instant payouts", "Personal success manager", "Co-marketing opportunities", "Exclusive events"]
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
