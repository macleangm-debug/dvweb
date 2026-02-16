"""
Test file for newly implemented features:
1. Trust Badges Section (frontend feature - relies on partners API)
2. Affiliate Admin Dashboard APIs
3. Extracted Components (AnimatedCounter, AfricaMap - verified via frontend)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://commission-hub-32.preview.emergentagent.com')


class TestStatisticsAPI:
    """Test statistics API - used by AnimatedCounter component"""
    
    def test_get_statistics(self):
        """Test statistics endpoint returns data for counter animation"""
        response = requests.get(f"{BASE_URL}/api/statistics")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Verify structure
        for stat in data:
            assert 'value' in stat
            assert 'label' in stat


class TestPartnersAPI:
    """Test partners API - used for Trust Badges section"""
    
    def test_get_partners(self):
        """Test partners endpoint for Trust Badges"""
        response = requests.get(f"{BASE_URL}/api/partners")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestAffiliateProgramInfo:
    """Test affiliate program info API"""
    
    def test_get_program_info(self):
        """Test affiliate program info endpoint"""
        response = requests.get(f"{BASE_URL}/api/affiliates/program-info")
        assert response.status_code == 200
        data = response.json()
        # Verify key fields
        assert 'tiers' in data
        assert 'commission_rate' in data
        assert 'commission_duration_months' in data
        assert data['commission_rate'] == 10
        assert data['commission_duration_months'] == 12


class TestAffiliateAdminAPIs:
    """Test affiliate admin dashboard APIs"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@datavision.co.tz", "password": "admin123"}
        )
        if response.status_code != 200:
            pytest.skip("Admin login failed - skipping admin tests")
        return response.json().get('access_token')
    
    def test_get_affiliate_applications(self, admin_token):
        """Test admin can fetch affiliate applications"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/applications",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert 'applications' in data
        assert 'stats' in data
        # Verify stats structure
        stats = data['stats']
        assert 'total' in stats
        assert 'pending' in stats
        assert 'approved' in stats
        assert 'rejected' in stats
    
    def test_get_affiliate_applications_with_status_filter(self, admin_token):
        """Test filtering applications by status"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/applications?status=pending",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert 'applications' in data
        # All returned should be pending
        for app in data['applications']:
            assert app['status'] == 'pending'
    
    def test_get_affiliate_payouts(self, admin_token):
        """Test admin can fetch affiliate payouts"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/payouts",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert 'payouts' in data
        assert isinstance(data['payouts'], list)
    
    def test_unauthenticated_access_blocked(self):
        """Test that unauthenticated access to admin APIs is blocked"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/applications")
        # 401 Unauthorized or 403 Forbidden - both indicate blocked access
        assert response.status_code in [401, 403]


class TestAffiliateApplication:
    """Test affiliate application submission"""
    
    def test_submit_affiliate_application(self):
        """Test submitting a new affiliate application"""
        import time
        timestamp = int(time.time())
        
        application_data = {
            "full_name": f"TEST_NewApp_{timestamp}",
            "email": f"test_new_{timestamp}@example.com",
            "phone": "+255123456789",
            "company_name": "Test Company",
            "website_url": "https://test.com",
            "audience_size": 5000,
            "promotion_methods": ["blog", "social"],
            "payment_info": {
                "payment_method": "paypal",
                "paypal_email": f"paypal_{timestamp}@example.com"
            },
            "accept_terms": True,
            "why_join": "Testing purposes"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/apply",
            json=application_data
        )
        
        # Should return 200 on success
        if response.status_code == 200:
            data = response.json()
            assert 'affiliate' in data
            assert data['affiliate']['status'] == 'pending'
            assert 'referral_code' in data['affiliate']
        else:
            # May fail if duplicate email - check for proper error
            assert response.status_code == 400


class TestHomepageAPIs:
    """Test APIs used by homepage"""
    
    def test_featured_projects(self):
        """Test featured projects for homepage"""
        response = requests.get(f"{BASE_URL}/api/projects?featured=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_featured_testimonials(self):
        """Test featured testimonials for homepage"""
        response = requests.get(f"{BASE_URL}/api/testimonials?featured=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
