const multer = require('multer');
const { cloudinary } = require('../lib/cloudinary');
const streamifier = require('streamifier');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware function
function uploadMiddleware(fieldName = 'image') {
  return upload.single(fieldName);
}

// Upload image function
async function uploadImage(req, res) {
  try {
    console.log('=== UPLOAD REQUEST START ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');

    // Check if file exists
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    // Check file size
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false,
        message: 'File size too large. Maximum 10MB allowed.' 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' 
      });
    }

    // Get folder from request body
    const folder = req.body.folder || 'aes_uploads';
    console.log('Uploading to folder:', folder);

    // Check Cloudinary configuration
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error('Cloudinary not configured properly');
      return res.status(500).json({ 
        success: false,
        message: 'Image upload service not configured. Please check your Cloudinary environment variables.',
        missing: {
          cloudName: !config.cloud_name,
          apiKey: !config.api_key,
          apiSecret: !config.api_secret
        }
      });
    }

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          // Add unique identifier to prevent conflicts
          public_id: `${folder}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result);
            resolve(result);
          }
        }
      );

      // Pipe the file buffer to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Prepare response data
    const imageData = {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      alt: req.body.alt || req.file.originalname,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      originalName: req.file.originalname,
      folder: folder
    };

    console.log('=== UPLOAD SUCCESS ===');
    console.log('Response data:', imageData);
    
    res.json(imageData);

  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false,
      message: 'Upload failed: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Delete image from Cloudinary
async function deleteImage(req, res) {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({ 
      success: true, 
      message: 'Image deleted successfully',
      result 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
}

module.exports = { uploadMiddleware, uploadImage, deleteImage };

