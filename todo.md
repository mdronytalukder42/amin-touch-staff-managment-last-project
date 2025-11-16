# AMIN TOUCH Staff Management & Income Tracking - TODO

## Database Schema
- [x] Create income_entries table for income tracking
- [x] Create ticket_entries table for ticket management
- [x] Update user table with role field (admin/staff)

## Backend Features
- [x] Income entry CRUD operations (Add, List, Update, Delete)
- [x] Ticket entry CRUD operations (Add, List, Update, Delete)
- [x] User authentication and role-based access
- [x] Admin dashboard data aggregation
- [x] Staff-specific data filtering
- [ ] Invoice generation functionality
- [ ] File upload support for ticket copies

## Frontend Features
- [x] Login page with authentication
- [x] Admin dashboard with summary cards
- [x] Staff dashboard with entry forms
- [x] Income entry form modal
- [x] Ticket entry form modal
- [ ] Data visualization charts (Statistics cards implemented)
- [ ] Invoice download functionality (Future feature)
- [ ] Change password modal (Future feature)
- [x] Notification system
- [x] Responsive design

## UI Components
- [x] Layout with header and footer
- [x] Summary cards for dashboard
- [x] Entry form modals
- [x] Data tables with filtering
- [ ] Charts for data visualization (Statistics implemented)
- [x] Notification toast component

## New Features (User Requested)
- [x] Setup demo user accounts (Admin: AL AMIN, Staff: RONY, MAHIR, SAKIL)
- [x] Add password change functionality for all users
- [x] Update company logo to AMIN TOUCH logo
- [x] Add background image with opacity to login page
- [x] Create custom login system (separate Admin/Staff login)
- [x] Store usernames and passwords in database
- [x] Implement authentication without OAuth

## Bug Fixes & New Requirements
- [x] Fix login authentication - context not working properly
- [x] Change currency symbol from ₹ to QR (Qatari Riyal)
- [x] Restore Home page with "Login to System" button
- [x] Fix routing - Home page should be default, Login page accessible via button

## Critical Bug
- [x] Fix login - users cannot login, not redirecting to dashboard after successful authentication
- [x] Implemented session-based authentication with database sessions table
- [x] Login now successfully redirects to appropriate dashboard (Admin/Staff)

## New Bug Report
- [x] Fix StaffDashboard tRPC procedure calls - income.list and ticket.list not found
- [x] Update StaffDashboard to use income.getMy and ticket.getMy instead

## Major Feature Additions (User Request)

### Ticket Entry Enhancements
- [x] Add "Source" field - where ticket was purchased (agency name)
- [x] Add ticket copy file upload (PDF/PNG/Image)
- [x] Add ticket copy download functionality
- [ ] Add PNR click redirect to airline "Manage My Trip" page

### Search Functionality
- [x] Add search by Passenger Name in both Admin and Staff pages
- [x] Add search by PNR in both Admin and Staff pages
- [ ] Implement search bar in ticket tables

### Edit/Delete Functionality
- [x] Staff can edit their own income entries (backend)
- [x] Staff can delete their own income entries (backend)
- [x] Staff can edit their own ticket entries (backend)
- [x] Staff can delete their own ticket entries (backend)

### Income Entry Enhancements
- [x] Add "Received From" field for tracking money sources

### UI/UX Improvements
- [ ] Convert all pages to dark theme
- [ ] Add 3D animated background slideshow (3 sec interval)
- [ ] Add company logo to all pages
- [ ] Update company name to full: "AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES"

### Invoice/Report Features
- [ ] Add invoice download for Admin
- [ ] Add invoice download for Staff
- [ ] Generate PDF invoices with company branding

### Real-time Updates
- [ ] Fix: Staff data entry should appear in Admin dashboard immediately
- [ ] Implement proper cache invalidation for real-time sync
