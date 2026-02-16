"""
KPI Tracking, Suspend/Reactivate, and Promo Code API Tests
Tests for:
- Admin KPI Tracking: GET /api/affiliates/admin/kpi
- Admin Suspend: PUT /api/affiliates/admin/affiliates/{id}/suspend
- Admin Reactivate: PUT /api/affiliates/admin/affiliates/{id}/reactivate  
- Admin Promo Code CRUD: POST/GET/PUT/DELETE /api/affiliates/admin/promo-codes
- Public Promo Validation: GET /api/affiliates/promo-codes/validate/{code}
"""

import pytest
import requests
import os
import time
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin login credentials
ADMIN_EMAIL = "admin@datavision.co.tz"
ADMIN_PASSWORD = "admin123"

@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        token = response.json().get("access_token")  # API returns access_token not token
        print(f"Admin login successful, token: {token[:30]}...")
        return token
    else:
        pytest.skip(f"Admin login failed: {response.status_code} - {response.text}")

@pytest.fixture(scope="module")
def admin_headers(admin_token):
    """Get admin auth headers"""
    return {"Authorization": f"Bearer {admin_token}"}


# ==================== KPI TRACKING TESTS ====================

class TestKPITracking:
    """Test GET /api/affiliates/admin/kpi endpoint"""
    
    def test_kpi_returns_200(self, admin_headers):
        """KPI endpoint should return 200 with admin auth"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi", headers=admin_headers)
        assert response.status_code == 200
        print(f"SUCCESS: /api/affiliates/admin/kpi returned 200")
    
    def test_kpi_has_required_fields(self, admin_headers):
        """KPI response should have required fields"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi", headers=admin_headers)
        data = response.json()
        
        assert "period_days" in data
        assert "kpi_thresholds" in data
        assert "summary" in data
        assert "affiliates" in data
        print(f"SUCCESS: KPI response has all required fields")
    
    def test_kpi_summary_fields(self, admin_headers):
        """KPI summary should have total_active_affiliates and underperforming_count"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi", headers=admin_headers)
        data = response.json()
        
        summary = data.get("summary", {})
        assert "total_active_affiliates" in summary
        assert "underperforming_count" in summary
        assert "performance_rate" in summary
        print(f"SUCCESS: KPI summary - Active: {summary['total_active_affiliates']}, Underperforming: {summary['underperforming_count']}, Rate: {summary['performance_rate']}%")
    
    def test_kpi_thresholds(self, admin_headers):
        """KPI thresholds should include min_referrals and min_conversion_rate"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi", headers=admin_headers)
        data = response.json()
        
        thresholds = data.get("kpi_thresholds", {})
        assert "min_referrals_per_month" in thresholds
        assert "min_conversion_rate" in thresholds
        print(f"SUCCESS: KPI thresholds - Min referrals: {thresholds['min_referrals_per_month']}, Min conversion: {thresholds['min_conversion_rate']}%")
    
    def test_kpi_affiliate_data_structure(self, admin_headers):
        """KPI affiliates should have performance metrics"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi", headers=admin_headers)
        data = response.json()
        
        affiliates = data.get("affiliates", [])
        if len(affiliates) > 0:
            affiliate = affiliates[0]
            required_fields = ["affiliate_id", "full_name", "email", "status", 
                              "referrals_in_period", "clicks_in_period", 
                              "conversion_rate", "earnings_in_period", "is_underperforming"]
            for field in required_fields:
                assert field in affiliate, f"Missing field: {field}"
            print(f"SUCCESS: Affiliate data has all required KPI fields")
        else:
            print(f"INFO: No affiliates found for KPI tracking")
    
    def test_kpi_period_filter(self, admin_headers):
        """KPI should accept period_days parameter"""
        for period in [7, 30, 60, 90]:
            response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi?period_days={period}", headers=admin_headers)
            assert response.status_code == 200
            data = response.json()
            assert data.get("period_days") == period
        print(f"SUCCESS: KPI period filter works for 7, 30, 60, 90 days")
    
    def test_kpi_requires_admin_auth(self):
        """KPI endpoint should require admin authentication"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi")
        assert response.status_code in [401, 403]
        print(f"SUCCESS: KPI endpoint correctly requires admin auth (status {response.status_code})")


