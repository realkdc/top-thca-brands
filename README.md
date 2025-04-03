# Top THCA Brands Website

This is a full-stack application for the Top THCA Brands website, showcasing premium THCA brands with a content management system.

## Project Structure

The project consists of two main parts:
- `top-thca-brands-frontend`: A React/TypeScript frontend built with Vite
- `backend`: A Node.js/Express backend with MongoDB

## Prerequisites

- Node.js (v14 or later)
- For development: MongoDB (installed locally) or a MongoDB Atlas account
- npm or yarn package manager

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory if it doesn't exist
   - Set the following variables (update as needed):
     ```
     PORT=5001
     # MongoDB Atlas connection (already configured)
     MONGODB_URI=mongodb+srv://indieplantmarketing:<password>@topthcabrands.ea79zxn.mongodb.net/?retryWrites=true&w=majority&appName=topthcabrands
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
   cd top-thca-brands-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env.development` file if it doesn't exist
   - Set the following variables:
     ```
     VITE_API_URL=http://localhost:5001
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Accessing the Application

- **Frontend Website**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
  - You'll need to create an initial admin user (see below)

## Creating an Initial Admin User

To create your first admin user, you can use the MongoDB shell or a tool like MongoDB Compass, or run this script:

1. In the backend directory, create a file called `createAdmin.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

// Get the User model
const User = require('./src/models/User');

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com', // Change this to your email
  password: 'admin123!', // Change this to a secure password
  role: 'admin'
};

// Create the admin user
async function createAdmin() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new user
    const user = await User.create(adminUser);
    console.log('Admin user created successfully:', user.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
```

2. Run the script:
```bash
node createAdmin.js
```

3. Now you can log in to the admin dashboard with the email and password you specified.

## Features

- **Public Website**:
  - Brand showcase with categories
  - Contact form for brand submissions
  - Responsive design

- **Admin Dashboard**:
  - Brand management (add, edit, delete, reorder)
  - Contact submission management
  - User management (admins can create and manage users)

## Deployment

### Setting Up MongoDB Atlas (for Production)

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient to get started)
3. Create a database user with password authentication
4. Whitelist your IP address or set it to allow access from anywhere (0.0.0.0/0)
5. Click "Connect" on your cluster and select "Connect your application"
6. Copy the connection string and replace `<username>`, `<password>`, and `<cluster>` with your information
7. Update your production `.env` file with this connection string

### Deploying the Application

1. Update the `.env` files with production settings:
   - Set `NODE_ENV=production`
   - Use your MongoDB Atlas connection string
   - Update the `CLIENT_URL` to your production frontend URL
   - Use a strong, random `JWT_SECRET`

2. Build the frontend:
   ```bash
   cd top-thca-brands-frontend
   npm run build
   ```

3. Deploy options:
   - **Heroku**: Create Procfile and deploy both frontend and backend
   - **Vercel/Netlify**: Deploy frontend and use a service like Render or Railway for the backend
   - **DigitalOcean/AWS**: Deploy using Docker containers or directly on VMs

4. Set up environment variables on your hosting platform

5. Create your admin user once deployed using the `createAdmin.js` script

## License

This project is proprietary and confidential.

## Database Options

This application supports two database options:

### MongoDB (Original)
The application was originally built with MongoDB as the database. To use MongoDB:
- Set up a MongoDB Atlas account or local MongoDB server
- Configure the `MONGO_URI` in your `.env` file

### Supabase (New)
The application now supports Supabase as an alternative database. To use Supabase:
- Set up a Supabase project at [app.supabase.com](https://app.supabase.com)
- Configure `SUPABASE_URL` and `SUPABASE_KEY` in your `.env` file

## Migrating from MongoDB to Supabase

To migrate your application from MongoDB to Supabase:

1. Make sure your `.env` file contains both MongoDB and Supabase credentials:
   ```
   # MongoDB configuration
   MONGODB_URI=your_mongodb_uri
   
   # Supabase configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your-anon-key
   
   # Common configuration
   JWT_SECRET=your_secure_jwt_secret
   ```

2. Run the complete migration script:
   ```bash
   cd backend
   node scripts/completeSupabaseMigration.js
   ```

3. This script will:
   - Test your Supabase connection
   - Set up necessary tables and storage buckets
   - Migrate existing data from MongoDB
   - Update your routes to use Supabase controllers

4. Start your server and verify everything works:
   ```bash
   npm start
   ``` 