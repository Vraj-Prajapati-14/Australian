const express = require('express');
const router = express.Router();
const caseStudyController = require('../controllers/caseStudyController');
const { requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', caseStudyController.list);
router.get('/:slug', caseStudyController.getBySlug);

// Protected routes
router.post('/', requireAdmin, caseStudyController.create);
router.put('/:id', requireAdmin, caseStudyController.update);
router.delete('/:id', requireAdmin, caseStudyController.delete);

module.exports = router; 