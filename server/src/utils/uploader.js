const { cloudinary } = require('../lib/cloudinary');
const streamifier = require('streamifier');

function uploadBufferToCloudinary(buffer, folder = 'aes_uploads', options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = { uploadBufferToCloudinary };

