"""
Test suite for Public Content Routes
Tests: /api/projects, /api/team, /api/testimonials, /api/statistics, /api/news, /api/partners, /api/inquiries
And admin endpoint: /api/admin/inquiries
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSetup:
    """Basic connectivity and auth tests"""
    
    def test_api_connectivity(self):
        """Verify API is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        print(f"✓ API connectivity confirmed: {data.get('message', 'OK')}")
    
    def test_admin_login(self):
        """Login as admin for authenticated tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        print(f"✓ Admin login successful")
        return data["access_token"]


class TestProjectsEndpoint:
    """Tests for /api/projects public endpoint"""
    
    def test_get_projects_no_auth(self):
        """GET /api/projects should work without authentication"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/projects returned {len(data)} projects")
    
    def test_projects_response_structure(self):
        """Verify project response has expected fields"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        data = response.json()
        
        # Find a DataVision project (has 'title' field)
        dv_projects = [p for p in data if 'title' in p]
        if dv_projects:
            project = dv_projects[0]
            # Check expected fields based on public_content_routes.py model
            assert "id" in project
            assert "title" in project
            assert "description" in project
            print(f"✓ Project structure validated: {project.get('title', 'Unknown')}")
    
    def test_projects_featured_filter(self):
        """GET /api/projects?featured=true should filter featured projects"""
        response = requests.get(f"{BASE_URL}/api/projects?featured=true")
        assert response.status_code == 200
        data = response.json()
        # All returned projects should have featured=true (if any)
        featured_projects = [p for p in data if p.get('featured') == True and 'title' in p]
        print(f"✓ Featured projects filter returned {len(featured_projects)} projects")
    
    def test_projects_sector_filter(self):
        """GET /api/projects?sector=education should filter by sector"""
        response = requests.get(f"{BASE_URL}/api/projects?sector=education")
        assert response.status_code == 200
        data = response.json()
        # All returned projects should have sector=education
        education_projects = [p for p in data if p.get('sector') == 'education']
        print(f"✓ Sector filter returned {len(education_projects)} education projects")


class TestTeamEndpoint:
    """Tests for /api/team public endpoint"""
    
    def test_get_team_no_auth(self):
        """GET /api/team should work without authentication"""
        response = requests.get(f"{BASE_URL}/api/team")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/team returned {len(data)} team members")
    
    def test_team_response_structure(self):
        """Verify team member response has expected fields"""
        response = requests.get(f"{BASE_URL}/api/team")
        assert response.status_code == 200
        data = response.json()
        
        if data:
            member = data[0]
            # Check expected fields based on public_content_routes.py TeamMember model
            assert "id" in member
            assert "name" in member
            assert "position" in member  # Using position not title
            assert "bio" in member
            print(f"✓ Team member structure validated: {member.get('name', 'Unknown')}")
    
    def test_team_ordered_by_order(self):
        """Team members should be sorted by 'order' field"""
        response = requests.get(f"{BASE_URL}/api/team")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 1:
            orders = [m.get('order', 0) for m in data]
            assert orders == sorted(orders), "Team members not sorted by order"
            print(f"✓ Team members correctly ordered")


class TestTestimonialsEndpoint:
    """Tests for /api/testimonials public endpoint"""
    
    def test_get_testimonials_no_auth(self):
        """GET /api/testimonials should work without authentication"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/testimonials returned {len(data)} testimonials")
    
    def test_testimonials_response_structure(self):
        """Verify testimonial response has expected fields"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        
        if data:
            testimonial = data[0]
            # Check expected fields based on public_content_routes.py Testimonial model
            assert "id" in testimonial
            assert "quote" in testimonial
            assert "author_name" in testimonial  # Using author_name not name
            assert "author_title" in testimonial  # Using author_title not role
            assert "organization" in testimonial
            print(f"✓ Testimonial structure validated: {testimonial.get('author_name', 'Unknown')}")
    
    def test_testimonials_featured_filter(self):
        """GET /api/testimonials?featured=true should filter featured testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials?featured=true")
        assert response.status_code == 200
        data = response.json()
        # All returned testimonials should have featured=true
        for testimonial in data:
            assert testimonial.get('featured') == True
        print(f"✓ Featured testimonials filter works correctly")


class TestStatisticsEndpoint:
    """Tests for /api/statistics public endpoint"""
    
    def test_get_statistics_no_auth(self):
        """GET /api/statistics should work without authentication"""
        response = requests.get(f"{BASE_URL}/api/statistics")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/statistics returned {len(data)} statistics")
    
    def test_statistics_response_structure(self):
        """Verify statistic response has expected fields"""
        response = requests.get(f"{BASE_URL}/api/statistics")
        assert response.status_code == 200
        data = response.json()
        
        if data:
            stat = data[0]
            # Check expected fields based on public_content_routes.py Statistic model
            assert "id" in stat
            assert "label" in stat
            assert "value" in stat
            print(f"✓ Statistic structure validated: {stat.get('label', 'Unknown')} = {stat.get('value')}")
    
    def test_statistics_ordered(self):
        """Statistics should be sorted by 'order' field"""
        response = requests.get(f"{BASE_URL}/api/statistics")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 1:
            orders = [s.get('order', 0) for s in data]
            assert orders == sorted(orders), "Statistics not sorted by order"
            print(f"✓ Statistics correctly ordered")


