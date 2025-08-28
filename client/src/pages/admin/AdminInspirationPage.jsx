import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Card, 
  Typography,
  Tag,
  Popconfirm,
  Image,
  Row,
  Col,
  Spin,
  App
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import SimpleImageUpload from '../../components/SimpleImageUpload';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminInspirationPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Validate image field when uploadedImage changes
  useEffect(() => {
    if (isModalVisible) {
      form.validateFields(['image']);
    }
  }, [uploadedImage, isModalVisible, form]);

  // Fetch inspiration data
  const { data: inspirationItems = [], isLoading } = useQuery({
    queryKey: ['inspiration'],
    queryFn: async () => {
      const response = await api.get('/inspiration');
      return response.data?.data || [];
    }
  });

  // Fetch services for dropdown
  const { data: services = [], error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services');
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

  // Create inspiration mutation
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/inspiration', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inspiration']);
      message.success('Inspiration item created successfully');
      handleCancel();
    },
    onError: (error) => {
      message.error('Failed to create inspiration item');
      console.error('Create error:', error);
    }
  });

  // Update inspiration mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await api.put(`/inspiration/${id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inspiration']);
      message.success('Inspiration item updated successfully');
      handleCancel();
    },
    onError: (error) => {
      message.error('Failed to update inspiration item');
      console.error('Update error:', error);
    }
  });

  // Delete inspiration mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/inspiration/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inspiration']);
      message.success('Inspiration item deleted successfully');
    },
    onError: (error) => {
      message.error('Failed to delete inspiration item');
      console.error('Delete error:', error);
    }
  });

  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue({
        title: item.title,
        service: item.service?._id,
        department: item.department?._id,
        description: item.description,
        tags: item.tags,
        status: item.status,
        isFeatured: item.isFeatured,
        order: item.order,
        image: item.image || null
      });
      setUploadedImage(item.image || null);
    } else {
      form.resetFields();
      setUploadedImage(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setUploadedImage(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Form values:', values);
      console.log('Uploaded image:', uploadedImage);
      console.log('Editing item image:', editingItem?.image);

      // Check if we have an image - check all possible sources
      const imageData = uploadedImage || editingItem?.image || values.image;
      console.log('Final image data:', imageData);
      
      if (!imageData) {
        message.error('Please upload an image before submitting');
        return;
      }

      // Validate image data structure
      if (typeof imageData === 'object' && (!imageData.url || !imageData.publicId)) {
        message.error('Invalid image data. Please upload an image again.');
        return;
      }

      // If imageData is a string (URL), convert it to proper format
      let finalImageData = imageData;
      if (typeof imageData === 'string') {
        finalImageData = {
          url: imageData,
          publicId: `inspiration_${Date.now()}`,
          alt: values.title || 'Inspiration image'
        };
      }

      // Prepare the data object
      const formData = {
        title: values.title,
        service: values.service,
        department: values.department,
        description: values.description,
        status: values.status || 'draft',
        isFeatured: values.isFeatured || false,
        order: values.order || 0,
        tags: values.tags || [],
        image: finalImageData
      };
      
      console.log('Submitting form data:', formData);
      
      if (editingItem) {
        updateMutation.mutate({ id: editingItem._id, formData });
      } else {
        createMutation.mutate(formData);
      }
    } catch (error) {
      console.error('Submit error:', error);
      message.error('An error occurred');
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleStatusChange = (id, status) => {
    const formData = { status };
    updateMutation.mutate({ id, formData });
  };

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => (
        <div style={{ 
          width: 80, 
          height: 60, 
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #d9d9d9'
        }}>
          {image && image.url ? (
            <Image
              src={image.url}
              alt={image.alt || record.title}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24
            }}>
              🎨
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Title & Service',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Service: {record.service?.title || 'N/A'}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Department: {record.department?.name || 'N/A'}
          </div>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div style={{ maxWidth: 300 }}>
          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
            {text}
          </Paragraph>
        </div>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div>
          {tags && tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {tag}
            </Tag>
          ))}
          {tags && tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
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
          <Option value="draft">Draft</Option>
          <Option value="published">Published</Option>
          <Option value="archived">Archived</Option>
        </Select>
      )
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured, record) => (
        <Select
          value={isFeatured}
          onChange={(value) => {
            const formData = { isFeatured: value };
            updateMutation.mutate({ id: record._id, formData });
          }}
          style={{ width: 100 }}
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showModal(record)}
            title="View"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this inspiration item?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              danger
              title="Delete"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2}>Inspiration Gallery Management</Title>
            <Paragraph>Manage inspiration gallery items and showcase your best work</Paragraph>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => showModal()}
          >
            Add Inspiration Item
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={inspirationItems}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} inspiration items`
          }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Edit Inspiration Item' : 'Add New Inspiration Item'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isFeatured: false,
            status: 'draft'
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the title' }]}
          >
            <Input placeholder="Enter inspiration item title" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="service"
                label="Service"
              >
                <Select placeholder="Select service" allowClear>
                  {services.map(service => (
                    <Option key={service._id} value={service._id}>
                      {service.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
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

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter description of the inspiration item"
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[{ required: true, message: 'Please enter at least one tag' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter tags"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            rules={[
              {
                validator: (_, value) => {
                  const hasImage = uploadedImage || editingItem?.image || value;
                  if (!hasImage) {
                    return Promise.reject(new Error('Please upload an image'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <SimpleImageUpload 
              value={uploadedImage}
              onChange={(image) => {
                console.log('ImageUpload onChange called with:', image);
                setUploadedImage(image);
                // Also set the form field value
                form.setFieldsValue({ image: image });
                // Trigger form validation
                form.validateFields(['image']);
              }}
              folder="inspiration"
              maxSize={5}
              required={true}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isFeatured"
                label="Featured"
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 