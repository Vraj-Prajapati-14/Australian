const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const {
  getVisitorStats,
  getRecentVisitors,
  getVisitorDetails
} = require('../controllers/visitorController');

const router = express.Router();

// All routes require authentication
router.use(requireAdmin);

// Get visitor statistics
router.get('/stats', getVisitorStats);

// Get recent visitors with pagination
router.get('/recent', getRecentVisitors);

// Get specific visitor details
router.get('/:id', getVisitorDetails);

module.exports = router; 