const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Admin expects 'role'; keep 'position' as optional alias for public site
    role: { type: String, required: true },
    position: { type: String },
    // Admin expects Department ref to show department.name
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    bio: String,
    email: String,
    phone: String,
    // Admin uses 'avatar'; public site can also use 'image'
    avatar: imageSchema,
    image: imageSchema,
    // Admin fields
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
    showContact: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    // Public site optional fields
    isLeadership: { type: Boolean, default: false },
    region: String,
    linkedin: String,
    twitter: String,
    website: String,
    qualifications: [String],
    specialties: [String],
    achievements: [String],
    experience: { type: Number },
    startDate: Date,
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

// Index for better query performance
teamMemberSchema.index({ department: 1, isLeadership: 1, isActive: 1 });
teamMemberSchema.index({ order: 1, isActive: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
module.exports = TeamMember;

