const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/departmentController');

// Public routes (for dropdowns)
router.get('/active', controller.getActive);

// Admin routes
router.get('/', requireAdmin, controller.list);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router; 