const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    userAgent: String,
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'desktop' },
    browser: String,
    os: String,
    city: String,
    country: String,
    region: String,
    timezone: String,
    referrer: String,
    page: String,
    sessionId: String,
    isReturning: { type: Boolean, default: false },
    visitDuration: Number, // in seconds
    lastActivity: Date,
  },
  { timestamps: true }
);

// Index for better query performance
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ ip: 1 });
visitorSchema.index({ country: 1 });
visitorSchema.index({ deviceType: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor; 