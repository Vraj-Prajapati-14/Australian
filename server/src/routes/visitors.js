const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const {
  trackVisitor,
  getAnalytics,
  getRecentVisitors,
  getVisitorDetails
} = require('../controllers/visitorController');

const router = express.Router();

// Track visitor (public endpoint - no auth required)
router.post('/track', trackVisitor);

// All routes below require authentication
router.use(requireAdmin);

// Get comprehensive analytics data
router.get('/analytics', getAnalytics);

// Get recent visitors with pagination
router.get('/recent', getRecentVisitors);

// Get specific visitor details
router.get('/:id', getVisitorDetails);

module.exports = router; 