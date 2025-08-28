import { useState, useEffect } from 'react';
import { Upload, Button, Image, Spin, Modal, message, Alert } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { api } from '../lib/api';

const { Dragger } = Upload;

export default function ImageUpload({ 
  value = null, 
  onChange, 
  folder = 'inspiration',
  maxSize = 5, // MB
  accept = 'image/*',
  style = {},
  showPreview = true,
  aspectRatio = null,
  required = false
}) {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [error, setError] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('ImageUpload: Component rendered with value:', value);
    console.log('ImageUpload: onChange type:', typeof onChange);
  }, [value, onChange]);

  const uploadProps = {
    name: 'image',
    multiple: false,
    accept: accept,
    showUploadList: false,
    beforeUpload: (file) => {
      console.log('ImageUpload: beforeUpload called with file:', file.name, file.size, file.type);
      
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      
      const isLt5M = file.size / 1024 / 1024 < maxSize;
      if (!isLt5M) {
        message.error(`Image must be smaller than ${maxSize}MB!`);
        return false;
      }
      
      return false; // Prevent default upload
    },
    onChange: async (info) => {
      console.log('ImageUpload: onChange called with info:', info);
      
      if (info.file.status === 'uploading') {
        setUploading(true);
        setError(null);
        return;
      }
      
      if (info.file.status === 'done') {
        setUploading(false);
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        setError(null);
        console.log('ImageUpload: Starting upload for file:', file.name, file.size);
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        
        console.log('ImageUpload: Uploading to folder:', folder);
        
        const response = await api.post('/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('ImageUpload: Upload response:', response.data);
        
        // Check if upload was successful
        if (response.data.success === false) {
          throw new Error(response.data.message || 'Upload failed');
        }
        
        const uploadedImage = response.data;
        
        console.log('ImageUpload: Calling onChange with:', uploadedImage);
        
        if (typeof onChange === 'function') {
          onChange(uploadedImage);
          console.log('ImageUpload: onChange called successfully');
        } else {
          console.warn('ImageUpload: onChange is not a function:', onChange);
        }
        
        message.success('Image uploaded successfully!');
        onSuccess(response.data);
      } catch (error) {
        console.error('ImageUpload: Upload error:', error);
        console.error('ImageUpload: Error response:', error.response?.data);
        
        let errorMessage = 'Upload failed. Please try again.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        message.error(errorMessage);
        onError(error);
      } finally {
        setUploading(false);
      }
    },
  };

  const handleRemove = () => {
    console.log('ImageUpload: Removing image');
    if (typeof onChange === 'function') {
      onChange(null);
    }
    setError(null);
  };

  const handlePreview = () => {
    setPreviewVisible(true);
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
    <div style={style}>
      {error && (
        <Alert
          message="Upload Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {!imageUrl ? (
        <Dragger {...uploadProps} disabled={uploading}>
          <Spin spinning={uploading}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
            <p className="ant-upload-hint">
              Support for JPG, PNG, GIF up to {maxSize}MB
            </p>
            {aspectRatio && (
              <p className="ant-upload-hint">
                Recommended aspect ratio: {aspectRatio}
              </p>
            )}
            {required && (
              <p className="ant-upload-hint" style={{ color: '#ff4d4f' }}>
                * Image is required
              </p>
            )}
          </Spin>
        </Dragger>
      ) : (
        <div style={{ position: 'relative', border: '1px solid #d9d9d9', borderRadius: '6px', padding: '8px' }}>
          <Image
            src={imageUrl}
            alt={value?.alt || 'Uploaded image'}
            width="100%"
            height={200}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            preview={false}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          
          <div style={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            display: 'flex', 
            gap: 8 
          }}>
            {showPreview && (
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={handlePreview}
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            )}
            
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleRemove}
              style={{
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>
          
          {value && typeof value === 'object' && (
            <div style={{ 
              position: 'absolute', 
              bottom: 12, 
              left: 12, 
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
      )}

      {/* Preview Modal */}
      {showPreview && imageUrl && (
        <Modal
          open={previewVisible}
          title="Image Preview"
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width={800}
        >
          <Image
            src={imageUrl}
            alt={value?.alt || 'Preview'}
            style={{ width: '100%' }}
          />
        </Modal>
      )}
    </div>
  );
} 