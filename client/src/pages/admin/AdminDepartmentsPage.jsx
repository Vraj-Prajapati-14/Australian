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

export default function AdminDepartmentsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
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
    form.resetFields();
    form.setFieldsValue({ 
      status: 'active',
      order: 0
    });
    setModalVisible(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    form.setFieldsValue({
      ...department,
      parent: department.parent?._id
    });
    setModalVisible(true);
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

      console.log('Submitting department data:', values);
      
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
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.shortDescription}</div>
            {record.parent && (
              <div style={{ fontSize: 11, color: '#999' }}>
                Parent: {record.parent.name}
              </div>
            )}
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
      title: 'Team Size',
      key: 'teamSize',
      render: (_, record) => (
        <Tag color="green" icon={<TeamOutlined />}>
          {record.teamSize || 0} members
        </Tag>
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
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
              >
                <Input placeholder="e.g., installation-team" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="shortDescription"
            label="Short Description"
            rules={[{ required: true, message: 'Please enter short description' }]}
          >
            <Input placeholder="Brief description of the department" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Full Description"
          >
            <TextArea 
              rows={4} 
              placeholder="Detailed description of the department's responsibilities and functions"
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="parent"
                label="Parent Department"
              >
                <Select placeholder="Select parent department (optional)">
                  {departments
                    .filter(dept => dept._id !== editingDepartment?._id)
                    .map(dept => (
                      <Option key={dept._id} value={dept._id}>
                        {dept.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label="Display Order"
                initialValue={0}
              >
                <InputNumber min={0} placeholder="1" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
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
                <Input type="color" style={{ width: '100%', height: '40px' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="responsibilities"
            label="Responsibilities"
          >
            <Select
              mode="tags"
              placeholder="Add department responsibilities"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="contactInfo"
            label="Contact Information"
          >
            <TextArea 
              rows={3} 
              placeholder="Department contact information, office location, etc."
            />
          </Form.Item>
          
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