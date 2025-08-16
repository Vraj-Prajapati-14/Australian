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
  DatePicker,
  InputNumber,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // Fetch projects data
  const { data: projectsData = [] } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: async () => (await api.get('/projects')).data || []
  });

  // Mock data for now - replace with actual API calls
  const mockProjects = [
    {
      _id: '1',
      title: 'City Council Fleet Upgrade',
      slug: 'city-council-fleet-upgrade',
      description: 'Complete fleet upgrade for City Council vehicles with custom service bodies and canopies.',
      shortDescription: 'Professional fleet solution for government operations',
      client: 'City Council',
      category: 'government',
      status: 'completed',
      featured: true,
      completionDate: '2024-01-15',
      image: 'https://via.placeholder.com/400x300',
      gallery: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300'
      ],
      technologies: ['Aluminium Construction', 'Custom Storage', 'Government Compliance'],
      results: {
        vehiclesUpgraded: 25,
        costSavings: '35%',
        efficiencyImprovement: '40%'
      },
      testimonial: {
        text: 'HIDRIVE delivered an exceptional solution that exceeded our expectations.',
        author: 'John Smith',
        role: 'Fleet Manager',
        company: 'City Council'
      },
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      title: 'Mining Company Service Bodies',
      slug: 'mining-company-service-bodies',
      description: 'Heavy-duty service bodies for mining operations in harsh environments.',
      shortDescription: 'Industrial strength solutions for mining',
      client: 'Mining Corp',
      category: 'industrial',
      status: 'in-progress',
      featured: true,
      completionDate: '2024-03-30',
      image: 'https://via.placeholder.com/400x300',
      gallery: [
        'https://via.placeholder.com/400x300'
      ],
      technologies: ['Steel Construction', 'Corrosion Resistant', 'Heavy Duty'],
      results: {
        vehiclesUpgraded: 12,
        costSavings: '25%',
        efficiencyImprovement: '30%'
      },
      testimonial: {
        text: 'The service bodies have significantly improved our operational efficiency.',
        author: 'Sarah Johnson',
        role: 'Operations Manager',
        company: 'Mining Corp'
      },
      createdAt: '2024-01-20'
    },
    {
      _id: '3',
      title: 'Emergency Services Fleet',
      slug: 'emergency-services-fleet',
      description: 'Specialized service bodies for emergency response vehicles.',
      shortDescription: 'Emergency response solutions',
      client: 'Fire Department',
      category: 'emergency',
      status: 'completed',
      featured: false,
      completionDate: '2024-02-15',
      image: 'https://via.placeholder.com/400x300',
      gallery: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300'
      ],
      technologies: ['Emergency Lighting', 'Quick Access', 'Durable Construction'],
      results: {
        vehiclesUpgraded: 8,
        costSavings: '20%',
        efficiencyImprovement: '45%'
      },
      testimonial: {
        text: 'Fast response times and reliable equipment access.',
        author: 'Mike Davis',
        role: 'Chief Fire Officer',
        company: 'Fire Department'
      },
      createdAt: '2024-01-10'
    }
  ];

  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      completionDate: project.completionDate ? new Date(project.completionDate) : null
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProject) {
        // Update existing project
        const updatedProjects = projects.map(p => 
          p._id === editingProject._id ? { ...p, ...values } : p
        );
        setProjects(updatedProjects);
        message.success('Project updated successfully');
      } else {
        // Add new project
        const newProject = {
          _id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setProjects([...projects, newProject]);
        message.success('Project added successfully');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Error saving project');
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p._id !== projectId));
    message.success('Project deleted successfully');
  };

  const handleStatusChange = (projectId, status) => {
    setProjects(projects.map(p => 
      p._id === projectId ? { ...p, status } : p
    ));
    message.success(`Project ${status === 'completed' ? 'marked as completed' : 'status updated'}`);
  };

  const handleFeaturedChange = (projectId, featured) => {
    setProjects(projects.map(p => 
      p._id === projectId ? { ...p, featured } : p
    ));
    message.success(`Project ${featured ? 'featured' : 'unfeatured'}`);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <Image
          width={80}
          height={60}
          src={image}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    },
    {
      title: 'Project',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Text type="secondary">{record.shortDescription}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="blue">{record.client}</Tag>
            <Tag color={
              record.category === 'government' ? 'green' : 
              record.category === 'industrial' ? 'orange' : 
              record.category === 'emergency' ? 'red' : 'purple'
            }>
              {record.category}
            </Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 120 }}
        >
          <Option value="planning">Planning</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="completed">Completed</Option>
          <Option value="on-hold">On Hold</Option>
        </Select>
      )
    },
    {
      title: 'Completion',
      dataIndex: 'completionDate',
      key: 'completionDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'TBD'
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured, record) => (
        <Switch
          checked={featured}
          onChange={(checked) => handleFeaturedChange(record._id, checked)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      )
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
            onClick={() => handleEditProject(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this project?"
            onConfirm={() => handleDeleteProject(record._id)}
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
      <Title level={2}>Projects Management</Title>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>All Projects</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddProject}
            size="large"
          >
            Add Project
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Project Modal */}
      <Modal
        title={editingProject ? 'Edit Project' : 'Add New Project'}
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
                name="title"
                label="Project Title"
                rules={[{ required: true, message: 'Please enter project title' }]}
              >
                <Input placeholder="e.g., City Council Fleet Upgrade" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="client"
                label="Client"
                rules={[{ required: true, message: 'Please enter client name' }]}
              >
                <Input placeholder="e.g., City Council" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="government">Government</Option>
                  <Option value="industrial">Industrial</Option>
                  <Option value="emergency">Emergency Services</Option>
                  <Option value="commercial">Commercial</Option>
                  <Option value="retail">Retail</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="planning">Planning</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="on-hold">On Hold</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="shortDescription"
            label="Short Description"
            rules={[{ required: true, message: 'Please enter short description' }]}
          >
            <Input placeholder="Brief description for display" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Full Description"
            rules={[{ required: true, message: 'Please enter full description' }]}
          >
            <TextArea rows={4} placeholder="Detailed description of the project" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="completionDate"
                label="Expected Completion Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="image"
                label="Main Image URL"
                rules={[{ required: true, message: 'Please enter image URL' }]}
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="gallery"
            label="Gallery Images (comma separated URLs)"
          >
            <TextArea 
              rows={3} 
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </Form.Item>

          <Form.Item
            name="technologies"
            label="Technologies Used (comma separated)"
          >
            <Input placeholder="Aluminium Construction, Custom Storage, Government Compliance" />
          </Form.Item>

          <Divider>Results & Metrics</Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={['results', 'vehiclesUpgraded']}
                label="Vehicles Upgraded"
              >
                <InputNumber style={{ width: '100%' }} placeholder="25" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['results', 'costSavings']}
                label="Cost Savings"
              >
                <Input placeholder="35%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['results', 'efficiencyImprovement']}
                label="Efficiency Improvement"
              >
                <Input placeholder="40%" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Testimonial</Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={['testimonial', 'author']}
                label="Author Name"
              >
                <Input placeholder="John Smith" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['testimonial', 'role']}
                label="Role"
              >
                <Input placeholder="Fleet Manager" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['testimonial', 'company']}
                label="Company"
              >
                <Input placeholder="City Council" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={['testimonial', 'text']}
            label="Testimonial Text"
          >
            <TextArea rows={3} placeholder="Client testimonial about the project..." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="featured"
                label="Featured Project"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="slug"
                label="URL Slug"
                rules={[{ required: true, message: 'Please enter URL slug' }]}
              >
                <Input placeholder="city-council-fleet-upgrade" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

