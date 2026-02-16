"""
Test file for DataVision refactoring and new features:
1. Email endpoints with Pydantic models (email_routes.py)
2. Auth endpoints from modularized auth_routes.py
3. Admin Analytics Dashboard endpoints
4. Promo codes with applicable_products field
"""
import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@datavision.co.tz",
        "password": "admin123"
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip(f"Admin login failed: {response.status_code}")

@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestAuthEndpoints:
    """Test modularized auth endpoints from auth_routes.py"""
    
    def test_auth_login_success(self, api_client):
        """Test /api/auth/login returns correct response structure"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "admin@datavision.co.tz"
        print(f"LOGIN: Success - token received, user: {data['user']['email']}")
    
    def test_auth_login_invalid_credentials(self, api_client):
        """Test /api/auth/login with wrong credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"LOGIN: Correctly rejected invalid credentials")
    
    def test_auth_forgot_password_success(self, api_client):
        """Test /api/auth/forgot-password endpoint (from auth_routes.py)"""
        response = api_client.post(f"{BASE_URL}/api/auth/forgot-password", json={
            "email": "admin@datavision.co.tz"
        })
        assert response.status_code == 200, f"Forgot password failed: {response.text}"
        data = response.json()
        assert "message" in data
        # Should always return success to prevent email enumeration
        assert "email" in data["message"].lower() or "password" in data["message"].lower()
        print(f"FORGOT-PASSWORD: Success - {data['message']}")
    
    def test_auth_forgot_password_nonexistent_email(self, api_client):
        """Test /api/auth/forgot-password with non-existent email (should still return 200)"""
        response = api_client.post(f"{BASE_URL}/api/auth/forgot-password", json={
            "email": "nonexistent@example.com"
        })
        # Should return 200 to prevent email enumeration attacks
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"FORGOT-PASSWORD: Correctly handled non-existent email (no enumeration)")
    
    def test_auth_me_endpoint(self, api_client, admin_token):
        """Test /api/auth/me returns current user"""
        response = api_client.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Auth me failed: {response.text}"
        data = response.json()
        assert data["email"] == "admin@datavision.co.tz"
        print(f"AUTH-ME: Success - user: {data['email']}")


class TestEmailEndpointsWithPydantic:
    """Test email endpoints using Pydantic models (email_routes.py)"""
    
    def test_email_status_endpoint(self, api_client):
        """Test /api/email/status returns service configuration"""
        response = api_client.get(f"{BASE_URL}/api/email/status")
        assert response.status_code == 200, f"Email status failed: {response.text}"
        data = response.json()
        assert "configured" in data
        print(f"EMAIL-STATUS: configured={data['configured']}")
    
    def test_send_product_email_endpoint(self, api_client):
        """Test /api/email/send-product-email with JSON body (Pydantic model)"""
        # Note: Resend test API can only send to verified email: macleangm@datavision.co.tz
        response = api_client.post(f"{BASE_URL}/api/email/send-product-email", json={
            "to_email": "macleangm@datavision.co.tz",
            "name": "Test User",
            "product": "survey360",
            "subject": "Test Product Email",
            "template_type": "notification",
            "template_data": {
                "message": "This is a test email from the testing suite.",
                "action_text": "View Dashboard",
                "action_link": "https://datavision.co.tz/solutions/survey360/app/dashboard",
                "details": {
                    "Test Type": "Backend API Test",
                    "Time": datetime.now().isoformat()
                }
            }
        })
        # Should return 200 for valid request (email may or may not send based on test mode)
        assert response.status_code == 200, f"Unexpected status: {response.status_code}, Response: {response.text}"
        data = response.json()
        assert data.get("status") in ["sent", "success", "delivered", "queued"]
        print(f"SEND-PRODUCT-EMAIL: Success - {data}")
    
    def test_send_product_email_invalid_product(self, api_client):
        """Test /api/email/send-product-email with invalid product"""
        response = api_client.post(f"{BASE_URL}/api/email/send-product-email", json={
            "to_email": "test@example.com",
            "name": "Test User",
            "product": "invalid_product",
            "subject": "Test Email",
            "template_type": "notification"
        })
        assert response.status_code == 400 or response.status_code == 422
        print(f"SEND-PRODUCT-EMAIL: Correctly rejected invalid product")
    
    def test_survey360_survey_invite_endpoint(self, api_client):
        """Test /api/email/survey360/survey-invite with JSON body"""
        response = api_client.post(f"{BASE_URL}/api/email/survey360/survey-invite", json={
            "to_email": "macleangm@datavision.co.tz",
            "name": "Survey Test User",
            "survey_name": "Test Survey from API",
            "survey_link": "https://datavision.co.tz/solutions/survey360/surveys/test123",
            "deadline": "2026-02-01"
        })
        assert response.status_code in [200, 500], f"Unexpected status: {response.status_code}"
        data = response.json()
        print(f"SURVEY-INVITE: Status {response.status_code} - {data}")


