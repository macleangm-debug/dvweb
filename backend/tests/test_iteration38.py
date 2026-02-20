"""
Test new features: Mega menu, AccuBooks, PeopleHub, inquiry forms
Iteration 38 testing
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://central-gateway-1.preview.emergentagent.com').rstrip('/')


class TestHealthAndAPI:
    """Basic API health checks"""
    
    def test_api_health(self):
        """Test API is running"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "operational"
        print("API health check: PASSED")


class TestInquiriesAPI:
    """Test inquiry endpoints for demo requests"""
    
    def test_create_accubooks_inquiry(self):
        """Test creating AccuBooks inquiry"""
        payload = {
            "name": "Test User AccuBooks",
            "email": "test_accubooks@example.com",
            "phone": "+255123456789",
            "organization": "Test Company Ltd",
            "organizationType": "enterprise",
            "country": "TZ",
            "employeeCount": "51-200",
            "message": "Interested in AccuBooks demo",
            "solution": "accubooks",
            "solutionName": "AccuBooks",
            "type": "demo_request"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "Inquiry submitted successfully" in data.get("message", "")
        print("AccuBooks inquiry creation: PASSED")
    
    def test_create_peoplehub_inquiry(self):
        """Test creating PeopleHub inquiry"""
        payload = {
            "name": "Test User PeopleHub",
            "email": "test_peoplehub@example.com",
            "phone": "+255987654321",
            "organization": "HR Solutions Inc",
            "organizationType": "enterprise",
            "country": "KE",
            "employeeCount": "201-500",
            "message": "Need PeopleHub for HR management",
            "solution": "peoplehub",
            "solutionName": "PeopleHub",
            "type": "demo_request"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("PeopleHub inquiry creation: PASSED")
    
    def test_create_taxxa_inquiry(self):
        """Test creating Taxxa (government) inquiry"""
        payload = {
            "name": "Government Official",
            "email": "gov_test@example.com",
            "phone": "+255111222333",
            "organization": "Ministry of Finance",
            "organizationType": "government",
            "country": "TZ",
            "employeeCount": "1000+",
            "message": "Interested in Taxxa tax collection system",
            "solution": "taxxa",
            "solutionName": "Taxxa",
            "type": "demo_request"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Taxxa inquiry creation: PASSED")
    
    def test_create_ammo_inquiry(self):
        """Test creating Ammo (firearm registry) inquiry"""
        payload = {
            "name": "Security Officer",
            "email": "security_test@example.com",
            "phone": "+255444555666",
            "organization": "Police Department",
            "organizationType": "government",
            "country": "TZ",
            "employeeCount": "501-1000",
            "message": "Need Ammo for firearm registry",
            "solution": "ammo",
            "solutionName": "Ammo",
            "type": "demo_request"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Ammo inquiry creation: PASSED")
    
    def test_inquiry_with_minimal_fields(self):
        """Test inquiry with only required fields"""
        payload = {
            "name": "Minimal Test",
            "email": "minimal@example.com",
            "solution": "accubooks",
            "solutionName": "AccuBooks",
            "type": "demo_request"
        }
        response = requests.post(f"{BASE_URL}/api/inquiries", json=payload)
        assert response.status_code == 200
        print("Minimal inquiry creation: PASSED")


class TestSolutionsCategories:
    """Test solutions endpoints if available"""
    
    def test_expert_options(self):
        """Test experts options endpoint (used for sectors)"""
        response = requests.get(f"{BASE_URL}/api/experts/options")
        assert response.status_code == 200
        data = response.json()
        # Check that sectors are available
        assert "sectors" in data
        assert len(data["sectors"]) > 0
        print("Expert options (sectors) endpoint: PASSED")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
