"""
Test P0 (Admin Referral Management) and P1 (Projects/News pages) features
Testing iteration 29: Admin Referral Management tabs, Projects API, News API
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://central-gateway-1.preview.emergentagent.com')

class TestAdminLogin:
    """Test admin authentication"""
    
    def test_admin_login_success(self):
        """Test successful admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["is_admin"] == True
        assert data["user"]["email"] == "admin@datavision.co.tz"
        print(f"Admin login successful, token received")
        return data["access_token"]
    
    def test_admin_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "wrongpassword"
        })
        assert response.status_code in [401, 400]


@pytest.fixture
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@datavision.co.tz",
        "password": "admin123"
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Admin authentication failed")


class TestAdminReferralManagement:
    """P0: Admin Referral Management APIs - Leaderboard, Credits, Conversions"""
    
    def test_referral_stats_api(self, admin_token):
        """Test /api/admin/referrals/stats endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/referrals/stats", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify stats structure
        assert "overview" in data
        assert "credits" in data
        assert "this_month" in data
        
        # Verify overview fields
        overview = data["overview"]
        assert "total_referrers" in overview
        assert "active_referrers" in overview
        assert "total_referrals" in overview
        assert "conversion_rate" in overview
        
        # Verify credits fields
        credits = data["credits"]
        assert "total_issued" in credits
        assert "total_redeemed" in credits
        assert "outstanding" in credits
        
        print(f"Referral stats: {data['overview']}")
    
    def test_referral_leaderboard_api(self, admin_token):
        """Test /api/admin/referrals/leaderboard endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/referrals/leaderboard?limit=20", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "leaderboard" in data
        assert "total_count" in data
        assert isinstance(data["leaderboard"], list)
        
        # If there are entries, verify structure
        if len(data["leaderboard"]) > 0:
            entry = data["leaderboard"][0]
            assert "rank" in entry
            assert "user_id" in entry
            assert "name" in entry
            assert "email" in entry
            assert "referral_code" in entry
            assert "total_referrals" in entry
            assert "successful_referrals" in entry
            
        print(f"Leaderboard has {data['total_count']} entries")
    
    def test_referral_conversions_api(self, admin_token):
        """Test /api/admin/referrals/conversions endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/referrals/conversions?days=30", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "timeline" in data
        assert "period_days" in data
        assert data["period_days"] == 30
        assert isinstance(data["timeline"], list)
        
        # If there are entries, verify structure
        if len(data["timeline"]) > 0:
            entry = data["timeline"][0]
            assert "date" in entry
            assert "invites_sent" in entry
            assert "signups" in entry
            assert "conversions" in entry
            
        print(f"Conversions timeline has {len(data['timeline'])} data points")
    
    def test_potential_affiliates_api(self, admin_token):
        """Test /api/admin/referrals/potential-affiliates endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/referrals/potential-affiliates?min_referrals=3", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "potential_affiliates" in data
        assert "count" in data
        assert "threshold" in data
        assert data["threshold"] == 3
        
        print(f"Found {data['count']} potential affiliates")
    
    def test_referral_user_details_api(self, admin_token):
        """Test /api/admin/referrals/user/{user_id} endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # First get a user from leaderboard
        leaderboard_response = requests.get(f"{BASE_URL}/api/admin/referrals/leaderboard?limit=1", headers=headers)
        if leaderboard_response.status_code == 200 and len(leaderboard_response.json().get("leaderboard", [])) > 0:
            user_id = leaderboard_response.json()["leaderboard"][0]["user_id"]
            
            response = requests.get(f"{BASE_URL}/api/admin/referrals/user/{user_id}", headers=headers)
            assert response.status_code == 200
            data = response.json()
            
            assert "profile" in data
            assert "user" in data
            assert "invites" in data
            assert "transactions" in data
            
            print(f"User details retrieved for {user_id}")
        else:
            print("No users in leaderboard to test user details")


class TestProjectsAPI:
    """P1: Projects page API tests"""
    
    def test_get_projects(self):
        """Test /api/projects endpoint"""
        response = requests.get(f"{BASE_URL}/api/projects")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 0
        
        # Verify project structure if any exist
        if len(data) > 0:
            project = data[0]
            assert "id" in project
            assert "title" in project
            assert "description" in project
            assert "client" in project
            assert "sector" in project
            
        print(f"Found {len(data)} projects")
    
    def test_projects_have_correct_schema(self):
        """Verify projects API returns correct schema (not FieldForce schema)"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        data = response.json()
        
        # All returned projects should have 'title' not 'name' (FieldForce schema)
        for project in data:
            assert "title" in project, f"Project missing 'title': {project.get('id')}"
            # Ensure it's not FieldForce project schema
            if "name" in project and "title" not in project:
                pytest.fail(f"FieldForce project schema detected: {project}")
        
        print("All projects have correct DataVision schema")


class TestNewsAPI:
    """P1: News page API tests"""
    
    def test_get_news(self):
        """Test /api/news endpoint"""
        response = requests.get(f"{BASE_URL}/api/news")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 0
        
        # Verify news structure if any exist
        if len(data) > 0:
            article = data[0]
            assert "id" in article
            assert "title" in article
            assert "content" in article or "excerpt" in article
            
        print(f"Found {len(data)} news articles")


class TestContactAPI:
    """P1: Contact page API tests"""
    
    def test_submit_inquiry(self):
        """Test /api/inquiries endpoint"""
        response = requests.post(f"{BASE_URL}/api/inquiries", json={
            "name": "TEST_User",
            "email": "test@example.com",
            "company": "Test Company",
            "subject": "Test Subject",
            "message": "This is a test inquiry",
            "inquiry_type": "general",
            "honeypot": ""
        })
        
        # Should either succeed or return validation error
        assert response.status_code in [200, 201, 400, 422]
        print(f"Inquiry submission response: {response.status_code}")


class TestAuthProtection:
    """Test that admin endpoints require authentication"""
    
    def test_referral_stats_requires_auth(self):
        """Test that /api/admin/referrals/stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/referrals/stats")
        assert response.status_code in [401, 403, 422]
    
    def test_referral_leaderboard_requires_auth(self):
        """Test that /api/admin/referrals/leaderboard requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/referrals/leaderboard")
        assert response.status_code in [401, 403, 422]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
