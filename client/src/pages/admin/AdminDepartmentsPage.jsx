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

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const SettingIcon = () => <span>⚙️</span>;
const TeamIcon = () => <span>👥</span>;
const FileIcon = () => <span>📄</span>;

// Helper function to calculate contrast color (black or white) based on background color
const getContrastColor = (hexColor) => {
  // Remove the # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default function AdminDepartmentsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const queryClient = useQueryClient();
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };

  // Fetch departments data
  const { data: departments = [], isLoading } = useQuery({
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/departments', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      showMessage('success', 'Department created successfully');
      setIsModalVisible(false);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create department error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error creating department. Please try again.');
      }
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/departments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      showMessage('success', 'Department updated successfully');
      setIsModalVisible(false);
      setEditingDepartment(null);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update department error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data?.message || 'Invalid data provided');
      } else {
        showMessage('error', 'Error updating department. Please try again.');
      }
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      showMessage('success', 'Department deleted successfully');
    },
    onError: (error) => {
      console.error('Delete department error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Error deleting department. Please try again.');
      }
    }
  });

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData({ 
      name: '',
      description: '',
      color: '#1890ff',
      isActive: true,
      order: 0
    });
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      ...department
    });
    setFormErrors({});
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDepartment(null);
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
        setFormErrors({ name: 'Department name is required' });
        return;
      }

      if (editingDepartment) {
        await updateMutation.mutateAsync({ id: editingDepartment._id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const columns = [
    {
      title: 'Department',
      key: 'department',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: record.color || '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getContrastColor(record.color || '#1890ff'),
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {record.name?.charAt(0)?.toUpperCase() || 'D'}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div 
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: color || '#1890ff'
            }}
          />
          <span style={{ fontSize: 12 }}>{color || '#1890ff'}</span>
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
        <h1 className="page-title">Departments</h1>
        <p className="page-description">Manage company departments and teams</p>
      </div>

      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">Departments ({departments.length})</h2>
            <p className="card-subtitle">View and manage all departments</p>
          </div>
          <Button 
            variant="primary"
            onClick={handleAdd}
          >
            <PlusIcon /> Add Department
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={departments}
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

      {/* Department Modal */}
      <Modal
        title={editingDepartment ? 'Edit Department' : 'Add New Department'}
        isOpen={isModalVisible}
        onClose={handleCancel}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Department Name *
              </label>
              <Input 
                placeholder="e.g., Engineering"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={formErrors.name}
                required
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
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Description
            </label>
            <textarea 
              placeholder="Enter department description"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color"
                  value={formData.color || '#1890ff'}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
                <Input 
                  value={formData.color || '#1890ff'}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="#1890ff"
                  style={{ flex: 1 }}
                />
              </div>
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
              {editingDepartment ? 'Update Department' : 'Add Department'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}