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
  Image as AntdImage,
  DatePicker,
  InputNumber,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SettingOutlined,
  FileOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import SimpleImageUpload from '../../components/SimpleImageUpload';
import GalleryUpload from '../../components/GalleryUpload';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminCaseStudiesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  const [uploadedHeroImage, setUploadedHeroImage] = useState(null);
  const [uploadedGallery, setUploadedGallery] = useState([]);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Fetch case studies data
  const { data: caseStudies = [], isLoading: loading, error: caseStudiesError } = useQuery({ 
    queryKey: ['caseStudies'], 
    queryFn: async () => {
      try {
        const response = await api.get('/case-studies');
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching case studies:', error);
        return [];
      }
    }
  });

  // Fetch sub-services for dropdown (not main services)
  const { data: services = [], error: servicesError } = useQuery({ 
    queryKey: ['sub-services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services?type=sub&status=all');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching sub-services:', error);
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
  const createCaseStudyMutation = useMutation({
    mutationFn: (data) => api.post('/case-studies', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['case-studies']);
      message.success('Case study created successfully');
      setModalVisible(false);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Create case study error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error creating case study. Please try again.');
      }
    }
  });

  const updateCaseStudyMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/case-studies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['case-studies']);
      message.success('Case study updated successfully');
      setModalVisible(false);
      setEditingCaseStudy(null);
      setUploadedHeroImage(null);
      setUploadedGallery([]);
      form.resetFields();
    },
    onError: (error) => {
      console.error('Update case study error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Invalid data provided');
      } else {
        message.error('Error updating case study. Please try again.');
      }
    }
  });

  const deleteCaseStudyMutation = useMutation({
    mutationFn: (id) => api.delete(`/case-studies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['case-studies']);
      message.success('Case study deleted successfully');
    },
    onError: (error) => {
      console.error('Delete case study error:', error);
      if (error.response?.status === 401) {
        message.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        message.error('Error deleting case study. Please try again.');
      }
    }
  });

  const handleAddCaseStudy = () => {
    setEditingCaseStudy(null);
    setUploadedHeroImage(null);
    setUploadedGallery([]);
    form.resetFields();
    form.setFieldsValue({ 
      status: 'active',
      isFeatured: false,
      order: 0
    });
    setModalVisible(true);
  };

  const handleEditCaseStudy = (caseStudy) => {
    setEditingCaseStudy(caseStudy);
    setUploadedHeroImage(caseStudy.heroImage || null);
    setUploadedGallery(caseStudy.gallery || []);
    form.setFieldsValue({
      ...caseStudy,
      service: caseStudy.service?._id,
      department: caseStudy.department?._id,
      completionDate: caseStudy.completionDate ? dayjs(caseStudy.completionDate) : null
    });
    setModalVisible(true);
  };

  const handleDeleteCaseStudy = async (caseStudyId) => {
    try {
      await deleteCaseStudyMutation.mutateAsync(caseStudyId);
    } catch (error) {
      console.error('Error deleting case study:', error);
    }
  };

  const handleStatusChange = async (caseStudyId, status) => {
    try {
      const caseStudy = caseStudies.find(c => c._id === caseStudyId);
      if (caseStudy) {
        await updateCaseStudyMutation.mutateAsync({ id: caseStudyId, data: { status } });
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
      if (values.completionDate && values.completionDate.isValid()) {
        values.completionDate = values.completionDate.toISOString();
      }

      // Handle image data
      const heroImageData = uploadedHeroImage || editingCaseStudy?.heroImage || values.heroImage;
      const galleryData = uploadedGallery.length > 0 ? uploadedGallery : editingCaseStudy?.gallery || values.gallery || [];

      // Prepare the data object with proper image structure
      const formData = {
        ...values,
        heroImage: heroImageData,
        gallery: galleryData
      };
      
      if (editingCaseStudy) {
        await updateCaseStudyMutation.mutateAsync({ id: editingCaseStudy._id, data: formData });
      } else {
        await createCaseStudyMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving case study:', error);
    }
  };

  const columns = [
    {
      title: 'Case Study',
      key: 'caseStudy',
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
          status={status === 'active' ? 'success' : 'default'} 
          text={status.charAt(0).toUpperCase() + status.slice(1)} 
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
      title: 'Completion',
      dataIndex: 'completionDate',
      key: 'completionDate',
      render: (date) => (
        <Text type="secondary">
          {date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'}
        </Text>
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
                <AntdImage
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
        <Space>
          <Tooltip title="Edit Case Study">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditCaseStudy(record)}
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
            title="Delete this case study?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteCaseStudy(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Case Study">
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
      <Title level={2}>Case Studies Management</Title>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Title level={4}>Case Studies ({caseStudies.length})</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddCaseStudy}
          >
            Add Case Study
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={Array.isArray(caseStudies) ? caseStudies : []}
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

      {/* Case Study Modal */}
      <Modal
        title={editingCaseStudy ? 'Edit Case Study' : 'Add New Case Study'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setUploadedHeroImage(null);
          setUploadedGallery([]);
        }}
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
                label="Case Study Title"
                rules={[{ required: true, message: 'Please enter case study title' }]}
              >
                <Input placeholder="e.g., Ute Canopy Installation for City Council" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter slug' }]}
              >
                <Input placeholder="e.g., ute-canopy-city-council" />
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
            <TextArea rows={4} placeholder="Detailed description of the case study" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="clientName"
                label="Client Name"
                rules={[{ required: true, message: 'Please enter client name' }]}
              >
                <Input placeholder="e.g., City Council" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="service"
                label="Related Sub-Service"
              >
                <Select placeholder="Select related sub-service" allowClear>
                  {services.map(service => (
                    <Option key={service._id} value={service._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{service.title}</span>
                        <Tag size="small" color={service.status === 'active' ? 'green' : 'red'}>
                          {service.status}
                        </Tag>
                      </div>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{dept.name}</span>
                        <Tag size="small" color={dept.status === 'active' ? 'green' : 'red'}>
                          {dept.status}
                        </Tag>
                      </div>
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
                rules={[
                  {
                    validator: (_, value) => {
                      const hasImage = uploadedHeroImage || editingCaseStudy?.heroImage || value;
                      if (!hasImage) {
                        return Promise.reject(new Error('Please upload a hero image'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <SimpleImageUpload 
                  value={uploadedHeroImage}
                  onChange={(image) => {
                    setUploadedHeroImage(image);
                    form.setFieldsValue({ heroImage: image });
                    form.validateFields(['heroImage']);
                  }}
                  folder="case-studies/hero"
                  maxSize={5}
                  required={true}
                />
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
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isFeatured"
                label="Featured Case Study"
                valuePropName="checked"
              >
                <Switch />
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
            label="Case Study Gallery"
          >
            <GalleryUpload 
              value={uploadedGallery}
              onChange={(gallery) => {
                setUploadedGallery(gallery);
                form.setFieldsValue({ gallery: gallery });
              }}
              folder="case-studies/gallery"
              maxSize={5}
              maxCount={10}
            />
          </Form.Item>
          
          <Divider>Project Details</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="projectScope"
                label="Project Scope"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe the scope of the project"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="challenges"
                label="Challenges Faced"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe challenges encountered during the project"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="solutions"
            label="Solutions Implemented"
          >
            <TextArea 
              rows={3} 
              placeholder="Describe the solutions implemented to address challenges"
            />
          </Form.Item>
          
          <Divider>Results & Metrics</Divider>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['results', 'vehiclesUpgraded']}
                label="Vehicles Upgraded"
              >
                <InputNumber 
                  min={0} 
                  placeholder="0" 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['results', 'costSavings']}
                label="Cost Savings (%)"
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0" 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['results', 'efficiencyImprovement']}
                label="Efficiency Improvement (%)"
              >
                <InputNumber 
                  min={0} 
                  max={100} 
                  placeholder="0" 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="testimonial"
            label="Client Testimonial"
          >
            <TextArea 
              rows={3} 
              placeholder="Client testimonial about the project"
            />
          </Form.Item>
          
          <Form.Item
            name="technologies"
            label="Technologies Used"
          >
            <Select
              mode="tags"
              placeholder="Add technologies used in this case study"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createCaseStudyMutation.isPending || updateCaseStudyMutation.isPending}>
                {editingCaseStudy ? 'Update Case Study' : 'Add Case Study'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 