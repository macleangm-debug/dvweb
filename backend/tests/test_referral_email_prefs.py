"""
Tests for User Referral System and Email Preferences - Iteration 28
Tests: 
1. User Referral System APIs (separate from affiliate system)
2. Email Preferences APIs
3. Extracted pages loading (About, Projects, News)
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "admin@datavision.co.tz"
TEST_PASSWORD = "admin123"


class TestAuthentication:
    """Authentication tests to get token for subsequent tests"""
    
    def test_login_success(self):
        """Test login with admin credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        print(f"Login successful - User: {data['user'].get('name', 'Unknown')}")
        return data["access_token"]


class TestReferralSystem:
    """Tests for User Referral System APIs"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_my_referral_stats(self, auth_token):
        """Test GET /api/referrals/my-stats - Returns user's referral statistics"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/referrals/my-stats", headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "total_referrals" in data
        assert "successful_referrals" in data
        assert "pending_referrals" in data
        assert "total_credits_earned" in data
        assert "credits_available" in data
        assert "credits_used" in data
        
        # Verify data types
        assert isinstance(data["total_referrals"], int)
        assert isinstance(data["credits_available"], (int, float))
        
        print(f"Referral stats: Total={data['total_referrals']}, Credits={data['credits_available']}")
    
    def test_get_my_referral_code(self, auth_token):
        """Test GET /api/referrals/my-code - Returns user's referral code and links"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/referrals/my-code", headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "referral_code" in data
        assert "referral_links" in data
        assert "rewards" in data
        
        # Verify referral code format (8 character alphanumeric)
        assert len(data["referral_code"]) == 8
        
        # Verify links exist
        links = data["referral_links"]
        assert "main" in links
        assert "signup" in links
        assert data["referral_code"] in links["main"]
        
        # Verify rewards info
        rewards = data["rewards"]
        assert "signup_bonus" in rewards
        assert "purchase_bonus" in rewards
        assert "friend_gets" in rewards
        assert rewards["signup_bonus"] == 10.0
        assert rewards["purchase_bonus"] == 25.0
        assert rewards["friend_gets"] == 5.0
        
        print(f"Referral code: {data['referral_code']}")
        print(f"Rewards: Signup={rewards['signup_bonus']}, Purchase={rewards['purchase_bonus']}")
    
    def test_get_my_invites(self, auth_token):
        """Test GET /api/referrals/my-invites - Returns list of sent invitations"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/referrals/my-invites", headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "invites" in data
        assert "total" in data
        assert isinstance(data["invites"], list)
        
        print(f"Total invites: {data['total']}")
    
    def test_get_credit_history(self, auth_token):
        """Test GET /api/referrals/credits/history - Returns credit transaction history"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/referrals/credits/history", headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "transactions" in data
        assert "current_balance" in data
        assert isinstance(data["transactions"], list)
        
        print(f"Credit history: {len(data['transactions'])} transactions, balance={data['current_balance']}")
    
    def test_send_referral_invite_validation(self, auth_token):
        """Test POST /api/referrals/invite - Validate email format"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Test with invalid email
        response = requests.post(f"{BASE_URL}/api/referrals/invite", 
            json={"email": "invalid-email"},
            headers=headers
        )
        
        # Should return 422 validation error
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("Email validation working correctly")
    
    def test_send_referral_invite_existing_user(self, auth_token):
        """Test POST /api/referrals/invite - Should reject if user already exists"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Try to invite existing admin user
        response = requests.post(f"{BASE_URL}/api/referrals/invite", 
            json={"email": "admin@datavision.co.tz", "name": "Admin"},
            headers=headers
        )
        
        # Should return 400 - user already exists
        assert response.status_code == 400, f"Expected 400 for existing user, got {response.status_code}: {response.text}"
        data = response.json()
        assert "already" in data.get("detail", "").lower()
        print("Existing user check working correctly")
    
    def test_redeem_credits_insufficient(self, auth_token):
        """Test POST /api/referrals/credits/redeem - Should fail if insufficient credits"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Try to redeem more credits than available
        response = requests.post(f"{BASE_URL}/api/referrals/credits/redeem", 
            json={"amount": 99999, "product": "fieldforce"},
            headers=headers
        )
        
        # Should return 400 - insufficient credits
        assert response.status_code == 400, f"Expected 400 for insufficient credits, got {response.status_code}"
        print("Insufficient credits check working correctly")
    
    def test_redeem_credits_invalid_product(self, auth_token):
        """Test POST /api/referrals/credits/redeem - Should fail for invalid product"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.post(f"{BASE_URL}/api/referrals/credits/redeem", 
            json={"amount": 5, "product": "invalid-product"},
            headers=headers
        )
        
        assert response.status_code == 400, f"Expected 400 for invalid product, got {response.status_code}"
        print("Invalid product check working correctly")


class TestEmailPreferences:
    """Tests for Email Preferences APIs"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get auth token for tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_email_preferences(self, auth_token):
        """Test GET /api/email-preferences/ - Returns user's email preferences"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/email-preferences/", headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "preferences" in data
        assert "categories" in data
        assert "frequencies" in data
        assert "mandatory_categories" in data
        
        # Verify preferences object
        prefs = data["preferences"]
        assert "user_id" in prefs
        assert "preferences" in prefs
        
        # Verify frequencies list
        freqs = data["frequencies"]
        assert "immediate" in freqs or "immediately" in freqs
        assert "never" in freqs
        
        # Verify mandatory categories
        mandatory = data["mandatory_categories"]
        assert "security" in mandatory
        assert "billing" in mandatory
        
        print(f"Email preferences loaded - Categories: {len(data['categories'])}")
    
    def test_update_category_preference(self, auth_token):
        """Test PUT /api/email-preferences/category - Update single category"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Update product_updates to weekly
        response = requests.put(f"{BASE_URL}/api/email-preferences/category", 
            json={"category": "product_updates", "frequency": "weekly"},
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert data["category"] == "product_updates"
        assert data["frequency"] == "weekly"
        print("Category preference update successful")
    
    def test_update_mandatory_category_fails(self, auth_token):
        """Test PUT /api/email-preferences/category - Cannot disable mandatory categories"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Try to disable security category
        response = requests.put(f"{BASE_URL}/api/email-preferences/category", 
            json={"category": "security", "frequency": "never"},
            headers=headers
        )
        
        assert response.status_code == 400, f"Expected 400 for mandatory category, got {response.status_code}"
        print("Mandatory category protection working correctly")
    
    def test_invalid_category(self, auth_token):
        """Test PUT /api/email-preferences/category - Invalid category handling"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.put(f"{BASE_URL}/api/email-preferences/category", 
            json={"category": "invalid_category", "frequency": "weekly"},
            headers=headers
        )
        
        assert response.status_code == 400, f"Expected 400 for invalid category, got {response.status_code}"
        print("Invalid category handling working correctly")
    
    def test_bulk_update_preferences(self, auth_token):
        """Test PUT /api/email-preferences/bulk - Update multiple preferences"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.put(f"{BASE_URL}/api/email-preferences/bulk", 
            json={
                "preferences": {
                    "tips_tutorials": "monthly",
                    "company_news": "weekly"
                }
            },
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert "updated_count" in data
        print(f"Bulk update: {data['updated_count']} preferences updated")
    
    def test_unsubscribe_all(self, auth_token):
        """Test POST /api/email-preferences/unsubscribe-all"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.post(f"{BASE_URL}/api/email-preferences/unsubscribe-all", 
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert "unsubscribed" in data.get("message", "").lower() or "message" in data
        print("Unsubscribe all successful")
    
    def test_resubscribe(self, auth_token):
        """Test POST /api/email-preferences/resubscribe"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.post(f"{BASE_URL}/api/email-preferences/resubscribe", 
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert "resubscribed" in data.get("message", "").lower() or "message" in data
        print("Resubscribe successful")
    
    def test_reset_to_defaults(self, auth_token):
        """Test GET /api/email-preferences/reset-to-defaults"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        response = requests.get(f"{BASE_URL}/api/email-preferences/reset-to-defaults", 
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        assert "preferences" in data
        assert "tier" in data
        print(f"Reset to {data['tier']} tier defaults")


