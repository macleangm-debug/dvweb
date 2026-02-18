"""
Test suite for Admin Inquiry Dashboard APIs
Tests:
- POST /api/inquiries (public endpoint) - create inquiry
- GET /api/inquiries (admin only) - get all inquiries with stats
- Admin authentication required for GET /api/inquiries
"""
import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials for testing
ADMIN_EMAIL = "admin@datavision.co.tz"
ADMIN_PASSWORD = "admin123"


class TestAdminAuth:
    """Test admin authentication for inquiry dashboard"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access token returned"
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["is_admin"] == True
        print(f"Admin login successful: {data['user']['name']}")
        
    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "invalid@test.com", "password": "wrongpass"}
        )
        assert response.status_code == 401, "Should reject invalid credentials"


class TestPublicInquirySubmission:
    """Test POST /api/inquiries (public endpoint)"""
    
    def test_create_inquiry_full_data(self):
        """Test creating inquiry with all fields"""
        inquiry_data = {
            "name": f"TEST_FullInquiry_{datetime.now().strftime('%H%M%S')}",
            "email": "test.full@example.com",
            "phone": "+255111222333",
            "organization": "Test Enterprise Ltd",
            "organizationType": "Private Company",
            "country": "Tanzania",
            "employeeCount": "100-500",
            "message": "Full test inquiry with all fields",
            "solution": "enterprise",
            "solutionName": "Enterprise Solutions",
            "type": "demo_request"
        }
        response = requests.post(
            f"{BASE_URL}/api/inquiries",
            json=inquiry_data
        )
        assert response.status_code == 200, f"Create inquiry failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Created inquiry: {data}")
        
    def test_create_inquiry_minimal_data(self):
        """Test creating inquiry with minimal required fields"""
        inquiry_data = {
            "name": "TEST_MinimalInquiry",
            "email": "test.minimal@example.com",
            "message": "Minimal test inquiry"
        }
        response = requests.post(
            f"{BASE_URL}/api/inquiries",
            json=inquiry_data
        )
        assert response.status_code == 200, f"Create minimal inquiry failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Created minimal inquiry: {data}")
        
    def test_create_government_inquiry(self):
        """Test creating inquiry for government solution"""
        inquiry_data = {
            "name": "TEST_GovInquiry",
            "email": "test.gov@government.org",
            "organization": "Ministry of Finance",
            "organizationType": "Government",
            "country": "Tanzania",
            "message": "Interested in government financial solutions",
            "solution": "taxxa",
            "solutionName": "Taxxa - Government Tax System",
            "type": "demo_request"
        }
        response = requests.post(
            f"{BASE_URL}/api/inquiries",
            json=inquiry_data
        )
        assert response.status_code == 200, f"Create gov inquiry failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Created government inquiry: {data}")
        
    def test_create_enterprise_inquiry(self):
        """Test creating inquiry for enterprise solution"""
        inquiry_data = {
            "name": "TEST_EnterpriseInquiry",
            "email": "test.enterprise@corp.com",
            "organization": "Big Corporation",
            "organizationType": "Private Company",
            "country": "Kenya",
            "employeeCount": "500+",
            "message": "Need enterprise accounting solution",
            "solution": "accubooks",
            "solutionName": "AccuBooks - Enterprise Accounting",
            "type": "demo_request"
        }
        response = requests.post(
            f"{BASE_URL}/api/inquiries",
            json=inquiry_data
        )
        assert response.status_code == 200, f"Create enterprise inquiry failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"Created enterprise inquiry: {data}")


class TestAdminInquiryDashboard:
    """Test GET /api/inquiries (admin only endpoint)"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Admin authentication failed")
        return response.json()["access_token"]
    
    def test_get_inquiries_with_auth(self, admin_token):
        """Test fetching inquiries with admin authentication"""
        response = requests.get(
            f"{BASE_URL}/api/inquiries",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Get inquiries failed: {response.text}"
        data = response.json()
        
        # Check response structure
        assert "inquiries" in data, "Missing 'inquiries' in response"
        assert "stats" in data, "Missing 'stats' in response"
        
        # Check stats structure
        stats = data["stats"]
        assert "total" in stats, "Missing 'total' in stats"
        assert "new" in stats, "Missing 'new' in stats"
        assert "contacted" in stats, "Missing 'contacted' in stats"
        assert "converted" in stats, "Missing 'converted' in stats"
        
        print(f"Inquiries fetched - Total: {stats['total']}, New: {stats['new']}, Contacted: {stats['contacted']}, Converted: {stats['converted']}")
        
        # Verify inquiries is a list
        assert isinstance(data["inquiries"], list), "Inquiries should be a list"
        print(f"Total inquiries returned: {len(data['inquiries'])}")
        
    def test_get_inquiries_without_auth(self):
        """Test that GET /api/inquiries requires authentication"""
        response = requests.get(f"{BASE_URL}/api/inquiries")
        assert response.status_code == 403 or response.status_code == 401, \
            f"Unauthenticated request should be rejected, got {response.status_code}"
        print("Correctly rejected unauthenticated request")
        
    def test_get_inquiries_with_invalid_token(self):
        """Test that GET /api/inquiries rejects invalid tokens"""
        response = requests.get(
            f"{BASE_URL}/api/inquiries",
            headers={"Authorization": "Bearer invalid_token_12345"}
        )
        assert response.status_code in [401, 403], \
            f"Invalid token should be rejected, got {response.status_code}"
        print("Correctly rejected invalid token")
        
    def test_inquiry_data_fields(self, admin_token):
        """Test that inquiry data contains expected fields"""
        response = requests.get(
            f"{BASE_URL}/api/inquiries",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data["inquiries"]) > 0:
            inquiry = data["inquiries"][0]
            # Check for expected fields (based on how POST /api/inquiries stores data)
            expected_fields = ["name", "email", "status", "created_at"]
            for field in expected_fields:
                assert field in inquiry, f"Missing field '{field}' in inquiry data"
            print(f"Sample inquiry data: {list(inquiry.keys())}")
        else:
            print("No inquiries found to verify fields")
            
    def test_stats_counts_match(self, admin_token):
        """Test that stats counts are consistent with inquiry data"""
        response = requests.get(
            f"{BASE_URL}/api/inquiries",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        stats = data["stats"]
        inquiries = data["inquiries"]
        
        # Total should match length of inquiries
        assert stats["total"] == len(inquiries), \
            f"Stats total ({stats['total']}) doesn't match inquiry count ({len(inquiries)})"
        
        # Count statuses
        new_count = sum(1 for i in inquiries if i.get("status") == "new")
        contacted_count = sum(1 for i in inquiries if i.get("status") == "contacted")
        converted_count = sum(1 for i in inquiries if i.get("status") == "converted")
        
        assert stats["new"] == new_count, f"Stats new ({stats['new']}) doesn't match counted ({new_count})"
        assert stats["contacted"] == contacted_count, f"Stats contacted ({stats['contacted']}) doesn't match counted ({contacted_count})"
        assert stats["converted"] == converted_count, f"Stats converted ({stats['converted']}) doesn't match counted ({converted_count})"
        
        print(f"Stats verified - Total: {stats['total']}, New: {new_count}, Contacted: {contacted_count}, Converted: {converted_count}")


class TestNonAdminAccess:
    """Test that regular users cannot access admin endpoints"""
    
    def test_non_admin_cannot_get_inquiries(self):
        """Test that non-admin users cannot access GET /api/inquiries"""
        # First register a regular user
        register_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": f"test_nonadmin_{datetime.now().strftime('%H%M%S')}@test.com",
                "password": "test123456",
                "name": "Test Non-Admin"
            }
        )
        
        if register_response.status_code == 200:
            token = register_response.json()["access_token"]
            
            # Try to access admin endpoint
            response = requests.get(
                f"{BASE_URL}/api/inquiries",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == 403, \
                f"Non-admin should be rejected, got {response.status_code}"
            print("Correctly rejected non-admin access to inquiries")
        else:
            # User might already exist, try logging in
            print(f"Could not create test user: {register_response.text}")
            pytest.skip("Could not create test non-admin user")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
