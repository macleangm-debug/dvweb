"""
Test Suite for Admin Dashboard Features
Tests: Dashboard Charts, Analytics Overview, Audit Logs, Notifications APIs
"""
import pytest
import requests
import os
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAdminAuth:
    """Test authentication to get admin token"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access_token in response"
        return data["access_token"]
    
    def test_admin_login(self, admin_token):
        """Verify admin login works"""
        assert admin_token is not None
        assert len(admin_token) > 10
        print(f"Admin login successful, token length: {len(admin_token)}")


class TestDashboardCharts:
    """Test /api/admin/dashboard/charts endpoint - Chart data for Recharts"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_charts_endpoint_default_period(self, admin_token):
        """Test charts endpoint returns data for default 30-day period"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/charts", headers=headers)
        
        assert response.status_code == 200, f"Charts endpoint failed: {response.status_code} - {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "revenue" in data, "Missing 'revenue' in charts response"
        assert "users" in data, "Missing 'users' in charts response"
        assert "products" in data, "Missing 'products' in charts response"
        
        print(f"Charts response has: revenue ({len(data.get('revenue', []))} items), users ({len(data.get('users', []))} items), products ({len(data.get('products', []))} items)")
    
    def test_charts_revenue_data_structure(self, admin_token):
        """Test revenue chart data has correct structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/charts?period=30", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        revenue_data = data.get("revenue", [])
        
        assert len(revenue_data) == 30, f"Expected 30 revenue items, got {len(revenue_data)}"
        
        # Check first revenue item structure
        if revenue_data:
            item = revenue_data[0]
            assert "date" in item, "Revenue item missing 'date'"
            assert "fieldforce" in item, "Revenue item missing 'fieldforce'"
            assert "survey360" in item, "Revenue item missing 'survey360'"
            assert "datapulse" in item, "Revenue item missing 'datapulse'"
            print(f"Revenue item example: {item}")
    
    def test_charts_users_data_structure(self, admin_token):
        """Test user growth chart data has correct structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/charts?period=14", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        users_data = data.get("users", [])
        
        assert len(users_data) == 14, f"Expected 14 user growth items for 14-day period, got {len(users_data)}"
        
        if users_data:
            item = users_data[0]
            assert "date" in item, "Users item missing 'date'"
            assert "fieldforce" in item, "Users item missing 'fieldforce'"
            assert "survey360" in item, "Users item missing 'survey360'"
            assert "datapulse" in item, "Users item missing 'datapulse'"
            assert "total" in item, "Users item missing 'total'"
            print(f"User growth item example: {item}")
    
    def test_charts_products_data_structure(self, admin_token):
        """Test products pie chart data has correct structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/charts", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        products_data = data.get("products", [])
        
        assert len(products_data) == 3, f"Expected 3 products, got {len(products_data)}"
        
        product_names = [p.get("name") for p in products_data]
        assert "FieldForce" in product_names, "Missing FieldForce in products"
        assert "Survey360" in product_names, "Missing Survey360 in products"
        assert "DataPulse" in product_names, "Missing DataPulse in products"
        
        for product in products_data:
            assert "name" in product, "Product missing 'name'"
            assert "value" in product, "Product missing 'value'"
            assert "color" in product, "Product missing 'color'"
        
        print(f"Products data: {products_data}")
    
    def test_charts_period_7_days(self, admin_token):
        """Test charts endpoint with 7-day period parameter"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/charts?period=7", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data.get("revenue", [])) == 7, "Expected 7 revenue items for 7-day period"
        assert len(data.get("users", [])) == 7, "Expected 7 user items for 7-day period"
        print("7-day period data verified")


class TestAnalyticsOverview:
    """Test /api/admin/analytics/overview endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_analytics_overview_endpoint(self, admin_token):
        """Test analytics overview returns correct structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code == 200, f"Analytics overview failed: {response.status_code} - {response.text}"
        data = response.json()
        
        # Verify main sections
        assert "users" in data, "Missing 'users' in analytics"
        assert "experts" in data, "Missing 'experts' in analytics"
        assert "jobs" in data, "Missing 'jobs' in analytics"
        assert "leads" in data, "Missing 'leads' in analytics"
        
        print(f"Analytics overview: {json.dumps(data, indent=2)}")
    
    def test_analytics_users_structure(self, admin_token):
        """Test analytics users section structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        users_data = data.get("users", {})
        assert "total" in users_data, "Missing 'total' in users"
        assert "byProduct" in users_data, "Missing 'byProduct' in users"
        
        by_product = users_data.get("byProduct", {})
        assert "fieldforce" in by_product, "Missing 'fieldforce' in byProduct"
        assert "survey360" in by_product, "Missing 'survey360' in byProduct"
        assert "datapulse" in by_product, "Missing 'datapulse' in byProduct"
        
        print(f"Users analytics: {users_data}")
    
    def test_analytics_experts_structure(self, admin_token):
        """Test analytics experts section structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        experts_data = data.get("experts", {})
        assert "total" in experts_data, "Missing 'total' in experts"
        assert "verified" in experts_data, "Missing 'verified' in experts"
        assert "conversionRate" in experts_data, "Missing 'conversionRate' in experts"
        
        print(f"Experts analytics: {experts_data}")
    
    def test_analytics_jobs_structure(self, admin_token):
        """Test analytics jobs section structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        jobs_data = data.get("jobs", {})
        assert "active" in jobs_data, "Missing 'active' in jobs"
        assert "applications" in jobs_data, "Missing 'applications' in jobs"
        
        print(f"Jobs analytics: {jobs_data}")
    
    def test_analytics_leads_structure(self, admin_token):
        """Test analytics leads section structure"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        leads_data = data.get("leads", {})
        assert "total" in leads_data, "Missing 'total' in leads"
        assert "converted" in leads_data, "Missing 'converted' in leads"
        assert "conversionRate" in leads_data, "Missing 'conversionRate' in leads"
        
        print(f"Leads analytics: {leads_data}")


class TestAuditLogs:
    """Test /api/admin/audit-logs endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_audit_logs_endpoint(self, admin_token):
        """Test audit logs endpoint returns array"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs", headers=headers)
        
        assert response.status_code == 200, f"Audit logs failed: {response.status_code} - {response.text}"
        data = response.json()
        
        # Should return array (may be empty if no logs yet)
        assert isinstance(data, list), f"Expected list, got {type(data)}"
        print(f"Audit logs returned {len(data)} entries")
    
    def test_audit_logs_with_filters(self, admin_token):
        """Test audit logs with query parameters"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Test with limit parameter
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs?limit=10", headers=headers)
        assert response.status_code == 200
        
        # Test with action_type filter
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs?action_type=login", headers=headers)
        assert response.status_code == 200
        
        # Test with admin_email filter
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs?admin_email=admin@datavision.co.tz", headers=headers)
        assert response.status_code == 200
        
        print("Audit logs filters work correctly")


