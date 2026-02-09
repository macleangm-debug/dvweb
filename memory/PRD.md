# DataVision International Website - PRD

## Original Problem Statement
User requested restructuring of the DataVision website navigation and services:
- Link GitHub software solutions to the main website
- Implement Single Sign-On (SSO) for unified user authentication
- Flexible payment gateway supporting subscriptions and one-time purchases

## What's Been Implemented

### February 9, 2026 - Global Branding & Partner Logo Update (COMPLETED)

**Partner Logo Updates:**
- Removed UK Aid logo from partners
- Added WHO (World Health Organization) logo
- Added RTI International logo
- Added Ecorys logo
- Final partner list: World Bank, USAID, UNICEF, WHO, RTI International, Ecorys
- Local logo files stored in `/app/frontend/public/` (usaid-logo.png, rti-logo.png, ecorys-logo.png)

**Global Content Updates (Feb 9, 2026):**
- Homepage: Updated hero messaging to "Data-Driven Insights Driving Global Impact"
- About page: Updated to "headquartered in Dar es Salaam with a global reach"
- Services Hub: Changed "Our Impact in Tanzania" to "Our Global Impact"
- Services Hub: Changed CTA text from "needs in Tanzania" to "needs globally"
- Services Hub: Changed WASH case study from "regions of Tanzania" to "multiple regions"
- FieldForce Landing: Uses global messaging "Trusted by organizations globally"
- Footer: Global messaging "delivering data-driven insights across Africa and beyond"

**Test Reports:**
- `/app/test_reports/iteration_17.json` - 90% pass rate (100% after fixes)
- All pages verified with correct global messaging
- Partner logos displaying correctly

---

### February 9, 2026 - FieldForce GitHub Backend Integration (COMPLETED)

**Major Change: Replaced custom backend with EXACT GitHub routes**
- Removed `/app/backend/routes/fieldforce_routes.py` (custom implementation)
- Copied ALL original route files from GitHub to `/app/backend/fieldforce/routes/`
- Copied supporting files: `models.py`, `auth.py`, `logic_engine.py`
- Created `fieldforce_main.py` to combine all 23 route modules
- Added missing `utils/security.py` and `utils/audit.py` (stubbed - missing from GitHub repo)
- Installed missing dependencies: `aiofiles`, `deepdiff`

**Route Modules Integrated (23 total):**
- auth_routes, org_routes, project_routes, form_routes, submission_routes
- case_routes, case_import_routes, export_routes, media_routes, gps_routes
- template_routes, logic_routes, widget_routes, device_routes, rbac_routes
- analytics_routes, translation_routes, paradata_routes, revision_routes
- dataset_routes, cawi_routes, quality_ai_routes, dashboard_routes

**Frontend Navigation Fixes (Feb 9, 2026):**
- Fixed all navigation paths to use `/solutions/fieldforce/app` prefix
- Fixed Form Builder to handle undefined formId for new forms
- Fixed DashboardLayout logo link
- Fixed FormsPage navigation for form cards and dropdowns
- Fixed DashboardPage Quick Actions navigation
- Test report: `/app/test_reports/iteration_16.json` - 100% frontend success

**Dark Theme Fix Verified (Feb 9, 2026):**
- Confirmed dark theme working on ALL FieldForce pages via testing agent
- Background color: `rgb(15, 23, 41)` (navy blue)
- `.fieldforce-app` CSS class wrapper properly applied via DashboardLayout
- CSS variables in `/app/frontend/src/solutions/fieldforce/app/App.css` functioning correctly
- Test report: `/app/test_reports/iteration_14.json` - 100% frontend success

