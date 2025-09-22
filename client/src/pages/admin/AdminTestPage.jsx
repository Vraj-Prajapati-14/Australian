import React, { useState } from 'react';
import '../styles/admin-forms.css';

const AdminTestPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', status: 'active' });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({ title: '', description: '', status: 'active' });
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Admin Test Page - Custom CSS</h1>
      
      <button 
        className="custom-button custom-button-primary"
        onClick={() => setIsModalOpen(true)}
      >
        Open Test Form
      </button>

      {isModalOpen && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <h2 className="custom-modal-title">Test Form</h2>
              <button 
                className="custom-modal-close"
                onClick={handleCancel}
              >
                ×
              </button>
            </div>
            
            <form className="custom-form" onSubmit={handleSubmit}>
              <div className="custom-form-group">
                <label className="custom-form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="custom-form-input"
                  placeholder="Enter title"
                />
              </div>
              
              <div className="custom-form-group">
                <label className="custom-form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="custom-form-textarea"
                  placeholder="Enter description"
                />
              </div>
              
              <div className="custom-form-group">
                <label className="custom-form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="custom-form-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  type="button"
                  className="custom-button custom-button-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="custom-button custom-button-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestPage;
