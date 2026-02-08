# DataVision International Website - PRD

## Original Problem Statement
User requested restructuring of the DataVision website navigation and services:
1. Remove "Research & Statistics" as a standalone navigation item
2. Move Research & Statistics under a "Services" dropdown
3. Create comprehensive McKinsey-style service pages with deep insights
4. Redesign Services hub page with rich visual elements
5. Expand services to 14 total, practice areas to 15 total
6. Use Ubuntu Light font across the website
7. Use icons instead of stock photos for a professional look

## Application Overview
DataVision International is a research and statistics consultancy based in Tanzania, specializing in:
- Agriculture, Education, Health, and WASH sectors
- Large-scale surveys and data collection
- Monitoring & Evaluation
- Capacity building and training

## User Personas
1. **Development Partners** (World Bank, USAID, UN agencies) - Looking for reliable research partners
2. **NGOs and Implementers** - Seeking M&E and data collection services
3. **Government Agencies** - Need policy research and statistics support
4. **Admin Users** - Managing website content

## What's Been Implemented

### February 2026 - Services Expansion (Complete)
**8 New Services Added to Services Hub:**
1. Survey Design (/services/survey-design)
2. Qualitative Research (/services/qualitative-research)
3. GIS & Geospatial (/services/gis-geospatial)
4. Digital Data Solutions (/services/digital-solutions)
5. Program Design (/services/program-design)
6. Policy Research (/services/policy-research)
7. Economic Analysis (/services/economic-analysis)
8. Knowledge Management (/services/knowledge-management)

**Updated Components:**
- ServicesHubRedesigned.js: services array expanded to 14 items
- ServicesHubRedesigned.js: comparison table now shows all 14 services
- Interactive carousel now cycles through all 14 services

### January 2026 - Services Restructure & Redesign
**Navigation Changes:**
- Removed standalone "Research & Statistics" from main nav
- Created Services and Practice Areas dropdowns with hover functionality

**Services Hub Redesign:**
- Animated hero with particle background and grid pattern
- Interactive service preview carousel with navigation dots (14 services)
- Animated statistics bar with hover effects
- Service cards with icons, stats, and hover animations
- Tanzania-focused case studies (Education, WASH, Health, Agriculture) - anonymized
- Service comparison table with timeline, team size, deliverables (14 services)
- Client logos section (World Bank, USAID, UNICEF, GIZ, EU)
- Visual engagement process with connected circular icons
- Bold red CTA section

**Practice Areas Expansion:**
- Created hub and 15 individual practice area pages
- All pages follow McKinsey-style structure

**Files Created/Modified:**
- `/app/frontend/src/App.js` - Updated navigation with dropdowns
- `/app/frontend/src/pages/ServicePages.js` - 14 McKinsey-style service pages
- `/app/frontend/src/pages/ServicesHubRedesigned.js` - Redesigned hub page
- `/app/frontend/src/pages/PracticeAreaPages.js` - 15 practice area pages

## Complete Service List (14 Total)
1. Research & Statistics
2. Monitoring & Evaluation
3. Data Collection
4. Data Analytics
5. Survey Design
6. Qualitative Research
7. GIS & Geospatial
8. Digital Data Solutions
9. Program Design
10. Policy Research
11. Economic Analysis
12. Knowledge Management
13. Capacity Building
14. Technical Advisory

## Tech Stack
- Frontend: React.js with Tailwind CSS, Framer Motion
- Backend: FastAPI (Python)
- Database: MongoDB
- Font: Ubuntu Light (Google Fonts)
- Icons: Lucide React

## Upcoming Tasks (P1)
1. **Custom CMS Admin Panel** - User expressed interest in content management system. Options discussed: WordPress (headless) or custom admin panel with FastAPI + MongoDB

## Future Tasks (P2)
1. Code refactoring - Split ServicePages.js and PracticeAreaPages.js into individual files
2. Remove dead code - Clean up unused components from App.js
3. Add detailed project case study pages
4. Implement SEO optimizations
