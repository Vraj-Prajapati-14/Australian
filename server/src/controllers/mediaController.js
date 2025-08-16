const multer = require('multer');
const { uploadBufferToCloudinary } = require('../utils/uploader');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function uploadMiddleware(fieldName = 'file') {
  return upload.single(fieldName);
}

async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const result = await uploadBufferToCloudinary(req.file.buffer, 'aes');
  res.json({ url: result.secure_url, publicId: result.public_id });
}

module.exports = { uploadMiddleware, uploadImage };