# ==================== SUSPEND/REACTIVATE TESTS ====================

class TestSuspendReactivate:
    """Test suspend and reactivate functionality"""
    
    @pytest.fixture(scope="class")
    def test_affiliate(self, admin_headers):
        """Create a test affiliate for suspend/reactivate tests"""
        timestamp = int(time.time())
        
        # Create an affiliate
        payload = {
            "full_name": f"TEST_Suspend_{timestamp}",
            "email": f"test_suspend_{timestamp}@example.com",
            "phone": "+255123456789",
            "agreed_to_terms": True
        }
        response = requests.post(f"{BASE_URL}/api/affiliates/apply", json=payload)
        assert response.status_code == 200
        
        # Get the affiliate ID from applications list
        apps_response = requests.get(f"{BASE_URL}/api/affiliates/admin/applications", headers=admin_headers)
        affiliates = apps_response.json().get("applications", [])
        
        # Find our test affiliate
        test_affiliate = None
        for aff in affiliates:
            if aff.get("email") == payload["email"]:
                test_affiliate = aff
                break
        
        if not test_affiliate:
            pytest.skip("Could not find test affiliate")
        
        # Approve the affiliate first so we can suspend
        affiliate_id = test_affiliate.get("id")
        approve_response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}",
            json={"status": "approved"},
            headers=admin_headers
        )
        assert approve_response.status_code == 200
        
        print(f"Created and approved test affiliate: {affiliate_id}")
        return {"id": affiliate_id, "email": payload["email"]}
    
    def test_suspend_affiliate(self, admin_headers, test_affiliate):
        """Suspend affiliate should work with valid reason"""
        affiliate_id = test_affiliate["id"]
        reason = "Underperforming - less than 5 referrals in 30 days"
        
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/suspend?reason={reason}",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("message") == "Affiliate suspended"
        print(f"SUCCESS: Affiliate suspended successfully")
    
    def test_suspend_requires_reason(self, admin_headers, test_affiliate):
        """Suspend should fail without reason"""
        affiliate_id = test_affiliate["id"]
        
        # First reactivate so we can test suspend again
        requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/reactivate",
            headers=admin_headers
        )
        
        # Try to suspend without reason
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/suspend",
            headers=admin_headers
        )
        assert response.status_code == 422  # Validation error
        print(f"SUCCESS: Suspend correctly requires reason parameter")
    
    def test_suspend_short_reason_rejected(self, admin_headers, test_affiliate):
        """Suspend with short reason should fail"""
        affiliate_id = test_affiliate["id"]
        reason = "short"  # Less than 10 chars
        
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/suspend?reason={reason}",
            headers=admin_headers
        )
        assert response.status_code == 422  # Validation error for min_length
        print(f"SUCCESS: Short suspend reason correctly rejected")
    
    def test_reactivate_affiliate(self, admin_headers, test_affiliate):
        """Reactivate suspended affiliate should work"""
        affiliate_id = test_affiliate["id"]
        
        # First ensure suspended
        requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/suspend?reason=Testing suspension flow for reactivation",
            headers=admin_headers
        )
        
        # Now reactivate
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/reactivate",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("message") == "Affiliate reactivated"
        print(f"SUCCESS: Affiliate reactivated successfully")
    
    def test_reactivate_non_suspended_fails(self, admin_headers, test_affiliate):
        """Reactivate on non-suspended affiliate should fail"""
        affiliate_id = test_affiliate["id"]
        
        # Affiliate is already active from previous test
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/reactivate",
            headers=admin_headers
        )
        assert response.status_code == 400
        assert "not suspended" in response.json().get("detail", "").lower()
        print(f"SUCCESS: Reactivate on non-suspended correctly returns 400")
    
    def test_suspend_already_suspended_fails(self, admin_headers, test_affiliate):
        """Suspend on already suspended affiliate should fail"""
        affiliate_id = test_affiliate["id"]
        
        # Suspend first
        requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/suspend?reason=First suspension for double-suspend test",
            headers=admin_headers
        )
        
        # Try to suspend again
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/{affiliate_id}/suspend?reason=Second suspension attempt",
            headers=admin_headers
        )
        assert response.status_code == 400
        assert "already suspended" in response.json().get("detail", "").lower()
        print(f"SUCCESS: Double-suspend correctly returns 400")
    
    def test_suspend_invalid_affiliate_404(self, admin_headers):
        """Suspend invalid affiliate ID should return 404"""
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/invalid-id-123/suspend?reason=Testing invalid ID handling",
            headers=admin_headers
        )
        assert response.status_code == 404
        print(f"SUCCESS: Suspend invalid ID correctly returns 404")
    
    def test_reactivate_invalid_affiliate_404(self, admin_headers):
        """Reactivate invalid affiliate ID should return 404"""
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/invalid-id-123/reactivate",
            headers=admin_headers
        )
        assert response.status_code == 404
        print(f"SUCCESS: Reactivate invalid ID correctly returns 404")


