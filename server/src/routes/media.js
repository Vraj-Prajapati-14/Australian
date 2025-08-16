const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadMiddleware, uploadImage } = require('../controllers/mediaController');

router.post('/upload', requireAdmin, uploadMiddleware('file'), uploadImage);

module.exports = router;

