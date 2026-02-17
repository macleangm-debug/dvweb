"""
Test Monthly Rewards System - Backend API Tests
Tests the new monthly rewards endpoints for leaderboard winners:
- Process monthly rewards endpoint (admin)
- Monthly rewards history endpoint (admin)
- Previous winners endpoint (public)
- Featured partner endpoint (public)
- Email templates for leaderboard winners
"""

import pytest
import requests
import os
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "admin@datavision.co.tz"
ADMIN_PASSWORD = "admin123"


class TestSetup:
    """Setup tests - verify connectivity and admin login"""
    
    def test_api_connectivity(self):
        """Verify API is accessible"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"API health check failed: {response.text}"
        print(f"API health check: PASSED - Status {response.status_code}")
    
    def test_admin_login(self):
        """Verify admin login works"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access token in response"
        print(f"Admin login: PASSED - Token obtained")


@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip(f"Admin login failed: {response.text}")
    return response.json().get("access_token")


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    """Get headers with admin token"""
    return {"Authorization": f"Bearer {admin_token}"}


class TestPreviousWinnersPublic:
    """Test /api/affiliates/leaderboard/previous-winners - PUBLIC endpoint"""
    
    def test_previous_winners_no_auth_required(self):
        """Previous winners endpoint should be public (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard/previous-winners")
        assert response.status_code == 200, f"Previous winners failed: {response.status_code} - {response.text}"
        print(f"Previous winners (no auth): PASSED - Status {response.status_code}")
    
    def test_previous_winners_response_structure(self):
        """Verify response structure contains history array"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard/previous-winners?months=3")
        assert response.status_code == 200
        data = response.json()
        assert "history" in data, "Response should contain 'history' field"
        assert isinstance(data["history"], list), "history should be a list"
        print(f"Previous winners structure: PASSED - history is list with {len(data['history'])} items")
    
    def test_previous_winners_months_parameter(self):
        """Verify months query parameter is accepted"""
        response = requests.get(f"{BASE_URL}/api/affiliates/leaderboard/previous-winners?months=6")
        assert response.status_code == 200
        data = response.json()
        assert "history" in data
        print(f"Previous winners months param: PASSED")


