# DataVision International Platform - PRD

## Original Problem Statement
Build a comprehensive web platform for DataVision featuring a decentralized, product-led architecture with:
1. Product-Centric Billing handled within individual products
2. Core product integration (Survey360, FieldForce, DataPulse, DataViz Studio)
3. Scalable navigation using categorized mega menu
4. Sales inquiry funnel for Enterprise/Government solutions
5. Unified Single Sign-On (SSO) across all products

## User Personas
- **End Users**: Researchers, data collectors, organizations using DataVision products
- **Enterprise Clients**: Large organizations requesting demos for Government/Enterprise solutions
- **Admins**: DataVision staff managing users, content, and inquiries

## Core Requirements

### Authentication
- [x] Centralized DataVision SSO for all products
- [x] Two-step registration (Basic info + Profile details)
- [x] SSO token exchange for FieldForce, Survey360, DataPulse, DataViz
- [x] Password reset flow with email verification

### Registration Fields Collected
**Step 1 (Required):** Full Name, Email, Password
**Step 2 (Optional):** Country, Industry, Organization, Job Title, Company Size, Phone, How Heard

### Admin Features
- [x] User Management with filtering/search
- [x] Solution Inquiries management
- [x] Dashboard with analytics
- [x] Content Management System
- [x] Expert Network management
- [x] Affiliate/Referral programs

### Products Integrated
- [x] FieldForce - Field data collection
- [x] Survey360 - Survey management
- [x] DataPulse - Real-time analytics
- [x] DataViz Studio - Data visualization

## What's Been Implemented

### Feb 2026 - SSO & Billing UI
- Unified DataVision SSO implemented across all 4 products
- Individual product login pages redirect to central SSO
- Consistent billing page UI/UX across all products
- Application footer fixed (landing pages have full footer, app pages have minimal footer)

### User Registration Flow
1. User accesses `/auth/register`
2. Step 1: Basic info collected → `POST /api/auth/register`
3. Step 2: Optional profile details → `PUT /api/auth/profile`
4. SSO token exchange to redirect to product dashboard

### Admin User Data View
- Admin Console → User Management → All Users
- Shows: Client info, Location, Organization, Products accessed, Registration date
- Filter by Country, Industry
- Export to CSV

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/sso/{product}` - SSO token exchange (fieldforce, survey360, datapulse, dataviz)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Admin
- `GET /api/admin/users` - Get all registered users with stats
- `GET /api/inquiries` - Get solution inquiries
- `PUT /api/inquiries/{id}/status` - Update inquiry status

## Database Schema

### datavision_users Collection
```json
{
  "id": "uuid",
  "email": "string",
  "password": "hashed",
  "name": "string",
  "is_admin": "boolean",
  "country": "string (optional)",
  "industry": "string (optional)",
  "organization": "string (optional)",
  "job_title": "string (optional)",
  "company_size": "string (optional)",
  "phone": "string (optional)",
  "how_heard": "string (optional)",
  "profile_completed": "boolean",
  "products_accessed": ["string"],
  "created_at": "datetime",
  "last_login": "datetime"
}
```

### inquiries Collection
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "organization": "string",
  "organization_type": "string",
  "country": "string",
  "employee_count": "string",
  "message": "string",
  "solution": "string",
  "solution_name": "string",
  "type": "demo_request",
  "status": "new|contacted|qualified|converted|closed",
  "created_at": "datetime"
}
```

## Prioritized Backlog

### P0 - Critical
- [ ] Create Unified Products Dashboard (post-SSO login destination)

### P1 - High Priority
- [ ] Pull interactive pages for Data Collection solutions (needs repo URLs)
- [ ] Integrate Government solutions websites (Taxxa, Ammo, LegalPro - needs URLs)
- [ ] Implement functional billing backend with Stripe

### P2 - Medium Priority
- [ ] Analyze veristamp solution integration (needs URL)
- [ ] Implement Resend domain verification for emails
- [ ] Build interactive product demos

### P3 - Future
- [ ] Implement user referral system
- [ ] Consolidate duplicate auth redirect components

## Technical Debt
- Auth redirect components (FFAuthRedirect, S360AuthRedirect, DPAuthRedirect, DVAuthRedirect) contain duplicate code - should be consolidated

## Test Credentials
- **Admin**: admin@datavision.co.tz / admin123

## Project Health
- **Working**: SSO authentication, User registration, Admin panel, Product routing
- **Mocked**: Billing/subscription functionality (UI only, no backend)
