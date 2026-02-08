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
8. Add Industries section with dedicated pages
9. Add Software Solutions section for standalone products
10. Clean up navigation with Mega Menu approach

## Application Overview
DataVision International is a research and statistics consultancy based in Tanzania, specializing in:
- Agriculture, Education, Health, and WASH sectors
- Large-scale surveys and data collection
- Monitoring & Evaluation
- Capacity building and training
- **Software Solutions** for data collection, analytics, and sector operations

## What's Been Implemented

### February 2026 - Major Updates

**Navigation Overhaul - Mega Menu:**
- Simplified navigation: Home | About | What We Do | Insights | Contact
- "What We Do" mega menu with 4 tabs: Services, Solutions, Industries, Practice Areas
- Clean, organized dropdown with icons and descriptions

**Software Solutions Section (NEW):**
- SolutionsHubPage with product showcase
- 8 software products:
  - Survey360 - End-to-end survey management
  - DataViz Studio - Analytics & visualization
  - M&E Tracker - M&E management system
  - FieldForce - Mobile data collection
  - AgriData Pro - Agricultural intelligence
  - EduInsights - Education analytics
  - HealthPulse - Healthcare analytics
  - WASH Monitor - WASH tracking system
- Individual product detail pages

**Industries Section:**
- 15 industry pages with sector-specific solutions
- Industries Hub page with grid layout

**Insights & Resources:**
- Auto-carousel featured articles (6-second rotation)
- Article detail pages with navigation
- Save to Reading List (localStorage)
- Your Reading List section

**Mobile Navigation:**
- Slide-out panel design
- Sub-menus for Services, Practice Areas, Industries
- Needs update for Solutions

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

## Upcoming Tasks (P1)
1. **Update Mobile Menu** - Add Solutions to slide-out panel
2. **Update Footer** - Reflect all new sections
3. **Custom CMS Admin Panel** - Content management system

## Future Tasks (P2)
1. Code refactoring - Split large component files
2. SEO optimizations
3. Individual product demo pages/videos
