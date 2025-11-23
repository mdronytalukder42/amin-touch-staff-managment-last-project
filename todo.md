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
- [x] Add PNR click redirect to airline "Manage My Trip" page

### Search Functionality
- [x] Add search by Passenger Name in both Admin and Staff pages
- [x] Add search by PNR in both Admin and Staff pages
- [x] Implement search bar in ticket tables

### Edit/Delete Functionality
- [x] Staff can edit their own income entries (backend)
- [x] Staff can delete their own income entries (backend)
- [x] Staff can edit their own ticket entries (backend)
- [x] Staff can delete their own ticket entries (backend)

### Income Entry Enhancements
- [x] Add "Received From" field for tracking money sources

### UI/UX Improvements
- [x] Convert all pages to dark theme
- [x] Add 3D animated background slideshow (3 sec interval)
- [x] Add company logo to all pages
- [x] Update company name to full: "AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES"

### Invoice/Report Features
- [x] Add invoice download button for Admin (placeholder)
- [x] Add invoice download button for Staff (placeholder)
- [ ] Generate PDF invoices with company branding

### Real-time Updates
- [x] Fix: Staff data entry should appear in Admin dashboard immediately
- [x] Implement proper cache invalidation for real-time sync (tRPC handles this automatically)

## New Bug Fixes & Feature Requests

### Invoice Download Issues
- [x] Remove "coming soon" message from invoice download button
- [x] Install jsPDF library
- [x] Implement actual PDF invoice generation using jsPDF
- [x] Staff should be able to download their own invoices
- [x] Admin should be able to download invoices for all staff

### Search Improvements
- [x] PNR search results should be highlighted in the table
- [x] Implement visual highlight effect when search matches

### UI Fixes
- [x] Year dropdown should show 2025-2050 (not just 2025)
- [x] Fix year range in all date filters

## UI/UX Improvements (User Request - Nov 22, 2025)

### Invoice Download Button Redesign
- [x] Make invoice download button more attractive with gradient colors
- [x] Add shadow and hover effects to button
- [x] Increase button size and font for better visibility

### PDF Invoice Enhancements
- [x] Add company logo watermark in center of invoice pages (10% opacity)
- [x] Improve table styling with proper borders and lines
- [x] Professional invoice layout with company branding

### Login Page Improvements
- [x] Add footer with technology badges (HTML5, CSS3, JavaScript, TypeScript, React 19)
- [x] Remove demo accounts section from login page
- [x] Clean and professional login page design

### Footer Position Fix
- [x] Move footer from bottom to top of login page
- [x] Update footer design to match reference image exactly
- [x] Footer should be fixed at top with technology badges in horizontal layout

### Login Page Redesign (User Request - Nov 23, 2025)
- [x] Add decorative illustration/lamp on left side of login page
- [x] Redesign login card with green border instead of default styling
- [x] Change login button color to green
- [x] Create two-column layout: left (illustration) and right (login form)
- [x] Maintain dark theme with professional appearance
- [x] Keep footer at top with technology badges
