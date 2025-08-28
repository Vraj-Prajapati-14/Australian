const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const specificationSchema = new mongoose.Schema({
  material: String,
  weight: String,
  installation: String,
  dimensions: String,
  capacity: String,
  warranty: String,
});

const pricingSchema = new mongoose.Schema({
  base: Number,
  currency: { type: String, default: 'AUD' },
  includes: [String],
  options: [{
    name: String,
    price: Number,
    description: String
  }]
});

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: String,
    content: String, // HTML or markdown
    heroImage: imageSchema,
    gallery: [imageSchema],
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
    
    // Service hierarchy - main service or sub-service
    isMainService: { type: Boolean, default: true }, // Main service like "Ute", "Trailer", "Truck"
    parentService: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', default: null }, // For sub-services
    subServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // For main services
    
    // Department association
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    
    // Enhanced fields
    shortDescription: String,
    features: [String],
    specifications: specificationSchema,
    pricing: pricingSchema,
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
    
    // Vehicle compatibility
    compatibleVehicles: [String],
    
    // Installation info
    installationTime: String,
    installationLocations: [String],
    
    // Additional fields
    brochureUrl: String,
    videoUrl: String,
    testimonials: [{
      name: String,
      company: String,
      text: String,
      rating: Number
    }]
  },
  { timestamps: true }
);

// Pre-save hook to generate slug if not provided
serviceSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  next();
});

// Index for better query performance
serviceSchema.index({ isMainService: 1, status: 1 });
serviceSchema.index({ parentService: 1, status: 1 });
serviceSchema.index({ department: 1, status: 1 });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;

