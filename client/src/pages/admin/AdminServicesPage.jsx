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
  Tabs,
  Image,
  Upload,
  TreeSelect,
  Divider,
  Tooltip,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  FolderOutlined,
  FileOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminServicesPage() {
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [subServiceModalVisible, setSubServiceModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingSubService, setEditingSubService] = useState(null);
  const [form] = Form.useForm();
  const [subServiceForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch services data
  const { data: mainServices = [], isLoading: mainServicesLoading } = useQuery({ 
    queryKey: ['adminMainServices'], 
    queryFn: async () => (await api.get('/services?type=main')).data || []
  });

  const { data: subServices = [], isLoading: subServicesLoading } = useQuery({ 
    queryKey: ['adminSubServices'], 
    queryFn: async () => (await api.get('/services?type=sub')).data || []
  });

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMainServices']);
      queryClient.invalidateQueries(['adminSubServices']);
      message.success('Service created successfully');
    },
    onError: () => message.error('Error creating service')
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMainServices']);
      queryClient.invalidateQueries(['adminSubServices']);
      message.success('Service updated successfully');
    },
    onError: () => message.error('Error updating service')
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMainServices']);
      queryClient.invalidateQueries(['adminSubServices']);
      message.success('Service deleted successfully');
    },
    onError: () => message.error('Error deleting service')
  });

  const handleAddService = () => {
    setEditingService(null);
    form.resetFields();
    form.setFieldsValue({ isMainService: true, status: 'active' });
    setServiceModalVisible(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      ...service,
      category: service.category?._id,
      parentService: service.parentService?._id
    });
    setServiceModalVisible(true);
  };

  const handleAddSubService = () => {
    setEditingSubService(null);
    subServiceForm.resetFields();
    subServiceForm.setFieldsValue({ isMainService: false, status: 'active' });
    setSubServiceModalVisible(true);
  };

  const handleEditSubService = (subService) => {
    setEditingSubService(subService);
    subServiceForm.setFieldsValue({
      ...subService,
      parentService: subService.parentService?._id
    });
    setSubServiceModalVisible(true);
  };

  const handleServiceSubmit = async (values) => {
    try {
      if (editingService) {
        await updateServiceMutation.mutateAsync({ id: editingService._id, data: values });
      } else {
        await createServiceMutation.mutateAsync(values);
      }
      setServiceModalVisible(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleSubServiceSubmit = async (values) => {
    try {
      if (editingSubService) {
        await updateServiceMutation.mutateAsync({ id: editingSubService._id, data: values });
      } else {
        await createServiceMutation.mutateAsync(values);
      }
      setSubServiceModalVisible(false);
    } catch (error) {
      console.error('Error saving sub-service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleStatusChange = async (serviceId, status) => {
    try {
      const service = mainServices.find(s => s._id === serviceId) || subServices.find(s => s._id === serviceId);
      if (service) {
        await updateServiceMutation.mutateAsync({ id: serviceId, data: { status } });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const serviceColumns = [
    {
      title: 'Image',
      dataIndex: 'heroImage',
      key: 'image',
      width: 100,
      render: (heroImage) => (
        <Image
          width={80}
          height={60}
          src={heroImage?.url || 'https://via.placeholder.com/80x60'}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="https://via.placeholder.com/80x60"
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderOutlined style={{ color: '#1677ff' }} />
            {text}
          </div>
          <Text type="secondary">{record.shortDescription}</Text>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category?.name === 'Ute' ? 'blue' : category?.name === 'Trailer' ? 'green' : 'orange'}>
          {category?.name?.toUpperCase() || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Sub-services',
      key: 'subServices',
      render: (_, record) => {
        const count = record.subServices?.length || 0;
        return (
          <Badge count={count} style={{ backgroundColor: '#1677ff' }}>
            <Tag color="purple">
              {count} sub-service{count !== 1 ? 's' : ''}
            </Tag>
          </Badge>
        );
      }
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'featured',
      render: (featured) => (
        <Tag color={featured ? 'green' : 'default'}>
          {featured ? 'Yes' : 'No'}
        </Tag>
      )
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
          <Tooltip title="Edit Service">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleEditService(record)}
            />
          </Tooltip>
          <Tooltip title="Add Sub-Service">
            <Button 
              icon={<PlusOutlined />} 
              size="small"
              type="dashed"
              onClick={() => {
                subServiceForm.setFieldsValue({ parentService: record._id });
                setSubServiceModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this service?"
            description="This will also delete all associated sub-services."
            onConfirm={() => handleDeleteService(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Service">
              <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const subServiceColumns = [
    {
      title: 'Image',
      dataIndex: 'heroImage',
      key: 'image',
      width: 100,
      render: (heroImage) => (
        <Image
          width={80}
          height={60}
          src={heroImage?.url || 'https://via.placeholder.com/80x60'}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="https://via.placeholder.com/80x60"
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileOutlined style={{ color: '#52c41a' }} />
            {text}
          </div>
          <Text type="secondary">{record.shortDescription}</Text>
        </div>
      )
    },
    {
      title: 'Parent Service',
      dataIndex: 'parentService',
      key: 'parentService',
      render: (parentService) => (
        <Tag color="blue">
          <FolderOutlined style={{ marginRight: 4 }} />
          {parentService?.title || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Features',
      key: 'features',
      render: (_, record) => (
        <div>
          {record.features?.slice(0, 2).map(feature => (
            <Tag key={feature} size="small">{feature}</Tag>
          ))}
          {record.features?.length > 2 && (
            <Tag size="small">+{record.features.length - 2} more</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Base Price',
      key: 'pricing',
      render: (_, record) => (
        <Text strong>${record.pricing?.base?.toLocaleString() || 'N/A'}</Text>
      )
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'featured',
      render: (featured) => (
        <Tag color={featured ? 'green' : 'default'}>
          {featured ? 'Yes' : 'No'}
        </Tag>
      )
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
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Sub-Service">
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleEditSubService(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this sub-service?"
            onConfirm={() => handleDeleteService(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Sub-Service">
              <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Services Management</Title>
      
      <Tabs
        defaultActiveKey="services"
        items={[
          {
            key: 'services',
            label: (
              <span>
                <FolderOutlined style={{ marginRight: 8 }} />
                Main Services ({mainServices.length})
              </span>
            ),
            children: (
              <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4}>Main Services</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddService}
                  >
                    Add Main Service
                  </Button>
                </div>
                <Table
                  columns={serviceColumns}
                  dataSource={mainServices}
                  rowKey="_id"
                  loading={mainServicesLoading}
                  pagination={{ pageSize: 10 }}
                  expandable={{
                    expandedRowRender: (record) => {
                      const serviceSubServices = subServices.filter(sub => sub.parentService?._id === record._id);
                      return serviceSubServices.length > 0 ? (
                        <Table
                          columns={subServiceColumns.filter(col => col.key !== 'parentService')}
                          dataSource={serviceSubServices}
                          rowKey="_id"
                          pagination={false}
                          size="small"
                        />
                      ) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
                          No sub-services found
                        </div>
                      );
                    },
                    expandIcon: ({ expanded, onExpand, record }) => {
                      const count = record.subServices?.length || 0;
                      return count > 0 ? (
                        <Button 
                          type="text" 
                          size="small"
                          onClick={(e) => onExpand(record, e)}
                        >
                          {expanded ? <DownOutlined /> : <RightOutlined />}
                          {count} sub-service{count !== 1 ? 's' : ''}
                        </Button>
                      ) : null;
                    }
                  }}
                />
              </Card>
            )
          },
          {
            key: 'subServices',
            label: (
              <span>
                <FileOutlined style={{ marginRight: 8 }} />
                Sub-Services ({subServices.length})
              </span>
            ),
            children: (
              <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={4}>Sub-Services</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddSubService}
                  >
                    Add Sub-Service
                  </Button>
                </div>
                <Table
                  columns={subServiceColumns}
                  dataSource={subServices}
                  rowKey="_id"
                  loading={subServicesLoading}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* Service Modal */}
      <Modal
        title={editingService ? 'Edit Service' : 'Add New Service'}
        open={serviceModalVisible}
        onCancel={() => setServiceModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleServiceSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Service Title"
                rules={[{ required: true, message: 'Please enter service title' }]}
              >
                <Input placeholder="e.g., Ute Canopies" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
              >
                <Input placeholder="e.g., ute-canopies" />
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
            name="summary"
            label="Full Description"
            rules={[{ required: true, message: 'Please enter full description' }]}
          >
            <TextArea rows={4} placeholder="Detailed description of the service" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="heroImage"
                label="Hero Image URL"
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label="Display Order"
                initialValue={0}
              >
                <Input type="number" placeholder="1" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="isMainService"
                label="Service Type"
                valuePropName="checked"
              >
                <Switch checkedChildren="Main Service" unCheckedChildren="Sub Service" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isFeatured"
                label="Featured Service"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="active"
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setServiceModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createServiceMutation.isPending || updateServiceMutation.isPending}>
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Sub-Service Modal */}
      <Modal
        title={editingSubService ? 'Edit Sub-Service' : 'Add New Sub-Service'}
        open={subServiceModalVisible}
        onCancel={() => setSubServiceModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={subServiceForm}
          layout="vertical"
          onFinish={handleSubServiceSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Sub-Service Title"
                rules={[{ required: true, message: 'Please enter sub-service title' }]}
              >
                <Input placeholder="e.g., Aluminium Canopy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
              >
                <Input placeholder="e.g., aluminium-canopy" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="parentService"
            label="Parent Service"
            rules={[{ required: true, message: 'Please select parent service' }]}
          >
            <Select placeholder="Select parent service">
              {mainServices.map(service => (
                <Option key={service._id} value={service._id}>
                  {service.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="shortDescription"
            label="Short Description"
            rules={[{ required: true, message: 'Please enter short description' }]}
          >
            <Input placeholder="Brief description for display" />
          </Form.Item>
          
          <Form.Item
            name="summary"
            label="Full Description"
            rules={[{ required: true, message: 'Please enter full description' }]}
          >
            <TextArea rows={4} placeholder="Detailed description of the sub-service" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="heroImage"
                label="Hero Image URL"
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order"
                label="Display Order"
                initialValue={0}
              >
                <Input type="number" placeholder="1" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="isMainService"
                label="Service Type"
                initialValue={false}
                hidden
              >
                <Input type="hidden" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isFeatured"
                label="Featured Sub-Service"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="active"
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setSubServiceModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createServiceMutation.isPending || updateServiceMutation.isPending}>
                {editingSubService ? 'Update Sub-Service' : 'Add Sub-Service'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

