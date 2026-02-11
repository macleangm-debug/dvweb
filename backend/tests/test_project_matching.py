"""
Test Project Matching APIs
Tests for project requirements creation, retrieval, and expert matching
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cms-builder-11.preview.emergentagent.com').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "info@datavision.co.tz"
ADMIN_PASSWORD = "walkthetalkdvi1998"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for admin"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Auth headers for authenticated requests"""
    return {"Authorization": f"Bearer {auth_token}"}


class TestProjectRequirementsAPI:
    """Tests for project requirements API endpoints"""
    
    def test_create_project_requirement(self, auth_headers):
        """Test creating a new project requirement"""
        project_data = {
            "title": f"TEST_Project_{uuid.uuid4().hex[:8]}",
            "description": "Test project for automated matching testing",
            "sectors": ["Agriculture & Food Security", "Data Science & Analytics"],
            "required_skills": ["Survey Design", "Data Collection"],
            "preferred_skills": ["Statistical Analysis", "GIS Mapping"],
            "min_experience": 5,
            "countries": ["Tanzania", "Kenya"],
            "start_date": "2026-03-01",
            "duration_months": 6,
            "engagement_type": "short-term",
            "budget_max": 500,
            "positions_needed": 2
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/project-requirements",
            json=project_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Failed to create project: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["title"] == project_data["title"]
        assert data["description"] == project_data["description"]
        assert data["sectors"] == project_data["sectors"]
        assert data["required_skills"] == project_data["required_skills"]
        assert data["preferred_skills"] == project_data["preferred_skills"]
        assert data["min_experience"] == project_data["min_experience"]
        assert data["duration_months"] == project_data["duration_months"]
        assert data["engagement_type"] == project_data["engagement_type"]
        assert data["budget_max"] == project_data["budget_max"]
        assert data["positions_needed"] == project_data["positions_needed"]
        assert data["status"] == "open"
        
        print(f"Created project: {data['id']}")
        return data["id"]
    
    def test_get_all_project_requirements(self, auth_headers):
        """Test getting all project requirements"""
        response = requests.get(
            f"{BASE_URL}/api/admin/project-requirements",
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Failed to get projects: {response.text}"
        data = response.json()
        
        assert isinstance(data, list), "Response should be a list"
        print(f"Found {len(data)} project requirements")
        
        # Verify each project has required fields
        if len(data) > 0:
            project = data[0]
            assert "id" in project
            assert "title" in project
            assert "description" in project
            assert "sectors" in project
            assert "status" in project
    
    def test_get_project_requirements_with_status_filter(self, auth_headers):
        """Test filtering project requirements by status"""
        response = requests.get(
            f"{BASE_URL}/api/admin/project-requirements?status=open",
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Failed to filter projects: {response.text}"
        data = response.json()
        
        # Verify all returned projects have 'open' status
        for project in data:
            assert project["status"] == "open", f"Project {project['id']} has wrong status"
        
        print(f"Found {len(data)} open projects")


class TestExpertMatching:
    """Tests for expert matching API"""
    
    @pytest.fixture(scope="class")
    def test_project_id(self, auth_headers):
        """Create a test project for matching tests"""
        project_data = {
            "title": f"TEST_Matching_Project_{uuid.uuid4().hex[:8]}",
            "description": "Test project for matching validation",
            "sectors": ["Agriculture & Food Security"],
            "required_skills": ["Survey Design", "Data Collection"],
            "preferred_skills": [],
            "min_experience": 3,
            "countries": ["Tanzania"],
            "start_date": "2026-04-01",
            "duration_months": 3,
            "engagement_type": "short-term",
            "budget_max": None,
            "positions_needed": 1
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/project-requirements",
            json=project_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Failed to create test project: {response.text}"
        return response.json()["id"]
    
    def test_get_matches_for_project(self, auth_headers, test_project_id):
        """Test getting matched experts for a project"""
        response = requests.get(
            f"{BASE_URL}/api/admin/project-requirements/{test_project_id}/matches",
            headers=auth_headers
        )
        
        assert response.status_code == 200, f"Failed to get matches: {response.text}"
        matches = response.json()
        
        assert isinstance(matches, list), "Matches should be a list"
        print(f"Found {len(matches)} matching experts for project {test_project_id}")
        
        # Verify match structure if matches exist
        if len(matches) > 0:
            match = matches[0]
            assert "expert_id" in match
            assert "expert_name" in match
            assert "expert_email" in match
            assert "match_score" in match
            assert "matching_sectors" in match
            assert "matching_skills" in match
            assert "years_experience" in match
            assert "availability" in match
            assert "verification_score" in match
            assert "trust_tier" in match
            
            # Verify scores are reasonable
            assert 0 <= match["match_score"] <= 110, "Match score should be 0-110"
            assert 0 <= match["verification_score"] <= 100, "Verification score should be 0-100"
            assert match["trust_tier"] in ["bronze", "silver", "gold", "platinum"]
            
            print(f"Top match: {match['expert_name']} with combined score: {match['match_score'] * 0.7 + match['verification_score'] * 0.3:.0f}%")
    
    def test_matches_for_nonexistent_project(self, auth_headers):
        """Test getting matches for non-existent project returns 404"""
        response = requests.get(
            f"{BASE_URL}/api/admin/project-requirements/nonexistent-id/matches",
            headers=auth_headers
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


class TestAuthentication:
    """Tests for authentication on project matching endpoints"""
    
    def test_project_requirements_require_auth(self):
        """Test that project requirements endpoints require authentication"""
        # No auth header
        response = requests.get(f"{BASE_URL}/api/admin/project-requirements")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        response = requests.post(
            f"{BASE_URL}/api/admin/project-requirements",
            json={"title": "test"}
        )
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    def test_matches_require_auth(self):
        """Test that matches endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/project-requirements/test-id/matches")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
