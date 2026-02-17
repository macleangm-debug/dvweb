"""
Test Partner Performance and Badges APIs - Iteration 30
Tests for:
- Partner Performance API (/api/affiliates/my-performance)
- Partner Badges API (/api/affiliates/badges)
- Registration with referral code processing
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@datavision.co.tz"
ADMIN_PASSWORD = "admin123"


class TestAdminLogin:
    """Get auth token for testing"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json()["access_token"]
    
    def test_admin_login_success(self, auth_token):
        """Verify login works and token is returned"""
        assert auth_token is not None
        assert len(auth_token) > 20
        print(f"✓ Admin login successful, token received")


class TestPartnerPerformanceAPI:
    """Test /api/affiliates/my-performance endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_my_performance_endpoint_exists(self, auth_token):
        """Test that /api/affiliates/my-performance endpoint is accessible"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/my-performance", headers=headers)
        
        # Should return 200 if user is affiliate, 404 if not
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}, {response.text}"
        print(f"✓ my-performance endpoint accessible (status: {response.status_code})")
        
    def test_my_performance_response_structure(self, auth_token):
        """Test response structure from my-performance endpoint"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/my-performance", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check for expected top-level keys
            assert "your_stats" in data, "Missing your_stats in response"
            assert "platform_average" in data, "Missing platform_average in response"
            assert "comparison" in data, "Missing comparison in response"
            assert "badges" in data, "Missing badges in response"
            assert "leaderboard_position" in data, "Missing leaderboard_position in response"
            
            # Check your_stats structure
            your_stats = data["your_stats"]
            assert "total_referrals" in your_stats
            assert "total_clicks" in your_stats
            assert "total_earnings" in your_stats
            assert "conversion_rate" in your_stats
            assert "rank" in your_stats
            
            # Check platform_average structure
            platform_avg = data["platform_average"]
            assert "avg_referrals" in platform_avg
            assert "avg_clicks" in platform_avg
            assert "avg_earnings" in platform_avg
            
            # Check comparison structure
            comparison = data["comparison"]
            assert "referrals_vs_avg" in comparison
            assert "clicks_vs_avg" in comparison
            assert "earnings_vs_avg" in comparison
            assert "is_above_average" in comparison
            
            # Check badges structure
            badges = data["badges"]
            assert "earned" in badges
            assert "total_earned" in badges
            assert "total_available" in badges
            assert "next_to_earn" in badges
            
            print(f"✓ my-performance response structure is correct")
            print(f"  - Your stats: {your_stats}")
            print(f"  - Badges earned: {badges['total_earned']}/{badges['total_available']}")
        else:
            print(f"✓ my-performance returned 404 (user not an affiliate) - expected for non-affiliate users")
            pytest.skip("User is not an affiliate")

    def test_my_performance_with_period(self, auth_token):
        """Test my-performance with different period_days parameter"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        for period in [7, 30, 60, 90]:
            response = requests.get(f"{BASE_URL}/api/affiliates/my-performance?period_days={period}", headers=headers)
            assert response.status_code in [200, 404], f"Failed for period {period}: {response.text}"
        
        print("✓ my-performance works with different period_days values")


