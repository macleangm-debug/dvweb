"""
FieldForce API Tests
Tests for the FieldForce mobile data collection product backend APIs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
DEMO_EMAIL = "demo@fieldforce.io"
DEMO_PASSWORD = "Test123!"


class TestFieldForceHealth:
    """Health check endpoint tests"""

    def test_health_endpoint_returns_healthy(self):
        """Test that health endpoint returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "FieldForce"
        assert data["database"] == "connected"
        print(f"✓ Health check passed: {data}")


class TestFieldForceAuth:
    """FieldForce authentication tests"""

    def test_login_with_valid_credentials(self):
        """Test login with demo credentials"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == DEMO_EMAIL
        assert data["user"]["name"] == "FieldForce Demo"
        assert "organization_id" in data["user"]
        print(f"✓ Login successful for {DEMO_EMAIL}")

    def test_login_with_invalid_credentials(self):
        """Test login fails with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Login correctly rejected invalid credentials")

    def test_login_with_nonexistent_user(self):
        """Test login fails with nonexistent user"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": "nonexistent@example.com", "password": "Test123!"}
        )
        assert response.status_code == 401
        print("✓ Login correctly rejected nonexistent user")

    def test_register_new_user(self):
        """Test user registration"""
        import uuid
        test_email = f"test_{uuid.uuid4().hex[:8]}@fieldforce.io"
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/register",
            json={
                "email": test_email,
                "password": "TestPass123!",
                "name": "Test User"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == test_email
        print(f"✓ Registration successful for {test_email}")
        return data["access_token"]

    def test_get_current_user(self):
        """Test getting current user profile"""
        # First login
        login_response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        token = login_response.json()["access_token"]
        
        # Get current user
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == DEMO_EMAIL
        print(f"✓ Got current user profile: {data['email']}")

    def test_me_endpoint_without_token(self):
        """Test that /auth/me requires authentication"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/auth/me")
        assert response.status_code == 401
        print("✓ /auth/me correctly requires authentication")


class TestFieldForceDashboard:
    """FieldForce dashboard tests"""

    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        return response.json()["access_token"]

    def test_dashboard_stats(self, auth_token):
        """Test dashboard stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/stats",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert "forms" in data
        assert "submissions" in data
        assert "enumerators" in data
        print(f"✓ Dashboard stats: {data}")

    def test_dashboard_stats_without_auth(self):
        """Test dashboard stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/dashboard/stats")
        assert response.status_code == 401
        print("✓ Dashboard stats correctly requires authentication")

    def test_recent_activity(self, auth_token):
        """Test recent activity endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/recent-activity",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Recent activity returned {len(data)} items")


class TestFieldForceProjects:
    """FieldForce project tests"""

    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        return response.json()["access_token"]

    def test_get_projects(self, auth_token):
        """Test getting all projects"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/projects",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} projects")


class TestFieldForceForms:
    """FieldForce form tests"""

    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        return response.json()["access_token"]

    def test_get_forms(self, auth_token):
        """Test getting all forms"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/forms",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} forms")


class TestFieldForceSubmissions:
    """FieldForce submission tests"""

    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        return response.json()["access_token"]

    def test_get_submissions(self, auth_token):
        """Test getting all submissions"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/submissions",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Got {len(data)} submissions")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
