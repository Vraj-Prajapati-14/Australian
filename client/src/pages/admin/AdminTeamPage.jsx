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
  Image,
  Avatar,
  Divider,
  App,
  Tooltip,
  Badge,
  InputNumber,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GlobalOutlined,
  MailOutlined,
  SettingOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import SimpleImageUpload from '../../components/SimpleImageUpload';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminTeamPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Fetch team data (expects raw array)
  const { data: teamMembers = [], isLoading: loading, error: teamError } = useQuery({ 
    queryKey: ['team'], 
    queryFn: async () => {
      try {
        const response = await api.get('/team');
        
        // Return raw array for antd Table
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        return data;
      } catch (error) {
        console.error('Error fetching team data:', error);
        throw error;
      }
    }
  });

  // Fetch departments for dropdown
  const { data: departments = [] } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => {
      try {
        const response = await api.get('/departments');
        return Array.isArray(response.data) ? response.data : (response.data?.data || []);
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
      message.success('Team member added successfully');
      setModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Create team member error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error creating team member. Please try again.');
      }
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/team/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      message.success('Team member updated successfully');
      setModalVisible(false);
      setEditingMember(null);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Update team member error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error updating team member. Please try again.');
      }
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id) => api.delete(`/team/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      message.success('Team member deleted successfully');
    },
    onError: (error) => {
      console.error('Delete team member error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        message.error('Error deleting team member. Please try again.');
      }
    }
  });

  const handleAddMember = () => {
    setEditingMember(null);
    form.resetFields();
    form.setFieldsValue({ 
      status: 'active',
      isFeatured: false,
      order: 0
    });
    setModalVisible(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    form.setFieldsValue({
      ...member,
      department: member.department?._id
    });
    setModalVisible(true);
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await deleteMemberMutation.mutateAsync(memberId);
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleStatusChange = async (memberId, status) => {
    try {
      const member = Array.isArray(teamMembers) ? teamMembers.find(m => m._id === memberId) : null;
      if (member) {
        await updateMemberMutation.mutateAsync({ id: memberId, data: { status } });
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

      console.log('Submitting team member data:', values);
      
      if (editingMember) {
        await updateMemberMutation.mutateAsync({ id: editingMember._id, data: values });
      } else {
        await createMemberMutation.mutateAsync(values);
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const columns = [
    {
      title: 'Team Member',
      key: 'member',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.avatar?.url ? (
            <Avatar 
              size={60} 
              src={record.avatar.url}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Avatar 
              size={60} 
              icon={<UserOutlined />}
              style={{ backgroundColor: '#f0f0f0', color: '#999' }}
            />
          )}
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.role}</div>
            <div style={{ fontSize: 11, color: '#999' }}>
              {record.department?.name || 'No Department'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="blue">
          {department?.name || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={(status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown')} 
        />
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
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{record.email || 'N/A'}</div>
          <div>{record.phone || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Specialties & Qualifications',
      key: 'specialties-qualifications',
      render: (_, record) => (
        <div style={{ fontSize: 12, maxWidth: 200 }}>
          {record.specialties && record.specialties.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: 4 }}>Specialties:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {record.specialties.slice(0, 3).map((specialty, index) => (
                  <Tag key={index} size="small" color="blue">{specialty}</Tag>
                ))}
                {record.specialties.length > 3 && (
                  <Tag size="small" color="blue">+{record.specialties.length - 3} more</Tag>
                )}
              </div>
            </div>
          )}
          {record.qualifications && record.qualifications.length > 0 && (
            <div>
              <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: 4 }}>Qualifications:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {record.qualifications.slice(0, 2).map((qual, index) => (
                  <Tag key={index} size="small" color="green">{qual}</Tag>
                ))}
                {record.qualifications.length > 2 && (
                  <Tag size="small" color="green">+{record.qualifications.length - 2} more</Tag>
                )}
              </div>
            </div>
          )}
          {(!record.specialties || record.specialties.length === 0) && (!record.qualifications || record.qualifications.length === 0) && (
            <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>No specialties or qualifications added</div>
          )}
        </div>
      )
    },
    {
      title: 'Social',
      key: 'social',
      render: (_, record) => (
        <Space size="small">
          {record.linkedin && (
            <Tooltip title="LinkedIn">
              <Button 
                type="text" 
                size="small" 
                icon={<LinkedinOutlined />} 
                onClick={() => window.open(record.linkedin, '_blank')}
              />
            </Tooltip>
          )}
          {record.twitter && (
            <Tooltip title="Twitter">
              <Button 
                type="text" 
                size="small" 
                icon={<TwitterOutlined />} 
                onClick={() => window.open(record.twitter, '_blank')}
              />
            </Tooltip>
          )}
          {record.website && (
            <Tooltip title="Website">
              <Button 
                type="text" 
                size="small" 
                icon={<GlobalOutlined />} 
                onClick={() => window.open(record.website, '_blank')}
              />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Team Member">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditMember(record)}
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
            title="Delete this team member?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteMember(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Team Member">
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
      <Title level={2}>Team Management</Title>
      
      {teamError && (
        <Alert
          message="Error Loading Team Data"
          description={teamError.message || 'There was an error loading the team data. Please try refreshing the page.'}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              Refresh
            </Button>
          }
        />
      )}
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Title level={4}>Team Members ({Array.isArray(teamMembers) ? teamMembers.length : 0})</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddMember}
          >
            Add Team Member
          </Button>
        </div>
        
        <Table
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Team Member Modal */}
      <Modal
        title={editingMember ? 'Edit Team Member' : 'Add New Team Member'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
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
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="e.g., John Smith" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role/Position"
                rules={[{ required: true, message: 'Please enter role/position' }]}
              >
                <Input placeholder="e.g., Senior Installer" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="e.g., john.smith@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
              >
                <Input placeholder="e.g., +61 400 123 456" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
              >
                <Select placeholder="Select department">
                  {Array.isArray(departments) ? departments.map(dept => (
                    <Option key={dept._id} value={dept._id}>
                      {dept.name}
                    </Option>
                  )) : null}
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
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="isFeatured"
                label="Featured Member"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="showContact"
                label="Show Contact Info"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="avatar"
            label="Profile Photo"
          >
            <SimpleImageUpload folder="team/avatars" />
          </Form.Item>
          
          <Form.Item
            name="bio"
            label="Bio"
          >
            <TextArea 
              rows={4} 
              placeholder="Tell us about this team member's experience, skills, and background..."
            />
          </Form.Item>
          
          <Divider>Social Media & Links</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="linkedin"
                label="LinkedIn Profile"
              >
                <Input placeholder="https://linkedin.com/in/username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="twitter"
                label="Twitter Profile"
              >
                <Input placeholder="https://twitter.com/username" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="website"
            label="Personal Website"
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
          
          <Divider>Skills & Expertise</Divider>
          
          <Form.Item
            name="specialties"
            label="Specialties & Skills"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.resolve();
                  }
                  if (Array.isArray(value) && value.some(specialty => !specialty || specialty.trim().length < 2)) {
                    return Promise.reject(new Error('Each specialty must be at least 2 characters long'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Select
              mode="tags"
              placeholder="Add specialties (e.g., Ute Canopies, Trailer Modifications, Customer Service)"
              style={{ width: '100%' }}
              maxTagCount={10}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          
          <Form.Item
            name="qualifications"
            label="Qualifications & Certifications"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.resolve();
                  }
                  if (Array.isArray(value) && value.some(qual => !qual || qual.trim().length < 2)) {
                    return Promise.reject(new Error('Each qualification must be at least 2 characters long'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Select
              mode="tags"
              placeholder="Add qualifications (e.g., ISO 9001 Lead Auditor, Six Sigma Green Belt, Trade Certificate)"
              style={{ width: '100%' }}
              maxTagCount={10}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          
          <Form.Item
            name="experience"
            label="Years of Experience"
          >
            <InputNumber 
              min={0} 
              max={50} 
              placeholder="5" 
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="region"
            label="Region/Location"
          >
            <Input placeholder="e.g., Sydney, Melbourne, Brisbane" />
          </Form.Item>

          <Form.Item
            name="achievements"
            label="Key Achievements"
          >
            <Select
              mode="tags"
              placeholder="Add achievements (e.g., Employee of the Year 2023, Project Excellence Award)"
              style={{ width: '100%' }}
              maxTagCount={5}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createMemberMutation.isPending || updateMemberMutation.isPending}>
                {editingMember ? 'Update Team Member' : 'Add Team Member'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

