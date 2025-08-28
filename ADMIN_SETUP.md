# Admin Setup Guide

## Quick Setup

### Windows Setup (Recommended)

1. **Run the automated setup script**:
   ```powershell
   .\setup-windows.ps1
   ```

2. **Start the application**:
   ```powershell
   # Terminal 1 - Start server
   .\start-server.ps1
   
   # Terminal 2 - Start client
   .\start-client.ps1
   ```

### Manual Setup

#### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 2. Set up Environment Variables

Create a `.env` file in the `server` directory with the following content:

```env
# Database
MONGO_URI=mongodb://localhost:27017/australian_services

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Admin credentials
ADMIN_EMAIL=admin@australian.com
ADMIN_PASSWORD=admin123

# Environment
NODE_ENV=development

# Frontend URLs
FRONTEND_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

#### 3. Set up Admin User

Run the setup script to create the admin user:

```bash
node setup-admin.js
```

This will create an admin user with:
- Email: `admin@australian.com`
- Password: `admin123`

#### 4. Start the Application

**Windows (PowerShell)**:
```powershell
# Start the server (in server directory)
cd server
npm start

# Start the client (in client directory)
cd ../client
npm run dev
```

**Linux/Mac**:
```bash
# Start the server (in server directory)
cd server && npm start

# Start the client (in client directory)
cd ../client && npm run dev
```

#### 5. Access Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with the admin credentials
3. You'll be redirected to the admin dashboard

## Admin Features

### Services Management
- Create, edit, and delete main services
- Create, edit, and delete sub-services
- Manage service categories
- Set featured services
- Control service status (active/inactive/draft)

### Team Management
- Add, edit, and delete team members
- Assign departments
- Upload profile images
- Manage social media links

### Departments Management
- Create and manage departments
- Set department colors
- Control department status

### Categories Management
- Create hierarchical service categories
- Set category order
- Manage parent-child relationships

## Troubleshooting

### Common Issues

1. **500 Error when creating services**
   - Ensure MongoDB is running
   - Check that admin user exists
   - Verify JWT_SECRET is set

2. **Authentication errors**
   - Clear browser localStorage
   - Re-run the setup script
   - Check admin credentials

3. **CORS errors**
   - Verify FRONTEND_URLS in .env
   - Ensure client is running on correct port

4. **Database connection issues**
   - Check MongoDB is running
   - Verify MONGO_URI in .env
   - Ensure database exists

5. **Text component errors**
   - Fixed in latest version
   - Ensure you're using the updated AdminServicesPage.jsx

6. **PowerShell command issues**
   - Use the provided PowerShell scripts
   - Or use separate commands instead of `&&`

### Debug Mode

To enable detailed error logging, set `NODE_ENV=development` in your `.env` file.

## Security Notes

⚠️ **IMPORTANT**: Change the default admin credentials in production!

- Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in production
- Use a strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Configure proper CORS settings
- Use HTTPS in production

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Services
- `GET /api/services` - List services
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Categories
- `GET /api/service-categories` - List categories
- `POST /api/service-categories` - Create category (admin only)
- `PUT /api/service-categories/:id` - Update category (admin only)
- `DELETE /api/service-categories/:id` - Delete category (admin only)

### Team
- `GET /api/team` - List team members
- `POST /api/team` - Add team member (admin only)
- `PUT /api/team/:id` - Update team member (admin only)
- `DELETE /api/team/:id` - Delete team member (admin only)

### Departments
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department (admin only)
- `PUT /api/departments/:id` - Update department (admin only)
- `DELETE /api/departments/:id` - Delete department (admin only) 