import { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Space, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Popconfirm,
  App,
  Tooltip,
  Badge,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SettingOutlined,
  TeamOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [currentColor, setCurrentColor] = useState('#1677ff');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Fetch departments data
  const { data: departments = [], isLoading: loading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => {
      const response = await api.get('/departments');
      return response.data || [];
    }
  });

  // Mutations
  const createDepartmentMutation = useMutation({
    mutationFn: (data) => api.post('/departments', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      message.success('Department created successfully');
      setModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Create department error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error creating department. Please try again.');
      }
    }
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/departments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      message.success('Department updated successfully');
      setModalVisible(false);
      setEditingDepartment(null);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Update department error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error updating department. Please try again.');
      }
    }
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      message.success('Department deleted successfully');
    },
    onError: (error) => {
      console.error('Delete department error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        message.error('Error deleting department. Please try again.');
      }
    }
  });

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setCurrentColor('#1677ff');
    form.resetFields();
    form.setFieldsValue({ 
      status: 'active',
      order: 0,
      color: '#1677ff'
    });
    setModalVisible(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    const departmentColor = department.color || '#1677ff';
    setCurrentColor(departmentColor);
    setModalVisible(true);
    
    // Small delay to ensure form is ready
    setTimeout(() => {
      // Pre-fill form fields with only the fields that exist in the database
      const formValues = {
        name: department.name,
        description: department.description,
        order: department.order || 0,
        status: department.status || 'active',
        color: departmentColor
      };
      form.setFieldsValue(formValues);
    }, 100);
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await deleteDepartmentMutation.mutateAsync(departmentId);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleStatusChange = async (departmentId, status) => {
    try {
      const department = departments.find(d => d._id === departmentId);
      if (department) {
        await updateDepartmentMutation.mutateAsync({ id: departmentId, data: { status } });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('aes_admin_token');
      if (!token) {
        message.error('Please log in to continue');
        return;
      }
      
      if (editingDepartment) {
        await updateDepartmentMutation.mutateAsync({ id: editingDepartment._id, data: values });
      } else {
        await createDepartmentMutation.mutateAsync(values);
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
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: record.color || '#1677ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getContrastColor(record.color || '#1677ff'),
              fontWeight: 'bold',
              fontSize: '16px',
              border: '2px solid #f0f0f0'
            }}
          >
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.description ? record.description.substring(0, 50) + (record.description.length > 50 ? '...' : '') : 'No description'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status.charAt(0).toUpperCase() + status.slice(1)} 
        />
      )
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (order) => <Tag color="blue">{order}</Tag>
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: '20px', 
              height: '20px', 
              borderRadius: '4px', 
              backgroundColor: color || '#1677ff',
              border: '1px solid #d9d9d9'
            }}
          />
          <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            {color || '#1677ff'}
          </Text>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Department">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditDepartment(record)}
            />
          </Tooltip>
          <Tooltip title="Toggle Status">
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              onClick={() => handleStatusChange(record._id, record.status === 'active' ? 'inactive' : 'active')}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this department?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteDepartment(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Department">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <Title level={2}>Departments Management</Title>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Title level={4}>Departments ({departments.length})</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddDepartment}
          >
            Add Department
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={departments}
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

      {/* Department Modal */}
      <Modal
        title={editingDepartment ? 'Edit Department' : 'Add New Department'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        className="admin-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="admin-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Department Name"
                rules={[{ required: true, message: 'Please enter department name' }]}
              >
                <Input placeholder="e.g., Installation Team" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label="Display Order"
                initialValue={0}
              >
                <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Detailed description of the department's responsibilities and functions"
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="active"
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="color"
                label="Department Color"
                initialValue="#1677ff"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input 
                    type="color" 
                    value={currentColor}
                    onChange={(e) => {
                      const color = e.target.value;
                      setCurrentColor(color);
                      form.setFieldValue('color', color);
                    }}
                    style={{ 
                      width: '60px', 
                      height: '40px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }} 
                  />
                  <Input 
                    value={currentColor}
                    placeholder="#1677ff"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      const color = e.target.value;
                      setCurrentColor(color);
                      if (color.match(/^#[0-9A-F]{6}$/i)) {
                        form.setFieldValue('color', color);
                      }
                    }}
                    onBlur={(e) => {
                      const color = e.target.value;
                      if (color && !color.startsWith('#')) {
                        const newColor = `#${color}`;
                        setCurrentColor(newColor);
                        form.setFieldValue('color', newColor);
                      }
                    }}
                  />
                </div>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #d9d9d9',
                  backgroundColor: currentColor,
                  color: getContrastColor(currentColor),
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  Preview: {currentColor}
                </div>
              </Form.Item>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}>
                {editingDepartment ? 'Update Department' : 'Add Department'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 