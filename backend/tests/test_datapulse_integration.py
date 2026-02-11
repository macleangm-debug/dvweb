"""
DataPulse Integration Tests
Tests for DataPulse product integration from GitHub repositories
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestDataPulseAuthEndpoints:
    """Test DataPulse authentication endpoints"""
    
    def test_datapulse_register_endpoint_exists(self):
        """Test that /api/datapulse/auth/register endpoint exists and accepts POST"""
        unique_email = f"test_reg_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/datapulse/auth/register", json={
            "email": unique_email,
            "password": "Test123!",
            "name": "Test User",
            "organization": "Test Org"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "access_token" in data, "Registration should return access_token"
        assert "user" in data, "Registration should return user data"
        assert data["user"]["email"] == unique_email
        assert data["user"]["name"] == "Test User"
        print(f"✓ DataPulse register endpoint works - Created user: {unique_email}")
    
    def test_datapulse_login_endpoint_exists(self):
        """Test that /api/datapulse/auth/login endpoint exists"""
        # First register a user
        unique_email = f"test_login_{uuid.uuid4().hex[:8]}@test.com"
        reg_response = requests.post(f"{BASE_URL}/api/datapulse/auth/register", json={
            "email": unique_email,
            "password": "Test123!",
            "name": "Login Test User",
            "organization": "Test Org"
        })
        assert reg_response.status_code == 200, "Registration should succeed first"
        
        # Then try to login
        login_response = requests.post(f"{BASE_URL}/api/datapulse/auth/login", json={
            "email": unique_email,
            "password": "Test123!"
        })
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        data = login_response.json()
        assert "access_token" in data, "Login should return access_token"
        assert data["user"]["email"] == unique_email
        print(f"✓ DataPulse login endpoint works - User: {unique_email}")
    
    def test_datapulse_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(f"{BASE_URL}/api/datapulse/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ DataPulse login correctly rejects invalid credentials")
    
    def test_datapulse_dashboard_stats_endpoint(self):
        """Test /api/datapulse/dashboard/stats endpoint (MOCKED)"""
        # First register and get token
        unique_email = f"test_dashboard_{uuid.uuid4().hex[:8]}@test.com"
        reg_response = requests.post(f"{BASE_URL}/api/datapulse/auth/register", json={
            "email": unique_email,
            "password": "Test123!",
            "name": "Dashboard Test User",
            "organization": "Test Org"
        })
        assert reg_response.status_code == 200
        token = reg_response.json()["access_token"]
        
        # Get dashboard stats with auth
        stats_response = requests.get(
            f"{BASE_URL}/api/datapulse/dashboard/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert stats_response.status_code == 200, f"Dashboard stats failed: {stats_response.text}"
        data = stats_response.json()
        # Verify mock data structure
        assert "total_projects" in data
        assert "active_forms" in data
        assert "total_submissions" in data
        print(f"✓ DataPulse dashboard stats endpoint works (MOCKED data)")
    
    def test_datapulse_auth_me_endpoint(self):
        """Test /api/datapulse/auth/me endpoint"""
        # Register and get token
        unique_email = f"test_me_{uuid.uuid4().hex[:8]}@test.com"
        reg_response = requests.post(f"{BASE_URL}/api/datapulse/auth/register", json={
            "email": unique_email,
            "password": "Test123!",
            "name": "Me Test User",
            "organization": "Me Test Org"
        })
        assert reg_response.status_code == 200
        token = reg_response.json()["access_token"]
        
        # Get current user
        me_response = requests.get(
            f"{BASE_URL}/api/datapulse/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_response.status_code == 200, f"Auth me failed: {me_response.text}"
        data = me_response.json()
        assert data["email"] == unique_email
        assert data["name"] == "Me Test User"
        print(f"✓ DataPulse auth/me endpoint works")


class TestFieldForceDemoEndpoints:
    """Test FieldForce demo page availability"""
    
    def test_fieldforce_landing_accessible(self):
        """Test that FieldForce landing page is accessible"""
        response = requests.get(f"{BASE_URL}/solutions/fieldforce", allow_redirects=True)
        assert response.status_code == 200, f"FieldForce landing not accessible: {response.status_code}"
        print("✓ FieldForce landing page is accessible")
    
    def test_fieldforce_demo_accessible(self):
        """Test that FieldForce demo page is accessible"""
        response = requests.get(f"{BASE_URL}/solutions/fieldforce/demo", allow_redirects=True)
        assert response.status_code == 200, f"FieldForce demo not accessible: {response.status_code}"
        print("✓ FieldForce demo page is accessible")


class TestExistingProductPages:
    """Test that existing product pages still work"""
    
    def test_survey360_landing_accessible(self):
        """Test Survey360 landing page is still accessible"""
        response = requests.get(f"{BASE_URL}/solutions/survey360", allow_redirects=True)
        assert response.status_code == 200, f"Survey360 landing not accessible: {response.status_code}"
        print("✓ Survey360 landing page is accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
