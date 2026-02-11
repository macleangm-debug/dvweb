"""
Backend API tests for Admin Expert Management Dashboard
Testing: Admin login, Expert Network APIs, Stats API, Status updates
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cms-builder-11.preview.emergentagent.com').rstrip('/')

# Admin credentials provided
ADMIN_EMAIL = "info@datavision.co.tz"
ADMIN_PASSWORD = "walkthetalkdvi1998"


class TestAdminAuth:
    """Test admin authentication"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data, "Missing access_token in response"
        assert "user" in data, "Missing user in response"
        assert data["user"]["email"] == ADMIN_EMAIL, "Email mismatch"
        assert len(data["access_token"]) > 0, "Token is empty"
        print(f"✓ Admin login successful - token received")
        
    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid credentials properly rejected")
        
    def test_get_current_user(self):
        """Test /auth/me endpoint with valid token"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Test /auth/me
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        
        assert response.status_code == 200, f"Auth check failed: {response.text}"
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        print("✓ /auth/me endpoint working correctly")


class TestAdminExpertAPIs:
    """Test admin expert management APIs"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get admin token before each test"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
        
    def test_get_experts_list(self):
        """Test GET /api/admin/experts - get all experts"""
        response = requests.get(f"{BASE_URL}/api/admin/experts", headers=self.headers)
        
        assert response.status_code == 200, f"Failed to get experts: {response.text}"
        experts = response.json()
        
        assert isinstance(experts, list), "Response should be a list"
        print(f"✓ Retrieved {len(experts)} experts")
        
        # If there are experts, verify structure
        if len(experts) > 0:
            expert = experts[0]
            assert "id" in expert, "Expert missing 'id'"
            assert "full_name" in expert, "Expert missing 'full_name'"
            assert "email" in expert, "Expert missing 'email'"
            assert "status" in expert, "Expert missing 'status'"
            print(f"✓ Expert data structure verified")
        
    def test_get_experts_with_filters(self):
        """Test GET /api/admin/experts with filtering parameters"""
        # Test status filter
        response = requests.get(f"{BASE_URL}/api/admin/experts?status=pending", headers=self.headers)
        assert response.status_code == 200, f"Status filter failed: {response.text}"
        print("✓ Status filter working")
        
        # Test search filter
        response = requests.get(f"{BASE_URL}/api/admin/experts?search=test", headers=self.headers)
        assert response.status_code == 200, f"Search filter failed: {response.text}"
        print("✓ Search filter working")
        
        # Test availability filter
        response = requests.get(f"{BASE_URL}/api/admin/experts?availability=available", headers=self.headers)
        assert response.status_code == 200, f"Availability filter failed: {response.text}"
        print("✓ Availability filter working")
        
    def test_get_experts_stats_summary(self):
        """Test GET /api/admin/experts/stats/summary - get expert statistics"""
        response = requests.get(f"{BASE_URL}/api/admin/experts/stats/summary", headers=self.headers)
        
        assert response.status_code == 200, f"Failed to get stats: {response.text}"
        stats = response.json()
        
        # Verify stats structure
        assert "total_experts" in stats, "Missing total_experts"
        assert "by_status" in stats, "Missing by_status"
        assert isinstance(stats["total_experts"], int), "total_experts should be int"
        
        print(f"✓ Stats: Total={stats['total_experts']}, By Status={stats['by_status']}")
        
    def test_get_single_expert(self):
        """Test GET /api/admin/experts/{id} - get single expert"""
        # First get list of experts
        list_response = requests.get(f"{BASE_URL}/api/admin/experts", headers=self.headers)
        experts = list_response.json()
        
        if len(experts) > 0:
            expert_id = experts[0]["id"]
            response = requests.get(f"{BASE_URL}/api/admin/experts/{expert_id}", headers=self.headers)
            
            assert response.status_code == 200, f"Failed to get expert: {response.text}"
            expert = response.json()
            
            assert expert["id"] == expert_id, "Expert ID mismatch"
            print(f"✓ Retrieved expert: {expert['full_name']}")
        else:
            pytest.skip("No experts in database to test")
            
    def test_get_nonexistent_expert(self):
        """Test GET /api/admin/experts/{id} with non-existent ID"""
        response = requests.get(f"{BASE_URL}/api/admin/experts/nonexistent-id-12345", headers=self.headers)
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ Non-existent expert returns 404")


