import React, { useState, useEffect } from 'react';
import '../../styles/admin-forms.css';
import {
  Button,
  Modal,
  Input,
  Card,
  Table,
  Tag,
  Select,
  InputNumber,
  Switch
} from '../../components/ui';
// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const EyeIcon = () => <span>👁️</span>;
const UploadIcon = () => <span>📤</span>;
const StarIcon = () => <span>⭐</span>;
const UserIcon = () => <span>👤</span>;
const CheckIcon = () => <span>✅</span>;
const CloseIcon = () => <span>❌</span>;
const ClockIcon = () => <span>🕐</span>;
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Helmet } from 'react-helmet-async';
import SimpleImageUpload from '../../components/SimpleImageUpload';

export default function AdminTestimonialsPage() {
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    featured: '',
    search: ''
  });

  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data: testimonialsData, isLoading, error } = useQuery({
    queryKey: ['adminTestimonials', pagination.current, pagination.pageSize, filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: pagination.current,
          limit: pagination.pageSize,
        });
        
        if (filters.status && filters.status.trim() !== '') {
          params.append('status', filters.status);
        }
        if (filters.featured && filters.featured.trim() !== '') {
          params.append('featured', filters.featured);
        }
        if (filters.search && filters.search.trim() !== '') {
          params.append('search', filters.search);
        }
        
        const response = await api.get(`/testimonials/admin?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return { data: [], stats: {} };
      }
    }
  });

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ['testimonialStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/testimonials/admin/stats');
        return response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
        return { stats: {} };
      }
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/testimonials', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      queryClient.invalidateQueries(['testimonialStats']);
      showMessage('success', 'Testimonial created successfully');
      setIsModalVisible(false);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create testimonial error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating testimonial. Please try again.');
      }
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/testimonials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      queryClient.invalidateQueries(['testimonialStats']);
      showMessage('success', 'Testimonial updated successfully');
      setIsModalVisible(false);
      setEditingTestimonial(null);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update testimonial error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating testimonial. Please try again.');
      }
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/testimonials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      queryClient.invalidateQueries(['testimonialStats']);
      showMessage('success', 'Testimonial deleted successfully');
    },
    onError: (error) => {
      console.error('Delete testimonial error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting testimonial. Please try again.');
      }
    }
  });

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({ 
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
      featured: false,
      status: 'pending',
      email: '',
      phone: ''
    });
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      ...testimonial
    });
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTestimonial(null);
    setFormData({});
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

      // Validate required fields
      if (!formData.name) {
        setFormErrors({ name: 'Name is required' });
        return;
      }
      if (!formData.content) {
        setFormErrors({ content: 'Testimonial content is required' });
        return;
      }

      if (editingTestimonial) {
        await updateMutation.mutateAsync({ id: editingTestimonial._id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const columns = [
    {
      title: 'Testimonial',
      key: 'testimonial',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.avatar?.url ? (
            <img
              src={record.avatar.url}
              alt={record.name}
              width={60}
              height={60}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              onError={(e) => {
                e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN';
              }}
            />
          ) : (
            <div style={{ width: 60, height: 60, background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.position}</div>
            {record.company && (
              <div style={{ fontSize: 11, color: '#999' }}>{record.company}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} style={{ 
              color: i < (rating || 5) ? '#ffc107' : '#ddd',
              fontSize: '14px'
            }} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 12 }}>{rating || 5}/5</span>
        </div>
      )
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (content) => (
        <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {content || 'No content'}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'approved': return 'green';
            case 'pending': return 'orange';
            case 'rejected': return 'red';
            default: return 'default';
          }
        };
        return (
          <Tag color={getStatusColor(status)}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
          </Tag>
        );
      }
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured) => (
        <Tag color={featured ? 'gold' : 'default'}>
          {featured ? 'Featured' : 'Regular'}
        </Tag>
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
    <div className="admin-page" style={{ padding: '24px', maxWidth: '100%', overflowX: 'auto', backgroundColor: 'white', minHeight: '100vh' }}>
      <Helmet>
        <title>Testimonials Management - Admin Dashboard</title>
      </Helmet>

      <div className="page-header">
        <h1 className="page-title">Testimonials Management</h1>
        <p className="page-description">Manage customer testimonials and reviews</p>
      </div>

      {/* Statistics */}
      {statsData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <UserIcon />
              <h3 style={{ margin: '8px 0 4px 0' }}>Total Testimonials</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {statsData?.stats?.total || 0}
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <CheckIcon />
              <h3 style={{ margin: '8px 0 4px 0' }}>Active</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {statsData?.stats?.active || 0}
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <StarIcon />
              <h3 style={{ margin: '8px 0 4px 0' }}>Featured</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {statsData?.stats?.featured || 0}
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <ClockIcon />
              <h3 style={{ margin: '8px 0 4px 0' }}>Pending</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {statsData?.stats?.pending || 0}
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">Testimonials ({testimonialsData?.data?.length || 0})</h2>
            <p className="card-subtitle">View and manage all testimonials</p>
          </div>
          <Button 
            variant="primary"
            onClick={handleAdd}
          >
            <PlusIcon /> Add Testimonial
          </Button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '200px' }}>
            <Input
              placeholder="Search testimonials..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              prefix={<span>🔍</span>}
            />
          </div>
          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => setFilters({...filters, status: value})}
            options={[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]}
            allowClear
          />
          <Select
            placeholder="Filter by featured"
            value={filters.featured}
            onChange={(value) => setFilters({...filters, featured: value})}
            options={[
              { value: '', label: 'All' },
              { value: 'true', label: 'Featured' },
              { value: 'false', label: 'Regular' }
            ]}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={testimonialsData?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize
              }));
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Testimonial Modal */}
      <Modal
        title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        isOpen={isModalVisible}
        onClose={handleCancel}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Name *
              </label>
              <Input 
                placeholder="Customer name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={formErrors.name}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Position
              </label>
              <Input 
                placeholder="Job title"
                value={formData.position || ''}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Company
            </label>
            <Input 
              placeholder="Company name"
              value={formData.company || ''}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Email *
              </label>
              <Input 
                type="email"
                placeholder="Customer email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Phone
              </label>
              <Input 
                placeholder="Phone number"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Testimonial Content *
            </label>
            <textarea 
              placeholder="Enter testimonial content"
              value={formData.content || ''}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
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
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Customer Photo
            </label>
            <SimpleImageUpload 
              value={formData.avatar}
              onChange={(avatar) => setFormData({...formData, avatar: avatar})}
              folder="testimonials"
              maxSize={5}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Rating
              </label>
              <InputNumber 
                placeholder="5"
                value={formData.rating || 5}
                onChange={(value) => setFormData({...formData, rating: value || 5})}
                min={1}
                max={5}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Status
              </label>
              <Select
                value={formData.status || 'pending'}
                onChange={(value) => setFormData({...formData, status: value})}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Featured
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                style={{ transform: 'scale(1.2)' }}
              />
              <span>Featured Testimonial</span>
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
              {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}