"""
FieldForce Complete API Tests
Tests all critical endpoints for FieldForce mobile data collection app
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://kpi-tracker-58.preview.emergentagent.com').rstrip('/')

# Test credentials
DEMO_EMAIL = "demo@fieldforce.io"
DEMO_PASSWORD = "Test123!"


@pytest.fixture(scope="module")
def auth_data():
    """Get authentication token and org_id"""
    # Login
    response = requests.post(
        f"{BASE_URL}/api/fieldforce/auth/login",
        json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    data = response.json()
    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get organizations to find org_id
    org_response = requests.get(
        f"{BASE_URL}/api/fieldforce/organizations",
        headers=headers
    )
    assert org_response.status_code == 200, f"Get orgs failed: {org_response.text}"
    orgs = org_response.json()
    org_id = orgs[0]["id"] if orgs else None
    
    return {"token": token, "headers": headers, "org_id": org_id}


class TestFieldForceHealth:
    """Health check tests"""
    
    def test_health_endpoint(self):
        """Test FieldForce health endpoint"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "FieldForce"
        print(f"✓ Health check passed: {data}")


class TestFieldForceAuth:
    """Authentication tests"""
    
    def test_login_success(self):
        """Test successful login with demo credentials"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == DEMO_EMAIL
        print(f"✓ Login successful: {data['user']['email']}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/auth/login",
            json={"email": "wrong@example.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")
    
    def test_get_current_user(self, auth_data):
        """Test get current user endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/auth/me",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == DEMO_EMAIL
        print(f"✓ Get current user passed: {data['name']}")
    
    def test_auth_without_token(self):
        """Test authenticated endpoint without token"""
        response = requests.get(f"{BASE_URL}/api/fieldforce/auth/me")
        assert response.status_code == 401
        print("✓ Unauthenticated access correctly rejected")
    
    def test_register_new_user(self):
        """Test user registration"""
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


class TestFieldForceOrganizations:
    """Organization tests"""
    
    def test_get_organizations(self, auth_data):
        """Test get organizations"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/organizations",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Should have at least one organization"
        print(f"✓ Organizations count: {len(data)}")
    
    def test_create_organization(self, auth_data):
        """Test create organization"""
        org_name = f"TEST_Org_{uuid.uuid4().hex[:6]}"
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/organizations",
            headers=auth_data["headers"],
            json={
                "name": org_name,
                "description": "Test organization for testing"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == org_name
        print(f"✓ Organization created: {org_name}")


class TestFieldForceDashboard:
    """Dashboard tests"""
    
    def test_dashboard_stats(self, auth_data):
        """Test dashboard stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/stats?org_id={auth_data['org_id']}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_projects" in data
        assert "total_forms" in data
        assert "total_submissions" in data
        print(f"✓ Dashboard stats: projects={data['total_projects']}, forms={data['total_forms']}")
    
    def test_submission_trends(self, auth_data):
        """Test submission trends endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/submission-trends?org_id={auth_data['org_id']}&days=14",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Submission trends: {len(data)} days of data")
    
    def test_quality_metrics(self, auth_data):
        """Test quality metrics endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/quality-metrics?org_id={auth_data['org_id']}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert "avg_quality_score" in data
        assert "total_count" in data
        print(f"✓ Quality metrics: avg_score={data['avg_quality_score']}")
    
    def test_recent_activity(self, auth_data):
        """Test recent activity endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/dashboard/recent-activity?org_id={auth_data['org_id']}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Recent activity: {len(data)} items")


class TestFieldForceProjects:
    """Project CRUD tests"""
    
    def test_get_projects(self, auth_data):
        """Test get all projects"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/projects?org_id={auth_data['org_id']}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Projects count: {len(data)}")
    
    def test_create_project(self, auth_data):
        """Test create project"""
        project_name = f"TEST_Project_{uuid.uuid4().hex[:6]}"
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/projects",
            headers=auth_data["headers"],
            json={
                "name": project_name,
                "description": "Test project for testing",
                "org_id": auth_data["org_id"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == project_name
        assert data["org_id"] == auth_data["org_id"]
        print(f"✓ Project created: {project_name}")
        return data["id"]
    
    def test_get_project_by_id(self, auth_data):
        """Test get project by ID"""
        # First create a project
        project_id = self.test_create_project(auth_data)
        
        # Then get it
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/projects/{project_id}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == project_id
        print(f"✓ Get project by ID: {data['name']}")


class TestFieldForceForms:
    """Form CRUD tests"""
    
    @pytest.fixture
    def test_project_id(self, auth_data):
        """Create a test project for forms"""
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/projects",
            headers=auth_data["headers"],
            json={
                "name": f"TEST_FormProject_{uuid.uuid4().hex[:6]}",
                "description": "Project for form testing",
                "org_id": auth_data["org_id"]
            }
        )
        return response.json()["id"]
    
    def test_get_forms_by_org(self, auth_data):
        """Test get forms by organization"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/forms?org_id={auth_data['org_id']}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Forms count: {len(data)}")
    
    def test_create_form(self, auth_data, test_project_id):
        """Test create form"""
        form_name = f"TEST_Form_{uuid.uuid4().hex[:6]}"
        response = requests.post(
            f"{BASE_URL}/api/fieldforce/forms",
            headers=auth_data["headers"],
            json={
                "name": form_name,
                "description": "Test form for testing",
                "project_id": test_project_id,
                "fields": [
                    {
                        "id": f"field_{uuid.uuid4().hex[:6]}",
                        "type": "text",
                        "name": "respondent_name",
                        "label": "Respondent Name",
                        "validation": {"required": True}
                    },
                    {
                        "id": f"field_{uuid.uuid4().hex[:6]}",
                        "type": "number",
                        "name": "age",
                        "label": "Age",
                        "validation": {"required": True, "min_value": 0, "max_value": 120}
                    }
                ],
                "default_language": "en",
                "languages": ["en", "sw"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == form_name
        print(f"✓ Form created: {form_name}")
        return data["id"]


class TestFieldForceSubmissions:
    """Submission tests"""
    
    def test_get_submissions_by_org(self, auth_data):
        """Test get submissions by organization"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/submissions?org_id={auth_data['org_id']}",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Submissions count: {len(data)}")


class TestFieldForceTeam:
    """Team management tests"""
    
    def test_get_org_members(self, auth_data):
        """Test get organization members"""
        response = requests.get(
            f"{BASE_URL}/api/fieldforce/organizations/{auth_data['org_id']}/members",
            headers=auth_data["headers"]
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Should have at least one member (the creator)"
        print(f"✓ Team members count: {len(data)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
