# Environment Setup Guide

## Client Environment Variables

Create a `.env.local` file in the `client` directory:

```env
VITE_API_BASE=http://localhost:5000/api
```

## Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Authentication
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## Required Environment Variables

### Database
- `MONGO_URI`: MongoDB connection string

### Cloudinary (for file uploads)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Admin Authentication
- `ADMIN_EMAIL`: Admin login email
- `ADMIN_PASSWORD`: Admin login password

### Security
- `JWT_SECRET`: Secret key for JWT tokens

## Getting Started

1. **Set up environment variables** as shown above
2. **Install dependencies**:
   ```bash
   cd server && npm install
   cd client && npm install
   ```
3. **Start the servers**:
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev
   
   # Terminal 2 - Client
   cd client && npm run dev
   ```
4. **Access the application**:
   - Frontend: http://localhost:5173
   - Admin: http://localhost:5173/admin/login
   - API: http://localhost:5000/api

## API Endpoints

### Public Endpoints
- `GET /api/departments/active` - Get active departments
- `GET /api/services` - Get services
- `GET /api/team` - Get team members

### Admin Endpoints (require authentication)
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `POST /api/team` - Create team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member
- `POST /api/media/upload` - Upload file to Cloudinary 