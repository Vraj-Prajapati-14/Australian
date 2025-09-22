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
  DatePicker, 
  InputNumber 
} from '../../components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import SimpleImageUpload from '../../components/SimpleImageUpload';
import GalleryUpload from '../../components/GalleryUpload';
import dayjs from 'dayjs';

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const SettingIcon = () => <span>⚙️</span>;
const FileIcon = () => <span>📄</span>;

export default function AdminCaseStudiesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  const [uploadedHeroImage, setUploadedHeroImage] = useState(null);
  const [uploadedGallery, setUploadedGallery] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const queryClient = useQueryClient();
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };

  // Fetch case studies data
  const { data: caseStudies = [], isLoading: loading, error: caseStudiesError } = useQuery({ 
    queryKey: ['caseStudies'], 
    queryFn: async () => {
      try {
        const response = await api.get('/case-studies');
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching case studies:', error);
        return [];
      }
    }
  });

  // Fetch sub-services for dropdown
  const { data: services = [], error: servicesError } = useQuery({ 
    queryKey: ['sub-services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services?type=sub&status=all');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching sub-services:', error);
        return [];
      }
    }
  });

  // Fetch departments for dropdown
  const { data: departments = [], error: departmentsError } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => {
      try {
        const response = await api.get('/departments');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
    }
  });

  // Mutations
  const createCaseStudyMutation = useMutation({
    mutationFn: (data) => api.post('/case-studies', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['case-studies']);
      showMessage('success', 'Case study created successfully');
      setModalVisible(false);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create case study error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating case study. Please try again.');
      }
    }
  });

  const updateCaseStudyMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/case-studies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['case-studies']);
      showMessage('success', 'Case study updated successfully');
      setModalVisible(false);
      setEditingCaseStudy(null);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update case study error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating case study. Please try again.');
      }
    }
  });

  const deleteCaseStudyMutation = useMutation({
    mutationFn: (id) => api.delete(`/case-studies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['case-studies']);
      showMessage('success', 'Case study deleted successfully');
    },
    onError: (error) => {
      console.error('Delete case study error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting case study. Please try again.');
      }
    }
  });

  const handleAddCaseStudy = () => {
    setEditingCaseStudy(null);
    setUploadedHeroImage(null);
    setUploadedGallery([]);
    setFormData({ 
      status: 'active',
      isFeatured: false,
      order: 0
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCaseStudy(null);
    setUploadedHeroImage(null);
    setUploadedGallery([]);
    setFormData({});
    setFormErrors({});
  };

  const handleEditCaseStudy = (caseStudy) => {
    setEditingCaseStudy(caseStudy);
    setUploadedHeroImage(caseStudy.heroImage || null);
    setUploadedGallery(caseStudy.gallery || []);
    
    // Process keyFeatures - convert from array to text
    const keyFeaturesText = caseStudy.keyFeatures && Array.isArray(caseStudy.keyFeatures) 
      ? caseStudy.keyFeatures.join('\n') 
      : caseStudy.keyFeatures || '';
    
    setFormData({
      ...caseStudy,
      service: caseStudy.service?._id,
      department: caseStudy.department?._id,
      completionDate: caseStudy.completionDate || '',
      startDate: caseStudy.startDate || '',
      keyFeatures: keyFeaturesText
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleDeleteCaseStudy = async (caseStudyId) => {
    try {
      await deleteCaseStudyMutation.mutateAsync(caseStudyId);
    } catch (error) {
      console.error('Error deleting case study:', error);
    }
  };

  const handleStatusChange = async (caseStudyId, status) => {
    try {
      const caseStudy = caseStudies.find(c => c._id === caseStudyId);
      if (caseStudy) {
        await updateCaseStudyMutation.mutateAsync({ id: caseStudyId, data: { status } });
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

      // Process keyFeatures - convert from text to array
      if (formData.keyFeatures && typeof formData.keyFeatures === 'string') {
        formData.keyFeatures = formData.keyFeatures
          .split('\n')
          .map(feature => feature.trim())
          .filter(feature => feature.length > 0);
      }

      // Handle image data
      const heroImageData = uploadedHeroImage || editingCaseStudy?.heroImage || formData.heroImage;
      const galleryData = uploadedGallery.length > 0 ? uploadedGallery : editingCaseStudy?.gallery || formData.gallery || [];

      // Prepare the data object with proper image structure
      const submitData = {
        ...formData,
        heroImage: heroImageData,
        gallery: galleryData
      };
      
      if (editingCaseStudy) {
        await updateCaseStudyMutation.mutateAsync({ id: editingCaseStudy._id, data: submitData });
      } else {
        await createCaseStudyMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving case study:', error);
    }
  };

  const columns = [
    {
      title: 'Case Study',
      key: 'caseStudy',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.heroImage?.url ? (
            <img
              src={record.heroImage.url}
              alt={record.title}
              width={80}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{ 
            width: 80, 
            height: 60, 
            background: '#f0f0f0', 
            borderRadius: 4, 
            display: record.heroImage?.url ? 'none' : 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <FileIcon />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.title}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.shortDescription}</div>
            <div style={{ fontSize: 11, color: '#999' }}>
              Client: {record.clientName || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      render: (service) => (
        <Tag color="blue">
          {service?.title || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="green">
          {department?.name || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'active' ? '#52c41a' : '#999',
          fontWeight: 'bold'
        }}>
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
      title: 'Completion',
      dataIndex: 'completionDate',
      key: 'completionDate',
      render: (date) => (
        <span style={{ color: '#666' }}>
          {date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleEditCaseStudy(record)}
            title="Edit Case Study"
          >
            <EditIcon />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleStatusChange(record._id, record.status === 'active' ? 'inactive' : 'active')}
            title="Toggle Status"
          >
            <SettingIcon />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (window.confirm('Delete this case study? This action cannot be undone.')) {
                handleDeleteCaseStudy(record._id);
              }
            }}
            title="Delete Case Study"
            style={{ color: '#ff4d4f' }}
          >
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page">
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Case Studies Management</h2>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Case Studies ({caseStudies.length})</h4>
          <Button 
            variant="primary" 
            onClick={handleAddCaseStudy}
          >
            <PlusIcon /> Add Case Study
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={Array.isArray(caseStudies) ? caseStudies : []}
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

      {/* Case Study Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={handleCancel}
        title={editingCaseStudy ? 'Edit Case Study' : 'Add New Case Study'}
        size="full"
      >
        <form onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Case Study Title *
                </label>
                <Input 
                  placeholder="e.g., Ute Canopy Installation for City Council"
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
                  placeholder="e.g., ute-canopy-city-council"
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
                placeholder="Detailed description of the case study"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                error={formErrors.description}
                required
              />
            </div>
          </div>

          {/* Client Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Client Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Client Name *
                </label>
                <Input 
                  placeholder="e.g., Dr. Michael Chen"
                  value={formData.clientName || ''}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  error={formErrors.clientName}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Client Position
                </label>
                <Input 
                  placeholder="e.g., Medical Director"
                  value={formData.clientPosition || ''}
                  onChange={(e) => setFormData({...formData, clientPosition: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Client Company
                </label>
                <Input 
                  placeholder="e.g., MediCare Plus"
                  value={formData.clientCompany || ''}
                  onChange={(e) => setFormData({...formData, clientCompany: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Service and Department */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Service & Department</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Related Service
                </label>
                <Select
                  options={services.map(service => ({
                    value: service._id,
                    label: service.title
                  }))}
                  value={formData.service}
                  onChange={(value) => setFormData({...formData, service: value})}
                  placeholder="Select related service"
                  allowClear
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Department
                </label>
                <Select
                  options={departments.map(dept => ({
                    value: dept._id,
                    label: dept.name
                  }))}
                  value={formData.department}
                  onChange={(value) => setFormData({...formData, department: value})}
                  placeholder="Select department"
                  allowClear
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Industry
                </label>
                <Input 
                  placeholder="e.g., Healthcare, Construction"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Images and Settings */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Images & Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Hero Image *
                </label>
                <SimpleImageUpload 
                  value={uploadedHeroImage}
                  onChange={(image) => {
                    setUploadedHeroImage(image);
                    setFormData({...formData, heroImage: image});
                  }}
                  folder="case-studies/hero"
                  maxSize={5}
                  required={true}
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch
                  checked={formData.isFeatured || false}
                  onChange={(checked) => setFormData({...formData, isFeatured: checked})}
                />
                <label style={{ fontWeight: '500' }}>Featured Case Study</label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Completion Date
                </label>
                <DatePicker 
                  placeholder="Select completion date"
                  value={formData.completionDate}
                  onChange={(value) => setFormData({...formData, completionDate: value})}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Case Study Gallery
              </label>
              <GalleryUpload 
                value={uploadedGallery}
                onChange={(gallery) => {
                  setUploadedGallery(gallery);
                  setFormData({...formData, gallery: gallery});
                }}
                folder="case-studies/gallery"
                maxSize={5}
                maxCount={10}
              />
            </div>
          </div>

          {/* Key Features */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Key Features</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Key Features (One per line)
              </label>
              <Input.Textarea 
                rows={6}
                placeholder="Patient portal with secure access
Automated appointment scheduling
Electronic health records (EHR)
Billing and insurance integration
HIPAA-compliant security
Telemedicine integration"
                value={formData.keyFeatures || ''}
                onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Button 
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              loading={createCaseStudyMutation.isPending || updateCaseStudyMutation.isPending}
            >
              {editingCaseStudy ? 'Update Case Study' : 'Add Case Study'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}