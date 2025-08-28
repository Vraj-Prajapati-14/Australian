const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/teamController');

// Public routes
router.get('/', controller.list);
router.get('/leadership', controller.getLeadership);
router.get('/department/:department', controller.getByDepartment);
router.get('/:slug', controller.getBySlug);

// Admin routes
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;

