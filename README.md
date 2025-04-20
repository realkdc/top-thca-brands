# Top THCA Brands Website

A professional website showcasing premium THCA brands with a content management system, brand submission functionality, and traffic tracking capabilities.

## Project Overview

Top THCA Brands is a curated directory of premium THCA products and brands, serving as an authority for spotlighting elite THCA brands. The platform includes both a public-facing website and an admin dashboard for content management.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Key Features](#key-features)
- [Database Options](#database-options)
- [API Structure](#api-structure)
- [Deployment](#deployment)
- [Traffic & Analytics](#traffic--analytics)
- [Troubleshooting](#troubleshooting)

## Tech Stack

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Supabase (PostgreSQL) with MongoDB migration support
- **Authentication**: JWT with Supabase Auth
- **Storage**: Supabase Storage for brand images

### Infrastructure
- **Frontend Hosting**: Netlify
- **Backend Hosting**: Render
- **Analytics**: Google Analytics (GA4)

## Project Structure

The project consists of two main parts:

```
/
├── top-thca-brands-frontend/   # React/TypeScript frontend
│   ├── public/                 # Static assets
│   │   └── index.html          # HTML entry point with GA tracking
│   └── index.html              # HTML entry point with GA tracking
│
└── backend/                    # Node.js/Express backend
    ├── src/                    # Source code
    │   ├── controllers/        # Route controllers
    │   ├── middleware/         # Express middleware
    │   ├── models/             # Data models
    │   ├── routes/             # API routes
    │   └── utils/              # Utility functions
    └── migrations/             # Database migration scripts
```

## System Architecture

```
                  ┌───────────────┐
                  │   Netlify     │
                  │  (Frontend)   │
                  └───────┬───────┘
                          │
                          ▼
┌─────────────┐    ┌───────────────┐    ┌───────────────┐
│ Web Browser │◄───┤  React App    │    │  Google       │
│ (User)      │    │  (Vite)       │───►│  Analytics    │
└─────────────┘    └───────┬───────┘    └───────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    Render     │
                  │   (Backend)   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Supabase    │
                  │  (Database)   │
                  └───────────────┘
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Git
- Supabase account (or MongoDB account if using MongoDB)

### Backend Setup
1. Clone the repository and navigate to backend directory:
   ```bash
   git clone https://github.com/realkdc/top-thca-brands.git
   cd top-thca-brands/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```
   # Create a .env file with these variables
   PORT=5001
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   JWT_SECRET=your_secure_jwt_key_here
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../top-thca-brands-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```
   # Create a .env.development file
   VITE_API_URL=http://localhost:5001
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Admin Dashboard: http://localhost:5173/admin
   - Redirect: http://localhost:5173/go/smoky (for testing referral tracking)

## Key Features

### Public Website
- **Brand Showcase**: Curated listing of premium THCA brands
- **Submission Form**: Contact form for brand submission requests
- **Responsive Design**: Mobile and desktop optimized interface
- **Redirect System**: Tracks external referral traffic (/go/smoky endpoint)

### Admin Dashboard
- **Authentication**: Secure login for admin users
- **Brand Management**: CRUD operations for brands
  - Add, edit, delete brands
  - Reorder brand listings
  - Upload brand images
- **Contact Form Management**: Review and process brand submissions
  - View submission details
  - Update submission status (pending, reviewed, approved, rejected)
  - Add admin notes
- **User Management**: Admin-only user control
  - Create new admin users
  - Manage user access

### Frontend Routes
- `/` - Main landing page with brand showcase
- `/login` - Admin login page
- `/admin` - Admin dashboard (protected)
- `/go/:target` - Dynamic redirect system for tracking referrals
- `/go-smoky.html` - Static redirect to Smoky Mountain CBD

## Database Options

This application supports two database options:

### Supabase (Primary)
The application primarily uses Supabase (PostgreSQL):
- Set up a Supabase project at [app.supabase.com](https://app.supabase.com)
- Configure `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_SERVICE_KEY` in your `.env` file

The Supabase schema includes these main tables:
- `brands`: Store brand information (name, description, logo, etc.)
- `users`: Admin user accounts with authentication
- `contacts`: Brand submission form entries

### MongoDB (Legacy Support)
The application originally used MongoDB and still has legacy support:
- Set up a MongoDB Atlas account or local MongoDB server
- Configure the `MONGODB_URI` in your `.env` file

## API Structure

### Authentication Endpoints
- `POST /api/auth/login` - Authenticate a user and return JWT token
- `POST /api/auth/register` - Register a new admin user (admin only)
- `GET /api/auth/profile` - Get the current user's profile

### Brand Endpoints
- `GET /api/brands` - Get all brands (public)
- `GET /api/brands/:id` - Get a specific brand (public)
- `POST /api/brands` - Create a new brand (admin only)
- `PUT /api/brands/:id` - Update a brand (admin only)
- `DELETE /api/brands/:id` - Delete a brand (admin only)
- `PUT /api/brands/reorder` - Reorder brands (admin only)

### Contact Form Endpoints
- `POST /api/contact` - Submit a contact form (public)
- `GET /api/contact` - Get all contact submissions (admin only)
- `GET /api/contact/:id` - Get a specific contact submission (admin only)
- `PUT /api/contact/:id` - Update contact status (admin only)
- `DELETE /api/contact/:id` - Delete a contact submission (admin only)

### User Management Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create a new user (admin only)
- `PUT /api/admin/users/:id` - Update a user (admin only)
- `DELETE /api/admin/users/:id` - Delete a user (admin only)

## Deployment

### Netlify (Frontend)
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `cd top-thca-brands-frontend && npm run build`
   - Publish directory: `top-thca-brands-frontend/dist`
3. Set environment variables:
   - `VITE_API_URL` to your backend URL

### Render (Backend)
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Configure build settings:
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
4. Set environment variables:
   - All the variables from your `.env` file

## Traffic & Analytics

### Google Analytics
- **Tracking ID**: G-3GRNBSGY9H
- **Implementation**: Added to index.html in the head section
- **Features**: Tracks page views, events, and user behavior

### Bot Traffic / Referral System
- Purpose: Route traffic from external sources through your site to appear as referrals
- Implementation:
  - React component: `src/pages/Redirect.tsx`
  - Static HTML: `public/go-smoky.html`
  - Routes: Added to `App.tsx`
- Usage:
  - Send traffic to `https://topthcabrands.com/go/smoky`
  - Visitors will be redirected to the destination with your site as the referrer

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify Supabase credentials in your `.env` file
- Check if Supabase project is active
- Ensure database schema matches expected structure

#### Authentication Issues
- Check if JWT_SECRET in environment variables matches
- Verify user exists in the database
- Clear browser cache and cookies

#### API Request Failures
- Check browser console for CORS errors
- Verify API URL is correctly set in environment variables
- Check network tab for detailed error responses

### Specific Error Solutions

#### "Could not find the 'brand_name' column of 'contacts'"
- Add the missing column to your Supabase database:
  ```sql
  ALTER TABLE contacts ADD COLUMN brand_name TEXT NOT NULL DEFAULT '';
  ```

#### "Could not find the 'website' column of 'contacts'"
- Add the missing column to your Supabase database:
  ```sql
  ALTER TABLE contacts ADD COLUMN website TEXT;
  ```

## Creating an Initial Admin User

Create your first admin user using this script:

1. In the backend directory, create a file called `createAdmin.js` with the contents from the `createAdmin.js` in the root.

2. Run the script:
```bash
cd backend
node createAdmin.js
```

## License

This project is proprietary and confidential. © Top THCA Brands. 