class TestExpertStatusUpdates:
    """Test expert status update functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get admin token before each test"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_update_expert_status(self):
        """Test PUT /api/admin/experts/{id}/status - update expert status"""
        # Get list of experts
        list_response = requests.get(f"{BASE_URL}/api/admin/experts", headers=self.headers)
        experts = list_response.json()
        
        if len(experts) > 0:
            expert = experts[0]
            expert_id = expert["id"]
            original_status = expert["status"]
            
            # Determine new status based on current status
            status_transitions = {
                "pending": "approved",
                "approved": "active",
                "active": "active",  # Keep as active
                "rejected": "pending",
                "inactive": "active",
                "engaged": "active"
            }
            new_status = status_transitions.get(original_status, "approved")
            
            # Update status
            response = requests.put(
                f"{BASE_URL}/api/admin/experts/{expert_id}/status?status={new_status}",
                headers=self.headers
            )
            
            assert response.status_code == 200, f"Failed to update status: {response.text}"
            
            # Verify status was updated
            get_response = requests.get(f"{BASE_URL}/api/admin/experts/{expert_id}", headers=self.headers)
            updated_expert = get_response.json()
            assert updated_expert["status"] == new_status, "Status not updated"
            
            # Restore original status
            requests.put(
                f"{BASE_URL}/api/admin/experts/{expert_id}/status?status={original_status}",
                headers=self.headers
            )
            
            print(f"✓ Status updated from '{original_status}' to '{new_status}' and restored")
        else:
            pytest.skip("No experts in database to test status update")
            
    def test_update_expert_invalid_status(self):
        """Test updating expert with invalid status"""
        list_response = requests.get(f"{BASE_URL}/api/admin/experts", headers=self.headers)
        experts = list_response.json()
        
        if len(experts) > 0:
            expert_id = experts[0]["id"]
            
            response = requests.put(
                f"{BASE_URL}/api/admin/experts/{expert_id}/status?status=invalid_status",
                headers=self.headers
            )
            
            assert response.status_code == 400, f"Expected 400, got {response.status_code}"
            print("✓ Invalid status properly rejected")
        else:
            pytest.skip("No experts in database to test")


class TestExpertOptions:
    """Test public expert options endpoint"""
    
    def test_get_expert_options(self):
        """Test GET /api/experts/options - public endpoint for form options"""
        response = requests.get(f"{BASE_URL}/api/experts/options")
        
        assert response.status_code == 200, f"Failed to get options: {response.text}"
        options = response.json()
        
        # Verify structure
        assert "sectors" in options, "Missing sectors"
        assert "skills" in options, "Missing skills"
        assert "engagement_types" in options, "Missing engagement_types"
        assert "countries" in options, "Missing countries"
        
        assert len(options["sectors"]) > 0, "Sectors list is empty"
        assert len(options["skills"]) > 0, "Skills list is empty"
        
        print(f"✓ Options: {len(options['sectors'])} sectors, {len(options['skills'])} skills")


class TestExpertRegistration:
    """Test expert registration (public endpoint)"""
    
    def test_register_expert(self):
        """Test POST /api/experts/register - register new expert"""
        test_email = f"test_expert_{uuid.uuid4().hex[:8]}@test.com"
        
        expert_data = {
            "full_name": "TEST Expert User",
            "email": test_email,
            "phone": "+255712345678",
            "location_country": "Tanzania",
            "location_city": "Dar es Salaam",
            "nationality": "Tanzanian",
            "languages": ["English", "Swahili"],
            "current_title": "Research Consultant",
            "years_experience": 5,
            "primary_sectors": ["Agriculture & Food Security", "Health & Pharmaceuticals"],
            "skills": [{"name": "Data Analysis", "proficiency": "advanced"}],
            "countries_experience": ["Tanzania", "Kenya"],
            "availability": "available",
            "engagement_type": ["short-term", "remote"]
        }
        
        response = requests.post(f"{BASE_URL}/api/experts/register", json=expert_data)
        
        assert response.status_code == 200, f"Registration failed: {response.text}"
        created_expert = response.json()
        
        assert created_expert["email"] == test_email, "Email mismatch"
        assert created_expert["full_name"] == "TEST Expert User", "Name mismatch"
        assert created_expert["status"] == "pending", "New expert should be pending"
        
        print(f"✓ Expert registered: {created_expert['id']}")
        
        # Cleanup: Delete test expert
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/experts/{created_expert['id']}",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"✓ Test expert deleted: {delete_response.status_code}")


class TestProtectedEndpoints:
    """Test that protected endpoints require authentication"""
    
    def test_experts_list_requires_auth(self):
        """Test that /admin/experts requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/experts")
        
        # Should return 403 Forbidden or 401 Unauthorized
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ /admin/experts requires authentication")
        
    def test_experts_stats_requires_auth(self):
        """Test that /admin/experts/stats/summary requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/experts/stats/summary")
        
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ /admin/experts/stats/summary requires authentication")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
