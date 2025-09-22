import { useState } from 'react';
import '../../styles/admin-forms.css';
import { 
  Button, 
  Modal, 
  Input, 
  Card, 
  Table, 
  Tag, 
  Select, 
  Switch, 
  InputNumber 
} from '../../components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import SimpleImageUpload from '../../components/SimpleImageUpload';
import GalleryUpload from '../../components/GalleryUpload';

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const SettingIcon = () => <span>⚙️</span>;
const FileIcon = () => <span>📄</span>;
const CarIcon = () => <span>🚗</span>;
const ContainerIcon = () => <span>📦</span>;

export default function AdminServicesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedGallery, setUploadedGallery] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState('main');
  const queryClient = useQueryClient();
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };

  // Fetch services data
  const { data: services = [], isLoading: loading, error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching services:', error);
        return [];
      }
    }
  });

  // Fetch main services for dropdown (for sub-services parent selection)
  const { data: mainServicesForDropdown = [], error: mainServicesError } = useQuery({ 
    queryKey: ['main-services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services/main');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching main services:', error);
        return [];
      }
    }
  });

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      showMessage('success', 'Service created successfully');
      setModalVisible(false);
      setUploadedImage(null);
      setUploadedGallery([]);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create service error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating service. Please try again.');
      }
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      showMessage('success', 'Service updated successfully');
      setModalVisible(false);
      setEditingService(null);
      setUploadedImage(null);
      setUploadedGallery([]);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update service error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating service. Please try again.');
      }
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      showMessage('success', 'Service deleted successfully');
    },
    onError: (error) => {
      console.error('Delete service error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting service. Please try again.');
      }
    }
  });

  const handleAddService = () => {
    setEditingService(null);
    setUploadedImage(null);
    setUploadedGallery([]);
    setFormData({ 
      status: 'active',
      isFeatured: false,
      isMainService: activeTab === 'main',
      order: 0
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingService(null);
    setUploadedImage(null);
    setUploadedGallery([]);
    setFormData({});
    setFormErrors({});
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setUploadedImage(service.image || null);
    setUploadedGallery(service.gallery || []);
    
    setFormData({
      ...service,
      category: service.category?._id,
      parentService: service.parentService?._id
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleStatusChange = async (serviceId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const service = services.find(s => s._id === serviceId);
      if (service) {
        await updateServiceMutation.mutateAsync({ id: serviceId, data: { status: newStatus } });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
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
      const imageData = uploadedImage || editingService?.image || formData.image;
      const galleryData = uploadedGallery.length > 0 ? uploadedGallery : editingService?.gallery || formData.gallery || [];

      // Prepare the data object
      const submitData = {
        ...formData,
        image: imageData,
        gallery: galleryData
      };
      
      if (editingService) {
        await updateServiceMutation.mutateAsync({ id: editingService._id, data: submitData });
      } else {
        await createServiceMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  // Filter services based on active tab
  const mainServices = services.filter(s => s.isMainService === true);
  const subServices = services.filter(s => s.isMainService === false);

  const currentServices = activeTab === 'main' ? mainServices : subServices;

  const columns = [
    {
      title: 'Service',
      key: 'service',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.image?.url ? (
            <img
              src={record.image.url}
              alt={record.title}
              width={60}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{ 
            width: 60, 
            height: 60, 
            background: '#f0f0f0', 
            borderRadius: 4, 
            display: record.image?.url ? 'none' : 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            {activeTab === 'main' ? <CarIcon /> : <ContainerIcon />}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.title}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.shortDescription}</div>
            {activeTab === 'sub' && record.parentService && (
              <div style={{ fontSize: 11, color: '#999' }}>
                Parent: {record.parentService.title}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">
          {category?.name || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={status === 'active' ? 'status-active' : 'status-inactive'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured) => (
        <Tag color={isFeatured ? 'gold' : 'default'}>
          {isFeatured ? 'Featured' : 'Regular'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <button 
            className="action-btn edit"
            onClick={() => handleEditService(record)}
            title="Edit Service"
          >
            <EditIcon />
          </button>
          <button 
            className="action-btn status"
            onClick={() => handleStatusChange(record._id, record.status)}
            title={`Toggle Status (Current: ${record.status})`}
          >
            <SettingIcon />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => {
              if (window.confirm('Delete this service? This action cannot be undone.')) {
                handleDeleteService(record._id);
              }
            }}
            title="Delete Service"
          >
            <DeleteIcon />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2 className="page-title">Services Management</h2>
        <p className="page-description">Manage your main services and sub-services</p>
      </div>
      
      {/* Tabs */}
      <div className="services-tabs">
        <div className="tab-list">
          <button
            className={`tab-button ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            <CarIcon />
            Main Services ({mainServices.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'sub' ? 'active' : ''}`}
            onClick={() => setActiveTab('sub')}
          >
            <ContainerIcon />
            Sub-Services ({subServices.length})
          </button>
        </div>
      </div>
      
      <Card className="services-card">
        <div className="card-header">
          <div className="card-title">
            <h4>
              {activeTab === 'main' ? 'Main Services' : 'Sub-Services'} ({currentServices.length})
            </h4>
            <p className="card-subtitle">
              {activeTab === 'main' 
                ? 'Primary services that appear in the main navigation' 
                : 'Detailed services under main service categories'
              }
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleAddService}
            className="add-service-btn"
          >
            <PlusIcon /> Add {activeTab === 'main' ? 'Main' : 'Sub'}-Service
          </Button>
        </div>
        
        <Table
          className="services-table"
          columns={columns}
          dataSource={Array.isArray(currentServices) ? currentServices : []}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>

      {/* Service Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={handleCancel}
        title={editingService ? 'Edit Service' : `Add New ${activeTab === 'main' ? 'Main' : 'Sub'}-Service`}
        size="full"
      >
        <form onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Service Title *
                </label>
                <Input 
                  placeholder="e.g., Ute Canopies"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  error={formErrors.title}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Slug *
                </label>
                <Input 
                  placeholder="e.g., ute-canopies"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  error={formErrors.slug}
                  required
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Short Description *
              </label>
              <Input 
                placeholder="Brief description for display"
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                error={formErrors.shortDescription}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Full Description *
              </label>
              <Input.Textarea 
                rows={4}
                placeholder="Detailed description of the service"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                error={formErrors.description}
                required
              />
            </div>
          </div>

          {/* Category and Settings */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Category & Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Category
                </label>
                <Select
                  options={mainServicesForDropdown.map(service => ({
                    value: service._id,
                    label: service.title
                  }))}
                  value={formData.category}
                  onChange={(value) => setFormData({...formData, category: value})}
                  placeholder="Select category"
                  allowClear
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Status
                </label>
                <Select
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'draft', label: 'Draft' }
                  ]}
                  value={formData.status || 'active'}
                  onChange={(value) => setFormData({...formData, status: value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Display Order
                </label>
                <InputNumber 
                  min={0}
                  placeholder="1"
                  value={formData.order || 0}
                  onChange={(value) => setFormData({...formData, order: value})}
                />
              </div>
            </div>
            
            {/* Parent Service Selection for Sub-Services */}
            {activeTab === 'sub' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Parent Service *
                </label>
                <Select
                  options={mainServicesForDropdown.map(service => ({
                    value: service._id,
                    label: service.title
                  }))}
                  value={formData.parentService}
                  onChange={(value) => setFormData({...formData, parentService: value})}
                  placeholder="Select parent service"
                  required
                />
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch
                  checked={formData.isFeatured || false}
                  onChange={(checked) => setFormData({...formData, isFeatured: checked})}
                />
                <label style={{ fontWeight: '500' }}>Featured Service</label>
              </div>
              {activeTab === 'sub' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Switch
                    checked={formData.isMainService || false}
                    onChange={(checked) => setFormData({...formData, isMainService: checked})}
                  />
                  <label style={{ fontWeight: '500' }}>Main Service</label>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Images</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Service Image
                </label>
                <SimpleImageUpload 
                  value={uploadedImage}
                  onChange={(image) => {
                    setUploadedImage(image);
                    setFormData({...formData, image: image});
                  }}
                  folder="services"
                  maxSize={5}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Service Gallery
                </label>
                <GalleryUpload 
                  value={uploadedGallery}
                  onChange={(gallery) => {
                    setUploadedGallery(gallery);
                    setFormData({...formData, gallery: gallery});
                  }}
                  folder="services/gallery"
                  maxSize={5}
                  maxCount={10}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
            >
              {createServiceMutation.isPending || updateServiceMutation.isPending ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}