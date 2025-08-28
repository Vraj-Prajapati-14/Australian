const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/services', require('./services'));
router.use('/sub-services', require('./services')); 
router.use('/departments', require('./departments'));
router.use('/projects', require('./projects'));
router.use('/case-studies', require('./caseStudies'));
router.use('/inspiration', require('./inspiration'));
router.use('/team', require('./team'));
router.use('/settings', require('./settings'));
router.use('/media', require('./media'));
router.use('/pages', require('./pages'));
router.use('/posts', require('./posts'));
router.use('/visitors', require('./visitors'));
router.use('/contacts', require('./contacts'));
router.use('/analytics', require('./analytics'));
router.use('/testimonials', require('./testimonials'));

module.exports = router;

