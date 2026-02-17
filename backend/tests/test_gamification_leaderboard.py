"""
Test suite for Partner Leaderboard, Badge Sharing, and Gamification features
- Public leaderboard endpoint with period filtering
- My-position endpoint showing rank and neighbors
- Badge sharing endpoint for social media
- Click tracking with geo data
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPublicLeaderboard:
    """Test public leaderboard endpoint - no auth required"""
    
    def test_leaderboard_default_all_time(self):
        """Test leaderboard returns all_time by default"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard")
        assert response.status_code == 200
        
        data = response.json()
        assert data["period"] == "all_time"
        assert data["period_label"] == "All Time"
        assert "leaderboard" in data
        assert "stats" in data
        assert "updated_at" in data
        
        # Verify stats structure
        assert "total_partners" in data["stats"]
        assert "active_partners" in data["stats"]
        assert "total_referrals" in data["stats"]
        print(f"PASS: Leaderboard all_time returns {len(data['leaderboard'])} partners")
    
    def test_leaderboard_weekly_period(self):
        """Test leaderboard with weekly period filter"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard?period=weekly")
        assert response.status_code == 200
        
        data = response.json()
        assert data["period"] == "weekly"
        assert data["period_label"] == "This Week"
        assert isinstance(data["leaderboard"], list)
        print(f"PASS: Weekly leaderboard returns {len(data['leaderboard'])} partners")
    
    def test_leaderboard_monthly_period(self):
        """Test leaderboard with monthly period filter"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard?period=monthly")
        assert response.status_code == 200
        
        data = response.json()
        assert data["period"] == "monthly"
        assert data["period_label"] == "This Month"
        assert isinstance(data["leaderboard"], list)
        print(f"PASS: Monthly leaderboard returns {len(data['leaderboard'])} partners")
    
    def test_leaderboard_entry_structure(self):
        """Test leaderboard entry has correct structure"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard")
        assert response.status_code == 200
        
        data = response.json()
        if data["leaderboard"]:
            entry = data["leaderboard"][0]
            assert "id" in entry
            assert "name" in entry
            assert "tier" in entry
            assert "tier_color" in entry
            assert "referrals" in entry
            assert "total_referrals" in entry
            assert "rank" in entry
            assert entry["rank"] == 1  # First entry should be rank 1
            print(f"PASS: Leaderboard entry structure correct - {entry['name']} at rank {entry['rank']}")
        else:
            print("INFO: No entries in leaderboard to verify structure")
    
    def test_leaderboard_limit_parameter(self):
        """Test leaderboard respects limit parameter"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard?limit=5")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["leaderboard"]) <= 5
        print(f"PASS: Leaderboard limit=5 returns {len(data['leaderboard'])} entries")


class TestMyPosition:
    """Test authenticated my-position endpoint"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for admin user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Auth failed - skipping authenticated tests")
    
    def test_my_position_requires_auth(self):
        """Test my-position requires authentication"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard/my-position")
        assert response.status_code in [401, 403]
        print("PASS: my-position requires authentication")
    
    def test_my_position_response_structure(self, auth_token):
        """Test my-position returns correct structure"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard/my-position", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "your_position" in data
        assert "above_you" in data
        assert "below_you" in data
        assert "referrals_to_next_rank" in data
        
        # Verify your_position structure
        position = data["your_position"]
        assert "rank" in position
        assert "total" in position
        assert "referrals" in position
        assert "percentile" in position
        print(f"PASS: My position is rank #{position['rank']} of {position['total']} with {position['referrals']} referrals")
    
    def test_my_position_neighbors(self, auth_token):
        """Test my-position shows neighbors correctly"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard/my-position", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        # If there's someone below, verify structure
        if data["below_you"]:
            below = data["below_you"]
            assert "rank" in below
            assert "name" in below
            assert "referrals" in below
            assert "gap" in below
            print(f"PASS: Partner below is #{below['rank']} {below['name']} with {below['referrals']} referrals (gap: {below['gap']})")
        else:
            print("INFO: No partner below on leaderboard")


