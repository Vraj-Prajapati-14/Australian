const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/contactController');

// Public routes
router.post('/submit', controller.submitContact);

// Admin routes
router.get('/', requireAdmin, controller.getAllContacts);
router.get('/stats', requireAdmin, controller.getContactStats);
router.get('/:id', requireAdmin, controller.getContact);
router.put('/:id', requireAdmin, controller.updateContact);
router.delete('/:id', requireAdmin, controller.deleteContact);
router.post('/:id/reply', requireAdmin, controller.sendReply);

module.exports = router; 