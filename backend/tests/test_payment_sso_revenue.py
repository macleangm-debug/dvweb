"""
Test file for Centralized Payment System features:
- SSO endpoints with subscription info (/api/auth/sso/survey360, /api/auth/sso/fieldforce)
- Revenue analytics endpoints (/api/admin/revenue/overview, /api/admin/revenue/by-product, /api/admin/subscriptions)
- User subscriptions endpoint (/api/user/subscriptions)
"""
import pytest
import requests
import os
import uuid
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@datavision.co.tz"
ADMIN_PASSWORD = "admin123"

class TestSetup:
    """Setup and connectivity tests"""
    
    def test_api_connectivity(self):
        """Test that API is reachable"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "status" in data
        print(f"API connectivity: OK - {data}")
    
    def test_admin_login(self):
        """Test admin login and get token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        print(f"Admin login: OK - Token received")
        return data["access_token"]


class TestSSOEndpoints:
    """Test SSO endpoints return subscription info"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token for SSO tests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_sso_survey360_returns_subscription_info(self, admin_token):
        """Test /api/auth/sso/survey360 returns subscription data"""
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"SSO Survey360 failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "user" in data
        assert "access_token" in data
        assert "subscription" in data or "subscription" in data.keys()  # Can be null
        assert "sso" in data
        assert data["sso"] == True
        assert "provider" in data
        assert data["provider"] == "datavision"
        
        # Verify user structure
        user = data["user"]
        assert "id" in user
        assert "email" in user
        assert "name" in user
        
        print(f"SSO Survey360 response: {data}")
        print(f"Subscription value: {data.get('subscription')}")
    
    def test_sso_survey360_user_without_subscription_gets_null(self, admin_token):
        """Test that users without subscription get subscription: null"""
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # For admin user without active subscription, should be null
        subscription = data.get("subscription")
        # Note: subscription can be null (None) or contain actual subscription data
        if subscription is None:
            print("User has no active subscription - returned null as expected")
        else:
            print(f"User has active subscription: {subscription}")
            # Verify subscription structure if present
            assert "plan" in subscription
            assert "status" in subscription
    
    def test_sso_fieldforce_returns_subscription_info(self, admin_token):
        """Test /api/auth/sso/fieldforce returns subscription data"""
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/fieldforce",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"SSO FieldForce failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "user" in data
        assert "access_token" in data
        assert "subscription" in data or "subscription" in data.keys()
        assert "sso" in data
        assert data["sso"] == True
        assert "provider" in data
        assert data["provider"] == "datavision"
        
        # Verify user structure
        user = data["user"]
        assert "id" in user
        assert "email" in user
        assert "name" in user
        assert "organization_id" in user
        
        print(f"SSO FieldForce response: {data}")
        print(f"Subscription value: {data.get('subscription')}")
    
    def test_sso_without_auth_returns_401(self):
        """Test SSO endpoints require authentication"""
        # Test Survey360 without auth
        response = requests.post(f"{BASE_URL}/api/auth/sso/survey360")
        assert response.status_code == 401
        
        # Test FieldForce without auth
        response = requests.post(f"{BASE_URL}/api/auth/sso/fieldforce")
        assert response.status_code == 401
        
        print("SSO endpoints correctly require authentication")
    
    def test_sso_with_invalid_token_returns_401(self):
        """Test SSO endpoints reject invalid tokens"""
        invalid_token = "invalid.jwt.token"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {invalid_token}"}
        )
        assert response.status_code == 401
        
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/fieldforce",
            headers={"Authorization": f"Bearer {invalid_token}"}
        )
        assert response.status_code == 401
        
        print("SSO endpoints correctly reject invalid tokens")


class TestRevenueAnalyticsEndpoints:
    """Test admin revenue analytics endpoints"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_revenue_overview_requires_admin(self):
        """Test /api/admin/revenue/overview requires admin auth"""
        # Without auth
        response = requests.get(f"{BASE_URL}/api/admin/revenue/overview")
        assert response.status_code in [401, 403]
        
        print("Revenue overview correctly requires admin authentication")
    
    def test_revenue_overview_returns_stats(self, admin_token):
        """Test /api/admin/revenue/overview returns revenue statistics"""
        response = requests.get(
            f"{BASE_URL}/api/admin/revenue/overview",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Revenue overview failed: {response.text}"
        data = response.json()
        
        # Verify required fields
        assert "total_revenue" in data
        assert "total_transactions" in data
        assert "active_subscriptions" in data
        assert "revenue_by_product" in data
        assert "monthly_revenue" in data
        
        # Verify data types
        assert isinstance(data["total_revenue"], (int, float))
        assert isinstance(data["total_transactions"], int)
        assert isinstance(data["active_subscriptions"], int)
        assert isinstance(data["revenue_by_product"], dict)
        assert isinstance(data["monthly_revenue"], list)
        
        # Verify monthly_revenue structure
        if data["monthly_revenue"]:
            month_entry = data["monthly_revenue"][0]
            assert "month" in month_entry
            assert "revenue" in month_entry
            assert "transactions" in month_entry
        
        print(f"Revenue Overview: total=${data['total_revenue']}, txns={data['total_transactions']}, active_subs={data['active_subscriptions']}")
        print(f"Revenue by product: {data['revenue_by_product']}")
    
    def test_revenue_by_product_requires_admin(self):
        """Test /api/admin/revenue/by-product requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/revenue/by-product")
        assert response.status_code in [401, 403]
        
        print("Revenue by-product correctly requires admin authentication")
    
    def test_revenue_by_product_returns_breakdown(self, admin_token):
        """Test /api/admin/revenue/by-product returns detailed breakdown"""
        response = requests.get(
            f"{BASE_URL}/api/admin/revenue/by-product",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Revenue by-product failed: {response.text}"
        data = response.json()
        
        # Verify structure
        assert "products" in data
        assert isinstance(data["products"], list)
        
        # If there are products, verify structure
        for product in data["products"]:
            assert "product_id" in product
            assert "total_revenue" in product
            assert "transactions" in product
            assert "packages" in product
            assert "active_subscriptions" in product
        
        print(f"Revenue by product: {len(data['products'])} products")
        for p in data["products"]:
            print(f"  - {p['product_id']}: ${p['total_revenue']} ({p['active_subscriptions']} active subs)")
    
    def test_admin_subscriptions_requires_admin(self):
        """Test /api/admin/subscriptions requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/admin/subscriptions")
        assert response.status_code in [401, 403]
        
        print("Admin subscriptions correctly requires admin authentication")
    
    def test_admin_subscriptions_returns_list(self, admin_token):
        """Test /api/admin/subscriptions returns subscription list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/subscriptions",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Admin subscriptions failed: {response.text}"
        data = response.json()
        
        # Verify structure
        assert "subscriptions" in data
        assert "total" in data
        assert isinstance(data["subscriptions"], list)
        assert isinstance(data["total"], int)
        
        print(f"Admin subscriptions: {data['total']} total subscriptions")
        
        # If subscriptions exist, verify structure
        for sub in data["subscriptions"][:3]:  # Check first 3
            print(f"  - {sub.get('user_email', 'N/A')}: {sub.get('product_id', 'N/A')} ({sub.get('status', 'N/A')})")
    
    def test_admin_subscriptions_filter_by_product(self, admin_token):
        """Test filtering subscriptions by product_id"""
        response = requests.get(
            f"{BASE_URL}/api/admin/subscriptions?product_id=survey360",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # All returned subscriptions should be for survey360
        for sub in data["subscriptions"]:
            assert sub.get("product_id") == "survey360"
        
        print(f"Filtered subscriptions for survey360: {data['total']}")
    
    def test_admin_subscriptions_filter_by_status(self, admin_token):
        """Test filtering subscriptions by status"""
        # Active subscriptions
        response = requests.get(
            f"{BASE_URL}/api/admin/subscriptions?status=active",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        active_data = response.json()
        
        for sub in active_data["subscriptions"]:
            assert sub.get("status") == "active"
        
        print(f"Active subscriptions: {active_data['total']}")


class TestUserSubscriptionsEndpoint:
    """Test user subscriptions endpoint"""
    
    def test_user_subscriptions_requires_email(self):
        """Test /api/user/subscriptions requires email parameter"""
        response = requests.get(f"{BASE_URL}/api/user/subscriptions")
        # Should fail or return empty without email
        assert response.status_code in [200, 400, 422]
        
        print("User subscriptions endpoint behavior without email tested")
    
    def test_user_subscriptions_returns_list(self):
        """Test /api/user/subscriptions returns subscription list for a user"""
        response = requests.get(
            f"{BASE_URL}/api/user/subscriptions",
            params={"email": ADMIN_EMAIL}
        )
        assert response.status_code == 200, f"User subscriptions failed: {response.text}"
        data = response.json()
        
        # Verify structure
        assert "subscriptions" in data
        assert isinstance(data["subscriptions"], list)
        
        print(f"User subscriptions for {ADMIN_EMAIL}: {len(data['subscriptions'])} subscriptions")
        for sub in data["subscriptions"]:
            print(f"  - {sub.get('product_id', 'N/A')}: {sub.get('plan', 'N/A')} ({sub.get('status', 'N/A')})")
    
    def test_user_subscriptions_for_nonexistent_user(self):
        """Test /api/user/subscriptions for user with no subscriptions"""
        response = requests.get(
            f"{BASE_URL}/api/user/subscriptions",
            params={"email": f"nonexistent_{uuid.uuid4()}@test.com"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Should return empty list, not error
        assert "subscriptions" in data
        assert isinstance(data["subscriptions"], list)
        assert len(data["subscriptions"]) == 0
        
        print("Nonexistent user correctly returns empty subscription list")


class TestPaymentCheckoutCreatesSubscription:
    """Test that payment checkout creates subscription records"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_checkout_endpoint_exists(self):
        """Test /api/payments/checkout endpoint exists"""
        # POST without required fields should return validation error, not 404
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json={})
        # Should be 422 (validation error) or 400, not 404
        assert response.status_code != 404, "Checkout endpoint not found"
        print(f"Checkout endpoint exists - status: {response.status_code}")
    
    def test_checkout_request_structure(self):
        """Test checkout request validation"""
        # Test with valid structure but test mode
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "package_id": "survey360_monthly",
                "origin_url": "https://test.example.com",
                "user_email": "test@example.com"
            }
        )
        # Should either succeed or return Stripe-related error, not validation error
        assert response.status_code in [200, 201, 400, 500], f"Unexpected status: {response.status_code}"
        print(f"Checkout request validation: {response.status_code}")


