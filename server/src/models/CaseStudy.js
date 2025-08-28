const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const caseStudySchema = new mongoose.Schema(
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
      enum: ['active', 'inactive', 'draft'], 
      default: 'active' 
    },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    completionDate: Date,
    projectScope: String,
    challenges: String,
    solutions: String,
    results: {
      vehiclesUpgraded: Number,
      costSavings: Number,
      efficiencyImprovement: Number
    },
    testimonial: String,
    technologies: [String],
    tags: [String],
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

// Pre-save hook to generate slug if not provided
caseStudySchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better query performance
caseStudySchema.index({ service: 1, status: 1 });
caseStudySchema.index({ department: 1, status: 1 });
caseStudySchema.index({ isFeatured: 1, status: 1 });

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
module.exports = CaseStudy; 