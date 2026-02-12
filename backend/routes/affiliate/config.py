"""
Affiliate System Configuration
Edit these settings to customize your affiliate program
"""

# ==================== COMMISSION MODELS ====================
# Options: "lifetime", "capped_lifetime", "time_limited", "first_purchase"
DEFAULT_COMMISSION_MODEL = "capped_lifetime"

# Commission settings
DEFAULT_COMMISSION_RATE = 15  # Base commission percentage
DEFAULT_CAP_AMOUNT = 500.0    # Max earnings per referral (for capped_lifetime)
DEFAULT_DURATION_MONTHS = 24   # Duration for time_limited model

# ==================== TIER SYSTEM ====================
TIERS = [
    {
        "name": "Bronze",
        "min_referrals": 0,
        "max_referrals": 5,
        "commission_rate": 10,
        "color": "#CD7F32",
        "benefits": ["Basic dashboard", "Monthly payouts"]
    },
    {
        "name": "Silver", 
        "min_referrals": 6,
        "max_referrals": 20,
        "commission_rate": 15,
        "color": "#C0C0C0",
        "benefits": ["Priority support", "Bi-weekly payouts", "Custom referral links"]
    },
    {
        "name": "Gold",
        "min_referrals": 21,
        "max_referrals": 50,
        "commission_rate": 20,
        "color": "#FFD700",
        "benefits": ["Dedicated account manager", "Weekly payouts", "Co-marketing opportunities"]
    },
    {
        "name": "Platinum",
        "min_referrals": 51,
        "max_referrals": None,  # Unlimited
        "commission_rate": 25,
        "color": "#E5E4E2",
        "benefits": ["VIP support", "Instant payouts", "Revenue share bonuses", "Early access to features"]
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