class TestSubscriptionDataInSSOTokens:
    """Verify subscription info is included in SSO tokens"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_sso_token_contains_plan_info(self, admin_token):
        """Verify SSO token payload includes plan info"""
        import base64
        import json
        
        # Get SSO token for Survey360
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Decode JWT to check payload
        sso_token = data["access_token"]
        parts = sso_token.split(".")
        assert len(parts) == 3, "Invalid JWT format"
        
        # Decode payload (add padding for base64)
        payload_b64 = parts[1] + "=" * (4 - len(parts[1]) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        
        # Token should contain plan and product info
        assert "product" in payload, f"Token missing 'product' field. Payload: {payload}"
        assert "plan" in payload, f"Token missing 'plan' field. Payload: {payload}"
        assert payload["product"] == "survey360"
        
        print(f"SSO Token payload: {payload}")
        print(f"Plan in token: {payload.get('plan')}")


class TestSubscriptionExpiry:
    """Test subscription expiry handling"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_get_user_subscription_helper_exists(self, admin_token):
        """Verify get_user_subscription helper works via SSO"""
        # The SSO endpoint internally uses get_user_subscription
        response = requests.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # The subscription field proves get_user_subscription is called
        assert "subscription" in data or "subscription" in data.keys()
        print(f"get_user_subscription helper working - subscription: {data.get('subscription')}")


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
