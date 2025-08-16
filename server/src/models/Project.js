const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    clientName: String,
    location: String,
    description: String,
    servicesInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['planned', 'in_progress', 'completed'], default: 'completed' },
    coverImage: imageSchema,
    gallery: [imageSchema],
    tags: [String],
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

