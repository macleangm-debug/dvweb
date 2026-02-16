"""
Affiliate Program API Tests
Tests the affiliate system: program-info, apply, payment methods
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAffiliateProgramInfo:
    """Test GET /api/affiliates/program-info endpoint"""
    
    def test_program_info_returns_200(self):
        """Program info endpoint should return 200"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        assert response.status_code == 200
        print(f"SUCCESS: /api/affiliates/program-info returned 200")
    
    def test_program_info_commission_rate(self):
        """Program info should return 10% commission rate"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        assert data.get("commission_rate") == 10
        print(f"SUCCESS: Commission rate is 10%")
    
    def test_program_info_duration_months(self):
        """Program info should return 12 month duration"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        assert data.get("commission_duration_months") == 12
        print(f"SUCCESS: Duration is 12 months")
    
    def test_program_info_has_tiers(self):
        """Program info should have tiers array"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        assert "tiers" in data
        assert len(data["tiers"]) >= 1
        print(f"SUCCESS: Found {len(data['tiers'])} tiers")
    
    def test_program_info_tier_commission_rates(self):
        """All tiers should have 10% commission rate (flat rate)"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        for tier in data.get("tiers", []):
            assert tier.get("commission_rate") == 10
            print(f"SUCCESS: Tier '{tier['name']}' has 10% commission")
    
    def test_program_info_payment_methods(self):
        """Program info should include 4 payment methods"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        payout_settings = data.get("payout_settings", {})
        payment_methods = payout_settings.get("payment_methods", [])
        
        expected_methods = ["bank_transfer", "paypal", "mpesa", "crypto"]
        for method in expected_methods:
            assert method in payment_methods, f"Missing payment method: {method}"
        print(f"SUCCESS: All 4 payment methods present: {payment_methods}")
    
    def test_program_info_highlights(self):
        """Program info should have highlights array"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        assert "highlights" in data
        assert len(data["highlights"]) >= 1
        print(f"SUCCESS: Found {len(data['highlights'])} highlights")
    
    def test_program_info_products(self):
        """Program info should have products array"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        data = response.json()
        assert "products" in data
        assert len(data["products"]) >= 1
        print(f"SUCCESS: Found {len(data['products'])} products")


class TestAffiliateApplication:
    """Test POST /api/affiliates/apply endpoint"""
    
    def test_apply_with_basic_info(self):
        """Application with basic info should succeed"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_Basic_{timestamp}",
            "email": f"test_basic_{timestamp}@example.com",
            "phone": "+255123456789",
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "pending"
        assert "referral_code" in data
        print(f"SUCCESS: Basic application created with referral code: {data['referral_code']}")
    
    def test_apply_with_bank_transfer_payment(self):
        """Application with bank transfer payment info should succeed"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_Bank_{timestamp}",
            "email": f"test_bank_{timestamp}@example.com",
            "phone": "+255123456789",
            "company_name": "Test Bank Company",
            "website_url": "https://testbank.com",
            "audience_size": 5000,
            "promotion_methods": ["blog", "social"],
            "payment_info": {
                "payment_method": "bank_transfer",
                "bank_name": "CRDB Bank",
                "account_name": "Test User",
                "account_number": "1234567890",
                "swift_code": "CRDBTZTZ"
            },
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "pending"
        assert "referral_code" in data
        print(f"SUCCESS: Bank transfer application created")
    
    def test_apply_with_paypal_payment(self):
        """Application with PayPal payment info should succeed"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_PayPal_{timestamp}",
            "email": f"test_paypal_{timestamp}@example.com",
            "phone": "+255123456789",
            "payment_info": {
                "payment_method": "paypal",
                "paypal_email": f"paypal_{timestamp}@example.com"
            },
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "pending"
        print(f"SUCCESS: PayPal application created")
    
    def test_apply_with_mpesa_payment(self):
        """Application with M-Pesa payment info should succeed"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_MPesa_{timestamp}",
            "email": f"test_mpesa_{timestamp}@example.com",
            "phone": "+255700123456",
            "payment_info": {
                "payment_method": "mpesa",
                "mpesa_phone": "+255700123456",
                "mpesa_name": "Test MPesa User"
            },
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "pending"
        print(f"SUCCESS: M-Pesa application created")
    
    def test_apply_with_crypto_payment(self):
        """Application with Crypto payment info should succeed"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_Crypto_{timestamp}",
            "email": f"test_crypto_{timestamp}@example.com",
            "phone": "+255123456789",
            "payment_info": {
                "payment_method": "crypto",
                "crypto_wallet": "0x1234567890abcdef1234567890abcdef12345678",
                "crypto_network": "USDT-TRC20"
            },
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "pending"
        print(f"SUCCESS: Crypto application created")
    
    def test_apply_without_terms_agreement(self):
        """Application without terms agreement should fail"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_NoTerms_{timestamp}",
            "email": f"test_noterms_{timestamp}@example.com",
            "agreed_to_terms": False
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 400
        print(f"SUCCESS: Application correctly rejected without terms agreement")
    
    def test_apply_duplicate_email_rejected(self):
        """Duplicate pending application should be rejected"""
        timestamp = int(time.time())
        email = f"test_dup_{timestamp}@example.com"
        payload = {
            "full_name": f"TEST_Dup_{timestamp}",
            "email": email,
            "agreed_to_terms": True
        }
        # First application
        response1 = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response1.status_code == 200
        
        # Duplicate application
        payload["full_name"] = f"TEST_Dup2_{timestamp}"
        response2 = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response2.status_code == 400
        print(f"SUCCESS: Duplicate application correctly rejected")
    
    def test_apply_with_complete_info(self):
        """Application with all fields should succeed"""
        timestamp = int(time.time())
        payload = {
            "full_name": f"TEST_Complete_{timestamp}",
            "email": f"test_complete_{timestamp}@example.com",
            "phone": "+255123456789",
            "company_name": "Complete Test Company Ltd",
            "website_url": "https://completetest.com",
            "social_profiles": {
                "linkedin": "https://linkedin.com/in/testuser",
                "twitter": "https://twitter.com/testuser"
            },
            "audience_size": 10000,
            "audience_description": "Tech professionals in East Africa",
            "promotion_methods": ["blog", "social", "email", "youtube"],
            "why_join": "I want to promote DataVision's excellent data solutions",
            "payment_info": {
                "payment_method": "bank_transfer",
                "bank_name": "NMB Bank",
                "account_name": "Complete Test User",
                "account_number": "9876543210",
                "swift_code": "NMBKTZTZ"
            },
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "pending"
        assert "referral_code" in data
        assert data.get("message") == "Application submitted successfully"
        print(f"SUCCESS: Complete application created with referral code: {data['referral_code']}")


class TestAffiliateTrackClick:
    """Test GET /api/affiliates/track/{referral_code} endpoint"""
    
    def test_track_invalid_code_returns_404(self):
        """Invalid referral code should return 404"""
        response = requests.get(f"{BASE_URL}/api/affiliates/track/INVALID_CODE_123")
        assert response.status_code == 404
        print(f"SUCCESS: Invalid referral code correctly returns 404")
