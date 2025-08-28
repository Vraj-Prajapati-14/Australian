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
    shortDescription: String,
    description: String,
    clientName: String,
    
    // Associations
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    
    heroImage: imageSchema,
    gallery: [imageSchema],
    status: { 
      type: String, 
      enum: ['planned', 'in-progress', 'completed', 'on-hold', 'active', 'inactive', 'draft'], 
      default: 'in-progress' 
    },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    completionDate: Date,
    budget: Number,
    technologies: [String],
    challenges: String,
    results: String,
    tags: [String],
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

// Pre-save hook to generate slug if not provided
projectSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better query performance
projectSchema.index({ service: 1, status: 1 });
projectSchema.index({ department: 1, status: 1 });
projectSchema.index({ isFeatured: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

