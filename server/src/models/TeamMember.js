const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: String,
    photo: imageSchema,
    email: String,
    phone: String,
    socials: {
      linkedin: String,
      twitter: String,
      website: String,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
module.exports = TeamMember;

