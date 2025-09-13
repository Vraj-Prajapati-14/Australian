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
    clientPosition: String,
    clientCompany: String,
    
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
    
    // Project Details - Enhanced
    completionDate: Date,
    startDate: Date,
    duration: String, // e.g., "6 months", "3 weeks"
    teamSize: Number,
    budget: String,
    location: String,
    
    // Content Sections
    projectScope: String,
    challenges: String,
    solutions: String,
    
    // Project Stats - Portfolio Style
    projectStats: {
      stat1: { label: String, value: String }, // e.g., "Patients: 10K+"
      stat2: { label: String, value: String }, // e.g., "Appointments: 25K+"
      stat3: { label: String, value: String }, // e.g., "Efficiency: 50%+"
      stat4: { label: String, value: String }  // e.g., "Satisfaction: 95%"
    },
    
    // Key Results - Enhanced
    results: {
      vehiclesUpgraded: Number,
      costSavings: Number,
      efficiencyImprovement: Number,
      // Additional result metrics
      customResults: [{
        label: String,
        value: String,
        icon: String // e.g., "📈", "💰", "⚡"
      }]
    },
    
    // Key Features - Portfolio Style
    keyFeatures: [String], // e.g., ["Patient portal with secure access", "Automated appointment scheduling"]
    
    // Development Process - Portfolio Style
    developmentProcess: [{
      step: Number,
      title: String,
      description: String,
      duration: String
    }],
    
    testimonial: String,
    technologies: [String],
    tags: [String],
    
    // SEO
    seoTitle: String,
    seoDescription: String,
    
    // Additional Portfolio Fields
    industry: String,
    projectType: String,
    methodology: String
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