import { useState } from 'react';
import { Upload, Button, Image, message, Spin, Row, Col } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '../lib/api';

const { Dragger } = Upload;

export default function GalleryUpload({ 
  value = [], 
  onChange, 
  folder = 'gallery',
  maxSize = 5, // MB
  maxCount = 10,
  accept = 'image/*',
  style = {}
}) {
  const [uploading, setUploading] = useState(false);

  const uploadProps = {
    name: 'image',
    multiple: true,
    accept: accept,
    showUploadList: false,
    beforeUpload: (file) => {
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

      if (value.length >= maxCount) {
        message.error(`Maximum ${maxCount} images allowed!`);
        return false;
      }
      
      // Return true to allow the upload to proceed
      return true;
    },
    onChange: async (info) => {
      if (info.file.status === 'uploading') {
        setUploading(true);
        return;
      }
      
      if (info.file.status === 'done') {
        setUploading(false);
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        
        const response = await api.post('/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Check if upload was successful
        if (response.data.success === false) {
          throw new Error(response.data.message || 'Upload failed');
        }
        
        const uploadedImage = response.data;
        const currentImages = value || [];
        
        if (typeof onChange === 'function') {
          onChange([...currentImages, uploadedImage]);
        } else {
          console.warn('onChange is not a function:', onChange);
        }
        
        message.success('Image uploaded successfully!');
        onSuccess(response.data);
      } catch (error) {
        console.error('Gallery upload error:', error);
        console.error('Error response:', error.response?.data);
        
        let errorMessage = 'Upload failed. Please try again.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        message.error(errorMessage);
        onError(error);
      } finally {
        setUploading(false);
      }
    },
  };

  const handleRemove = (index) => {
    const newImages = value.filter((_, i) => i !== index);
    if (typeof onChange === 'function') {
      onChange(newImages);
    }
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...value];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    if (typeof onChange === 'function') {
      onChange(newImages);
    }
  };

  // Get image URL for display
  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return null;
  };

  return (
    <div style={style}>
      {value.length < maxCount && (
        <Dragger {...uploadProps} disabled={uploading}>
          <Spin spinning={uploading}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag images to upload</p>
            <p className="ant-upload-hint">
              Support for JPG, PNG, GIF up to {maxSize}MB. Max {maxCount} images.
            </p>
            <p className="ant-upload-hint">
              {value.length} of {maxCount} images uploaded
            </p>
          </Spin>
        </Dragger>
      )}
      
      {value.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Row gutter={[8, 8]}>
            {value.map((image, index) => {
              const imageUrl = getImageUrl(image);
              if (!imageUrl) return null;
              
              return (
                <Col key={index} xs={12} sm={8} md={6} lg={4}>
                  <div style={{ position: 'relative', border: '1px solid #d9d9d9', borderRadius: '6px', padding: '4px' }}>
                    <Image
                      src={imageUrl}
                      alt={image?.alt || `Gallery image ${index + 1}`}
                      width="100%"
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                      preview={{
                        mask: <EyeOutlined />,
                        maskClassName: 'custom-mask'
                      }}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(index)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 4, 
                      left: 4, 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '12px' 
                    }}>
                      {index + 1}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
} 