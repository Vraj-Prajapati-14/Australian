const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getAllTestimonials,
  getPublicTestimonials,
  getTestimonial,
  createTestimonial,
  createTestimonialAdmin,
  updateTestimonial,
  deleteTestimonial,
  bulkUpdateTestimonials,
  getTestimonialStats
} = require('../controllers/testimonialController');

const { requireAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/testimonials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get('/public', getPublicTestimonials);
router.post('/', upload.single('avatar'), createTestimonial);

// Admin routes (protected)
router.use('/admin', requireAdmin);

// Get all testimonials with pagination and filters
router.get('/admin', getAllTestimonials);

// Get testimonial statistics
router.get('/admin/stats', getTestimonialStats);

// Bulk update testimonials
router.post('/admin/bulk-update', bulkUpdateTestimonials);

// Create testimonial (admin)
router.post('/admin', upload.single('avatar'), createTestimonialAdmin);

// Get single testimonial
router.get('/admin/:id', getTestimonial);

// Update testimonial
router.put('/admin/:id', upload.single('avatar'), updateTestimonial);

// Delete testimonial
router.delete('/admin/:id', deleteTestimonial);

module.exports = router; 