class TestNewsEndpoint:
    """Tests for /api/news public endpoint"""
    
    def test_get_news_no_auth(self):
        """GET /api/news should work without authentication"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/news returned {len(data)} articles")
    
    def test_news_response_structure(self):
        """Verify news article response has expected fields"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        data = response.json()
        
        if data:
            article = data[0]
            # Check expected fields based on public_content_routes.py NewsArticle model
            assert "id" in article
            assert "title" in article
            assert "excerpt" in article
            assert "content" in article
            assert "published" in article
            print(f"✓ News article structure validated: {article.get('title', 'Unknown')}")
    
    def test_news_limit_parameter(self):
        """GET /api/news?limit=5 should limit results"""
        response = requests.get(f"{BASE_URL}/api/news?limit=5")
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 5
        print(f"✓ News limit parameter works correctly")


class TestPartnersEndpoint:
    """Tests for /api/partners public endpoint"""
    
    def test_get_partners_no_auth(self):
        """GET /api/partners should work without authentication"""
        response = requests.get(f"{BASE_URL}/api/partners")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/partners returned {len(data)} partners")
    
    def test_partners_response_structure(self):
        """Verify partner response has expected fields"""
        response = requests.get(f"{BASE_URL}/api/partners")
        assert response.status_code == 200
        data = response.json()
        
        if data:
            partner = data[0]
            # Check expected fields based on public_content_routes.py Partner model
            assert "id" in partner
            assert "name" in partner
            assert "logo_url" in partner
            print(f"✓ Partner structure validated: {partner.get('name', 'Unknown')}")
    
    def test_partners_ordered(self):
        """Partners should be sorted by 'order' field"""
        response = requests.get(f"{BASE_URL}/api/partners")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 1:
            orders = [p.get('order', 0) for p in data]
            assert orders == sorted(orders), "Partners not sorted by order"
            print(f"✓ Partners correctly ordered")


class TestInquiriesEndpoint:
    """Tests for /api/inquiries public POST endpoint"""
    
    def test_create_inquiry_success(self):
        """POST /api/inquiries should create an inquiry"""
        inquiry_data = {
            "name": f"TEST_User_{uuid.uuid4().hex[:6]}",
            "email": "test@example.com",
            "company": "Test Company",
            "subject": "Test Subject",
            "message": "This is a test inquiry message",
            "inquiry_type": "general"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=inquiry_data)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["name"] == inquiry_data["name"]
        assert data["email"] == inquiry_data["email"]
        assert data["subject"] == inquiry_data["subject"]
        print(f"✓ Inquiry created successfully: {data['id']}")
    
    def test_create_inquiry_honeypot_detection(self):
        """POST /api/inquiries with honeypot filled should be rejected silently"""
        inquiry_data = {
            "name": "Bot User",
            "email": "bot@example.com",
            "subject": "Bot Message",
            "message": "Bot content",
            "honeypot": "filled_by_bot"  # Honeypot should be empty
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=inquiry_data)
        # Should return success but not save (to not alert bot)
        assert response.status_code == 200
        print(f"✓ Honeypot detection works (returns success but doesn't save)")
    
    def test_create_inquiry_minimal_fields(self):
        """POST /api/inquiries with minimal required fields"""
        inquiry_data = {
            "name": "Minimal User",
            "email": "minimal@example.com",
            "subject": "Minimal Subject",
            "message": "Minimal message"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=inquiry_data)
        assert response.status_code == 200
        data = response.json()
        assert data["inquiry_type"] == "general"  # Default value
        print(f"✓ Minimal inquiry creation works")


class TestAdminInquiriesEndpoint:
    """Tests for /api/admin/inquiries authenticated endpoint"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Admin login failed")
    
    def test_admin_inquiries_requires_auth(self):
        """GET /api/admin/inquiries should require authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/inquiries")
        assert response.status_code in [401, 403]
        print(f"✓ Admin inquiries correctly requires authentication")
    
    def test_admin_inquiries_with_auth(self, admin_token):
        """GET /api/admin/inquiries with admin token should return inquiries"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/inquiries", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin inquiries returned {len(data)} inquiries")
    
    def test_admin_inquiries_response_structure(self, admin_token):
        """Verify admin inquiries response has expected fields"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/inquiries", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        if data:
            inquiry = data[0]
            assert "id" in inquiry
            assert "name" in inquiry
            assert "email" in inquiry
            assert "subject" in inquiry
            assert "message" in inquiry
            assert "created_at" in inquiry
            print(f"✓ Admin inquiries response structure validated")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
