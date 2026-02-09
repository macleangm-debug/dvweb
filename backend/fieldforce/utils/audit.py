"""FieldForce - Audit Utils
Note: This module was missing from the GitHub repo and has been stubbed
"""
from functools import wraps
from datetime import datetime, timezone


def log_action(action_type: str, target_type: str = None):
    """Decorator to log actions for audit trail
    Note: Stubbed - logs to console only
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Execute the function
            result = await func(*args, **kwargs)
            # Log the action (console only for now)
            print(f"[AUDIT] {datetime.now(timezone.utc).isoformat()} - {action_type} on {target_type}")
            return result
        return wrapper
    return decorator
