const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/serviceController');

// Public routes
router.get('/', controller.list);
router.get('/main', controller.getMainServices);
router.get('/featured', controller.getFeatured);
router.get('/sub/:parentId', controller.getSubServices);
router.get('/:slug', controller.getBySlug);

// Admin routes
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;