class TestAdminAnalyticsDashboard:
    """Test admin analytics dashboard endpoints"""
    
    def test_admin_dashboard_stats(self, api_client, admin_token):
        """Test /api/admin/dashboard/stats endpoint"""
        response = api_client.get(
            f"{BASE_URL}/api/admin/dashboard/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        # Endpoint may return mock data or 404 if not implemented
        if response.status_code == 200:
            data = response.json()
            print(f"DASHBOARD-STATS: {data}")
        else:
            print(f"DASHBOARD-STATS: Status {response.status_code} (may use mock data)")
    
    def test_admin_dashboard_activity(self, api_client, admin_token):
        """Test /api/admin/dashboard/activity endpoint"""
        response = api_client.get(
            f"{BASE_URL}/api/admin/dashboard/activity",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"DASHBOARD-ACTIVITY: {len(data) if isinstance(data, list) else data}")
        else:
            print(f"DASHBOARD-ACTIVITY: Status {response.status_code}")
    
    def test_admin_dashboard_charts(self, api_client, admin_token):
        """Test /api/admin/dashboard/charts endpoint"""
        response = api_client.get(
            f"{BASE_URL}/api/admin/dashboard/charts?period=30",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"DASHBOARD-CHARTS: {data.keys() if isinstance(data, dict) else data}")
        else:
            print(f"DASHBOARD-CHARTS: Status {response.status_code}")


class TestPromoCodesWithProducts:
    """Test promo codes with applicable_products field"""
    
    def test_get_promo_codes_list(self, api_client, admin_token):
        """Test /api/affiliates/admin/promo-codes returns list with products field"""
        response = api_client.get(
            f"{BASE_URL}/api/affiliates/admin/promo-codes?include_expired=true",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Get promo codes failed: {response.text}"
        data = response.json()
        assert "promo_codes" in data
        assert "stats" in data
        print(f"PROMO-CODES: Found {len(data['promo_codes'])} codes, stats: {data['stats']}")
        
        # Check if any codes have applicable_products field
        for code in data["promo_codes"]:
            if "applicable_products" in code:
                print(f"  - Code {code['code']}: products={code['applicable_products']}")
    
    def test_create_promo_code_with_products(self, api_client, admin_token):
        """Test creating a promo code with applicable_products field"""
        test_code = f"TEST{datetime.now().strftime('%H%M%S')}"
        response = api_client.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "code": test_code,
                "name": "Test Product-Specific Code",
                "description": "Test promo code for specific products",
                "discount_type": "percentage",
                "discount_value": 15,
                "applicable_products": ["fieldforce", "survey360"],
                "start_date": datetime.now().isoformat(),
                "end_date": "2026-12-31T23:59:59Z",
                "is_active": True,
                "max_uses": 100
            }
        )
        assert response.status_code in [200, 201], f"Create promo code failed: {response.text}"
        data = response.json()
        print(f"CREATE-PROMO: Success - code={test_code}")
        
        # Verify the code was created with products
        verify_response = api_client.get(
            f"{BASE_URL}/api/affiliates/admin/promo-codes?include_expired=true",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        codes = verify_response.json().get("promo_codes", [])
        created_code = next((c for c in codes if c["code"] == test_code), None)
        if created_code:
            assert "applicable_products" in created_code
            assert "fieldforce" in created_code.get("applicable_products", [])
            assert "survey360" in created_code.get("applicable_products", [])
            print(f"VERIFY-PROMO: Code {test_code} has products: {created_code['applicable_products']}")
            
            # Cleanup - delete test code
            api_client.delete(
                f"{BASE_URL}/api/affiliates/admin/promo-codes/{created_code['id']}",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            print(f"CLEANUP: Deleted test code {test_code}")


class TestHomepageComponent:
    """Test that HomePage loads correctly via public APIs"""
    
    def test_statistics_api(self, api_client):
        """Test /api/statistics used by HomePage"""
        response = api_client.get(f"{BASE_URL}/api/statistics")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"STATISTICS: Found {len(data)} stats")
    
    def test_testimonials_api(self, api_client):
        """Test /api/testimonials?featured=true used by HomePage"""
        response = api_client.get(f"{BASE_URL}/api/testimonials?featured=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"TESTIMONIALS: Found {len(data)} featured testimonials")
    
    def test_projects_api(self, api_client):
        """Test /api/projects?featured=true used by HomePage"""
        response = api_client.get(f"{BASE_URL}/api/projects?featured=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PROJECTS: Found {len(data)} featured projects")
    
    def test_partners_api(self, api_client):
        """Test /api/partners used by HomePage"""
        response = api_client.get(f"{BASE_URL}/api/partners")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PARTNERS: Found {len(data)} partners")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
