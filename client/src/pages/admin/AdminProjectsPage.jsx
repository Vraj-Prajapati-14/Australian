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
  message,
  Image as AntdImage,
  DatePicker,
  InputNumber,
  Divider,
  App,
  Badge,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CalendarOutlined,
  SettingOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminProjectsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Fetch projects data
  const { data: projects = [], isLoading: loading, error: projectsError } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: async () => {
      try {
        const response = await api.get('/projects');
        console.log('Projects API response:', response);
        console.log('Projects data:', response.data);
        console.log('Projects data type:', typeof response.data);
        console.log('Projects data length:', response.data?.data?.length);
        // The API returns { data: [...] }, so we need to access response.data.data
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    }
  });

  // Fetch services for dropdown
  const { data: services = [], error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services');
        console.log('Services API response:', response);
        // The API returns the data directly, so we access response.data
        return response.data || [];
      } catch (error) {
        console.error('Error fetching services:', error);
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
  const createProjectMutation = useMutation({
    mutationFn: (data) => api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      message.success('Project created successfully');
      setModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Create project error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error creating project. Please try again.');
      }
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      message.success('Project updated successfully');
      setModalVisible(false);
      setEditingProject(null);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Update project error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error updating project. Please try again.');
      }
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      message.success('Project deleted successfully');
    },
    onError: (error) => {
      console.error('Delete project error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        message.error('Error deleting project. Please try again.');
      }
    }
  });

  const handleAddProject = () => {
    setEditingProject(null);
    form.resetFields();
    form.setFieldsValue({ 
      status: 'in-progress',
      isFeatured: false,
      order: 0
    });
    setModalVisible(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      service: project.service?._id,
      department: project.department?._id,
      startDate: project.startDate ? dayjs(project.startDate) : null,
      endDate: project.endDate ? dayjs(project.endDate) : null,
      completionDate: project.completionDate ? dayjs(project.completionDate) : null
    });
    setModalVisible(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
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

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('aes_admin_token');
      if (!token) {
        message.error('Please log in to continue');
        return;
      }

      // Convert dayjs to ISO string if present
      if (values.startDate && values.startDate.isValid()) {
        values.startDate = values.startDate.toISOString();
      }
      if (values.endDate && values.endDate.isValid()) {
        values.endDate = values.endDate.toISOString();
      }
      if (values.completionDate && values.completionDate.isValid()) {
        values.completionDate = values.completionDate.toISOString();
      }

      console.log('Submitting project data:', values);
      
      if (editingProject) {
        await updateProjectMutation.mutateAsync({ id: editingProject._id, data: values });
      } else {
        await createProjectMutation.mutateAsync(values);
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
            <AntdImage
              src={record.heroImage.url}
              alt={record.title}
              width={80}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            <div style={{ width: 80, height: 60, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileOutlined style={{ color: '#999' }} />
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
        <Badge 
          status={status === 'completed' ? 'success' : status === 'in-progress' ? 'processing' : status === 'planned' ? 'default' : 'error'} 
          text={status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} 
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
        <Text strong>
          ${record.budget?.toLocaleString() || 'N/A'}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Project">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditProject(record)}
            />
          </Tooltip>
          <Tooltip title="Toggle Status">
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              onClick={() => handleStatusChange(record._id, record.status === 'completed' ? 'in-progress' : 'completed')}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this project?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteProject(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Project">
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
      <Title level={2}>Projects Management</Title>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Title level={4}>Projects ({projects.length})</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddProject}
          >
            Add Project
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
                name="title"
                label="Project Title"
                rules={[{ required: true, message: 'Please enter project title' }]}
              >
                <Input placeholder="e.g., Ute Canopy Installation" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
              >
                <Input placeholder="e.g., ute-canopy-installation" />
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
            <Col span={8}>
              <Form.Item
                name="clientName"
                label="Client Name"
                rules={[{ required: true, message: 'Please enter client name' }]}
              >
                <Input placeholder="e.g., John Smith" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="service"
                label="Related Service"
              >
                <Select placeholder="Select related service" allowClear>
                  {services.map(service => (
                    <Option key={service._id} value={service._id}>
                      {service.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="department"
                label="Department"
              >
                <Select placeholder="Select department" allowClear>
                  {departments.map(dept => (
                    <Option key={dept._id} value={dept._id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="heroImage"
                label="Hero Image"
              >
                <ImageUpload folder="projects/hero" />
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
                initialValue="in-progress"
              >
                <Select>
                  <Option value="planned">Planned</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="on-hold">On Hold</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isFeatured"
                label="Featured Project"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="budget"
                label="Budget (AUD)"
              >
                <InputNumber 
                  min={0} 
                  placeholder="0" 
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider>Project Timeline</Divider>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Start Date"
              >
                <DatePicker 
                  placeholder="Select start date" 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="End Date"
              >
                <DatePicker 
                  placeholder="Select end date" 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="completionDate"
                label="Completion Date"
              >
                <DatePicker 
                  placeholder="Select completion date" 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="gallery"
            label="Project Gallery"
          >
            <ImageUpload folder="projects/gallery" multiple={true} />
          </Form.Item>
          
          <Form.Item
            name="technologies"
            label="Technologies Used"
          >
            <Select
              mode="tags"
              placeholder="Add technologies used"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="challenges"
            label="Challenges & Solutions"
          >
            <TextArea 
              rows={3} 
              placeholder="Describe challenges faced and solutions implemented"
            />
          </Form.Item>
          
          <Form.Item
            name="results"
            label="Results & Outcomes"
          >
            <TextArea 
              rows={3} 
              placeholder="Describe the results and outcomes of the project"
            />
          </Form.Item>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createProjectMutation.isPending || updateProjectMutation.isPending}>
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

