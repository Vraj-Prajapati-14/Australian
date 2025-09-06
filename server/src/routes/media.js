const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadMiddleware, uploadImage, deleteImage } = require('../controllers/mediaController');

// Image upload endpoint
router.post('/upload', requireAdmin, uploadMiddleware('image'), uploadImage);

// Image delete endpoint
router.delete('/delete', requireAdmin, deleteImage);

module.exports = router;

