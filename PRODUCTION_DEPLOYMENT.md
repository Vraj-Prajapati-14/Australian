# Production Deployment Guide

## Environment Variables Setup

### Frontend (Vercel)

In your Vercel dashboard, add these environment variables:

```env
VITE_API_BASE=https://your-render-app-name.onrender.com/api
```

**How to set in Vercel:**
1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add `VITE_API_BASE` with your Render backend URL

### Backend (Render)

In your Render dashboard, add these environment variables:

```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Authentication
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key

# Frontend URLs (CORS)
FRONTEND_URLS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

**How to set in Render:**
1. Go to your service dashboard
2. Click on "Environment" tab
3. Add each environment variable

## Deployment Steps

### 1. Deploy Backend to Render
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add all environment variables listed above
5. Deploy

### 2. Deploy Frontend to Vercel
1. Connect your GitHub repository to Vercel
2. Set root directory to `client`
3. Add environment variable: `VITE_API_BASE=https://your-render-app.onrender.com/api`
4. Deploy

### 3. Update CORS Settings
After getting your Vercel URL, update the `FRONTEND_URLS` environment variable in Render to include your Vercel domain.

## Important Notes

- Replace `your-render-app-name` with your actual Render app name
- Replace `your-vercel-app` with your actual Vercel app name
- Use MongoDB Atlas for production database
- Use strong, unique passwords and secrets
- Enable HTTPS in production (both Vercel and Render provide this by default)

## Testing Production Setup

1. **Test API Health**: Visit `https://your-render-app.onrender.com/api/health`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Admin Login**: Visit `https://your-vercel-app.vercel.app/admin/login`

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URLS` includes your exact Vercel domain
- Check that the URL doesn't have trailing slashes

### API Connection Issues
- Verify `VITE_API_BASE` is set correctly in Vercel
- Check that your Render app is running and accessible

### Database Issues
- Ensure MongoDB Atlas allows connections from Render's IP ranges
- Verify `MONGO_URI` is correct and includes authentication