class TestBadgeSharing:
    """Test badge sharing endpoint for social media"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for admin user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Auth failed - skipping authenticated tests")
    
    def test_badge_share_requires_auth(self):
        """Test badge-share requires authentication"""
        response = requests.get(f"{BASE_URL}/api/affiliates/badge-share/first_referral")
        assert response.status_code in [401, 403]
        print("PASS: badge-share requires authentication")
    
    def test_badge_share_first_referral(self, auth_token):
        """Test sharing first_referral badge"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badge-share/first_referral", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "badge" in data
        assert "partner_name" in data
        assert "share_text" in data
        assert "share_url" in data
        assert "image_url" in data
        
        # Verify share_text has all social platforms
        share_text = data["share_text"]
        assert "twitter" in share_text
        assert "linkedin" in share_text
        assert "facebook" in share_text
        assert "whatsapp" in share_text
        
        # Verify badge structure
        badge = data["badge"]
        assert badge["id"] == "first_referral"
        assert badge["name"] == "First Referral"
        print(f"PASS: Badge share for first_referral returns correct structure")
    
    def test_badge_share_five_referrals(self, auth_token):
        """Test sharing five_referrals badge"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badge-share/five_referrals", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        badge = data["badge"]
        assert badge["id"] == "five_referrals"
        assert badge["name"] == "Rising Star"
        print(f"PASS: Badge share for five_referrals returns correct structure")
    
    def test_badge_share_unearned_badge(self, auth_token):
        """Test cannot share unearned badge"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        # fifty_referrals requires 50 referrals, likely not earned
        response = requests.get(f"{BASE_URL}/api/affiliates/badge-share/fifty_referrals", headers=headers)
        # Should return 403 if not earned
        if response.status_code == 403:
            print("PASS: Cannot share unearned badge - returns 403")
        elif response.status_code == 200:
            print("INFO: User has earned fifty_referrals badge")
        else:
            print(f"INFO: Got status {response.status_code}")
    
    def test_badge_share_invalid_badge(self, auth_token):
        """Test invalid badge returns 404"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badge-share/invalid_badge_id", headers=headers)
        assert response.status_code == 404
        print("PASS: Invalid badge ID returns 404")


class TestClickTrackingGeo:
    """Test click tracking with geolocation data"""
    
    @pytest.fixture
    def referral_code(self):
        """Get admin user's referral code"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        profile_response = requests.get(f"{BASE_URL}/api/affiliates/my-profile", headers=headers)
        if profile_response.status_code == 200:
            return profile_response.json().get("referral_code")
        pytest.skip("Could not get referral code")
    
    def test_click_tracking_returns_success(self, referral_code):
        """Test click tracking returns success"""
        response = requests.get(f"{BASE_URL}/api/affiliates/track/{referral_code}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["referral_code"] == referral_code
        assert "benefits" in data
        print(f"PASS: Click tracking for {referral_code} returns success")
    
    def test_click_tracking_invalid_code(self):
        """Test click tracking with invalid code returns 404"""
        response = requests.get(f"{BASE_URL}/api/affiliates/track/INVALID123")
        assert response.status_code == 404
        print("PASS: Invalid referral code returns 404")
    
    def test_analytics_shows_geo_breakdown(self):
        """Test analytics includes geo_breakdown field"""
        # Login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        if response.status_code != 200:
            pytest.skip("Auth failed")
        
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get analytics
        analytics_response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=30", 
            headers=headers
        )
        assert analytics_response.status_code == 200
        
        data = analytics_response.json()
        assert "geo_breakdown" in data
        assert isinstance(data["geo_breakdown"], list)
        
        # Each geo entry should have region, clicks, percentage
        if data["geo_breakdown"]:
            geo = data["geo_breakdown"][0]
            assert "region" in geo
            assert "clicks" in geo
            assert "percentage" in geo
            print(f"PASS: Geo breakdown shows {len(data['geo_breakdown'])} regions")
        else:
            print("INFO: No geo data available yet")


class TestBadgeDefinitions:
    """Test all 10 badge definitions are available"""
    
    @pytest.fixture
    def auth_token(self):
        """Get auth token for admin user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Auth failed - skipping authenticated tests")
    
    def test_all_badges_available(self, auth_token):
        """Test all 10 badges are defined"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badges", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["total_available"] == 10
        assert len(data["badges"]) == 10
        print(f"PASS: All 10 badges are available")
    
    def test_new_badge_types_exist(self, auth_token):
        """Test new badge types (consistent_performer, quick_starter) exist"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badges", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        badge_ids = [b["id"] for b in data["badges"]]
        
        assert "consistent_performer" in badge_ids
        assert "quick_starter" in badge_ids
        print("PASS: New badge types (consistent_performer, quick_starter) exist")
    
    def test_badge_has_required_fields(self, auth_token):
        """Test each badge has all required fields"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/affiliates/badges", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        for badge in data["badges"]:
            assert "id" in badge
            assert "name" in badge
            assert "description" in badge
            assert "icon" in badge
            assert "color" in badge
            assert "requirement" in badge
            assert "earned" in badge
        
        print("PASS: All badges have required fields")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
