const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/pageController');

router.get('/', controller.list);
router.get('/:slug', controller.getBySlug);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;

