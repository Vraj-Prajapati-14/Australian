import { useState, useEffect } from 'react';
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
  message,
  Image,
  Upload,
  Avatar,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  UploadOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form] = Form.useForm();

  // Fetch team data
  const { data: teamData = [] } = useQuery({ 
    queryKey: ['team'], 
    queryFn: async () => (await api.get('/team')).data || []
  });

  // Mock data for now - replace with actual API calls
  const mockTeamMembers = [
    {
      _id: '1',
      name: 'John Smith',
      position: 'CEO & Founder',
      department: 'Executive',
      email: 'john.smith@hidrive.com.au',
      phone: '+61 2 1234 5678',
      bio: 'John has over 20 years of experience in the automotive industry, specializing in vehicle modifications and service body solutions.',
      shortBio: 'CEO with 20+ years automotive experience',
      image: 'https://via.placeholder.com/200x200',
      linkedin: 'https://linkedin.com/in/johnsmith',
      twitter: 'https://twitter.com/johnsmith',
      website: 'https://johnsmith.com',
      expertise: ['Strategic Planning', 'Business Development', 'Industry Relations'],
      experience: '20+ years',
      education: 'Bachelor of Engineering, University of Sydney',
      featured: true,
      status: 'active',
      order: 1,
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      position: 'Head of Engineering',
      department: 'Engineering',
      email: 'sarah.johnson@hidrive.com.au',
      phone: '+61 2 1234 5679',
      bio: 'Sarah leads our engineering team with expertise in mechanical design, materials science, and innovative vehicle solutions.',
      shortBio: 'Engineering leader with mechanical expertise',
      image: 'https://via.placeholder.com/200x200',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: '',
      website: '',
      expertise: ['Mechanical Design', 'Materials Science', 'Product Development'],
      experience: '15+ years',
      education: 'Master of Engineering, University of Melbourne',
      featured: true,
      status: 'active',
      order: 2,
      createdAt: '2024-01-15'
    },
    {
      _id: '3',
      name: 'Mike Davis',
      position: 'Sales Director',
      department: 'Sales',
      email: 'mike.davis@hidrive.com.au',
      phone: '+61 2 1234 5680',
      bio: 'Mike drives our sales strategy and customer relationships, ensuring we deliver solutions that exceed client expectations.',
      shortBio: 'Sales leader focused on customer success',
      image: 'https://via.placeholder.com/200x200',
      linkedin: 'https://linkedin.com/in/mikedavis',
      twitter: 'https://twitter.com/mikedavis',
      website: '',
      expertise: ['Sales Strategy', 'Customer Relations', 'Market Analysis'],
      experience: '12+ years',
      education: 'Bachelor of Business, RMIT University',
      featured: false,
      status: 'active',
      order: 3,
      createdAt: '2024-01-15'
    },
    {
      _id: '4',
      name: 'Lisa Chen',
      position: 'Production Manager',
      department: 'Operations',
      email: 'lisa.chen@hidrive.com.au',
      phone: '+61 2 1234 5681',
      bio: 'Lisa oversees our production processes, ensuring quality control and efficient manufacturing of all HIDRIVE products.',
      shortBio: 'Operations expert with quality focus',
      image: 'https://via.placeholder.com/200x200',
      linkedin: 'https://linkedin.com/in/lisachen',
      twitter: '',
      website: '',
      expertise: ['Production Management', 'Quality Control', 'Process Optimization'],
      experience: '10+ years',
      education: 'Bachelor of Manufacturing Engineering, University of Queensland',
      featured: false,
      status: 'active',
      order: 4,
      createdAt: '2024-01-15'
    }
  ];

  useEffect(() => {
    setTeamMembers(mockTeamMembers);
  }, []);

  const handleAddMember = () => {
    setEditingMember(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    form.setFieldsValue(member);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingMember) {
        // Update existing member
        const updatedMembers = teamMembers.map(m => 
          m._id === editingMember._id ? { ...m, ...values } : m
        );
        setTeamMembers(updatedMembers);
        message.success('Team member updated successfully');
      } else {
        // Add new member
        const newMember = {
          _id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setTeamMembers([...teamMembers, newMember]);
        message.success('Team member added successfully');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Error saving team member');
    }
  };

  const handleDeleteMember = (memberId) => {
    setTeamMembers(teamMembers.filter(m => m._id !== memberId));
    message.success('Team member deleted successfully');
  };

  const handleStatusChange = (memberId, status) => {
    setTeamMembers(teamMembers.map(m => 
      m._id === memberId ? { ...m, status } : m
    ));
    message.success(`Team member ${status === 'active' ? 'activated' : 'deactivated'}`);
  };

  const handleFeaturedChange = (memberId, featured) => {
    setTeamMembers(teamMembers.map(m => 
      m._id === memberId ? { ...m, featured } : m
    ));
    message.success(`Team member ${featured ? 'featured' : 'unfeatured'}`);
  };

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image, record) => (
        <Avatar
          size={60}
          src={image}
          icon={<UserOutlined />}
          style={{ objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Member',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '14px' }}>{record.position}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="blue">{record.department}</Tag>
            {record.featured && <Tag color="gold">Featured</Tag>}
          </div>
        </div>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
        </div>
      )
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (experience) => <Tag color="green">{experience}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(record._id, checked ? 'active' : 'inactive')}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      )
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditMember(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this team member?"
            onConfirm={() => handleDeleteMember(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Team Management</Title>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>Team Members</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddMember}
            size="large"
          >
            Add Team Member
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={teamMembers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Team Member Modal */}
      <Modal
        title={editingMember ? 'Edit Team Member' : 'Add New Team Member'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="e.g., John Smith" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="position"
                label="Position/Title"
                rules={[{ required: true, message: 'Please enter position' }]}
              >
                <Input placeholder="e.g., CEO & Founder" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select placeholder="Select department">
                  <Option value="Executive">Executive</Option>
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Operations">Operations</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="HR">Human Resources</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="experience"
                label="Years of Experience"
                rules={[{ required: true, message: 'Please enter experience' }]}
              >
                <Input placeholder="e.g., 20+ years" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="john.smith@hidrive.com.au" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="+61 2 1234 5678" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="shortBio"
            label="Short Bio"
            rules={[{ required: true, message: 'Please enter short bio' }]}
          >
            <Input placeholder="Brief professional summary" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Full Bio"
            rules={[{ required: true, message: 'Please enter full bio' }]}
          >
            <TextArea rows={4} placeholder="Detailed professional background and achievements..." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="education"
                label="Education"
              >
                <Input placeholder="e.g., Bachelor of Engineering, University of Sydney" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="image"
                label="Profile Photo URL"
                rules={[{ required: true, message: 'Please enter image URL' }]}
              >
                <Input placeholder="https://example.com/photo.jpg" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="expertise"
            label="Areas of Expertise (comma separated)"
          >
            <Input placeholder="Strategic Planning, Business Development, Industry Relations" />
          </Form.Item>

          <Divider>Social Media & Links</Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="linkedin"
                label="LinkedIn Profile"
              >
                <Input placeholder="https://linkedin.com/in/username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="twitter"
                label="Twitter Profile"
              >
                <Input placeholder="https://twitter.com/username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="website"
                label="Personal Website"
              >
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Display Settings</Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="featured"
                label="Featured Member"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="order"
                label="Display Order"
                rules={[{ required: true, message: 'Please enter display order' }]}
              >
                <Input type="number" placeholder="1" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
          </Row>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

