const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Default environment variables
const defaultEnv = {
  MONGO_URI: 'mongodb://localhost:27017/australian_services',
  JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRE: '30d',
  ADMIN_EMAIL: 'admin@australian.com',
  ADMIN_PASSWORD: 'admin123',
  NODE_ENV: 'development',
  FRONTEND_URLS: 'http://localhost:5173,http://localhost:5174,http://localhost:5175'
};

// Admin model (simplified version)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Administrator' },
  role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...');
    
    // Connect to MongoDB
    await mongoose.connect(defaultEnv.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultEnv.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Create admin user
    const passwordHash = await bcrypt.hash(defaultEnv.ADMIN_PASSWORD, 10);
    await Admin.create({
      email: defaultEnv.ADMIN_EMAIL,
      passwordHash,
      name: 'Admin'
    });
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', defaultEnv.ADMIN_EMAIL);
    console.log('🔑 Password:', defaultEnv.ADMIN_PASSWORD);
    console.log('\n⚠️  IMPORTANT: Change these credentials in production!');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

setupAdmin(); 