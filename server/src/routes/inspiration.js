const express = require('express');
const router = express.Router();
const { 
  getAllInspiration, 
  getPublishedInspiration, 
  getInspirationById, 
  createInspiration, 
  updateInspiration, 
  deleteInspiration, 
  updateInspirationOrder 
} = require('../controllers/inspirationController');
const { requireAdmin } = require('../middleware/auth');
const { uploadMiddleware, uploadImage } = require('../controllers/mediaController');

// Public routes
router.get('/published', getPublishedInspiration);
router.get('/:id', getInspirationById);

// Admin routes (protected)
router.get('/', requireAdmin, getAllInspiration);
router.post('/', requireAdmin, createInspiration);
router.put('/:id', requireAdmin, updateInspiration);
router.delete('/:id', requireAdmin, deleteInspiration);
router.put('/order/update', requireAdmin, updateInspirationOrder);

// Image upload route for inspiration
router.post('/upload-image', requireAdmin, uploadMiddleware('image'), (req, res) => {
  // Override the folder to be specific for inspiration images
  req.body.folder = 'inspiration';
  uploadImage(req, res);
});

module.exports = router; 