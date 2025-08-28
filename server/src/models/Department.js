const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    order: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#1677ff'
    }
  },
  { timestamps: true }
);

// Index for better query performance
departmentSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Department', departmentSchema); 