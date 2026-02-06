# DataVision International Website - PRD

## Project Overview
Modern website for DataVision International - a 25+ year old Tanzanian research and statistics consultancy expanding across Africa to attract local partners for donor-funded research projects.

## Original Problem Statement
Build a modern, McKinsey-style website that positions DataVision as Africa's premier research consultancy. Focus on Research & Statistics while keeping other services (ICT, Payments, Training) secondary.

## User Personas
1. **Development Organizations** - World Bank, USAID, UNICEF, UN agencies seeking African research partners
2. **NGOs & Foundations** - Room to Read, Ecorys looking for data collection services
3. **Potential Local Partners** - African firms wanting to collaborate on large research projects
4. **Government Agencies** - Ministries needing M&E studies

## Core Requirements
- McKinsey-style design (clean, authoritative, professional)
- Colors: Deep Navy (#0a1628), Red accent (#e63946)
- Focus: Research & Statistics (primary), other services (secondary)
- Interactive Africa map showing project presence
- Animated statistics counters
- Client testimonials carousel
- Admin panel for content management
- Contact form with bot protection (honeypot)

## What's Been Implemented (Jan 2026)

### Backend (FastAPI + MongoDB)
- ✅ Admin authentication (JWT-based)
- ✅ Statistics API (CRUD)
- ✅ Projects API (CRUD, filter by sector)
- ✅ Team members API (CRUD)
- ✅ Testimonials API (CRUD)
- ✅ Partners API (CRUD)
- ✅ News/Articles API (CRUD)
- ✅ Inquiries API with honeypot bot protection
- ✅ Database seeding with initial content

### Frontend (React + Tailwind)
- ✅ Homepage with rotating hero messages
- ✅ Interactive Africa map (SVG-based)
- ✅ Animated statistics counters
- ✅ Testimonials carousel (auto-rotate)
- ✅ Featured projects section
- ✅ Practice areas (Agriculture, Education, Health, WASH)
- ✅ Partners logo strip
- ✅ About page with team, values, story
- ✅ Research & Statistics page (detailed)
- ✅ Other Services page (combined, less prominent)
- ✅ Practice Areas page with map
- ✅ Projects page with sector filtering
- ✅ News page
- ✅ Contact page with form (honeypot protection)
- ✅ Admin login page
- ✅ Admin dashboard (inquiries, projects, statistics)
- ✅ Responsive design
- ✅ McKinsey-style typography (Crimson Text + DM Sans)

### Admin Credentials
- Email: info@datavision.co.tz
- Password: walkthetalkdvi1998

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Core website structure
- [x] Research & Statistics focus
- [x] Contact form with bot protection
- [x] Admin panel

### P1 (High Priority)
- [ ] Email notifications for new inquiries (SendGrid/Resend integration)
- [ ] Rich text editor for news articles in admin
- [ ] Image upload for projects/team members

### P2 (Medium Priority)
- [ ] Blog/Insights section with full CMS
- [ ] Case study detail pages
- [ ] Newsletter subscription
- [ ] Multi-language support (Swahili)

### P3 (Nice to Have)
- [ ] Advanced analytics dashboard
- [ ] PDF company profile download
- [ ] Calendar integration for consultations
- [ ] Live chat widget

## Next Tasks
1. Add email notifications for inquiries (SendGrid integration)
2. Implement image upload for admin panel
3. Add rich text editor for news content
4. Create detailed case study pages

## Tech Stack
- Frontend: React 19, Tailwind CSS, Framer Motion
- Backend: FastAPI, MongoDB, Motor
- Auth: JWT with bcrypt
- Hosting: Emergent Platform

## Testing Status
- Backend: 100% (16/16 tests passed)
- Frontend: 95% (all core features working)
