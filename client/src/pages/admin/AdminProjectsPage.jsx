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
import dayjs from 'dayjs';

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const EyeIcon = () => <span>👁️</span>;
const CalendarIcon = () => <span>📅</span>;
const SettingIcon = () => <span>⚙️</span>;
const FileIcon = () => <span>📄</span>;

export default function AdminProjectsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
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

  // Fetch projects data
  const { data: projects = [], isLoading: loading, error: projectsError } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: async () => {
      try {
        const response = await api.get('/projects');
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    }
  });

  // Fetch sub-services for dropdown (not main services)
  const { data: services = [], error: servicesError } = useQuery({ 
    queryKey: ['sub-services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services?type=sub&status=all');
        console.log('Sub-services response:', response.data);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching sub-services:', error);
        return [];
      }
    }
  });

  // Fetch departments for dropdown
  const { data: departments = [], error: departmentsError } = useQuery({ 
    queryKey: ['all-departments'], 
    queryFn: async () => {
      try {
        const response = await api.get('/departments');
        console.log('Departments response:', response.data);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
    }
  });

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: (data) => api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      showMessage('success', 'Project created successfully');
      setModalVisible(false);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create project error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating project. Please try again.');
      }
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      showMessage('success', 'Project updated successfully');
      setModalVisible(false);
      setEditingProject(null);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update project error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating project. Please try again.');
      }
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      showMessage('success', 'Project deleted successfully');
    },
    onError: (error) => {
      console.error('Delete project error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting project. Please try again.');
      }
    }
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setUploadedHeroImage(null);
    setUploadedGallery([]);
    setFormData({ 
      status: 'in-progress',
      isFeatured: false,
      order: 0
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingProject(null);
    setUploadedHeroImage(null);
    setUploadedGallery([]);
    setFormData({});
    setFormErrors({});
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setUploadedHeroImage(project.heroImage || null);
    setUploadedGallery(project.gallery || []);
    setFormData({
      ...project,
      service: project.service?._id,
      department: project.department?._id,
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      completionDate: project.completionDate || ''
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProjectMutation.mutateAsync(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleStatusChange = async (projectId, status) => {
    try {
      const project = projects.find(p => p._id === projectId);
      if (project) {
        await updateProjectMutation.mutateAsync({ id: projectId, data: { status } });
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
      const heroImageData = uploadedHeroImage || editingProject?.heroImage || formData.heroImage;
      const galleryData = uploadedGallery.length > 0 ? uploadedGallery : editingProject?.gallery || formData.gallery || [];

      // Prepare the data object with proper image structure
      const submitData = {
        ...formData,
        heroImage: heroImageData,
        gallery: galleryData
      };
      
      if (editingProject) {
        await updateProjectMutation.mutateAsync({ id: editingProject._id, data: submitData });
      } else {
        await createProjectMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const columns = [
    {
      title: 'Project',
      key: 'project',
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
                e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN';
              }}
            />
          ) : (
            <div style={{ width: 80, height: 60, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileIcon />
            </div>
          )}
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
        <Tag color={status === 'completed' ? 'green' : status === 'in-progress' ? 'blue' : status === 'planned' ? 'gray' : 'red'}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'N/A'}
        </Tag>
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
      title: 'Dates',
      key: 'dates',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>Start: {record.startDate ? dayjs(record.startDate).format('MMM DD, YYYY') : 'N/A'}</div>
          <div>End: {record.endDate ? dayjs(record.endDate).format('MMM DD, YYYY') : 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Budget',
      key: 'budget',
      render: (_, record) => (
        <div style={{ fontWeight: 'bold' }}>
          ${record.budget?.toLocaleString() || 'N/A'}
        </div>
      )
    },
    {
      title: 'Gallery',
      key: 'gallery',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {record.gallery && record.gallery.length > 0 ? (
            record.gallery.slice(0, 3).map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={image.url}
                  alt={image.alt || `Gallery ${index + 1}`}
                  width={40}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  onError={(e) => {
                    e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN';
                  }}
                />
                {index === 2 && record.gallery.length > 3 && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    borderRadius: 4
                  }}>
                    +{record.gallery.length - 3}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ fontSize: '12px', color: '#999' }}>No images</div>
          )}
        </div>
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
            onClick={() => handleEditProject(record)}
          >
            <EditIcon />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(record._id, record.status === 'completed' ? 'in-progress' : 'completed')}
          >
            <SettingIcon />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleDeleteProject(record._id)}
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
        <h1 className="page-title">Projects Management</h1>
        <p className="page-description">Manage all projects, case studies, and portfolio items</p>
      </div>
      
      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">Projects ({projects.length})</h2>
            <p className="card-subtitle">View and manage all projects</p>
          </div>
          <Button 
            variant="primary"
            onClick={handleAddProject}
          >
            <PlusIcon /> Add Project
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={Array.isArray(projects) ? projects : []}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Project Modal */}
      <Modal
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        isOpen={modalVisible}
        onClose={handleCancel}
        size="4xl"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Project Title *
              </label>
              <Input 
                placeholder="e.g., Ute Canopy Installation"
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
                placeholder="e.g., ute-canopy-installation"
                value={formData.slug || ''}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                error={formErrors.slug}
                required
              />
            </div>
          </div>
          
          <div>
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
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Full Description *
            </label>
            <textarea 
              placeholder="Detailed description of the project"
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
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Client Name *
              </label>
              <Input 
                placeholder="e.g., John Smith"
                value={formData.clientName || ''}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                error={formErrors.clientName}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Related Sub-Service
              </label>
              <Select
                placeholder="Select related sub-service"
                value={formData.service}
                onChange={(value) => setFormData({...formData, service: value})}
                options={services.map(service => ({
                  value: service._id,
                  label: service.title
                }))}
                allowClear
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Department
              </label>
              <Select
                placeholder="Select department"
                value={formData.department}
                onChange={(value) => setFormData({...formData, department: value})}
                options={departments.map(dept => ({
                  value: dept._id,
                  label: dept.name
                }))}
                allowClear
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                folder="projects/hero"
                maxSize={5}
                required={true}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Display Order
              </label>
              <InputNumber 
                placeholder="0"
                value={formData.order || 0}
                onChange={(value) => setFormData({...formData, order: value || 0})}
                min={0}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Status
              </label>
              <Select
                value={formData.status || 'in-progress'}
                onChange={(value) => setFormData({...formData, status: value})}
                options={[
                  { value: 'planned', label: 'Planned' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'on-hold', label: 'On Hold' }
                ]}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Featured Project
              </label>
              <Switch 
                checked={formData.isFeatured || false}
                onChange={(checked) => setFormData({...formData, isFeatured: checked})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Budget (AUD)
              </label>
              <InputNumber 
                placeholder="0"
                value={formData.budget}
                onChange={(value) => setFormData({...formData, budget: value})}
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>
          </div>
          
          <div>
            <h3 style={{ margin: '24px 0 16px 0', padding: '12px 0', borderTop: '1px solid #eee' }}>
              Project Timeline
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Start Date
              </label>
              <input 
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
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
                End Date
              </label>
              <input 
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
                Completion Date
              </label>
              <input 
                type="date"
                value={formData.completionDate || ''}
                onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Project Gallery
            </label>
            <GalleryUpload 
              value={uploadedGallery}
              onChange={(gallery) => {
                setUploadedGallery(gallery);
                setFormData({...formData, gallery: gallery});
              }}
              folder="projects/gallery"
              maxSize={5}
              maxCount={10}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Technologies Used
            </label>
            <Input 
              placeholder="Add technologies used (comma separated)"
              value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''}
              onChange={(e) => {
                const technologies = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                setFormData({...formData, technologies: technologies});
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Challenges & Solutions
            </label>
            <textarea 
              placeholder="Describe challenges faced and solutions implemented"
              value={formData.challenges || ''}
              onChange={(e) => setFormData({...formData, challenges: e.target.value})}
              rows={3}
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
              Results & Outcomes
            </label>
            <textarea 
              placeholder="Describe the results and outcomes of the project"
              value={formData.results || ''}
              onChange={(e) => setFormData({...formData, results: e.target.value})}
              rows={3}
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
              disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}