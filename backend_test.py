import requests
import sys
from datetime import datetime

class DataVisionAPITester:
    def __init__(self, base_url="https://tanzania-insights.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, description=""):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        if description:
            print(f"   Description: {description}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:200]}")
            else:
                self.failed_tests.append({
                    'name': name,
                    'endpoint': endpoint,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'error': response.text[:500] if response.text else 'No error message'
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Error: {response.text[:200] if response.text else 'No error message'}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.failed_tests.append({
                'name': name,
                'endpoint': endpoint,
                'expected': expected_status,
                'actual': 'Exception',
                'error': str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_public_endpoints(self):
        """Test all public API endpoints"""
        print("\n" + "="*50)
        print("TESTING PUBLIC API ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200, description="Basic API health check")
        
        # Test statistics endpoint
        self.run_test("Statistics", "GET", "statistics", 200, 
                     description="Get homepage statistics (25+ Years, 1000+ Projects, etc.)")
        
        # Test projects endpoint
        self.run_test("All Projects", "GET", "projects", 200,
                     description="Get all projects")
        
        self.run_test("Featured Projects", "GET", "projects?featured=true", 200,
                     description="Get only featured projects")
        
        self.run_test("Education Projects", "GET", "projects?sector=education", 200,
                     description="Filter projects by education sector")
        
        # Test team endpoint
        self.run_test("Team Members", "GET", "team", 200,
                     description="Get team/leadership information")
        
        # Test testimonials endpoint  
        self.run_test("All Testimonials", "GET", "testimonials", 200,
                     description="Get all testimonials")
        
        self.run_test("Featured Testimonials", "GET", "testimonials?featured=true", 200,
                     description="Get featured testimonials for homepage carousel")
        
        # Test partners endpoint
        self.run_test("Partners", "GET", "partners", 200,
                     description="Get partner organizations")
        
        # Test news endpoint
        self.run_test("News Articles", "GET", "news", 200,
                     description="Get published news articles")

    def test_contact_form(self):
        """Test contact form submission with honeypot protection"""
        print("\n" + "="*50)
        print("TESTING CONTACT FORM & HONEYPOT PROTECTION")
        print("="*50)
        
        # Test valid submission (empty honeypot)
        valid_inquiry = {
            "name": "Test User",
            "email": "test@example.com", 
            "company": "Test Company",
            "subject": "Test Inquiry",
            "message": "This is a test message",
            "inquiry_type": "general",
            "honeypot": ""  # Should be empty for valid submissions
        }
        
        self.run_test("Valid Contact Form Submission", "POST", "inquiries", 200, 
                     data=valid_inquiry,
                     description="Submit contact form with empty honeypot (valid)")
        
        # Test bot protection (filled honeypot)
        bot_inquiry = {
            "name": "Bot User",
            "email": "bot@example.com",
            "company": "Bot Company", 
            "subject": "Bot Inquiry",
            "message": "This is a bot message",
            "inquiry_type": "general",
            "honeypot": "bot-filled-field"  # Filled honeypot should be rejected
        }
        
        self.run_test("Bot Protection (Filled Honeypot)", "POST", "inquiries", 200,
                     data=bot_inquiry,
                     description="Submit contact form with filled honeypot (should still return 200 but not save)")

    def test_admin_authentication(self):
        """Test admin login functionality"""
        print("\n" + "="*50)
        print("TESTING ADMIN AUTHENTICATION")
        print("="*50)
        
        # Test admin login
        admin_credentials = {
            "email": "info@datavision.co.tz",
            "password": "walkthetalkdvi1998"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200,
                                        data=admin_credentials,
                                        description="Login with provided admin credentials")
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   ✅ Token obtained: {self.token[:50]}...")
            
            # Test /auth/me endpoint
            self.run_test("Get Current User", "GET", "auth/me", 200,
                         description="Get current authenticated user info")
            
            return True
        else:
            print("   ❌ Failed to obtain admin token")
            return False

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        if not self.token:
            print("\n❌ Skipping admin endpoint tests - no authentication token")
            return
            
        print("\n" + "="*50)
        print("TESTING ADMIN ENDPOINTS")  
        print("="*50)
        
        # Test admin inquiries endpoint
        self.run_test("Admin - View Inquiries", "GET", "admin/inquiries", 200,
                     description="View all contact form submissions")

    def test_data_seeding(self):
        """Test the seed endpoint"""
        print("\n" + "="*50)
        print("TESTING DATA SEEDING")
        print("="*50)
        
        self.run_test("Seed Database", "POST", "seed", 200,
                     description="Initialize database with sample data")

    def test_cors_and_connectivity(self):
        """Test basic connectivity and CORS"""
        print("\n" + "="*50)
        print("TESTING BASIC CONNECTIVITY")
        print("="*50)
        
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            print(f"✅ Server accessible at {self.base_url}")
            print(f"✅ Response time: {response.elapsed.total_seconds():.2f}s")
            
            # Check CORS headers
            if 'Access-Control-Allow-Origin' in response.headers:
                print(f"✅ CORS enabled: {response.headers.get('Access-Control-Allow-Origin')}")
            else:
                print("⚠️  No CORS headers detected")
                
        except Exception as e:
            print(f"❌ Server connection failed: {str(e)}")

def main():
    """Run all tests"""
    print("DataVision International API Testing")
    print("=" * 60)
    
    tester = DataVisionAPITester()
    
    # Run all test suites
    tester.test_cors_and_connectivity()
    tester.test_data_seeding() 
    tester.test_public_endpoints()
    tester.test_contact_form()
    
    # Test admin functionality
    if tester.test_admin_authentication():
        tester.test_admin_endpoints()
    
    # Print final results
    print("\n" + "="*60)
    print("FINAL TEST RESULTS")
    print("="*60)
    print(f"📊 Tests Run: {tester.tests_run}")
    print(f"✅ Tests Passed: {tester.tests_passed}")
    print(f"❌ Tests Failed: {len(tester.failed_tests)}")
    print(f"📈 Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS SUMMARY:")
        for i, test in enumerate(tester.failed_tests, 1):
            print(f"{i}. {test['name']} ({test['endpoint']})")
            print(f"   Expected: {test['expected']}, Got: {test['actual']}")
            print(f"   Error: {test['error'][:200]}...")
    
    print(f"\nTesting completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Return appropriate exit code
    return 0 if len(tester.failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())