class TestExtractedPages:
    """Tests for extracted page components (About, Projects, News)"""
    
    def test_about_page_api(self):
        """Test that /api/team endpoint works for AboutPage"""
        response = requests.get(f"{BASE_URL}/api/team")
        assert response.status_code == 200, f"Team API failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"Team API: {len(data)} members")
    
    def test_projects_page_api(self):
        """Test that /api/projects endpoint works for ProjectsPage"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200, f"Projects API failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"Projects API: {len(data)} projects")
    
    def test_news_page_api(self):
        """Test that /api/news endpoint works for NewsPage"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200, f"News API failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"News API: {len(data)} articles")


class TestReferralUnauthorized:
    """Tests for unauthorized access to referral endpoints"""
    
    def test_my_stats_unauthorized(self):
        """Test GET /api/referrals/my-stats without token"""
        response = requests.get(f"{BASE_URL}/api/referrals/my-stats")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("Unauthorized access blocked for my-stats")
    
    def test_my_code_unauthorized(self):
        """Test GET /api/referrals/my-code without token"""
        response = requests.get(f"{BASE_URL}/api/referrals/my-code")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("Unauthorized access blocked for my-code")
    
    def test_email_prefs_unauthorized(self):
        """Test GET /api/email-preferences/ without token"""
        response = requests.get(f"{BASE_URL}/api/email-preferences/")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("Unauthorized access blocked for email-preferences")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
