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
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
    // New fields for nested services
    isMainService: { type: Boolean, default: false }, // Main service like "Ute", "Trailer", "Truck"
    parentService: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', default: null }, // For sub-services
    subServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // For main services
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

// Index for better query performance
serviceSchema.index({ isMainService: 1, status: 1 });
serviceSchema.index({ parentService: 1, status: 1 });
serviceSchema.index({ category: 1, status: 1 });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;

