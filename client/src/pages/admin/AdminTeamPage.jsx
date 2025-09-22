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

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const UserIcon = () => <span>👤</span>;
const SettingIcon = () => <span>⚙️</span>;

export default function AdminTeamPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const queryClient = useQueryClient();
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };

  // Fetch team members
  const { data: teamMembers = [], isLoading: loading } = useQuery({ 
    queryKey: ['team'], 
    queryFn: async () => {
      try {
        const response = await api.get('/team');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching team:', error);
        return [];
      }
    }
  });

  // Fetch departments
  const { data: departments = [] } = useQuery({ 
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
  const createMemberMutation = useMutation({
    mutationFn: (data) => api.post('/team', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      showMessage('success', 'Team member created successfully');
      setModalVisible(false);
      setUploadedImage(null);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create member error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating team member. Please try again.');
      }
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/team/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      showMessage('success', 'Team member updated successfully');
      setModalVisible(false);
      setEditingMember(null);
      setUploadedImage(null);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update member error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating team member. Please try again.');
      }
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id) => api.delete(`/team/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      showMessage('success', 'Team member deleted successfully');
    },
    onError: (error) => {
      console.error('Delete member error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting team member. Please try again.');
      }
    }
  });

  const handleAddMember = () => {
    setEditingMember(null);
    setUploadedImage(null);
    setFormData({ 
      isActive: true,
      order: 0
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingMember(null);
    setUploadedImage(null);
    setFormData({});
    setFormErrors({});
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setUploadedImage(member.image || null);
    setFormData({
      name: member.name || '',
      position: member.position || '',
      department: member.department || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      experience: member.experience || '',
      specializations: member.specializations || [],
      linkedinUrl: member.linkedinUrl || '',
      twitterUrl: member.twitterUrl || '',
      websiteUrl: member.websiteUrl || '',
      isActive: member.isActive !== undefined ? member.isActive : true,
      order: member.order || 0
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Delete this team member? This action cannot be undone.')) {
    try {
      await deleteMemberMutation.mutateAsync(memberId);
    } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleStatusChange = async (memberId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const member = teamMembers.find(m => m._id === memberId);
      if (member) {
        await updateMemberMutation.mutateAsync({ id: memberId, data: { isActive: newStatus } });
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
      const imageData = uploadedImage || editingMember?.image || formData.image;

      // Prepare the data object
      const submitData = {
        ...formData,
        image: imageData
      };
      
      if (editingMember) {
        await updateMemberMutation.mutateAsync({ id: editingMember._id, data: submitData });
      } else {
        await createMemberMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const columns = [
    {
      title: 'Member',
      key: 'member',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.image?.url ? (
            <img
              src={record.image.url}
              alt={record.name}
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{ 
            width: 50, 
            height: 50, 
            background: '#f0f0f0', 
            borderRadius: '50%', 
            display: record.image?.url ? 'none' : 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <UserIcon />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {typeof record.name === 'object' 
                ? (record.name?.name || record.name?.title || JSON.stringify(record.name))
                : (record.name || 'Unnamed')
              }
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {typeof record.position === 'object' 
                ? (record.position?.name || record.position?.title || JSON.stringify(record.position))
                : (record.position || '-')
              }
            </div>
            <div style={{ fontSize: 11, color: '#999' }}>
              {typeof record.department === 'object' 
                ? (record.department?.name || record.department?.title || JSON.stringify(record.department))
                : (record.department || '-')
              }
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12, marginBottom: 2 }}>{record.email}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.phone || '-'}</div>
        </div>
      )
    },
    {
      title: 'Specializations',
      dataIndex: 'specializations',
      key: 'specializations',
      render: (specializations) => {
        // Handle both string arrays and object arrays
        const specs = Array.isArray(specializations) ? specializations : [];
        const displaySpecs = specs.slice(0, 2).map(spec => {
          // If spec is an object, extract the name property, otherwise use as string
          return typeof spec === 'object' ? (spec.name || spec.title || JSON.stringify(spec)) : spec;
        });
        
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {displaySpecs.map((spec, index) => (
              <Tag key={index} color="blue">
                {String(spec)}
              </Tag>
            ))}
            {specs.length > 2 && (
              <Tag color="default">+{specs.length - 2}</Tag>
                )}
              </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span className={isActive ? 'status-active' : 'status-inactive'}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <button 
            className="action-btn edit"
              onClick={() => handleEditMember(record)}
            title="Edit Member"
          >
            <EditIcon />
          </button>
          <button 
            className="action-btn status"
            onClick={() => handleStatusChange(record._id, record.isActive)}
            title={`Toggle Status (Current: ${record.isActive ? 'Active' : 'Inactive'})`}
          >
            <SettingIcon />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => handleDeleteMember(record._id)}
            title="Delete Member"
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
        <h2 className="page-title">Team Management</h2>
        <p className="page-description">Manage your team members and their information</p>
      </div>
      
      <Card className="services-card">
        <div className="card-header">
          <div className="card-title">
            <h4>Team Members ({teamMembers.length})</h4>
            <p className="card-subtitle">Add and manage team member profiles</p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleAddMember}
            className="add-service-btn"
          >
            <PlusIcon /> Add Team Member
          </Button>
        </div>
        
        <Table
          className="services-table"
          columns={columns}
          dataSource={Array.isArray(teamMembers) ? teamMembers : []}
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

      {/* Team Member Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={handleCancel}
        title={editingMember ? 'Edit Team Member' : 'Add New Team Member'}
        size="full"
      >
        <form onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Full Name *
                </label>
                <Input 
                  placeholder="e.g., John Smith"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  error={formErrors.name}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Position *
                </label>
                <Input 
                  placeholder="e.g., Senior Engineer"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  error={formErrors.position}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Department
                </label>
                <Select
                  placeholder="Select department"
                  value={typeof formData.department === 'object' ? formData.department?._id : formData.department}
                  onChange={(value) => {
                    // Find the selected department object
                    const selectedDept = departments.find(dept => dept._id === value);
                    setFormData({...formData, department: selectedDept || value});
                  }}
                  options={departments.map(dept => ({
                    value: dept._id,
                    label: dept.name || dept.title
                  }))}
                  error={formErrors.department}
                  allowClear
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Email *
                </label>
                <Input 
                  type="email"
                  placeholder="e.g., john@company.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  error={formErrors.email}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Phone
                </label>
                <Input 
                  placeholder="e.g., +61 400 000 000"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  error={formErrors.phone}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Years of Experience
                </label>
                <Input 
                  placeholder="e.g., 5 years"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  error={formErrors.experience}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Bio
              </label>
              <Input.Textarea 
              rows={4} 
                placeholder="Brief biography of the team member"
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                error={formErrors.bio}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Professional Information</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Specializations
              </label>
              <Input 
                placeholder="e.g., React, Node.js, Python (comma separated)"
                value={formData.specializations ? formData.specializations.join(', ') : ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                error={formErrors.specializations}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  LinkedIn URL
                </label>
                <Input 
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                  error={formErrors.linkedinUrl}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Twitter URL
                </label>
                <Input 
                  placeholder="https://twitter.com/username"
                  value={formData.twitterUrl || ''}
                  onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})}
                  error={formErrors.twitterUrl}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Website URL
                </label>
                <Input 
                  placeholder="https://website.com"
                  value={formData.websiteUrl || ''}
                  onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                  error={formErrors.websiteUrl}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Display Order
                </label>
            <InputNumber 
              min={0} 
                  placeholder="0"
                  value={formData.order || 0}
                  onChange={(value) => setFormData({...formData, order: value})}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Switch
                    checked={formData.isActive !== undefined ? formData.isActive : true}
                    onChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <label style={{ fontWeight: '500' }}>Active Member</label>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Profile Image</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Team Member Photo
              </label>
              <SimpleImageUpload 
                value={uploadedImage}
                onChange={(image) => {
                  setUploadedImage(image);
                  setFormData({...formData, image: image});
                }}
                folder="team"
                maxSize={5}
              />
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
              disabled={createMemberMutation.isPending || updateMemberMutation.isPending}
            >
              {createMemberMutation.isPending || updateMemberMutation.isPending ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}