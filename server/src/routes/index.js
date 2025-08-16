const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/services', require('./services'));
router.use('/service-categories', require('./serviceCategories'));
router.use('/projects', require('./projects'));
router.use('/team', require('./team'));
router.use('/settings', require('./settings'));
router.use('/media', require('./media'));
router.use('/pages', require('./pages'));
router.use('/posts', require('./posts'));
router.use('/visitors', require('./visitors'));

module.exports = router;

