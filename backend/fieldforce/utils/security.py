"""FieldForce - Security Utils
Note: This module was missing from the GitHub repo and has been stubbed
"""
from functools import wraps
from fastapi import Depends


def requires_permission(permission: str):
    """Decorator to require a specific permission
    Note: Stubbed - passes through without checking
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await func(*args, **kwargs)
        return wrapper
    return decorator


async def check_permission(db, user_id: str, org_id: str, permission: str) -> bool:
    """Check if user has a specific permission in an organization
    Note: Stubbed - always returns True
    """
    return True
