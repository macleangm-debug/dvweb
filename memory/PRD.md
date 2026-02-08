# DataVision International Website - PRD

## Original Problem Statement
User requested restructuring of the DataVision website navigation and services:

## What's Been Implemented

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
- Font: Ubuntu Light (Google Fonts)
- Icons: Lucide React

## Key Files
- `/app/frontend/src/App.js` - Main app with Navbar, Footer, routes
- `/app/frontend/src/pages/SolutionsPages.js` - Software solutions
- `/app/frontend/src/pages/IndustriesPages.js` - Industries hub and detail pages
- `/app/frontend/src/pages/InsightsPage.js` - Insights hub
- `/app/frontend/src/pages/ArticlePage.js` - Article detail page
- `/app/frontend/src/pages/ServicesHubRedesigned.js` - Services hub
- `/app/frontend/src/pages/PracticeAreaPages.js` - Practice areas

## Test IDs Available
- `mobile-menu-btn` - Hamburger menu button
- `mega-menu-btn` - Desktop What We Do button
- `mobile-what-we-do-btn` - Mobile What We Do button
- `mobile-services-btn`, `mobile-solutions-btn`, `mobile-industries-btn`, `mobile-practice-areas-btn`
- `footer`, `footer-services-title`, `footer-solutions-title`, `footer-industries-title`, `footer-company-title`

## Upcoming Tasks (P1)
1. **Custom CMS Admin Panel** - Content management system for managing services, solutions, industries content
2. **Individual Solution Demo Pages** - Add demo videos/screenshots to solution detail pages

## Future Tasks (P2)
1. Code refactoring - Split large App.js into smaller component files
2. SEO optimizations - Meta tags, structured data
3. User accounts for cross-device saved articles sync
4. Centralize hardcoded content into JSON data files
