"""
Affiliate Analytics API Tests
Tests for referral link analytics - clicks by day, top sources, geographic breakdown
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAffiliateAnalytics:
    """Tests for the affiliate analytics endpoint /api/affiliates/my-analytics"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token for admin user who is an affiliate"""
        self.headers = {"Content-Type": "application/json"}
        # Login as admin (who has affiliate profile)
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@datavision.co.tz", "password": "admin123"},
            headers=self.headers
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        self.token = response.json().get("access_token")
        self.headers["Authorization"] = f"Bearer {self.token}"
    
    def test_my_profile_returns_affiliate_data(self):
        """Test that my-profile returns affiliate data for admin user"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-profile",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify is_affiliate flag
        assert data.get("is_affiliate") == True
        
        # Verify required fields exist
        assert "referral_code" in data
        assert "total_clicks" in data
        assert "total_referrals" in data
        assert "commission_rate" in data
        assert "tier" in data
        
        # Verify affiliate has clicks (seeded data)
        assert data.get("total_clicks", 0) > 0, "Expected seeded click data"
        print(f"Affiliate profile: {data.get('referral_code')} - {data.get('total_clicks')} total clicks")
    
    def test_analytics_default_30_days(self):
        """Test analytics endpoint with default 30 day period"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify period
        assert data.get("period_days") == 30
        
        # Verify summary structure
        summary = data.get("summary", {})
        assert "total_clicks" in summary
        assert "period_referrals" in summary
        assert "period_conversions" in summary
        assert "conversion_rate" in summary
        assert "avg_clicks_per_day" in summary
        
        print(f"30-day analytics: {summary.get('total_clicks')} clicks, {summary.get('avg_clicks_per_day')} avg/day")
    
    def test_analytics_with_7_day_period(self):
        """Test analytics endpoint with 7 day period"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=7",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("period_days") == 7
        assert "summary" in data
        assert "daily_clicks" in data
        
        # Verify daily_clicks has 8 days (7 days period + 1 for edge)
        daily_clicks = data.get("daily_clicks", [])
        assert len(daily_clicks) >= 7, f"Expected at least 7 daily entries, got {len(daily_clicks)}"
        
        print(f"7-day analytics: {data['summary'].get('total_clicks')} clicks")
    
    def test_analytics_with_14_day_period(self):
        """Test analytics endpoint with 14 day period"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=14",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("period_days") == 14
        print(f"14-day analytics: {data['summary'].get('total_clicks')} clicks")
    
    def test_analytics_with_60_day_period(self):
        """Test analytics endpoint with 60 day period"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=60",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("period_days") == 60
        print(f"60-day analytics: {data['summary'].get('total_clicks')} clicks")
    
    def test_analytics_with_90_day_period(self):
        """Test analytics endpoint with 90 day period"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=90",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data.get("period_days") == 90
        print(f"90-day analytics: {data['summary'].get('total_clicks')} clicks")
    
    def test_analytics_daily_clicks_structure(self):
        """Test that daily_clicks array has proper structure"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=30",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        daily_clicks = data.get("daily_clicks", [])
        assert len(daily_clicks) > 0, "Expected daily_clicks data"
        
        # Verify each entry has date and clicks
        for entry in daily_clicks:
            assert "date" in entry, "Missing date field"
            assert "clicks" in entry, "Missing clicks field"
            assert isinstance(entry["clicks"], int), "clicks should be integer"
        
        print(f"Daily clicks entries: {len(daily_clicks)}")
    
    def test_analytics_top_sources(self):
        """Test that top_sources returns source breakdown"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=30",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        top_sources = data.get("top_sources", [])
        
        # Verify structure if sources exist
        if top_sources:
            for source in top_sources:
                assert "source" in source, "Missing source field"
                assert "clicks" in source, "Missing clicks field"
            
            # Sources should be sorted by clicks descending
            clicks = [s["clicks"] for s in top_sources]
            assert clicks == sorted(clicks, reverse=True), "Sources should be sorted by clicks desc"
            
        print(f"Top sources: {top_sources}")
    
    def test_analytics_geo_breakdown(self):
        """Test geographic breakdown (MOCKED data based on percentages)"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=30",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        geo_breakdown = data.get("geo_breakdown", [])
        
        # Verify structure
        if geo_breakdown:
            expected_regions = ["Tanzania", "Kenya", "Uganda", "Rwanda", "Other"]
            regions = [g["region"] for g in geo_breakdown]
            
            for geo in geo_breakdown:
                assert "region" in geo, "Missing region field"
                assert "clicks" in geo, "Missing clicks field"
                assert "percentage" in geo, "Missing percentage field"
            
            # Check percentages sum to ~100 (may have rounding)
            total_percentage = sum(g["percentage"] for g in geo_breakdown)
            assert 95 <= total_percentage <= 105, f"Percentages should sum to ~100, got {total_percentage}"
        
        print(f"Geo breakdown: {geo_breakdown}")
    
    def test_analytics_insights(self):
        """Test AI-generated insights are returned"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=30",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        insights = data.get("insights", [])
        
        # Verify structure
        for insight in insights:
            assert "type" in insight, "Missing type field"
            assert "title" in insight, "Missing title field"
            assert "message" in insight, "Missing message field"
            assert insight["type"] in ["success", "warning", "tip", "info"], f"Invalid insight type: {insight['type']}"
        
        # Should not have more than 3 insights
        assert len(insights) <= 3, "Should return max 3 insights"
        
        print(f"Insights: {len(insights)} items")
        for i in insights:
            print(f"  - [{i['type']}] {i['title']}")
    
    def test_analytics_unauthorized_without_token(self):
        """Test that analytics endpoint requires authentication"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics",
            headers={"Content-Type": "application/json"}  # No auth header
        )
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    def test_analytics_invalid_period_too_low(self):
        """Test that period_days below 7 is rejected"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=5",
            headers=self.headers
        )
        assert response.status_code == 422, f"Expected 422 for invalid period, got {response.status_code}"
    
    def test_analytics_invalid_period_too_high(self):
        """Test that period_days above 90 is rejected"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-analytics?period_days=100",
            headers=self.headers
        )
        assert response.status_code == 422, f"Expected 422 for invalid period, got {response.status_code}"


class TestAffiliateOverviewTab:
    """Tests for affiliate dashboard overview data endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token"""
        self.headers = {"Content-Type": "application/json"}
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@datavision.co.tz", "password": "admin123"},
            headers=self.headers
        )
        assert response.status_code == 200
        self.token = response.json().get("access_token")
        self.headers["Authorization"] = f"Bearer {self.token}"
    
    def test_my_referrals_endpoint(self):
        """Test my-referrals returns referral list"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-referrals",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "referrals" in data
        assert "total" in data
        print(f"Referrals: {data.get('total')} total")
    
    def test_my_commissions_endpoint(self):
        """Test my-commissions returns commission history"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-commissions",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "commissions" in data
        print(f"Commissions: {len(data.get('commissions', []))} entries")
    
    def test_my_payouts_endpoint(self):
        """Test my-payouts returns payout history"""
        response = requests.get(
            f"{BASE_URL}/api/affiliates/my-payouts",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "payouts" in data
        print(f"Payouts: {len(data.get('payouts', []))} entries")
