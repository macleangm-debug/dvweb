"""
Email Preferences Model and Service
Industry-standard email notification preferences with tier-based defaults.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from enum import Enum


class EmailFrequency(str, Enum):
    IMMEDIATELY = "immediately"
    DAILY_DIGEST = "daily"
    WEEKLY_DIGEST = "weekly"
    MONTHLY_DIGEST = "monthly"
    NEVER = "never"


class EmailCategory(str, Enum):
    # Transactional (cannot be disabled)
    SECURITY = "security"  # Login alerts, password changes
    BILLING = "billing"    # Payment confirmations, invoices
    
    # Marketing (can be disabled)
    PRODUCT_UPDATES = "product_updates"     # New features, improvements
    TIPS_AND_TUTORIALS = "tips_tutorials"   # How-to guides, best practices
    COMPANY_NEWS = "company_news"           # Company announcements
    
    # Activity (customizable frequency)
    SURVEY_ACTIVITY = "survey_activity"     # Survey responses, completions
    FIELD_ACTIVITY = "field_activity"       # Data sync, assignments
    REPORT_READY = "report_ready"           # Reports and exports
    
    # Digest
    WEEKLY_SUMMARY = "weekly_summary"       # Weekly activity summary
    MONTHLY_REPORT = "monthly_report"       # Monthly insights report


# Tier-based default preferences
TIER_EMAIL_DEFAULTS = {
    "free": {
        EmailCategory.SECURITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.BILLING: EmailFrequency.IMMEDIATELY,
        EmailCategory.PRODUCT_UPDATES: EmailFrequency.MONTHLY_DIGEST,
        EmailCategory.TIPS_AND_TUTORIALS: EmailFrequency.MONTHLY_DIGEST,
        EmailCategory.COMPANY_NEWS: EmailFrequency.MONTHLY_DIGEST,
        EmailCategory.SURVEY_ACTIVITY: EmailFrequency.DAILY_DIGEST,
        EmailCategory.FIELD_ACTIVITY: EmailFrequency.DAILY_DIGEST,
        EmailCategory.REPORT_READY: EmailFrequency.IMMEDIATELY,
        EmailCategory.WEEKLY_SUMMARY: EmailFrequency.NEVER,
        EmailCategory.MONTHLY_REPORT: EmailFrequency.MONTHLY_DIGEST,
    },
    "pro": {
        EmailCategory.SECURITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.BILLING: EmailFrequency.IMMEDIATELY,
        EmailCategory.PRODUCT_UPDATES: EmailFrequency.WEEKLY_DIGEST,
        EmailCategory.TIPS_AND_TUTORIALS: EmailFrequency.WEEKLY_DIGEST,
        EmailCategory.COMPANY_NEWS: EmailFrequency.WEEKLY_DIGEST,
        EmailCategory.SURVEY_ACTIVITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.FIELD_ACTIVITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.REPORT_READY: EmailFrequency.IMMEDIATELY,
        EmailCategory.WEEKLY_SUMMARY: EmailFrequency.WEEKLY_DIGEST,
        EmailCategory.MONTHLY_REPORT: EmailFrequency.MONTHLY_DIGEST,
    },
    "enterprise": {
        EmailCategory.SECURITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.BILLING: EmailFrequency.IMMEDIATELY,
        EmailCategory.PRODUCT_UPDATES: EmailFrequency.IMMEDIATELY,
        EmailCategory.TIPS_AND_TUTORIALS: EmailFrequency.WEEKLY_DIGEST,
        EmailCategory.COMPANY_NEWS: EmailFrequency.IMMEDIATELY,
        EmailCategory.SURVEY_ACTIVITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.FIELD_ACTIVITY: EmailFrequency.IMMEDIATELY,
        EmailCategory.REPORT_READY: EmailFrequency.IMMEDIATELY,
        EmailCategory.WEEKLY_SUMMARY: EmailFrequency.WEEKLY_DIGEST,
        EmailCategory.MONTHLY_REPORT: EmailFrequency.MONTHLY_DIGEST,
    }
}

# Categories that cannot be disabled (transactional)
MANDATORY_CATEGORIES = [
    EmailCategory.SECURITY,
    EmailCategory.BILLING
]

# Category display info
CATEGORY_INFO = {
    EmailCategory.SECURITY: {
        "name": "Security Alerts",
        "description": "Login notifications, password changes, and security alerts",
        "icon": "shield",
        "mandatory": True
    },
    EmailCategory.BILLING: {
        "name": "Billing & Payments",
        "description": "Payment confirmations, invoices, and subscription updates",
        "icon": "credit-card",
        "mandatory": True
    },
    EmailCategory.PRODUCT_UPDATES: {
        "name": "Product Updates",
        "description": "New features, improvements, and platform updates",
        "icon": "sparkles",
        "mandatory": False
    },
    EmailCategory.TIPS_AND_TUTORIALS: {
        "name": "Tips & Tutorials",
        "description": "Best practices, how-to guides, and learning resources",
        "icon": "lightbulb",
        "mandatory": False
    },
    EmailCategory.COMPANY_NEWS: {
        "name": "Company News",
        "description": "Company announcements, events, and industry insights",
        "icon": "newspaper",
        "mandatory": False
    },
    EmailCategory.SURVEY_ACTIVITY: {
        "name": "Survey Activity",
        "description": "Survey responses, completions, and milestones",
        "icon": "clipboard-list",
        "mandatory": False
    },
    EmailCategory.FIELD_ACTIVITY: {
        "name": "Field Activity",
        "description": "Data collection sync, field assignments, and alerts",
        "icon": "map-pin",
        "mandatory": False
    },
    EmailCategory.REPORT_READY: {
        "name": "Reports & Exports",
        "description": "Notification when reports and data exports are ready",
        "icon": "file-text",
        "mandatory": False
    },
    EmailCategory.WEEKLY_SUMMARY: {
        "name": "Weekly Summary",
        "description": "Weekly digest of your activity and key metrics",
        "icon": "calendar",
        "mandatory": False
    },
    EmailCategory.MONTHLY_REPORT: {
        "name": "Monthly Report",
        "description": "Monthly insights report with trends and analytics",
        "icon": "bar-chart",
        "mandatory": False
    }
}


class EmailPreferences(BaseModel):
    """User email preferences model"""
    user_id: str
    email: str
    tier: str = "free"
    
    # Global unsubscribe (affects all non-mandatory emails)
    global_unsubscribe: bool = False
    
    # Per-category preferences
    preferences: Dict[str, str] = Field(default_factory=dict)
    
    # Quiet hours (no emails except security)
    quiet_hours_enabled: bool = False
    quiet_hours_start: Optional[str] = "22:00"  # 10 PM
    quiet_hours_end: Optional[str] = "08:00"    # 8 AM
    quiet_hours_timezone: str = "Africa/Dar_es_Salaam"
    
    # Updated timestamp
    updated_at: Optional[str] = None


class UpdateEmailPreferencesRequest(BaseModel):
    """Request to update email preferences"""
    category: str
    frequency: str


class BulkUpdatePreferencesRequest(BaseModel):
    """Request to update multiple preferences at once"""
    preferences: Dict[str, str]
    global_unsubscribe: Optional[bool] = None


def get_default_preferences(tier: str = "free") -> Dict[str, str]:
    """Get default email preferences based on user tier"""
    defaults = TIER_EMAIL_DEFAULTS.get(tier, TIER_EMAIL_DEFAULTS["free"])
    return {cat.value: freq.value for cat, freq in defaults.items()}


def should_send_email(
    preferences: Dict[str, str],
    category: EmailCategory,
    global_unsubscribe: bool = False
) -> tuple[bool, str]:
    """
    Check if an email should be sent based on preferences.
    Returns (should_send, frequency)
    """
    # Always send mandatory categories
    if category in MANDATORY_CATEGORIES:
        return True, EmailFrequency.IMMEDIATELY.value
    
    # Check global unsubscribe
    if global_unsubscribe:
        return False, EmailFrequency.NEVER.value
    
    # Check category preference
    freq = preferences.get(category.value, EmailFrequency.NEVER.value)
    
    if freq == EmailFrequency.NEVER.value:
        return False, freq
    
    return True, freq
