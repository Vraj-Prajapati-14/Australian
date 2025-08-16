const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const seedServices = require('./services');

async function ensureSeedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = await Admin.findOne({ email });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash, name: 'Admin' });
  console.log('Seed admin created:', email);
}

async function seedAll() {
  try {
    await ensureSeedAdmin();
    await seedServices();
    console.log('✅ All seed data created successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

module.exports = { ensureSeedAdmin, seedAll };

