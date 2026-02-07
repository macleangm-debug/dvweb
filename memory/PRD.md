# DataVision International Website - PRD

## Original Problem Statement
User requested restructuring of the DataVision website navigation and services:
1. Remove "Research & Statistics" as a standalone navigation item
2. Move Research & Statistics under a "Services" dropdown
3. Create comprehensive McKinsey-style service pages with deep insights, not shallow information

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

## Core Requirements (Static)
- Professional consultancy website
- Admin dashboard for content management
- Contact inquiry system
- Project portfolio showcase
- Team member profiles
- Testimonials from partners

## What's Been Implemented

### January 2026 - Services Restructure
**Navigation Changes:**
- Removed standalone "Research & Statistics" from main nav
- Created Services dropdown with hover functionality
- Services menu includes: All Services, Research & Statistics, M&E, Data Collection, Data Analytics, Capacity Building, Technical Advisory

**New Service Pages (McKinsey-style):**
Each page contains 7 comprehensive sections:
1. **Hero Section** - Value proposition with tagline, title, description, and image
2. **The Challenge** - Industry context and problems clients face
3. **Our Approach** - Step-by-step methodology with numbered process
4. **What We Deliver** - Grid of deliverables with icons
5. **Key Insights** - Statistics and thought leadership content
6. **Why DataVision** - Differentiation and value proposition
7. **CTA Section** - Call-to-action for engagement

**Service Pages Created:**
1. `/services` - Services Hub with overview of all offerings
2. `/services/research-statistics` - Core quantitative/qualitative research
3. `/services/monitoring-evaluation` - M&E frameworks, baselines, impact evaluations
4. `/services/data-collection` - Large-scale field operations
5. `/services/data-analytics` - Analysis and visualization
6. `/services/capacity-building` - Training and knowledge transfer
7. `/services/technical-advisory` - Strategic consulting and policy support

**Files Modified/Created:**
- `/app/frontend/src/App.js` - Updated navigation with dropdown
- `/app/frontend/src/pages/ServicePages.js` - New comprehensive service pages

## Tech Stack
- Frontend: React.js with Tailwind CSS
- Backend: FastAPI (Python)
- Database: MongoDB
- Animations: Framer Motion

## Prioritized Backlog

### P0 (Critical)
- None remaining

### P1 (High Priority)
- Add case study/project detail pages
- Implement blog/news article detail views
- Add newsletter subscription functionality

### P2 (Medium Priority)
- Enhanced search functionality
- Multi-language support (Swahili)
- Client portal for project tracking

### P3 (Future Enhancements)
- Testimonial video integration
- Interactive impact map
- Career/job application system

## Next Tasks
1. Add detailed project case study pages
2. Enhance admin dashboard with rich text editor
3. Implement SEO optimizations
4. Add Google Analytics integration
