const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // Basic contact information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: String,
    jobTitle: String,

    // Enquiry details
    enquiryType: { 
      type: String, 
      required: true,
      enum: ['general', 'service', 'quote', 'support', 'warranty', 'installation', 'parts', 'fleet']
    },
    
    // Service associations
    serviceCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    specificService: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

    // Vehicle information
    vehicleType: { 
      type: String,
      enum: ['ute', 'trailer', 'truck', 'van', 'other']
    },
    vehicleDetails: String,
    urgency: { 
      type: String,
      enum: ['low', 'medium', 'high', 'emergency']
    },

    // Message
    message: { type: String, required: true },

    // Status tracking
    status: { 
      type: String, 
      enum: ['new', 'in-progress', 'contacted', 'quoted', 'closed', 'spam'],
      default: 'new'
    },

    // Internal notes
    internalNotes: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },

    // Response tracking
    respondedAt: Date,
    responseMethod: { 
      type: String,
      enum: ['email', 'phone', 'sms', 'in-person']
    },
    followUpDate: Date,

    // Source tracking
    source: { 
      type: String,
      enum: ['website', 'phone', 'email', 'referral', 'social', 'other'],
      default: 'website'
    },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,

    // Privacy and consent
    marketingConsent: { type: Boolean, default: false },
    privacyConsent: { type: Boolean, default: true },

    // Location information
    location: String,
    region: String,
    timezone: String,

    // Additional metadata
    ipAddress: String,
    userAgent: String,
    referrer: String,
    pageUrl: String,

    // Priority and tags
    priority: { 
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    tags: [String],

    // Timestamps
    estimatedValue: Number,
    currency: { type: String, default: 'AUD' }
  },
  { timestamps: true }
);

// Index for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ enquiryType: 1 });
contactSchema.index({ serviceCategory: 1 });
contactSchema.index({ department: 1 });
contactSchema.index({ priority: 1 });

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to set priority based on urgency
contactSchema.pre('save', function(next) {
  if (this.urgency === 'emergency') {
    this.priority = 'urgent';
  } else if (this.urgency === 'high') {
    this.priority = 'high';
  } else if (this.urgency === 'low') {
    this.priority = 'low';
  } else {
    this.priority = 'normal';
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema); 