**FieldForce Solution - FULL Original GitHub Integration** at `/solutions/fieldforce`:
- Using EXACT original code from GitHub repo (https://github.com/macleangm-debug/FieldForce)
- Canva-style left rail navigation with labeled icons
- All original pages: Dashboard, Projects, Forms, Form Builder, Templates, Submissions, Cases, Datasets, GPS Map, Devices, Quality, Analytics, Team, RBAC, Translations, Settings
- Original login/register pages with FieldForce branding
- "Online/Offline" status indicator
- Standard/Widgets dashboard view toggle
- Submission Trends chart
- Data Quality metrics
- Recent Activity feed
- Quick Actions panel

**Routes Integrated (ALL Original Pages):**
- `/solutions/fieldforce` - Landing page
- `/solutions/fieldforce/app/login` - Original login
- `/solutions/fieldforce/app/register` - Original register
- `/solutions/fieldforce/app/dashboard` - Full dashboard with trends/quality/activity
- `/solutions/fieldforce/app/projects` - Projects management
- `/solutions/fieldforce/app/forms` - Forms list
- `/solutions/fieldforce/app/forms/new` - Form builder
- `/solutions/fieldforce/app/forms/:id/edit` - Form editor
- `/solutions/fieldforce/app/forms/:id/preview` - Form preview
- `/solutions/fieldforce/app/templates` - Form templates
- `/solutions/fieldforce/app/submissions` - Submissions data
- `/solutions/fieldforce/app/cases` - Cases management
- `/solutions/fieldforce/app/cases/import` - Case import
- `/solutions/fieldforce/app/datasets` - Datasets
- `/solutions/fieldforce/app/map` - GPS Map
- `/solutions/fieldforce/app/devices` - Device management
- `/solutions/fieldforce/app/quality` - Quality checks
- `/solutions/fieldforce/app/analytics` - Analytics
- `/solutions/fieldforce/app/team` - Team management
- `/solutions/fieldforce/app/rbac` - Role-based access
- `/solutions/fieldforce/app/translations` - Multi-language
- `/solutions/fieldforce/app/settings` - Settings

**Original Components Available:**
- AnalyticsDashboard, AudioRecorder, BarcodeCapture
- CalculatedFieldEditor, CollaborationIndicator, CustomDashboard
- DuplicateDetection, FormLogicVisualization, FormVersioning
- GPSCapture, MediaUpload, OfflineStatus, OfflineSync
- ParadataViewer, PWAComponents, RosterGroup
- SignatureCapture, SkipLogicEditor, VideoRecorder

**Backend API:** `/api/fieldforce/*` with full routes

**Demo Credentials:**
- Email: demo@fieldforce.io
- Password: Test123!

**Note:** Disabled babel-metadata-plugin in craco.config.js to fix compilation issues. Can be re-enabled later.

**Known Issues (P1) - RESOLVED:**
- ~~`/api/fieldforce/dashboard/submission-trends` returns 404~~ ✅ FIXED
- ~~`/api/fieldforce/dashboard/quality-metrics` returns 404~~ ✅ FIXED
- ~~`AdminVerificationDashboard.js` stubbed~~ ✅ RESTORED
- ~~`ServicesHubRedesigned.js` stubbed~~ ✅ RESTORED
- `visual-edits` babel plugin disabled in `craco.config.js` (kept disabled to prevent compilation issues)

---

### February 2026 - Survey360 Tabbed Product Page (COMPLETED)

**Survey360 Product Page** at `/solutions/survey360`:
- 7 tabbed sections: Overview, Features, How It Works, Use Cases, Testimonials, Pricing, FAQ
- Sticky product navigation below DataVision main nav
- Mobile-responsive with hamburger menu for tabs
- Integrated Stripe checkout for pricing plans
- Survey360 branding (teal color scheme) maintained within DataVision

**Files Created:**
- `/app/frontend/src/components/solutions/survey360/Survey360ProductPage.jsx`
- `/app/frontend/src/components/solutions/survey360/survey360Data.js`
- `/app/frontend/src/components/solutions/survey360/index.js`

**Content Sections:**
- Overview: Hero with stats, feature highlights
- Features: 6 main features + 10 question types
- How It Works: 4-step workflow guide
- Use Cases: 6 industry use cases (Research, NGO, HR, Customer, Market, Events)
- Testimonials: Customer quotes with ratings
- Pricing: Monthly ($99), Annual ($990), Enterprise (Custom)
- FAQ: 8 accordion-style questions

---

### February 2026 - Stripe Payment Integration (COMPLETED)

**P0: Stripe Payment System:**
- Full Stripe Checkout integration using `emergentintegrations` library
- Server-side package definitions for security (no price manipulation from frontend)
- Payment success page with polling for status updates
- Multiple pricing tiers per product (monthly, annual, one-time packages)

**Backend API Endpoints:**
- `POST /api/payments/checkout` - Creates Stripe checkout session
- `GET /api/payments/status/{session_id}` - Gets payment status with polling
- `POST /api/webhook/stripe` - Handles Stripe webhooks

**Pricing Structure:**
- Survey360: $99/month, $990/year, Enterprise (custom)
- DataViz Studio: $79/month, $790/year
- M&E Tracker: $149/month, $1,490/year
- FieldForce: $499 (10 seats), $1,999 (50 seats), $4,999 (unlimited) - one-time
- Sectoral Solutions: $1,299-$1,999/year

**Files Created:**
- `/app/frontend/src/pages/PaymentSuccessPage.js` - Payment result handling with polling

**Files Modified:**
- `/app/frontend/src/pages/SolutionsPages.js` - Added PRICING_DATA and handlePurchase
- `/app/frontend/src/App.js` - Added /payment/success route
- `/app/backend/server.py` - Stripe routes (already existed, verified working)

---

### December 2025 - Expert Verification Frontend (COMPLETED)

**P2: Expert Verification Dashboard:**
- Full admin dashboard for managing expert verification
- **Expert List**: Shows experts with verification status badges, trust tier, and score %
- **Verification Detail Panel** with 4 tabs:
  - **Overview**: Score breakdown gauges (Skills 40%, References 35%, Documents 25%), progress stats, trust tier progress bar
  - **Assessments**: Shows 10 available sectors with completion status
  - **References**: Reference request form (name, email), send request button, request all references
  - **Documents**: 4 document types with verification status
- **Trust Tier Scale**: Bronze (0-50%), Silver (50-70%), Gold (70-85%), Platinum (85-100%)
- Email notifications for references are MOCKED (console.log)

**Files Created:**
- `/app/frontend/src/components/AdminVerificationDashboard.js`

**Files Modified:**
- `/app/frontend/src/App.js` - Added Verification tab to AdminDashboard

---

### December 2025 - CareersPage.js Tab Components Refactoring (COMPLETED)

**Frontend Tab Components Extracted:**
CareersPage.js reduced from 1805 lines to 215 lines (88% reduction!)
Tab components extracted to separate files:
- `/app/frontend/src/components/careers/OverviewTab.js` - 330 lines
- `/app/frontend/src/components/careers/WhyUsTab.js` - 176 lines
- `/app/frontend/src/components/careers/JobsTab.js` - 166 lines
- `/app/frontend/src/components/careers/ProcessTab.js` - 130 lines
- `/app/frontend/src/components/careers/StudentsTab.js` - 168 lines
- `/app/frontend/src/components/careers/LifeTab.js` - 144 lines
- `/app/frontend/src/components/careers/ExpertsTab.js` - 316 lines
- `/app/frontend/src/components/careers/RegisterTab.js` - 38 lines
- `/app/frontend/src/components/careers/careersData.js` - 227 lines (static data)
- `/app/frontend/src/components/careers/index.js` - 57 lines (exports)

**CareersPage.js now only handles:**
- Navigation state management
- Dropdown menu logic
- Tab routing
- Importing and rendering tab components

---

### December 2025 - Backend MVC Structure (COMPLETED)

**Backend MVC Structure:**
- Created `/app/backend/models/__init__.py` - All Pydantic models extracted
- Created `/app/backend/services/__init__.py` - Business logic (matching algorithms, verification scoring)
- Created `/app/backend/routes/` - Route modules:
  - `auth.py` - Authentication routes and helpers
  - `public.py` - Public content endpoints
  - `admin_content.py` - Admin CRUD operations
- Updated `server.py` with imports from new modules (backward compatible)

**Structure Overview:**
```
/app/backend/
├── models/__init__.py      # Pydantic models
├── services/__init__.py    # Business logic
├── routes/
│   ├── __init__.py
│   ├── auth.py            # Authentication
│   ├── public.py          # Public endpoints
│   └── admin_content.py   # Admin CRUD
└── server.py              # Main application
```

---

### December 2025 - Automated Project Matching UI (COMPLETED)

**P2: UI for Automated Project Matching:**
- Full project matching interface in admin dashboard
- **Create Project Form**: Title, description, sectors selection, skills (required/preferred), requirements
- **Project Cards**: Display projects with title, description, sectors, experience, duration, positions
- **Matches View**: Ranked list of matching experts with combined scores
- **Match Scoring**: 70% match score + 30% verification score weighting
- **Expert Match Cards**:
  - Rank badge (#1 gold, #2 silver, #3 bronze)
  - Combined score display
  - Score breakdown (Match vs Verification)
  - Expert details (experience, availability, rate, trust tier)
  - Matching sectors and skills
  - Contact and View Profile actions

**Files Created:**
- `/app/frontend/src/components/AdminProjectMatching.js` - New component for project matching

**Files Modified:**
- `/app/frontend/src/App.js` - Added Project Matching tab to AdminDashboard

---

### December 2025 - Admin Expert Management Dashboard (COMPLETED)

**P1: Admin Dashboard for Expert Management:**
- Full-featured admin dashboard to manage expert network
- **Stats Overview**: Total Experts, Pending Review, Active, Engaged counts
- **Search & Filter**: Search by name/email/title, filter by Status, Sector, Availability, Experience
- **Expert Cards**: Display expert info with status badges, verification tier, location, sectors
- **Detail Panel**: Slide-out panel with:
  - Quick Actions (Approve/Reject/Activate/Deactivate/Mark Engaged)
  - Verification Score breakdown (Skills/References/Documents)
  - Contact Information
  - Experience & Expertise
  - Geographic Expertise
  - Availability & Rates
  - Education
  - Portfolio Links
  - Admin Notes
- Status workflow: pending → approved → active → engaged

**Files Created:**
- `/app/frontend/src/components/AdminExpertManagement.js` - New component for expert management

**Files Modified:**
- `/app/frontend/src/App.js` - Added Expert Network tab to AdminDashboard

---

### December 2025 - Careers Menu Reorganization (COMPLETED)

**Careers Page Navigation Cleanup:**
- Reorganized crowded 8-tab horizontal navigation into 3-item dropdown navigation
- **Overview** - Standalone tab for careers landing page
- **Our Culture** dropdown:
  - Why Work Here
  - Life at DataVision
  - How We Hire
- **Find Your Role** dropdown:
  - Open Positions
  - Students & Graduates
  - Expert Network
  - Register as Expert
- Dropdown menus use Framer Motion animations
- Click-outside-to-close functionality
- Active dropdown highlighting when viewing child tabs
- Responsive design for mobile/tablet

**Files Modified:**
- `/app/frontend/src/pages/CareersPage.js` - New `careerNavItems` structure with dropdown navigation component

---

## Earlier Work
1. Remove "Research & Statistics" as a standalone navigation item
2. Move Research & Statistics under a "Services" dropdown
3. Create comprehensive McKinsey-style service pages with deep insights
4. Redesign Services hub page with rich visual elements
5. Expand services to 14 total, practice areas to 15 total
6. Use Ubuntu Light font across the website
7. Use icons instead of stock photos for a professional look
8. Add Industries section with dedicated pages
9. Add Software Solutions section for standalone products
10. Clean up navigation with Mega Menu approach
11. Fix mobile navigation to match desktop structure
12. Update footer with all new sections

## Application Overview
DataVision International is a research and statistics consultancy based in Tanzania, specializing in:
- Agriculture, Education, Health, and WASH sectors
- Large-scale surveys and data collection
- Monitoring & Evaluation
- Capacity building and training
- **Software Solutions** for data collection, analytics, and sector operations

## What's Been Implemented

### February 8, 2026 - Automated Expert Verification System (COMPLETED)

**Skills Assessment Engine:**
- 10 sector-specific assessments (agriculture, health, education, WASH, M&E, data, governance, finance, gender, energy)
- 5 questions per sector with multiple difficulty levels (easy/medium/hard)
- Auto-scoring with 70% passing threshold
- Questions cover real-world sector knowledge (JMP, HMIS, GAP, counterfactuals, etc.)

**Reference Verification Workflow:**
- Automated reference request generation with unique tokens
- Structured feedback form (5 competency ratings 1-5 scale)
- Verification of claims (role, experience, specific skills)
- Recommendation level (1-10)
- Auto-scoring based on responses

**Verification Scoring Algorithm:**
- Skills Assessment: 40% weight
- Reference Verification: 35% weight  
- Document Verification: 25% weight
- Composite score 0-100

**Trust Tiers (Auto-calculated):**
- Platinum: 85+ score
- Gold: 70-84 score
- Silver: 50-69 score
- Bronze: <50 score

**Expert Matching Enhancement:**
- Matching now factors in verification score (30%) alongside match score (70%)
- Verified experts ranked higher for project opportunities

**API Endpoints:**
- `GET /api/experts/{id}/assessment/{sector}` - Get skills test
- `POST /api/experts/{id}/assessment/submit` - Submit answers
- `POST /api/admin/experts/{id}/request-reference` - Send reference request
- `POST /api/verify-reference/{token}` - Submit reference feedback (public)
- `GET /api/admin/experts/{id}/verification` - Get verification summary
- `GET /api/admin/experts/verified/ranked` - Get experts ranked by verification

### February 8, 2026 - Expert Network Backend System (COMPLETED)

**Expert Registration System:**
- Comprehensive 6-step registration form (Personal → Professional → Expertise → Geographic → Availability → Portfolio)
- 15 sector categories with skills matching
- Geographic experience tracking (countries, regions)
- Availability and rate preferences
- CV/Portfolio links and professional references
- Public registration endpoint: `POST /api/experts/register`

**Backend Admin APIs:**
- `GET /api/admin/experts` - List all experts with filters (sector, status, experience, country)
- `GET /api/admin/experts/{id}` - Get single expert profile
- `PUT /api/admin/experts/{id}/status` - Update expert status (pending → approved → active)
- `POST /api/admin/experts/search` - Advanced search with multiple criteria
- `GET /api/admin/experts/stats/summary` - Dashboard statistics

**Project Matching System:**
- `POST /api/admin/project-requirements` - Create project requirements
- `GET /api/admin/project-requirements` - List all projects
- `GET /api/admin/project-requirements/{id}/matches` - **Automated matching algorithm**
  - Scores experts 0-100 based on:
    - Sector match (30 pts): Primary sectors weighted higher
    - Skills match (30 pts): Required vs preferred skills
    - Experience match (20 pts): Years of experience vs minimum
    - Geographic match (10 pts): Country experience overlap
    - Availability match (10 pts): Available > Limited > Unavailable
    - Bonuses for engagement type match, budget compatibility

**Database Collections:**
- `experts` - Expert profiles with all registration data
- `project_requirements` - Project needs for matching

### February 8, 2026 - McKinsey-Style Careers Section (COMPLETED)

**New Careers Page (`/careers`):**
- Comprehensive careers section with dedicated sub-navigation
- 6 tabs: Overview, Why Work Here, Open Positions, How We Hire, Students & Graduates, Life at DataVision
- McKinsey-inspired design with compelling hero ("Big Challenges. Bigger Impact.")
- Featured positions showcase on overview tab
- Job search with filters (department, search term)
- 6 sample job listings with expandable details
- Students & Graduates section with 3 programs (Graduate Associate, Summer Internship, Research Fellowship)
- 5-step hiring process with tips for each stage
- Team testimonials and benefits showcase
- Company values and impact sections

**Navigation Changes:**
- Replaced "Contact" with "Careers" in main navigation (desktop & mobile)
- Contact remains accessible via footer and "Partner With Us" CTA
- Footer Company column: About Us, Careers, Insights, Contact

### February 8, 2026 - Retail Industry Addition (COMPLETED)

**New Retail Industry:**
- Added "Retail & Consumer Goods" as the 16th industry
- Custom challenges: consumer preferences, inventory optimization, marketing ROI, e-commerce disruption, customer loyalty
- Custom solutions: Consumer Behavior Analytics, Retail Performance Optimization, Pricing & Promotion Insights, Market Expansion Research
- Custom capabilities: Mystery shopping, CSAT/NPS surveys, POS data analysis, shopper journey mapping, price elasticity modeling
- Stats: 40+ projects, 500+ stores, 2M+ consumers
- Route: `/industries/retail`
- Updated navigation links in desktop mega menu and mobile menu

### February 8, 2026 - Mobile Navigation & Footer Update (COMPLETED)

**Mobile Navigation Refactor:**
- Unified "What We Do" button in main mobile menu
- Multi-level slide-out panel system matching desktop
- Category selection panel with: Services, Solutions, Industries, Practice Areas
- Each category has dedicated sub-panel with all links
- Back navigation between panels works correctly
- Menu closes after link selection
- Smooth animations using Framer Motion

**Footer Update:**
- Expanded from 4 columns to 6 columns on desktop
- New sections:
  - Brand (spans 2 columns) with logo, description, social, contact info
  - Services (5 key service links)
  - Solutions (5 software product links)
  - Industries (5 industry links)
  - Company (About, Practice Areas, Insights, Contact)
- Responsive grid: 2 cols mobile, 3 cols tablet, 6 cols desktop
- All links verified working

### February 2026 - Major Updates

**Navigation Overhaul - Mega Menu:**
- Simplified navigation: Home | About | What We Do | Insights | Contact
- "What We Do" mega menu with 4 tabs: Services, Solutions, Industries, Practice Areas
- Clean, organized dropdown with icons and descriptions

**Software Solutions Section:**
- SolutionsHubPage with product showcase
- 8 software products with detail pages:
  - Survey360 - End-to-end survey management
  - DataViz Studio - Analytics & visualization
  - M&E Tracker - M&E management system
  - FieldForce - Mobile data collection
  - AgriData Pro - Agricultural intelligence
  - EduInsights - Education analytics
  - HealthPulse - Healthcare analytics
  - WASH Monitor - WASH tracking system

**Industries Section:**
- 15 industry pages with sector-specific solutions
- Industries Hub page with grid layout

**Insights & Resources:**
- Auto-carousel featured articles (6-second rotation)
- Article detail pages with navigation
- Save to Reading List (localStorage)
- Your Reading List section

### January 2026 - Initial Build
- Services Hub redesign with interactive elements
- 14 service pages (McKinsey-style)
- 15 practice area pages
- Ubuntu Light font across website

## Tech Stack
- Frontend: React.js with Tailwind CSS, Framer Motion
- Backend: FastAPI (Python)
- Database: MongoDB
- Payments: Stripe (via emergentintegrations library)
- Font: Ubuntu Light (Google Fonts)
- Icons: Lucide React

## Key Files
- `/app/frontend/src/App.js` - Main app with Navbar, Footer, routes
- `/app/frontend/src/pages/SolutionsPages.js` - Software solutions with pricing
- `/app/frontend/src/pages/PaymentSuccessPage.js` - Payment result handling
- `/app/frontend/src/pages/IndustriesPages.js` - Industries hub and detail pages
- `/app/frontend/src/pages/InsightsPage.js` - Insights hub
- `/app/frontend/src/pages/ArticlePage.js` - Article detail page
- `/app/frontend/src/pages/ServicesHubRedesigned.js` - Services hub
- `/app/frontend/src/pages/PracticeAreaPages.js` - Practice areas
- `/app/backend/server.py` - Main API with payment routes

## Key API Endpoints
- `POST /api/payments/checkout` - Create Stripe checkout session
- `GET /api/payments/status/{session_id}` - Get payment status
- `POST /api/webhook/stripe` - Stripe webhook handler

## Test IDs Available
- `mobile-menu-btn` - Hamburger menu button
- `mega-menu-btn` - Desktop What We Do button
- `mobile-what-we-do-btn` - Mobile What We Do button
- `mobile-services-btn`, `mobile-solutions-btn`, `mobile-industries-btn`, `mobile-practice-areas-btn`
- `footer`, `footer-services-title`, `footer-solutions-title`, `footer-industries-title`, `footer-company-title`
- `buy-monthly-btn`, `buy-annual-btn`, `buy-small-btn`, `buy-medium-btn` - Payment buttons
- `view-pricing-btn`, `contact-enterprise-btn` - Pricing navigation

## Upcoming Tasks (P1)
1. **Auth0 SSO Integration** - Single Sign-On across all software products (WAITING FOR USER CREDENTIALS)
2. **User Dashboard** - Authenticated page for users to view/access purchased products
3. **Product Access Management** - Sync purchased products with user accounts

## Future Tasks (P2)
1. **Custom CMS Admin Panel** - Content management system for managing services, solutions, industries content
2. **Individual Solution Demo Pages** - Add demo videos/screenshots to solution detail pages
3. Code refactoring - Split large App.js into smaller component files
4. SEO optimizations - Meta tags, structured data
5. Complete Backend MVC Refactoring - Move routes from server.py to /routes/ directory