class TestNotifications:
    """Test /api/notifications/* endpoints"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_notifications_status_endpoint(self, admin_token):
        """Test notifications status endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/notifications/status", headers=headers)
        
        assert response.status_code == 200, f"Notifications status failed: {response.status_code} - {response.text}"
        data = response.json()
        
        assert "active_connections" in data, "Missing 'active_connections' in status"
        assert "connected_admins" in data, "Missing 'connected_admins' in status"
        
        assert isinstance(data["active_connections"], int), "active_connections should be integer"
        assert isinstance(data["connected_admins"], list), "connected_admins should be list"
        
        print(f"Notification status: {data}")
    
    def test_notifications_test_endpoint(self, admin_token):
        """Test trigger notification endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/notifications/test", headers=headers)
        
        assert response.status_code == 200, f"Test notification failed: {response.status_code} - {response.text}"
        data = response.json()
        
        assert "message" in data, "Missing 'message' in response"
        assert "connections" in data, "Missing 'connections' in response"
        assert data["message"] == "Test notification sent", f"Unexpected message: {data['message']}"
        
        print(f"Test notification sent. Active connections: {data['connections']}")


class TestDashboardStats:
    """Test /api/admin/dashboard/stats endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@datavision.co.tz",
            "password": "admin123"
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    def test_dashboard_stats_endpoint(self, admin_token):
        """Test dashboard stats endpoint"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/stats", headers=headers)
        
        assert response.status_code == 200, f"Dashboard stats failed: {response.status_code} - {response.text}"
        data = response.json()
        
        # Verify main stats
        assert "totalRevenue" in data, "Missing 'totalRevenue'"
        assert "activeUsers" in data, "Missing 'activeUsers'"
        assert "activeProjects" in data, "Missing 'activeProjects'"
        assert "pendingTasks" in data, "Missing 'pendingTasks'"
        assert "solutionStats" in data, "Missing 'solutionStats'"
        
        # Verify solution stats structure
        solution_stats = data.get("solutionStats", {})
        assert "fieldforce" in solution_stats, "Missing 'fieldforce' in solutionStats"
        assert "survey360" in solution_stats, "Missing 'survey360' in solutionStats"
        assert "datapulse" in solution_stats, "Missing 'datapulse' in solutionStats"
        
        for product in ["fieldforce", "survey360", "datapulse"]:
            product_stats = solution_stats.get(product, {})
            assert "users" in product_stats, f"Missing 'users' in {product}"
            assert "revenue" in product_stats, f"Missing 'revenue' in {product}"
            assert "growth" in product_stats, f"Missing 'growth' in {product}"
        
        print(f"Dashboard stats: {json.dumps(data, indent=2)}")


class TestUnauthorizedAccess:
    """Test endpoints require authentication"""
    
    def test_charts_requires_auth(self):
        """Verify charts endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard/charts")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    def test_analytics_requires_auth(self):
        """Verify analytics endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/overview")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    def test_audit_logs_requires_auth(self):
        """Verify audit logs endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/audit-logs")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    def test_notifications_status_requires_auth(self):
        """Verify notifications status endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/notifications/status")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
