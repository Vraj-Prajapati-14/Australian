const router = require('express').Router();
const { getStats } = require('../controllers/analyticsController');

// Get analytics statistics
router.get('/stats', getStats);

module.exports = router; 