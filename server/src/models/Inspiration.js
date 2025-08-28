const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const inspirationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Associations
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: imageSchema,
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
inspirationSchema.index({ status: 1, service: 1, isFeatured: 1 });
inspirationSchema.index({ status: 1, department: 1, isFeatured: 1 });
inspirationSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Inspiration', inspirationSchema); 