class TestFeaturedPartnerPublic:
    """Test /api/affiliates/featured-partner - PUBLIC endpoint"""
    
    def test_featured_partner_no_auth_required(self):
        """Featured partner endpoint should be public (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/affiliates/featured-partner")
        assert response.status_code == 200, f"Featured partner failed: {response.status_code} - {response.text}"
        print(f"Featured partner (no auth): PASSED - Status {response.status_code}")
    
    def test_featured_partner_response_structure(self):
        """Verify response structure contains featured_partner field"""
        response = requests.get(f"{BASE_URL}/api/affiliates/featured-partner")
        assert response.status_code == 200
        data = response.json()
        assert "featured_partner" in data, "Response should contain 'featured_partner' field"
        # Can be null if no featured partner exists yet
        if data["featured_partner"]:
            partner = data["featured_partner"]
            assert "id" in partner
            assert "name" in partner
            assert "tier" in partner
            print(f"Featured partner: PASSED - Partner: {partner['name']}")
        else:
            print(f"Featured partner: PASSED - No featured partner yet (expected before rewards processed)")


class TestMonthlyRewardsAdminEndpoints:
    """Test admin-only monthly rewards endpoints"""
    
    def test_process_rewards_requires_auth(self):
        """Process rewards should require authentication"""
        response = requests.post(f"{BASE_URL}/api/affiliates/admin/process-monthly-rewards")
        assert response.status_code in [401, 403], f"Should require auth, got: {response.status_code}"
        print(f"Process rewards auth check: PASSED - Returns {response.status_code} without auth")
    
    def test_process_rewards_dry_run(self, admin_headers):
        """Test process monthly rewards with dry_run=True (default)"""
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/process-monthly-rewards?dry_run=true",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Process rewards dry run failed: {response.status_code} - {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "month" in data, "Response should contain 'month'"
        assert "dry_run" in data, "Response should contain 'dry_run'"
        assert data["dry_run"] == True, "dry_run should be True"
        assert "winners" in data, "Response should contain 'winners'"
        assert "reward_config" in data, "Response should contain 'reward_config'"
        
        print(f"Process rewards dry run: PASSED")
        print(f"  Month: {data.get('month')}")
        print(f"  Winners found: {len(data.get('winners', []))}")
        print(f"  Message: {data.get('message')}")
    
    def test_process_rewards_response_includes_config(self, admin_headers):
        """Verify reward configuration is returned"""
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/process-monthly-rewards?dry_run=true",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        reward_config = data.get("reward_config", {})
        assert 1 in reward_config or "1" in reward_config, "Should have 1st place config"
        
        # Get 1st place config
        first_place = reward_config.get(1) or reward_config.get("1")
        if first_place:
            assert "credits" in first_place
            assert "tier_upgrade" in first_place
            assert "featured" in first_place
            assert "description" in first_place
            print(f"Reward config 1st place: {first_place['description']}")
        
        print(f"Process rewards config: PASSED")
    
    def test_process_rewards_specific_month(self, admin_headers):
        """Test processing rewards for a specific month"""
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/process-monthly-rewards?month=2025-12&dry_run=true",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Process rewards specific month failed: {response.status_code}"
        data = response.json()
        assert "December 2025" in data.get("month", ""), f"Month should be December 2025, got: {data.get('month')}"
        print(f"Process rewards specific month: PASSED - {data.get('month')}")
    
    def test_process_rewards_invalid_month_format(self, admin_headers):
        """Test error handling for invalid month format"""
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/process-monthly-rewards?month=invalid&dry_run=true",
            headers=admin_headers
        )
        assert response.status_code == 400, f"Should return 400 for invalid month, got: {response.status_code}"
        print(f"Process rewards invalid month: PASSED - Returns 400")
    
    def test_rewards_history_requires_auth(self):
        """Monthly rewards history should require admin auth"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/monthly-rewards-history")
        assert response.status_code in [401, 403], f"Should require auth, got: {response.status_code}"
        print(f"Rewards history auth check: PASSED - Returns {response.status_code} without auth")
    
    def test_rewards_history_response(self, admin_headers):
        """Test monthly rewards history endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/monthly-rewards-history",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Rewards history failed: {response.status_code} - {response.text}"
        data = response.json()
        
        assert "history" in data, "Response should contain 'history'"
        assert "total_months_processed" in data, "Response should contain 'total_months_processed'"
        assert "reward_config" in data, "Response should contain 'reward_config'"
        
        print(f"Rewards history: PASSED")
        print(f"  Total months processed: {data.get('total_months_processed', 0)}")
        print(f"  History entries: {len(data.get('history', []))}")


class TestRewardConfiguration:
    """Test reward configuration values"""
    
    def test_reward_values(self, admin_headers):
        """Verify reward configuration has correct values"""
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/process-monthly-rewards?dry_run=true",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        config = data.get("reward_config", {})
        
        # 1st place: $100 + tier upgrade + featured
        first = config.get(1) or config.get("1")
        if first:
            assert first["credits"] == 100.0, f"1st place credits should be 100, got {first['credits']}"
            assert first["tier_upgrade"] == True, "1st place should have tier upgrade"
            assert first["featured"] == True, "1st place should be featured"
            print(f"1st place rewards: $100 + tier upgrade + featured - VERIFIED")
        
        # 2nd place: $50
        second = config.get(2) or config.get("2")
        if second:
            assert second["credits"] == 50.0, f"2nd place credits should be 50, got {second['credits']}"
            assert second["tier_upgrade"] == False, "2nd place should NOT have tier upgrade"
            print(f"2nd place rewards: $50 - VERIFIED")
        
        # 3rd place: $25
        third = config.get(3) or config.get("3")
        if third:
            assert third["credits"] == 25.0, f"3rd place credits should be 25, got {third['credits']}"
            assert third["tier_upgrade"] == False, "3rd place should NOT have tier upgrade"
            print(f"3rd place rewards: $25 - VERIFIED")


class TestEmailServiceTemplates:
    """Verify email templates exist in email service - code review tests"""
    
    def test_email_service_has_leaderboard_winner_method(self):
        """Verify email service has send_leaderboard_winner_email method"""
        # This is a code verification test - we check the file exists and has the method
        import subprocess
        result = subprocess.run(
            ["grep", "-c", "send_leaderboard_winner_email", "/app/backend/services/email_service.py"],
            capture_output=True, text=True
        )
        count = int(result.stdout.strip()) if result.returncode == 0 else 0
        assert count > 0, "email_service.py should have send_leaderboard_winner_email method"
        print(f"send_leaderboard_winner_email method: FOUND ({count} occurrences)")
    
    def test_email_service_has_featured_partner_method(self):
        """Verify email service has send_featured_partner_email method"""
        import subprocess
        result = subprocess.run(
            ["grep", "-c", "send_featured_partner_email", "/app/backend/services/email_service.py"],
            capture_output=True, text=True
        )
        count = int(result.stdout.strip()) if result.returncode == 0 else 0
        assert count > 0, "email_service.py should have send_featured_partner_email method"
        print(f"send_featured_partner_email method: FOUND ({count} occurrences)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