class TestPartnerBadgesAPI:
    """Test /api/affiliates/badges endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_badges_endpoint_exists(self, auth_token):
        """Test that /api/affiliates/badges endpoint is accessible"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badges", headers=headers)
        
        # Should return 200 if user is affiliate, 404 if not
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}, {response.text}"
        print(f"✓ badges endpoint accessible (status: {response.status_code})")
    
    def test_badges_response_structure(self, auth_token):
        """Test response structure from badges endpoint"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badges", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check top-level structure
            assert "badges" in data, "Missing badges array"
            assert "total_earned" in data, "Missing total_earned count"
            assert "total_available" in data, "Missing total_available count"
            
            # Check badges array structure
            badges = data["badges"]
            assert isinstance(badges, list), "badges should be a list"
            assert len(badges) > 0, "badges list should not be empty"
            
            # Check individual badge structure
            first_badge = badges[0]
            assert "id" in first_badge
            assert "name" in first_badge
            assert "description" in first_badge
            assert "icon" in first_badge
            assert "color" in first_badge
            assert "requirement" in first_badge
            assert "earned" in first_badge
            
            print(f"✓ badges response structure is correct")
            print(f"  - Total badges: {len(badges)}")
            print(f"  - Earned: {data['total_earned']}/{data['total_available']}")
            
            # Print earned badges
            earned_badges = [b for b in badges if b.get('earned')]
            if earned_badges:
                print(f"  - Earned badges: {[b['name'] for b in earned_badges]}")
        else:
            print(f"✓ badges returned 404 (user not an affiliate)")
            pytest.skip("User is not an affiliate")

    def test_badges_have_all_10_types(self, auth_token):
        """Verify all 10 badge types are returned"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badges", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            badges = data["badges"]
            
            # Check total available is 10
            assert data["total_available"] == 10, f"Expected 10 badges, got {data['total_available']}"
            
            # Verify expected badge IDs exist
            expected_badge_ids = [
                "first_referral", "five_referrals", "ten_referrals", 
                "twenty_five_referrals", "fifty_referrals", "high_converter",
                "consistent_performer", "top_earner", "quick_starter", "top_10_percent"
            ]
            
            actual_badge_ids = [b["id"] for b in badges]
            for expected_id in expected_badge_ids:
                assert expected_id in actual_badge_ids, f"Missing badge: {expected_id}"
            
            print(f"✓ All 10 badge types present")
        else:
            pytest.skip("User is not an affiliate")


class TestReferralCodeRegistration:
    """Test registration with referral code processing"""
    
    def test_register_without_referral_code(self):
        """Test registration without referral code works"""
        unique_email = f"test_no_ref_{uuid.uuid4().hex[:8]}@example.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "TestPass123!",
            "name": "Test User No Ref"
        })
        
        # Should succeed
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == unique_email
        print(f"✓ Registration without referral code works")
    
    def test_register_with_invalid_referral_code(self):
        """Test registration with invalid referral code still succeeds"""
        unique_email = f"test_invalid_ref_{uuid.uuid4().hex[:8]}@example.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "TestPass123!",
            "name": "Test User Invalid Ref",
            "referral_code": "INVALID123XYZ"
        })
        
        # Should succeed even with invalid referral code
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        print(f"✓ Registration with invalid referral code still succeeds")

    def test_registration_creates_user(self):
        """Test that registration properly creates a user"""
        unique_email = f"test_create_{uuid.uuid4().hex[:8]}@example.com"
        
        # Register
        reg_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "TestPass123!",
            "name": "Test Created User"
        })
        
        assert reg_response.status_code == 200
        token = reg_response.json()["access_token"]
        
        # Verify user can login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": unique_email,
            "password": "TestPass123!"
        })
        
        assert login_response.status_code == 200, f"Login after registration failed"
        print(f"✓ Registration creates user correctly")


class TestAffiliateProfile:
    """Test affiliate profile returns performance data"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_affiliate_profile(self, auth_token):
        """Test my-profile endpoint returns correct structure"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/my-profile", headers=headers)
        
        assert response.status_code == 200, f"Profile request failed: {response.text}"
        data = response.json()
        
        if data.get("is_affiliate"):
            assert "referral_code" in data
            assert "tier" in data
            assert "commission_rate" in data
            assert "total_clicks" in data
            assert "total_referrals" in data
            assert "total_earnings" in data
            print(f"✓ Affiliate profile returns correct structure")
            print(f"  - Code: {data.get('referral_code')}")
            print(f"  - Tier: {data.get('tier')}")
            print(f"  - Referrals: {data.get('total_referrals')}")
        else:
            print(f"✓ User is not an affiliate")


class TestAffiliateAnalytics:
    """Test affiliate analytics endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Login and get token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_analytics_endpoint(self, auth_token):
        """Test my-analytics endpoint"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/my-analytics", headers=headers)
        
        # Should return 200 or 404 if not affiliate
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}"
        
        if response.status_code == 200:
            data = response.json()
            assert "period_days" in data
            assert "summary" in data
            assert "daily_clicks" in data
            print(f"✓ Analytics endpoint working")
        else:
            print(f"✓ Analytics returns 404 (user not an affiliate)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
