import { useState, useEffect } from 'react';
import '../../styles/admin-forms.css';
import { 
  Button, 
  Modal, 
  Input, 
  Card, 
  Table, 
  Tag, 
  Select
} from '../../components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import SimpleImageUpload from '../../components/SimpleImageUpload';

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const EyeIcon = () => <span>👁️</span>;
const FileIcon = () => <span>📄</span>;
const ImageIcon = () => <span>🖼️</span>;

export default function AdminInspirationPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const queryClient = useQueryClient();
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };

  // Fetch inspiration data
  const { data: inspirationItems = [], isLoading } = useQuery({
    queryKey: ['inspiration'],
    queryFn: async () => {
      try {
        const response = await api.get('/inspiration');
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching inspiration items:', error);
        return [];
      }
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/inspiration', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inspiration']);
      showMessage('success', 'Inspiration item created successfully');
      setIsModalVisible(false);
      setFormData({});
      setUploadedImage(null);
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create inspiration error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating inspiration item. Please try again.');
      }
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/inspiration/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inspiration']);
      showMessage('success', 'Inspiration item updated successfully');
      setIsModalVisible(false);
      setEditingItem(null);
      setFormData({});
      setUploadedImage(null);
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update inspiration error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating inspiration item. Please try again.');
      }
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/inspiration/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['inspiration']);
      showMessage('success', 'Inspiration item deleted successfully');
    },
    onError: (error) => {
      console.error('Delete inspiration error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting inspiration item. Please try again.');
      }
    }
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ 
      title: '',
      description: '',
      category: 'general',
      tags: [],
      isActive: true,
      order: 0
    });
    setUploadedImage(null);
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : []
    });
    setUploadedImage(item.image || null);
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inspiration item?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting inspiration item:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setFormData({});
    setUploadedImage(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('aes_admin_token');
      if (!token) {
        showMessage('error', 'Please log in to continue');
        return;
      }

      // Handle image data
      const imageData = uploadedImage || editingItem?.image || formData.image;
      
      // Prepare the data object
      const submitData = {
        ...formData,
        image: imageData,
        tags: Array.isArray(formData.tags) ? formData.tags : []
      };
      
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem._id, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving inspiration item:', error);
    }
  };

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.image?.url ? (
            <img
              src={record.image.url}
              alt={record.title}
              width={80}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              onError={(e) => {
                e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN';
              }}
            />
          ) : (
            <div style={{ width: 80, height: 60, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon />
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <div style={{ fontWeight: 'bold' }}>{title || 'Untitled'}</div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General'}
        </Tag>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.slice(0, 3).map((tag, index) => (
              <Tag key={index} color="gray" size="small">
                {tag}
              </Tag>
            ))
          ) : (
            <span style={{ fontSize: 12, color: '#999' }}>No tags</span>
          )}
          {Array.isArray(tags) && tags.length > 3 && (
            <Tag color="gray" size="small">
              +{tags.length - 3}
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (order) => (
        <span style={{ fontWeight: 'bold' }}>{order || 0}</span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleEdit(record)}
          >
            <EditIcon />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleDelete(record._id)}
          >
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page" style={{ padding: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <div className="page-header">
        <h1 className="page-title">Inspiration Gallery</h1>
        <p className="page-description">Manage inspiration images and gallery content</p>
      </div>

      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">Inspiration Items ({inspirationItems.length})</h2>
            <p className="card-subtitle">View and manage all inspiration gallery items</p>
          </div>
          <Button 
            variant="primary"
            onClick={handleAdd}
          >
            <PlusIcon /> Add Item
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={inspirationItems}
          rowKey="_id"
          loading={isLoading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Inspiration Modal */}
      <Modal
        title={editingItem ? 'Edit Inspiration Item' : 'Add New Inspiration Item'}
        isOpen={isModalVisible}
        onClose={handleCancel}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Title *
              </label>
              <Input 
                placeholder="Enter title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                error={formErrors.title}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category
              </label>
              <Select
                value={formData.category || 'general'}
                onChange={(value) => setFormData({...formData, category: value})}
                options={[
                  { value: 'general', label: 'General' },
                  { value: 'automotive', label: 'Automotive' },
                  { value: 'custom', label: 'Custom Work' },
                  { value: 'before-after', label: 'Before & After' },
                  { value: 'featured', label: 'Featured' }
                ]}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Description
            </label>
            <textarea 
              placeholder="Enter description"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Tags (comma separated)
            </label>
            <Input 
              placeholder="e.g., automotive, custom, featured"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
              onChange={(e) => {
                const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                setFormData({...formData, tags: tags});
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Image *
            </label>
            <SimpleImageUpload 
              value={uploadedImage}
              onChange={(image) => {
                setUploadedImage(image);
                setFormData({...formData, image: image});
              }}
              folder="inspiration"
              maxSize={5}
              required={true}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Display Order
              </label>
              <input 
                type="number"
                placeholder="0"
                value={formData.order || 0}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Status
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Active</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}