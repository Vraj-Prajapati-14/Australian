const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    // Basic identification
    ip: { type: String, required: true },
    sessionId: String,
    
    // User agent and device info
    userAgent: String,
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'desktop' },
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    
    // Device details
    screenResolution: String,
    viewportSize: String,
    colorDepth: Number,
    pixelRatio: Number,
    deviceMemory: Number,
    hardwareConcurrency: Number,
    
    // Location information
    city: String,
    country: String,
    region: String,
    timezone: String,
    latitude: Number,
    longitude: Number,
    
    // Network information
    connectionType: String,
    connectionSpeed: String,
    isp: String,
    
    // User identification (if available)
    email: String,
    name: String,
    socialAccounts: {
      google: String,
      facebook: String,
      twitter: String,
      linkedin: String,
      github: String
    },
    
    // Session information
    referrer: String,
    page: String,
    previousPage: String,
    entryPage: String,
    exitPage: String,
    isReturning: { type: Boolean, default: false },
    visitDuration: Number, // in seconds
    lastActivity: Date,
    
    // Engagement metrics
    pageViews: { type: Number, default: 1 },
    clicks: { type: Number, default: 0 },
    scrollDepth: { type: Number, default: 0 }, // percentage
    timeOnPage: { type: Number, default: 0 }, // in seconds
    
    // Technical details
    language: String,
    acceptsCookies: { type: Boolean, default: true },
    acceptsJavaScript: { type: Boolean, default: true },
    acceptsImages: { type: Boolean, default: true },
    
    // Analytics tracking
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    
    // Custom tracking
    customData: mongoose.Schema.Types.Mixed,
    
    // Privacy and consent
    consentGiven: { type: Boolean, default: false },
    consentTimestamp: Date,
    
    // Status
    isActive: { type: Boolean, default: true },
    lastSeen: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Index for better query performance
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ ip: 1 });
visitorSchema.index({ country: 1 });
visitorSchema.index({ deviceType: 1 });
visitorSchema.index({ sessionId: 1 });
visitorSchema.index({ email: 1 });
visitorSchema.index({ lastSeen: -1 });
visitorSchema.index({ 'socialAccounts.google': 1 });
visitorSchema.index({ 'socialAccounts.facebook': 1 });

// Pre-save middleware to update lastSeen
visitorSchema.pre('save', function(next) {
  this.lastSeen = new Date();
  next();
});

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor; 