"""
Tests for DataVision Authentication and SSO Flows

Tests:
- User registration with DataVision
- User login with DataVision
- SSO to FieldForce 
- SSO to Survey360
- products_accessed field updates
"""
import pytest
import requests
import os
import time
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://vision-hub-16.preview.emergentagent.com')

class TestDataVisionAuth:
    """DataVision Authentication endpoint tests"""
    
    @pytest.fixture(scope="class")
    def api_client(self):
        """Shared requests session"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def test_user(self):
        """Generate unique test user credentials"""
        unique_id = str(uuid.uuid4())[:8]
        return {
            "email": f"test_user_{unique_id}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {unique_id}"
        }
    
    @pytest.fixture(scope="class")
    def admin_credentials(self):
        """Admin credentials"""
        return {
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        }
    
    def test_api_health(self, api_client):
        """Test API is operational"""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "operational"
        print(f"API Health: {data}")
    
    def test_admin_login(self, api_client, admin_credentials):
        """Test admin login"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json=admin_credentials
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == admin_credentials["email"]
        assert data["user"]["is_admin"] == True
        print(f"Admin login successful: {data['user']['email']}")
        return data["access_token"]
    
    def test_user_registration(self, api_client, test_user):
        """Test new user registration"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/register",
            json=test_user
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == test_user["email"]
        assert data["user"]["name"] == test_user["name"]
        assert data["user"]["is_admin"] == False
        print(f"User registration successful: {data['user']['email']}")
        
        # Store token for subsequent tests
        test_user["token"] = data["access_token"]
        test_user["id"] = data["user"]["id"]
        return data
    
    def test_duplicate_registration_fails(self, api_client, test_user):
        """Test that duplicate registration returns 400"""
        # This should fail since user already exists
        response = api_client.post(
            f"{BASE_URL}/api/auth/register",
            json=test_user
        )
        assert response.status_code == 400
        data = response.json()
        assert "already registered" in data.get("detail", "").lower()
        print(f"Duplicate registration correctly rejected")
    
    def test_user_login(self, api_client, test_user):
        """Test user login after registration"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": test_user["email"], "password": test_user["password"]}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert data["user"]["email"] == test_user["email"]
        print(f"User login successful: {data['user']['email']}")
        
        # Update token
        test_user["token"] = data["access_token"]
        return data
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials returns 401"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "nonexistent@example.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("Invalid credentials correctly rejected")


class TestSSOFlows:
    """SSO Flow tests"""
    
    @pytest.fixture(scope="class")
    def api_client(self):
        """Shared requests session"""
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def admin_token(self, api_client):
        """Get admin token for SSO tests"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@datavision.co.tz", "password": "admin123"}
        )
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Admin login failed")
    
    @pytest.fixture(scope="class")
    def new_user_token(self, api_client):
        """Create a new user for SSO testing"""
        unique_id = str(uuid.uuid4())[:8]
        user_data = {
            "email": f"sso_test_{unique_id}@example.com",
            "password": "SSOTestPass123!",
            "name": f"SSO Test User {unique_id}"
        }
        response = api_client.post(f"{BASE_URL}/api/auth/register", json=user_data)
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("User registration failed for SSO test")
    
    def test_sso_to_fieldforce(self, api_client, admin_token):
        """Test SSO flow from DataVision to FieldForce"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/sso/fieldforce",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify SSO response structure
        assert "access_token" in data
        assert "user" in data
        assert data.get("sso") == True
        assert data.get("provider") == "datavision"
        assert "organization_id" in data["user"]
        print(f"FieldForce SSO successful for user: {data['user']['email']}")
        return data
    
    def test_sso_to_survey360(self, api_client, admin_token):
        """Test SSO flow from DataVision to Survey360"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify SSO response structure
        assert "access_token" in data
        assert "user" in data
        assert data.get("sso") == True
        assert data.get("provider") == "datavision"
        assert "org_id" in data["user"]
        print(f"Survey360 SSO successful for user: {data['user']['email']}")
        return data
    
    def test_sso_without_auth_fails(self, api_client):
        """Test SSO endpoints without auth returns 401"""
        # FieldForce SSO
        response = api_client.post(f"{BASE_URL}/api/auth/sso/fieldforce")
        assert response.status_code == 401
        
        # Survey360 SSO
        response = api_client.post(f"{BASE_URL}/api/auth/sso/survey360")
        assert response.status_code == 401
        print("SSO endpoints correctly require authentication")
    
    def test_sso_with_invalid_token_fails(self, api_client):
        """Test SSO with invalid token returns 401"""
        response = api_client.post(
            f"{BASE_URL}/api/auth/sso/fieldforce",
            headers={"Authorization": "Bearer invalid_token_123"}
        )
        assert response.status_code == 401
        print("SSO correctly rejects invalid tokens")
    
    def test_sso_updates_products_accessed(self, api_client, new_user_token):
        """Test that SSO correctly updates products_accessed field"""
        # First, SSO to FieldForce
        response = api_client.post(
            f"{BASE_URL}/api/auth/sso/fieldforce",
            headers={"Authorization": f"Bearer {new_user_token}"}
        )
        assert response.status_code == 200
        
        # Then SSO to Survey360
        response = api_client.post(
            f"{BASE_URL}/api/auth/sso/survey360",
            headers={"Authorization": f"Bearer {new_user_token}"}
        )
        assert response.status_code == 200
        
        # Now verify products_accessed via /auth/me
        response = api_client.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {new_user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify products_accessed contains both products
        products = data.get("products_accessed", [])
        assert "fieldforce" in products, f"FieldForce not in products_accessed: {products}"
        assert "survey360" in products, f"Survey360 not in products_accessed: {products}"
        print(f"products_accessed correctly updated: {products}")


class TestProfileUpdate:
    """Test profile update endpoint (Step 2 of registration)"""
    
    @pytest.fixture(scope="class")
    def api_client(self):
        session = requests.Session()
        session.headers.update({"Content-Type": "application/json"})
        return session
    
    @pytest.fixture(scope="class")
    def user_token(self, api_client):
        """Create user for profile update test"""
        unique_id = str(uuid.uuid4())[:8]
        user_data = {
            "email": f"profile_test_{unique_id}@example.com",
            "password": "ProfileTest123!",
            "name": f"Profile Test User {unique_id}"
        }
        response = api_client.post(f"{BASE_URL}/api/auth/register", json=user_data)
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("User registration failed")
    
    def test_update_profile(self, api_client, user_token):
        """Test profile update with country, industry, organization"""
        profile_data = {
            "country": "Tanzania",
            "industry": "healthcare",
            "organization": "Test Organization",
            "job_title": "Data Analyst",
            "company_size": "51-200",
            "phone": "+255123456789",
            "how_heard": "referral"
        }
        
        response = api_client.put(
            f"{BASE_URL}/api/auth/profile",
            json=profile_data,
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify profile updated
        assert data.get("country") == "Tanzania"
        assert data.get("industry") == "healthcare"
        assert data.get("organization") == "Test Organization"
        assert data.get("profile_completed") == True
        print(f"Profile update successful: {data.get('email')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
