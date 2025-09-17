import { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  InputNumber, 
  Upload, 
  message, 
  Popconfirm,
  Spin,
  Alert,
  Tabs,
  Divider,
  Badge,
  Tooltip,
  Image
} from 'antd';
import SimpleImageUpload from '../../components/SimpleImageUpload';
import GalleryUpload from '../../components/GalleryUpload';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  CarOutlined,
  ContainerOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminServicesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubServiceModalVisible, setIsSubServiceModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedMainService, setSelectedMainService] = useState(null);
  const [activeTab, setActiveTab] = useState('main');
  const [uploadedHeroImage, setUploadedHeroImage] = useState(null);
  const [uploadedGallery, setUploadedGallery] = useState([]);
  const [uploadedSubHeroImage, setUploadedSubHeroImage] = useState(null);
  const [uploadedSubGallery, setUploadedSubGallery] = useState([]);
  const [form] = Form.useForm();
  const [subServiceForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch services data
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => (await api.get('/departments')).data || []
  });

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => {
      console.log('Create service mutation success - closing modal');
      queryClient.invalidateQueries(['services']);
      message.success('Service created successfully');
      setIsModalVisible(false);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Create service mutation error:', error);
      message.error('Error creating service: ' + error.message);
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => {
      console.log('Update service mutation success - closing modal');
      queryClient.invalidateQueries(['services']);
      message.success('Service updated successfully');
      setIsModalVisible(false);
      setEditingService(null);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Update service mutation error:', error);
      message.error('Error updating service: ' + error.message);
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      message.success('Service deleted successfully');
    },
    onError: (error) => {
      message.error('Error deleting service: ' + error.message);
    }
  });

  const createSubServiceMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      message.success('Sub-service created successfully');
      setIsSubServiceModalVisible(false);
      setUploadedSubHeroImage(null);
      setUploadedSubGallery([]);
      subServiceForm.resetFields();
    },
    onError: (error) => {
      console.error('Sub-service creation error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message;
      message.error('Error creating sub-service: ' + errorMessage);
    }
  });

  // Filter data
  const mainServices = services.filter(s => s.isMainService);
  const subServices = services.filter(s => !s.isMainService && s.parentService);

  // Modal handlers
  const showModal = (service = null) => {
    setEditingService(service);
    setUploadedHeroImage(service?.heroImage || null);
    setUploadedGallery(service?.gallery || []);
    if (service) {
      form.setFieldsValue({
        ...service,
        parentService: service.parentService?._id
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const showSubServiceModal = (mainService) => {
    setSelectedMainService(mainService);
    setUploadedSubHeroImage(null);
    setUploadedSubGallery([]);
    subServiceForm.resetFields();
    setIsSubServiceModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingService(null);
    setUploadedHeroImage(null);
    setUploadedGallery([]);
    form.resetFields();
  };

  const handleSubServiceCancel = () => {
    setIsSubServiceModalVisible(false);
    setSelectedMainService(null);
    setUploadedSubHeroImage(null);
    setUploadedSubGallery([]);
    subServiceForm.resetFields();
  };

  // Auto-generate slug from title
  const generateSlug = (title) => {
    if (!title) return '';
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (values) => {
    console.log('handleSubmit called with values:', values);
    console.log('editingService:', editingService);
    
    // Handle image data
    const heroImageData = uploadedHeroImage || editingService?.heroImage || values.heroImage;
    const galleryData = uploadedGallery.length > 0 ? uploadedGallery : editingService?.gallery || values.gallery || [];

    // Prepare the data object with proper image structure
    const formData = {
      ...values,
      heroImage: heroImageData,
      gallery: galleryData
    };

    console.log('Submitting formData:', formData);

    if (editingService) {
      console.log('Calling updateServiceMutation with id:', editingService._id);
      updateServiceMutation.mutate({ id: editingService._id, data: formData });
    } else {
      console.log('Calling createServiceMutation');
      createServiceMutation.mutate(formData);
    }
  };

  const handleSubServiceSubmit = (values) => {
    // Ensure slug is properly formatted
    let slug = values.slug;
    if (slug) {
      slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    // Handle image data for sub-service
    const heroImageData = uploadedSubHeroImage || values.heroImage;
    const galleryData = uploadedSubGallery.length > 0 ? uploadedSubGallery : values.gallery || [];
    
    const subServiceData = {
      ...values,
      slug: slug,
      isMainService: false,
      parentService: selectedMainService._id,
      heroImage: heroImageData,
      gallery: galleryData
    };
    console.log('Submitting sub-service data:', subServiceData);
    createSubServiceMutation.mutate(subServiceData);
  };

  const handleDelete = (id) => {
    deleteServiceMutation.mutate(id);
  };

  // Image upload handler
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'services');

    try {
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        message.error('Upload failed');
        return false;
      }
    } catch (error) {
      message.error('Upload failed: ' + error.message);
      return false;
    }
  };

  // Modern CSS styles
  const containerStyle = {
    padding: '32px',
    background: '#ffffff',
    minHeight: '100vh'
  };

  const pageHeaderStyle = {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const titleStyle = {
    color: '#1a1a1a',
    margin: 0,
    fontWeight: '700',
    fontSize: '28px',
    letterSpacing: '-0.5px'
  };

  const headerActionsStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  };

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  };

  const tabCardStyle = {
    background: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  const buttonStyle = {
    height: '40px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
    border: 'none',
    boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)'
  };

  const actionButtonStyle = {
    border: 'none',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px'
  };

  const modalStyle = {
    borderRadius: '16px',
    overflow: 'hidden'
  };

  const formItemStyle = {
    marginBottom: '20px'
  };

  const dividerStyle = {
    margin: '24px 0',
    borderColor: '#f0f0f0'
  };

  const inputStyle = {
    borderRadius: '8px',
    border: '2px solid #f0f0f0',
    padding: '8px 12px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#1677ff'
    },
    '&:focus': {
      borderColor: '#1677ff',
      boxShadow: '0 0 0 3px rgba(22, 119, 255, 0.1)'
    }
  };

  const selectStyle = {
    borderRadius: '8px',
    border: '2px solid #f0f0f0'
  };

  const tableStyle = {
    background: '#ffffff'
  };

  const statusTagStyle = {
    borderRadius: '6px',
    fontWeight: '500',
    padding: '4px 8px'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    background: '#ffffff'
  };

  const errorStyle = {
    padding: '32px',
    background: '#ffffff'
  };

  // Table columns for main services
  const mainServiceColumns = [
    {
      title: 'Service',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
            {text}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.slug}
          </Text>
          {record.heroImage && (
            <Image
              src={record.heroImage.url}
              alt={record.heroImage.alt}
              width={40}
              height={40}
              style={{ borderRadius: '6px', marginTop: '8px' }}
            />
          )}
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="blue" style={statusTagStyle}>
          {department?.name || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Sub-Services',
      dataIndex: 'subServices',
      key: 'subServices',
      render: (subServices) => (
        <div>
          <Text style={{ color: '#666' }}>
            {subServices?.length || 0} sub-services
          </Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={
            <Tag color={status === 'active' ? 'green' : 'red'} style={statusTagStyle}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </Tag>
          }
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
      title: 'Gallery',
      key: 'gallery',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {record.gallery && record.gallery.length > 0 ? (
            record.gallery.slice(0, 3).map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery ${index + 1}`}
                  width={40}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
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
            <Text type="secondary" style={{ fontSize: '12px' }}>No images</Text>
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Add Sub-Service">
            <Button 
              type="text" 
              icon={<PlusCircleOutlined />} 
              onClick={() => showSubServiceModal(record)}
              style={{ ...actionButtonStyle, color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
              style={{ ...actionButtonStyle, color: '#1677ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this service?"
            description="This will also delete all sub-services."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                style={{ ...actionButtonStyle, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Table columns for sub-services
  const subServiceColumns = [
    {
      title: 'Sub-Service',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
            {text}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.slug}
          </Text>
          {record.heroImage && (
            <Image
              src={record.heroImage.url}
              alt={record.heroImage.alt}
              width={40}
              height={40}
              style={{ borderRadius: '6px', marginTop: '8px' }}
            />
          )}
        </div>
      )
    },
    {
      title: 'Parent Service',
      dataIndex: 'parentService',
      key: 'parentService',
      render: (parentService) => (
        <Text style={{ color: '#666' }}>
          {parentService?.title || 'N/A'}
        </Text>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <Tag color="blue" style={statusTagStyle}>
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
          status={status === 'active' ? 'success' : 'error'} 
          text={
            <Tag color={status === 'active' ? 'green' : 'red'} style={statusTagStyle}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </Tag>
          }
        />
      )
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (featured) => (
        <Tag color={featured ? 'gold' : 'default'} style={statusTagStyle}>
          {featured ? 'Yes' : 'No'}
        </Tag>
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
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery ${index + 1}`}
                  width={40}
                  height={30}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
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
            <Text type="secondary" style={{ fontSize: '12px' }}>No images</Text>
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
              style={{ ...actionButtonStyle, color: '#1677ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this sub-service?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                style={{ ...actionButtonStyle, color: '#ff4d4f' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const isLoading = servicesLoading || departmentsLoading;
  const hasError = servicesError;

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <Spin size="large" style={{ color: '#1677ff' }} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={errorStyle}>
        <Alert
          message="Error Loading Services"
          description="There was an error loading the services data. Please try refreshing the page."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              Refresh
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Page Header */}
      <div style={pageHeaderStyle}>
        <Title level={2} style={titleStyle}>
          Services Management
        </Title>
        <div style={headerActionsStyle}>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
            style={buttonStyle}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={primaryButtonStyle}
          >
            Add New Service
          </Button>
        </div>
      </div>

      {/* Services Tabs */}
      <Card style={tabCardStyle}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'main',
              label: (
                <span>
                  <CarOutlined style={{ marginRight: '8px' }} />
                  Main Services ({mainServices.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={mainServices}
                  columns={mainServiceColumns}
                  rowKey="_id"
                  style={tableStyle}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} services`
                  }}
                />
              )
            },
            {
              key: 'sub',
              label: (
                <span>
                  <ContainerOutlined style={{ marginRight: '8px' }} />
                  Sub-Services ({subServices.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={subServices}
                  columns={subServiceColumns}
                  rowKey="_id"
                  style={tableStyle}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sub-services`
                  }}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Service Modal */}
      <Modal
        title={
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
            {editingService ? 'Edit Service' : 'Add New Service'}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={modalStyle}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isMainService: true,
            status: 'active',
            isFeatured: false
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Service Title"
                rules={[{ required: true, message: 'Please enter service title' }]}
                style={formItemStyle}
              >
                <Input 
                  placeholder="Enter service title" 
                  style={inputStyle}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
                style={formItemStyle}
              >
                <Input 
                  placeholder="service-slug" 
                  style={inputStyle}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="summary"
            label="Summary"
            style={formItemStyle}
          >
            <TextArea 
              placeholder="Brief description of the service" 
              rows={3}
              style={inputStyle}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                style={formItemStyle}
              >
                <Select 
                  placeholder="Select department" 
                  style={selectStyle}
                  allowClear
                >
                  {departments.map(dept => (
                    <Option key={dept._id} value={dept._id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                style={formItemStyle}
              >
                <Select style={selectStyle}>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isMainService"
                label="Service Type"
                style={formItemStyle}
              >
                <Select style={selectStyle}>
                  <Option value={true}>Main Service</Option>
                  <Option value={false}>Sub-Service</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Parent Service"
                style={formItemStyle}
                dependencies={['isMainService']}
              >
                {({ getFieldValue }) => {
                  const isMainService = getFieldValue('isMainService');
                  return isMainService ? null : (
                    <Form.Item name="parentService" noStyle>
                      <Select 
                        placeholder="Select parent service" 
                        style={selectStyle}
                        allowClear
                      >
                        {mainServices.map(service => (
                          <Option key={service._id} value={service._id}>
                            {service.title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isFeatured"
            label="Featured"
            valuePropName="checked"
            style={formItemStyle}
          >
            <Switch />
          </Form.Item>

          <Divider style={dividerStyle}>Images & Media</Divider>

          <Form.Item
            name="heroImage"
            label="Hero Image"
            style={formItemStyle}
          >
            <SimpleImageUpload 
              value={uploadedHeroImage}
              onChange={(image) => {
                setUploadedHeroImage(image);
                form.setFieldsValue({ heroImage: image });
              }}
              folder="services/hero"
              maxSize={5}
              required={true}
            />
          </Form.Item>

          <Form.Item
            name="gallery"
            label="Gallery Images"
            style={formItemStyle}
          >
            <GalleryUpload 
              value={uploadedGallery}
              onChange={(gallery) => {
                setUploadedGallery(gallery);
                form.setFieldsValue({ gallery: gallery });
              }}
              folder="services/gallery"
              maxSize={5}
              maxCount={10}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createServiceMutation.isLoading || updateServiceMutation.isLoading}
                style={primaryButtonStyle}
              >
                {editingService ? 'Update' : 'Create'} Service
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Sub-Service Modal */}
      <Modal
        title={
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
            Add Sub-Service to {selectedMainService?.title}
          </div>
        }
        open={isSubServiceModalVisible}
        onCancel={handleSubServiceCancel}
        footer={null}
        width={600}
        style={modalStyle}
        destroyOnHidden
      >
        <Form
          form={subServiceForm}
          layout="vertical"
          onFinish={handleSubServiceSubmit}
          initialValues={{
            status: 'active',
            isFeatured: false
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Sub-Service Title"
                rules={[{ required: true, message: 'Please enter sub-service title' }]}
                style={formItemStyle}
              >
                <Input 
                  placeholder="Enter sub-service title" 
                  style={inputStyle}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = generateSlug(title);
                    subServiceForm.setFieldsValue({ slug });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[
                  { required: true, message: 'Please enter slug' },
                  { 
                    pattern: /^[a-z0-9-]+$/, 
                    message: 'Slug can only contain lowercase letters, numbers, and hyphens' 
                  }
                ]}
                style={formItemStyle}
              >
                <Input 
                  placeholder="sub-service-slug" 
                  style={inputStyle}
                  onChange={(e) => {
                    // Ensure slug format
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    e.target.value = value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="summary"
            label="Summary"
            style={formItemStyle}
          >
            <TextArea 
              placeholder="Brief description of the sub-service" 
              rows={3}
              style={inputStyle}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                style={formItemStyle}
              >
                <Select 
                  placeholder="Select department" 
                  style={selectStyle}
                  allowClear
                >
                  {departments.map(dept => (
                    <Option key={dept._id} value={dept._id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                style={formItemStyle}
              >
                <Select style={selectStyle}>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isFeatured"
            label="Featured"
            valuePropName="checked"
            style={formItemStyle}
          >
            <Switch />
          </Form.Item>

          <Divider style={dividerStyle}>Images & Media</Divider>

          <Form.Item
            name="heroImage"
            label="Hero Image"
            style={formItemStyle}
          >
            <SimpleImageUpload 
              value={uploadedSubHeroImage}
              onChange={(image) => {
                setUploadedSubHeroImage(image);
                subServiceForm.setFieldsValue({ heroImage: image });
              }}
              folder="services/sub-hero"
              maxSize={5}
              required={true}
            />
          </Form.Item>

          <Form.Item
            name="gallery"
            label="Gallery Images"
            style={formItemStyle}
          >
            <GalleryUpload 
              value={uploadedSubGallery}
              onChange={(gallery) => {
                setUploadedSubGallery(gallery);
                subServiceForm.setFieldsValue({ gallery: gallery });
              }}
              folder="services/sub-gallery"
              maxSize={5}
              maxCount={8}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleSubServiceCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createSubServiceMutation.isLoading}
                style={primaryButtonStyle}
              >
                Create Sub-Service
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

