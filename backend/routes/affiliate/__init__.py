# Affiliate System Module
from .routes import create_affiliate_router
from .config import TIERS, AFFILIATE_PRODUCTS, REFERRAL_BENEFITS, PAYOUT_SETTINGS
from .models import (
    AffiliateApplicationRequest, PayoutRequestModel, UpdateAffiliateRequest,
    AffiliateStatus, PayoutStatus, CommissionStatus, PaymentInfoModel
)

__all__ = [
    'create_affiliate_router',
    'TIERS', 'AFFILIATE_PRODUCTS', 'REFERRAL_BENEFITS', 'PAYOUT_SETTINGS',
    'AffiliateApplicationRequest', 'PayoutRequestModel', 'UpdateAffiliateRequest',
    'AffiliateStatus', 'PayoutStatus', 'CommissionStatus', 'PaymentInfoModel'
]
