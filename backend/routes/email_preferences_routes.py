"""
Email Preferences API Routes
Allows users to manage their email notification settings.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime, timezone

from services.email_preferences import (
    EmailPreferences,
    EmailCategory,
    EmailFrequency,
    UpdateEmailPreferencesRequest,
    BulkUpdatePreferencesRequest,
    CATEGORY_INFO,
    MANDATORY_CATEGORIES,
    get_default_preferences,
    should_send_email
)

router = APIRouter(prefix="/email-preferences", tags=["Email Preferences"])


def create_email_preferences_router(db, verify_token):
    """Create email preferences router with database dependency"""
    
    @router.get("/")
    async def get_my_preferences(payload: dict = Depends(verify_token)):
        """Get current user's email preferences"""
        user_email = payload.get("sub")
        user_id = payload.get("user_id") or payload.get("id")
        
        # Get existing preferences
        prefs = await db.email_preferences.find_one(
            {"user_id": user_id},
            {"_id": 0}
        )
        
        if not prefs:
            # Get user's tier
            user = await db.datavision_users.find_one({"id": user_id}, {"_id": 0})
            if not user:
                user = await db.admins.find_one({"id": user_id}, {"_id": 0})
            
            tier = user.get("billing_tier", "free") if user else "free"
            
            # Create default preferences
            prefs = {
                "user_id": user_id,
                "email": user_email,
                "tier": tier,
                "global_unsubscribe": False,
                "preferences": get_default_preferences(tier),
                "quiet_hours_enabled": False,
                "quiet_hours_start": "22:00",
                "quiet_hours_end": "08:00",
                "quiet_hours_timezone": "Africa/Dar_es_Salaam",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.email_preferences.insert_one(prefs)
        
        return {
            "preferences": prefs,
            "categories": CATEGORY_INFO,
            "frequencies": [f.value for f in EmailFrequency],
            "mandatory_categories": [c.value for c in MANDATORY_CATEGORIES]
        }
    
    @router.put("/category")
    async def update_category_preference(
        request: UpdateEmailPreferencesRequest,
        payload: dict = Depends(verify_token)
    ):
        """Update preference for a single email category"""
        user_id = payload.get("user_id") or payload.get("id")
        
        # Validate category
        try:
            category = EmailCategory(request.category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid category: {request.category}")
        
        # Validate frequency
        try:
            frequency = EmailFrequency(request.frequency)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid frequency: {request.frequency}")
        
        # Cannot disable mandatory categories
        if category in MANDATORY_CATEGORIES and frequency == EmailFrequency.NEVER:
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot disable {category.value} notifications (required for account security)"
            )
        
        # Update preference
        result = await db.email_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    f"preferences.{category.value}": frequency.value,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "message": f"Updated {category.value} to {frequency.value}",
            "category": category.value,
            "frequency": frequency.value
        }
    
    @router.put("/bulk")
    async def bulk_update_preferences(
        request: BulkUpdatePreferencesRequest,
        payload: dict = Depends(verify_token)
    ):
        """Update multiple email preferences at once"""
        user_id = payload.get("user_id") or payload.get("id")
        
        update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
        
        # Validate and process preferences
        for cat_str, freq_str in request.preferences.items():
            try:
                category = EmailCategory(cat_str)
                frequency = EmailFrequency(freq_str)
                
                # Cannot disable mandatory categories
                if category in MANDATORY_CATEGORIES and frequency == EmailFrequency.NEVER:
                    continue  # Skip silently
                
                update_data[f"preferences.{cat_str}"] = freq_str
            except ValueError:
                continue  # Skip invalid categories/frequencies
        
        # Update global unsubscribe if provided
        if request.global_unsubscribe is not None:
            update_data["global_unsubscribe"] = request.global_unsubscribe
        
        await db.email_preferences.update_one(
            {"user_id": user_id},
            {"$set": update_data},
            upsert=True
        )
        
        return {"message": "Preferences updated", "updated_count": len(request.preferences)}
    
    @router.post("/unsubscribe-all")
    async def unsubscribe_all(payload: dict = Depends(verify_token)):
        """Unsubscribe from all non-mandatory emails"""
        user_id = payload.get("user_id") or payload.get("id")
        
        await db.email_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "global_unsubscribe": True,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "message": "You have been unsubscribed from all non-essential emails",
            "note": "You will still receive security and billing notifications"
        }
    
    @router.post("/resubscribe")
    async def resubscribe(payload: dict = Depends(verify_token)):
        """Resubscribe to emails (undo global unsubscribe)"""
        user_id = payload.get("user_id") or payload.get("id")
        user_email = payload.get("sub")
        
        # Get user's tier for defaults
        user = await db.datavision_users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            user = await db.admins.find_one({"id": user_id}, {"_id": 0})
        
        tier = user.get("billing_tier", "free") if user else "free"
        
        await db.email_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "global_unsubscribe": False,
                    "preferences": get_default_preferences(tier),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "message": "You have been resubscribed with default preferences",
            "tier": tier
        }
    
    @router.put("/quiet-hours")
    async def update_quiet_hours(
        enabled: bool,
        start: Optional[str] = "22:00",
        end: Optional[str] = "08:00",
        timezone_str: Optional[str] = "Africa/Dar_es_Salaam",
        payload: dict = Depends(verify_token)
    ):
        """Update quiet hours settings"""
        user_id = payload.get("user_id") or payload.get("id")
        
        await db.email_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "quiet_hours_enabled": enabled,
                    "quiet_hours_start": start,
                    "quiet_hours_end": end,
                    "quiet_hours_timezone": timezone_str,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "message": "Quiet hours updated",
            "enabled": enabled,
            "start": start,
            "end": end,
            "timezone": timezone_str
        }
    
    @router.get("/reset-to-defaults")
    async def reset_to_defaults(payload: dict = Depends(verify_token)):
        """Reset email preferences to tier defaults"""
        user_id = payload.get("user_id") or payload.get("id")
        
        # Get user's tier
        user = await db.datavision_users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            user = await db.admins.find_one({"id": user_id}, {"_id": 0})
        
        tier = user.get("billing_tier", "free") if user else "free"
        
        await db.email_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "global_unsubscribe": False,
                    "preferences": get_default_preferences(tier),
                    "quiet_hours_enabled": False,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )
        
        return {
            "message": f"Preferences reset to {tier} tier defaults",
            "tier": tier,
            "preferences": get_default_preferences(tier)
        }
    
    # ==================== PUBLIC UNSUBSCRIBE (one-click from email) ====================
    
    @router.get("/unsubscribe/{token}")
    async def one_click_unsubscribe(token: str):
        """
        One-click unsubscribe from email link (no auth required).
        Token should be a signed JWT or unique identifier.
        """
        # In production, validate the unsubscribe token
        # For now, we'll use user_id as a simple token
        
        prefs = await db.email_preferences.find_one(
            {"user_id": token},
            {"_id": 0}
        )
        
        if not prefs:
            raise HTTPException(status_code=404, detail="Invalid unsubscribe link")
        
        await db.email_preferences.update_one(
            {"user_id": token},
            {
                "$set": {
                    "global_unsubscribe": True,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return {
            "message": "You have been unsubscribed from all marketing emails",
            "note": "You will still receive important security and billing notifications"
        }
    
    return router
