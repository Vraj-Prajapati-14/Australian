const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/teamController');

router.get('/', controller.list);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;