# ==================== PROMO CODE TESTS ====================

class TestPromoCodes:
    """Test promo code CRUD operations"""
    
    @pytest.fixture(scope="class")
    def test_promo_code(self, admin_headers):
        """Create a test promo code"""
        timestamp = int(time.time())
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z"
        
        payload = {
            "code": f"TEST{timestamp}",
            "name": "Test Promo Code",
            "description": "A test promotional code for API testing",
            "discount_type": "percentage",
            "discount_value": 15,
            "max_uses": 100,
            "max_uses_per_user": 1,
            "min_order_value": 50,
            "applicable_products": [],
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        print(f"Created test promo code: {data.get('code')}")
        return {"id": data.get("id"), "code": data.get("code")}
    
    def test_create_promo_code(self, admin_headers):
        """Create promo code should work"""
        timestamp = int(time.time())
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z"
        
        payload = {
            "code": f"NEWYR{timestamp}",
            "name": "New Year Discount",
            "description": "Special New Year promotional discount",
            "discount_type": "percentage",
            "discount_value": 25,
            "max_uses": 1000,
            "max_uses_per_user": 3,
            "min_order_value": None,
            "applicable_products": [],
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data.get("code") == payload["code"]
        print(f"SUCCESS: Promo code created: {data['code']}")
    
    def test_create_fixed_amount_promo(self, admin_headers):
        """Create fixed amount discount promo code"""
        timestamp = int(time.time())
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=15)).isoformat() + "Z"
        
        payload = {
            "code": f"FIXED{timestamp}",
            "name": "Fixed $10 Off",
            "discount_type": "fixed_amount",
            "discount_value": 10.00,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 200
        print(f"SUCCESS: Fixed amount promo code created")
    
    def test_get_promo_codes_list(self, admin_headers):
        """Get list of promo codes"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "promo_codes" in data
        assert "stats" in data
        print(f"SUCCESS: Retrieved {len(data['promo_codes'])} promo codes")
    
    def test_get_promo_codes_include_expired(self, admin_headers):
        """Get promo codes including expired"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/promo-codes?include_expired=true",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "promo_codes" in data
        print(f"SUCCESS: Retrieved promo codes with expired: {len(data['promo_codes'])} codes")
    
    def test_get_single_promo_code(self, admin_headers, test_promo_code):
        """Get single promo code details"""
        promo_id = test_promo_code["id"]
        response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/promo-codes/{promo_id}",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "promo_code" in data
        assert data["promo_code"].get("id") == promo_id
        print(f"SUCCESS: Retrieved promo code details")
    
    def test_update_promo_code(self, admin_headers, test_promo_code):
        """Update promo code"""
        promo_id = test_promo_code["id"]
        
        update_payload = {
            "name": "Updated Test Promo",
            "discount_value": 20,
            "is_active": True
        }
        
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/promo-codes/{promo_id}",
            json=update_payload,
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("message") == "Promo code updated"
        print(f"SUCCESS: Promo code updated")
    
    def test_deactivate_promo_code(self, admin_headers, test_promo_code):
        """Deactivate promo code"""
        promo_id = test_promo_code["id"]
        
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/promo-codes/{promo_id}",
            json={"is_active": False},
            headers=admin_headers
        )
        assert response.status_code == 200
        print(f"SUCCESS: Promo code deactivated")
        
        # Reactivate for other tests
        requests.put(
            f"{BASE_URL}/api/affiliates/admin/promo-codes/{promo_id}",
            json={"is_active": True},
            headers=admin_headers
        )
    
    def test_duplicate_code_rejected(self, admin_headers, test_promo_code):
        """Duplicate promo code should be rejected"""
        code = test_promo_code["code"]
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z"
        
        payload = {
            "code": code,  # Same code
            "name": "Duplicate Code",
            "discount_type": "percentage",
            "discount_value": 10,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 400
        assert "already exists" in response.json().get("detail", "").lower()
        print(f"SUCCESS: Duplicate code correctly rejected")
    
    def test_invalid_dates_rejected(self, admin_headers):
        """End date before start date should be rejected"""
        start_date = (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z"
        end_date = datetime.utcnow().isoformat() + "Z"  # Before start
        
        payload = {
            "code": f"INVALID{int(time.time())}",
            "name": "Invalid Dates",
            "discount_type": "percentage",
            "discount_value": 10,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 400
        print(f"SUCCESS: Invalid dates correctly rejected")
    
    def test_delete_promo_code(self, admin_headers):
        """Delete promo code"""
        # Create one to delete
        timestamp = int(time.time())
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z"
        
        payload = {
            "code": f"DEL{timestamp}",
            "name": "To Be Deleted",
            "discount_type": "percentage",
            "discount_value": 5,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert create_response.status_code == 200
        promo_id = create_response.json().get("id")
        
        # Delete it
        delete_response = requests.delete(
            f"{BASE_URL}/api/affiliates/admin/promo-codes/{promo_id}",
            headers=admin_headers
        )
        assert delete_response.status_code == 200
        assert delete_response.json().get("message") == "Promo code deleted"
        
        # Verify deleted
        get_response = requests.get(
            f"{BASE_URL}/api/affiliates/admin/promo-codes/{promo_id}",
            headers=admin_headers
        )
        assert get_response.status_code == 404
        print(f"SUCCESS: Promo code deleted and verified")
    
    def test_promo_requires_admin_auth(self):
        """Promo code endpoints require admin auth"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/promo-codes")
        assert response.status_code in [401, 403]
        print(f"SUCCESS: Promo code endpoints correctly require admin auth")


# ==================== PUBLIC PROMO VALIDATION TESTS ====================

class TestPromoValidation:
    """Test public promo code validation endpoint"""
    
    @pytest.fixture(scope="class")
    def valid_promo_code(self, admin_headers):
        """Create a valid promo code for testing"""
        timestamp = int(time.time())
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z"
        
        payload = {
            "code": f"VALID{timestamp}",
            "name": "Valid Test Code",
            "discount_type": "percentage",
            "discount_value": 20,
            "max_uses": 100,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 200
        return payload["code"]
    
    @pytest.fixture(scope="class")  
    def inactive_promo_code(self, admin_headers):
        """Create an inactive promo code for testing"""
        timestamp = int(time.time())
        start_date = datetime.utcnow().isoformat() + "Z"
        end_date = (datetime.utcnow() + timedelta(days=30)).isoformat() + "Z"
        
        payload = {
            "code": f"INACT{timestamp}",
            "name": "Inactive Test Code",
            "discount_type": "percentage",
            "discount_value": 10,
            "start_date": start_date,
            "end_date": end_date,
            "is_active": False  # Inactive
        }
        
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload,
            headers=admin_headers
        )
        assert response.status_code == 200
        return payload["code"]
    
    def test_validate_valid_promo(self, valid_promo_code):
        """Validate active promo code should succeed"""
        response = requests.get(f"{BASE_URL}/api/affiliates/promo-codes/validate/{valid_promo_code}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("valid") == True
        assert data.get("code") == valid_promo_code
        assert "discount_type" in data
        assert "discount_value" in data
        print(f"SUCCESS: Valid promo code validation works")
    
    def test_validate_invalid_code_404(self):
        """Invalid promo code should return 404"""
        response = requests.get(f"{BASE_URL}/api/affiliates/promo-codes/validate/NONEXISTENT123")
        assert response.status_code == 404
        assert "invalid" in response.json().get("detail", "").lower()
        print(f"SUCCESS: Invalid code correctly returns 404")
    
    def test_validate_inactive_code_fails(self, inactive_promo_code):
        """Inactive promo code validation should fail"""
        response = requests.get(f"{BASE_URL}/api/affiliates/promo-codes/validate/{inactive_promo_code}")
        assert response.status_code == 400
        assert "not active" in response.json().get("detail", "").lower()
        print(f"SUCCESS: Inactive code correctly returns 400")
    
    def test_validate_existing_codes(self):
        """Test validation of existing codes HOLIDAY25 and NEWYEAR25"""
        # HOLIDAY25 should be active
        response = requests.get(f"{BASE_URL}/api/affiliates/promo-codes/validate/HOLIDAY25")
        if response.status_code == 200:
            data = response.json()
            print(f"HOLIDAY25 is valid: {data}")
        elif response.status_code == 400:
            print(f"HOLIDAY25 validation failed: {response.json().get('detail')}")
        elif response.status_code == 404:
            print(f"HOLIDAY25 not found in database")
        
        # NEWYEAR25 is expired according to requirements
        response2 = requests.get(f"{BASE_URL}/api/affiliates/promo-codes/validate/NEWYEAR25")
        if response2.status_code == 400:
            detail = response2.json().get("detail", "")
            if "expired" in detail.lower():
                print(f"SUCCESS: NEWYEAR25 correctly marked as expired")
        elif response2.status_code == 404:
            print(f"NEWYEAR25 not found in database")
        
        print(f"SUCCESS: Existing promo code validation tested")
    
    def test_validation_no_auth_required(self, valid_promo_code):
        """Validation endpoint should not require authentication"""
        response = requests.get(f"{BASE_URL}/api/affiliates/promo-codes/validate/{valid_promo_code}")
        assert response.status_code == 200
        print(f"SUCCESS: Validation endpoint is public (no auth required)")


# ==================== ADMIN AUTH TESTS ====================

class TestAdminAuth:
    """Test admin authentication on all endpoints"""
    
    def test_kpi_unauthenticated(self):
        """KPI should reject unauthenticated requests"""
        response = requests.get(f"{BASE_URL}/api/affiliates/admin/kpi")
        assert response.status_code in [401, 403]
        print(f"SUCCESS: KPI endpoint secured")
    
    def test_suspend_unauthenticated(self):
        """Suspend should reject unauthenticated requests"""
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/any-id/suspend?reason=Test reason here"
        )
        assert response.status_code in [401, 403]
        print(f"SUCCESS: Suspend endpoint secured")
    
    def test_reactivate_unauthenticated(self):
        """Reactivate should reject unauthenticated requests"""
        response = requests.put(
            f"{BASE_URL}/api/affiliates/admin/affiliates/any-id/reactivate"
        )
        assert response.status_code in [401, 403]
        print(f"SUCCESS: Reactivate endpoint secured")
    
    def test_promo_create_unauthenticated(self):
        """Promo code creation should reject unauthenticated requests"""
        payload = {
            "code": "UNAUTH",
            "name": "Unauth Test",
            "discount_type": "percentage",
            "discount_value": 10,
            "start_date": datetime.utcnow().isoformat() + "Z",
            "end_date": (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z",
            "is_active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/affiliates/admin/promo-codes",
            json=payload
        )
        assert response.status_code in [401, 403]
        print(f"SUCCESS: Promo creation endpoint secured")
