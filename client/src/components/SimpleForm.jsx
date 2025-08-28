import { useState } from 'react';
import SimpleImageUpload from './SimpleImageUpload';
import { api } from '../lib/api';

export default function SimpleForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (image) => {
    setFormData(prev => ({
      ...prev,
      image: image
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setMessage('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      setMessage('Please enter a description');
      return;
    }
    
    if (!formData.image) {
      setMessage('Please upload an image');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const submitData = {
        title: formData.title,
        description: formData.description,
        tags: tags,
        image: formData.image,
        status: 'draft',
        isFeatured: false
      };

      const response = await api.post('/inspiration', submitData);
      
      if (response.data) {
        setMessage('✅ Inspiration item created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          tags: '',
          image: null
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('❌ Error creating inspiration item: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Create Inspiration Item</h2>
      
      {message && (
        <div style={{
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
          backgroundColor: message.includes('✅') ? '#f6ffed' : '#fff2f0',
          border: `1px solid ${message.includes('✅') ? '#b7eb8f' : '#ffccc7'}`,
          color: message.includes('✅') ? '#52c41a' : '#ff4d4f'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter inspiration title"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description"
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Enter tags separated by commas"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>
            Image *
          </label>
          <SimpleImageUpload
            value={formData.image}
            onChange={handleImageChange}
            folder="inspiration"
            maxSize={5}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#d9d9d9' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating...' : 'Create Inspiration Item'}
        </button>
      </form>
    </div>
  );
} 