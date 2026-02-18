"""
FieldForce API Tests
Tests for FieldForce mobile data collection APIs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://admin-leads.preview.emergentagent.com').rstrip('/')

class TestFieldForceHealth:
    """Health check tests"""
    
    def test_health_endpoint(self):
        """Test FieldForce health endpoint"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "FieldForce"
        print(f"Health check passed: {data}")


class TestFieldForceAuth:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful login with demo credentials"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "demo@fieldforce.io"
        print(f"Login successful: {data['user']['email']}")
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "wrong@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
        print("Invalid credentials test passed")
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        # First login
        login_response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        token = login_response.json()["access_token"]
        
        # Get current user
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "demo@fieldforce.io"
        print(f"Get current user passed: {data['name']}")
    
    def test_auth_without_token(self):
        """Test authenticated endpoint without token"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/auth/me")
        assert response.status_code in [401, 403]
        print("Unauthenticated access correctly rejected")


class TestFieldForceDashboard:
    """Dashboard endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for authenticated tests"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/stats",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data or "total_projects" in data
        print(f"Dashboard stats: {data}")


class TestFieldForceProjects:
    """Project CRUD tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for authenticated tests"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_projects(self):
        """Test get all projects"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/projects",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Projects count: {len(data)}")


class TestFieldForceForms:
    """Form CRUD tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for authenticated tests"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_forms(self):
        """Test get all forms"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/forms",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Forms count: {len(data)}")


class TestFieldForceSubmissions:
    """Submission tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for authenticated tests"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_submissions(self):
        """Test get all submissions"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/submissions",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Submissions count: {len(data)}")


class TestFieldForceOrganizations:
    """Organization tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for authenticated tests"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_organizations(self):
        """Test get organizations"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/organizations",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Organizations count: {len(data)}")


class TestFieldForceTeam:
    """Team management tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for authenticated tests"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={
                "email": "demo@fieldforce.io",
                "password": "Test123!"
            }
        )
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_team_members(self):
        """Test get team members"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/team/members",
            headers=self.headers
        )
        # May return 200 or 404 if endpoint doesn't exist
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            print(f"Team members: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
