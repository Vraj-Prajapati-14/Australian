const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/settingsController');

router.get('/', controller.get);
router.put('/', requireAdmin, controller.upsert);

module.exports = router;

