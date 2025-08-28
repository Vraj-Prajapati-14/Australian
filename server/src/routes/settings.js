const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/settingsController');

// Main settings endpoints
router.get('/', controller.get);
router.put('/', requireAdmin, controller.upsert);

// Section-specific endpoints
router.get('/section/:section', controller.getSection);
router.put('/section/:section', requireAdmin, controller.updateSection);

// Page-specific settings
router.get('/pages/:page', controller.getPageSettings);
router.put('/pages/:page', requireAdmin, controller.updatePageSettings);

// Settings management
router.get('/summary', controller.getSummary);
router.post('/reset', requireAdmin, controller.resetToDefaults);
router.post('/reset/:section', requireAdmin, controller.resetToDefaults);
router.get('/export', requireAdmin, controller.exportSettings);
router.post('/import', requireAdmin, controller.importSettings);

module.exports = router;

