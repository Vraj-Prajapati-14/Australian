import { useState } from 'react';
import { api } from '../lib/api';

export default function SimpleImageUpload({ 
  value = null, 
  onChange, 
  folder = 'inspiration',
  maxSize = 5 // MB
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === false) {
        throw new Error(response.data.message || 'Upload failed');
      }

      const uploadedImage = response.data;
      
      if (typeof onChange === 'function') {
        onChange(uploadedImage);
      }

      setError(null);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (typeof onChange === 'function') {
      onChange(null);
    }
    setError(null);
  };

  // Get image URL for display
  const getImageUrl = () => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (value.url) return value.url;
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div style={{ marginBottom: '16px' }}>
      {error && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '4px',
          color: '#ff4d4f',
          marginBottom: '12px',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      {!imageUrl ? (
        <div style={{
          border: '2px dashed #d9d9d9',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fafafa',
          cursor: 'pointer',
          transition: 'border-color 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.borderColor = '#1890ff'}
        onMouseLeave={(e) => e.target.style.borderColor = '#d9d9d9'}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
            id="image-upload-input"
          />
          <label htmlFor="image-upload-input" style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              📁
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              JPG, PNG, GIF up to {maxSize}MB
            </div>
          </label>
        </div>
      ) : (
        <div style={{
          border: '2px solid #52c41a',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#f6ffed'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#52c41a',
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            ✅ Image uploaded successfully!
          </div>
          
          <div style={{ position: 'relative' }}>
            <img
              src={imageUrl}
              alt="Uploaded image"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #d9d9d9'
              }}
            />
            
            <button
              onClick={handleRemove}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
            
            {value && typeof value === 'object' && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {value.format?.toUpperCase()} • {(value.size / 1024 / 1024).toFixed(2)}MB
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 