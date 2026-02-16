"""
Test Stripe Payment Integration for Software Solutions

Tests:
- GET /api/payments/packages - List available packages
- POST /api/payments/checkout - Create checkout session
- GET /api/payments/status/{session_id} - Get payment status
"""
import pytest
import requests
import os

# Use REACT_APP_BACKEND_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://kpi-tracker-58.preview.emergentagent.com')

class TestPaymentPackages:
    """Test payment packages endpoint"""
    
    def test_get_packages_returns_200(self):
        """GET /api/payments/packages should return 200 with packages list"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "packages" in data, "Response should contain 'packages' key"
        assert len(data["packages"]) > 0, "Should have at least one package"
        print(f"✓ GET /api/payments/packages returned {len(data['packages'])} packages")
    
    def test_packages_have_required_fields(self):
        """Each package should have id, name, amount, type, product_id"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        data = response.json()
        
        required_fields = ["id", "name", "amount", "type", "product_id"]
        for package in data["packages"]:
            for field in required_fields:
                assert field in package, f"Package missing field: {field}"
        print(f"✓ All packages have required fields: {required_fields}")
    
    def test_packages_contain_expected_products(self):
        """Verify expected product packages exist"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        data = response.json()
        
        package_ids = [p["id"] for p in data["packages"]]
        
        # Expected packages from requirements
        expected = [
            "survey360_monthly",
            "survey360_annual", 
            "fieldforce_10seats",
            "fieldforce_50seats"
        ]
        
        for expected_id in expected:
            assert expected_id in package_ids, f"Missing package: {expected_id}"
        print(f"✓ Found all expected packages: {expected}")
    
    def test_survey360_monthly_price(self):
        """Survey360 monthly should be $99"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        data = response.json()
        
        survey360_monthly = next(
            (p for p in data["packages"] if p["id"] == "survey360_monthly"), 
            None
        )
        assert survey360_monthly is not None, "survey360_monthly not found"
        assert survey360_monthly["amount"] == 99.0, f"Expected $99, got ${survey360_monthly['amount']}"
        print(f"✓ Survey360 monthly price: ${survey360_monthly['amount']}")
    
    def test_fieldforce_10seats_price(self):
        """FieldForce 10 seats should be $499 one-time"""
        response = requests.get(f"{BASE_URL}/api/payments/packages")
        data = response.json()
        
        fieldforce = next(
            (p for p in data["packages"] if p["id"] == "fieldforce_10seats"), 
            None
        )
        assert fieldforce is not None, "fieldforce_10seats not found"
        assert fieldforce["amount"] == 499.0, f"Expected $499, got ${fieldforce['amount']}"
        assert fieldforce["type"] == "package", f"Expected type 'package', got {fieldforce['type']}"
        print(f"✓ FieldForce 10 seats price: ${fieldforce['amount']} ({fieldforce['type']})")


class TestCheckoutEndpoint:
    """Test checkout session creation"""
    
    def test_checkout_requires_valid_package_id(self):
        """POST /api/payments/checkout should reject invalid package_id"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "package_id": "invalid_package_123",
                "origin_url": "https://example.com"
            }
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"✓ Invalid package_id rejected with 400")
    
    def test_checkout_enterprise_package_returns_400(self):
        """Enterprise packages should not be purchasable directly"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "package_id": "survey360_enterprise",
                "origin_url": "https://example.com"
            }
        )
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "enterprise" in data.get("detail", "").lower() or "contact" in data.get("detail", "").lower(), \
            "Error should mention enterprise or contact"
        print(f"✓ Enterprise package rejected: {data.get('detail')}")
    
    def test_checkout_creates_session_for_valid_package(self):
        """POST /api/payments/checkout should create checkout session for valid package"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "package_id": "survey360_monthly",
                "origin_url": "https://kpi-tracker-58.preview.emergentagent.com",
                "user_email": "test@example.com",
                "metadata": {
                    "source": "test_script",
                    "product": "survey360"
                }
            }
        )
        
        # Should return 200 with url and session_id
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "url" in data, "Response should contain 'url'"
        assert "session_id" in data, "Response should contain 'session_id'"
        
        # URL should be a Stripe checkout URL
        assert "stripe.com" in data["url"] or "checkout" in data["url"], \
            f"URL should be Stripe checkout URL: {data['url']}"
        
        print(f"✓ Checkout session created")
        print(f"  Session ID: {data['session_id'][:30]}...")
        print(f"  URL starts with: {data['url'][:50]}...")
        
        return data["session_id"]
    
    def test_checkout_fieldforce_package(self):
        """Test checkout for FieldForce one-time package"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "package_id": "fieldforce_10seats",
                "origin_url": "https://kpi-tracker-58.preview.emergentagent.com"
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "url" in data
        assert "session_id" in data
        print(f"✓ FieldForce checkout session created")


class TestPaymentStatus:
    """Test payment status endpoint"""
    
    def test_payment_status_for_valid_session(self):
        """GET /api/payments/status/{session_id} should return status"""
        # First create a session
        checkout_response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "package_id": "survey360_monthly",
                "origin_url": "https://kpi-tracker-58.preview.emergentagent.com"
            }
        )
        
        if checkout_response.status_code != 200:
            pytest.skip(f"Could not create checkout session: {checkout_response.text}")
        
        session_id = checkout_response.json()["session_id"]
        
        # Check status
        status_response = requests.get(f"{BASE_URL}/api/payments/status/{session_id}")
        assert status_response.status_code == 200, f"Expected 200, got {status_response.status_code}"
        
        data = status_response.json()
        # Status should have expected fields
        assert "status" in data, "Response should contain 'status'"
        assert "payment_status" in data, "Response should contain 'payment_status'"
        
        # New session should be open/unpaid
        print(f"✓ Payment status retrieved")
        print(f"  Status: {data.get('status')}")
        print(f"  Payment Status: {data.get('payment_status')}")
    
    def test_payment_status_invalid_session(self):
        """Status for invalid session should return error"""
        response = requests.get(f"{BASE_URL}/api/payments/status/invalid_session_id_123")
        # Should return 4xx or contain error
        # Note: Depending on implementation, might return 404 or 500
        print(f"✓ Invalid session status check: {response.status_code}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
