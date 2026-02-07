# DataVision International Website - PRD

## Original Problem Statement
User requested restructuring of the DataVision website navigation and services:
1. Remove "Research & Statistics" as a standalone navigation item
2. Move Research & Statistics under a "Services" dropdown
3. Create comprehensive McKinsey-style service pages with deep insights
4. Redesign Services hub page with rich visual elements

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

### January 2026 - Services Restructure & Redesign
**Navigation Changes:**
- Removed standalone "Research & Statistics" from main nav
- Created Services dropdown with hover functionality

**Services Hub Redesign:**
- Animated hero with particle background and grid pattern
- Interactive service preview carousel with navigation dots
- Animated statistics bar with hover effects
- Service cards with images, stats, and hover animations
- Tanzania-focused case studies (Education, WASH, Health, Agriculture) - anonymized
- Service comparison table with timeline, team size, deliverables
- Client logos section (World Bank, USAID, UNICEF, GIZ, EU)
- Visual engagement process with connected circular icons
- Bold red CTA section

**Files Created/Modified:**
- `/app/frontend/src/App.js` - Updated navigation
- `/app/frontend/src/pages/ServicePages.js` - McKinsey-style service pages
- `/app/frontend/src/pages/ServicesHubRedesigned.js` - Redesigned hub page

## Tech Stack
- Frontend: React.js with Tailwind CSS, Framer Motion
- Backend: FastAPI (Python)
- Database: MongoDB

## Next Tasks
1. Add detailed project case study pages
2. Implement SEO optimizations
