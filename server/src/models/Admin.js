const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Administrator' },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

