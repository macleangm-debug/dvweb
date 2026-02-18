"""
DataViz Studio API Tests
Tests for DataViz Studio authentication and integration endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://biosign-branding.preview.emergentagent.com')


class TestDataVizAuthEndpoints:
    """DataViz Studio Authentication tests"""
    
    def test_dataviz_login_endpoint_exists(self):
        """Test that DataViz login endpoint exists"""
        response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/login",
            json={"email": "invalid@test.com", "password": "invalid"},
            timeout=10
        )
        # Should return 401 for invalid credentials, not 404
        assert response.status_code in [401, 400], f"Expected 401 or 400, got {response.status_code}"
        print("PASS: DataViz login endpoint exists")
    
    def test_dataviz_register_endpoint_exists(self):
        """Test that DataViz register endpoint exists"""
        unique_email = f"TEST_dataviz_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": unique_email,
                "password": "testpass123",
                "name": "Test User"
            },
            timeout=10
        )
        # Should return 200 for new registration or 400 if email exists
        assert response.status_code in [200, 201, 400], f"Expected 200/201/400, got {response.status_code}"
        
        if response.status_code in [200, 201]:
            data = response.json()
            assert "token" in data, "Response should contain token"
            assert "user" in data, "Response should contain user"
            print(f"PASS: DataViz register created user: {unique_email}")
        else:
            print("PASS: DataViz register endpoint exists (email may exist)")
    
    def test_dataviz_register_returns_correct_data(self):
        """Test DataViz register returns user, token, and organization"""
        unique_email = f"TEST_dataviz_full_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": unique_email,
                "password": "testpass123",
                "name": "Test DataViz User"
            },
            timeout=10
        )
        
        assert response.status_code in [200, 201], f"Registration failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "token" in data, "Missing token in response"
        assert "user" in data, "Missing user in response"
        assert "organization" in data, "Missing organization in response"
        
        # Verify user data
        user = data["user"]
        assert user["email"] == unique_email
        assert user["name"] == "Test DataViz User"
        assert "id" in user
        
        # Verify organization created
        org = data["organization"]
        assert "id" in org
        assert "name" in org
        
        print(f"PASS: DataViz register returns correct data structure")
        print(f"  - User: {user['email']}")
        print(f"  - Org: {org['name']}")
        return data
    
    def test_dataviz_login_valid_credentials(self):
        """Test DataViz login with valid credentials"""
        # First register a user
        unique_email = f"TEST_dataviz_login_{uuid.uuid4().hex[:8]}@test.com"
        password = "testpass123"
        
        register_response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": unique_email,
                "password": password,
                "name": "Test Login User"
            },
            timeout=10
        )
        assert register_response.status_code in [200, 201], f"Registration failed: {register_response.text}"
        
        # Now login
        login_response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/login",
            json={"email": unique_email, "password": password},
            timeout=10
        )
        
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        data = login_response.json()
        
        assert "token" in data, "Missing token"
        assert "user" in data, "Missing user"
        assert data["user"]["email"] == unique_email
        
        print(f"PASS: DataViz login works with valid credentials")
    
    def test_dataviz_login_invalid_credentials(self):
        """Test DataViz login rejects invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/login",
            json={"email": "nonexistent@test.com", "password": "wrongpassword"},
            timeout=10
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: DataViz login rejects invalid credentials")
    
    def test_dataviz_me_endpoint_requires_auth(self):
        """Test DataViz /me endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/dataviz/auth/me", timeout=10)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: DataViz /me endpoint requires authentication")
    
    def test_dataviz_me_endpoint_returns_user(self):
        """Test DataViz /me endpoint returns user data with valid token"""
        # Register and get token
        unique_email = f"TEST_dataviz_me_{uuid.uuid4().hex[:8]}@test.com"
        register_response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": unique_email,
                "password": "testpass123",
                "name": "Test Me User"
            },
            timeout=10
        )
        assert register_response.status_code in [200, 201], f"Registration failed: {register_response.text}"
        token = register_response.json()["token"]
        
        # Call /me with token
        me_response = requests.get(
            f"{BASE_URL}/api/dataviz/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        
        assert me_response.status_code == 200, f"Me endpoint failed: {me_response.text}"
        data = me_response.json()
        
        assert "user" in data
        assert data["user"]["email"] == unique_email
        assert "organizations" in data
        
        print("PASS: DataViz /me endpoint returns user data")


class TestDataVizFrontendRoutes:
    """Test DataViz Studio frontend routes return 200"""
    
    def test_dataviz_landing_page(self):
        """Test DataViz landing page at /solutions/dataviz"""
        response = requests.get(f"{BASE_URL}/solutions/dataviz", timeout=10)
        assert response.status_code == 200, f"Landing page failed: {response.status_code}"
        print("PASS: /solutions/dataviz returns 200")
    
    def test_dataviz_studio_landing_page(self):
        """Test DataViz landing page at /solutions/dataviz-studio"""
        response = requests.get(f"{BASE_URL}/solutions/dataviz-studio", timeout=10)
        assert response.status_code == 200, f"Landing page failed: {response.status_code}"
        print("PASS: /solutions/dataviz-studio returns 200")
    
    def test_dataviz_login_page(self):
        """Test DataViz login page"""
        response = requests.get(f"{BASE_URL}/solutions/dataviz/login", timeout=10)
        assert response.status_code == 200, f"Login page failed: {response.status_code}"
        print("PASS: /solutions/dataviz/login returns 200")
    
    def test_dataviz_register_page(self):
        """Test DataViz register page"""
        response = requests.get(f"{BASE_URL}/solutions/dataviz/register", timeout=10)
        assert response.status_code == 200, f"Register page failed: {response.status_code}"
        print("PASS: /solutions/dataviz/register returns 200")


class TestOtherProductRoutes:
    """Verify other products still work"""
    
    def test_solutions_hub_page(self):
        """Test main solutions page at /solutions"""
        response = requests.get(f"{BASE_URL}/solutions", timeout=10)
        assert response.status_code == 200, f"Solutions page failed: {response.status_code}"
        print("PASS: /solutions returns 200")
    
    def test_survey360_landing(self):
        """Test Survey360 landing page"""
        response = requests.get(f"{BASE_URL}/solutions/survey360", timeout=10)
        assert response.status_code == 200, f"Survey360 failed: {response.status_code}"
        print("PASS: /solutions/survey360 returns 200")
    
    def test_fieldforce_landing(self):
        """Test FieldForce landing page"""
        response = requests.get(f"{BASE_URL}/solutions/fieldforce", timeout=10)
        assert response.status_code == 200, f"FieldForce failed: {response.status_code}"
        print("PASS: /solutions/fieldforce returns 200")
    
    def test_datapulse_landing(self):
        """Test DataPulse landing page"""
        response = requests.get(f"{BASE_URL}/solutions/datapulse", timeout=10)
        assert response.status_code == 200, f"DataPulse failed: {response.status_code}"
        print("PASS: /solutions/datapulse returns 200")


class TestDataVizRegisterValidation:
    """Test DataViz registration validation"""
    
    def test_register_duplicate_email_rejected(self):
        """Test that duplicate email registration is rejected"""
        unique_email = f"TEST_dataviz_dup_{uuid.uuid4().hex[:8]}@test.com"
        
        # First registration
        first_response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": unique_email,
                "password": "testpass123",
                "name": "First User"
            },
            timeout=10
        )
        assert first_response.status_code in [200, 201], f"First registration failed: {first_response.text}"
        
        # Second registration with same email
        second_response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": unique_email,
                "password": "differentpass",
                "name": "Second User"
            },
            timeout=10
        )
        
        assert second_response.status_code == 400, f"Expected 400 for duplicate email, got {second_response.status_code}"
        print("PASS: Duplicate email registration rejected")
    
    def test_register_missing_fields_rejected(self):
        """Test that registration with missing fields fails"""
        # Missing password
        response = requests.post(
            f"{BASE_URL}/api/dataviz/auth/register",
            json={
                "email": "test@test.com",
                "name": "Test User"
            },
            timeout=10
        )
        assert response.status_code == 422, f"Expected 422 for missing password, got {response.status_code}"
        print("PASS: Missing fields rejected with 422")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
