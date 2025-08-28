import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Button,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Rate,
  Upload,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Statistic,
  Select,
  InputNumber,
  Switch,
  Tooltip,
  Avatar,
  Badge,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  StarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Helmet } from 'react-helmet-async';
import './AdminTestimonialsPage.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminTestimonialsPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    featured: '',
    search: ''
  });

  const queryClient = useQueryClient();

  // Fetch testimonials
  const { data: testimonialsData, isLoading, error } = useQuery({
    queryKey: ['adminTestimonials', pagination.current, pagination.pageSize, filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: pagination.current,
          limit: pagination.pageSize,
        });
        
        // Only add non-empty filters
        if (filters.status && filters.status.trim() !== '') {
          params.append('status', filters.status);
        }
        if (filters.featured && filters.featured.trim() !== '') {
          params.append('featured', filters.featured);
        }
        if (filters.search && filters.search.trim() !== '') {
          params.append('search', filters.search);
        }
        const response = await api.get(`/testimonials/admin?${params}`);
        console.log('Testimonials API response:', response.data);
        return response.data; // This returns { success: true, data: [...], pagination: {...} }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
    }
  });

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ['testimonialStats'],
    queryFn: async () => {
      const response = await api.get('/testimonials/admin/stats');
      console.log('Stats API response:', response.data);
      return response.data;
    }
  });

  // Create/Update mutation
  const testimonialMutation = useMutation({
    mutationFn: async (values) => {
      console.log('Form values:', values);
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === 'avatar' && values[key]?.fileList?.[0]) {
            formData.append('avatar', values[key].fileList[0].originFileObj);
          } else if (key !== 'avatar') {
            formData.append(key, values[key]);
          }
        }
      });

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log('FormData:', key, value);
      }

      if (editingTestimonial) {
        const response = await api.put(`/testimonials/admin/${editingTestimonial._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } else {
        console.log('Creating new testimonial...');
        const response = await api.post('/testimonials/admin', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Create response:', response.data);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success(editingTestimonial ? 'Testimonial updated successfully' : 'Testimonial created successfully');
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingTestimonial(null);
      queryClient.invalidateQueries(['adminTestimonials']);
      queryClient.invalidateQueries(['testimonialStats']);
    },
    onError: (error) => {
      console.error('Testimonial mutation error:', error);
      console.error('Error response:', error.response?.data);
      message.error(error.response?.data?.message || 'Operation failed');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/testimonials/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      message.success('Testimonial deleted successfully');
      queryClient.invalidateQueries(['adminTestimonials']);
      queryClient.invalidateQueries(['testimonialStats']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Delete failed');
    }
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, action, value }) => {
      const response = await api.post('/testimonials/admin/bulk-update', { ids, action, value });
      return response.data;
    },
    onSuccess: () => {
      message.success('Bulk operation completed successfully');
      setSelectedRowKeys([]);
      queryClient.invalidateQueries(['adminTestimonials']);
      queryClient.invalidateQueries(['testimonialStats']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Bulk operation failed');
    }
  });

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEditTestimonial = (record) => {
    setEditingTestimonial(record);
    form.setFieldsValue({
      ...record,
      avatar: record.avatar?.url ? [{ uid: '-1', name: 'avatar.jpg', status: 'done', url: record.avatar.url }] : []
    });
    setFileList(record.avatar?.url ? [{ uid: '-1', name: 'avatar.jpg', status: 'done', url: record.avatar.url }] : []);
    setIsModalVisible(true);
  };

  const handleDeleteTestimonial = (id) => {
    deleteMutation.mutate(id);
  };

  const handleBulkAction = (action, value) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select testimonials first');
      return;
    }
    bulkUpdateMutation.mutate({ ids: selectedRowKeys, action, value });
  };

  const handleTableChange = (paginationInfo, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }));
  };

  const uploadProps = {
    name: 'avatar',
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    accept: 'image/*',
    maxCount: 1
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 60,
      render: (avatar) => (
        <Avatar
          size={40}
          src={avatar?.url}
          icon={<UserOutlined />}
        >
          {avatar?.url ? '' : 'U'}
        </Avatar>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">{record.position}</Text>
          <br />
          <Text type="secondary">{record.company}</Text>
        </div>
      )
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating} size="small" />
          <br />
          <Text type="secondary">{rating}/5</Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' },
          approved: { color: 'green', icon: <CheckCircleOutlined />, text: 'Approved' },
          rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Rejected' }
        };
        const config = statusConfig[status];
        return (
          <Badge
            status={config.color}
            text={
              <Tag color={config.color} icon={config.icon}>
                {config.text}
              </Tag>
            }
          />
        );
      }
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      width: 80,
      render: (featured) => (
        <Tag color={featured ? 'blue' : 'default'}>
          {featured ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTestimonial(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this testimonial?"
            onConfirm={() => handleDeleteTestimonial(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  };

  return (
    <>
      <Helmet>
        <title>Testimonials Management - Admin Dashboard</title>
      </Helmet>

      <div className="admin-testimonials-page">
        <div className="admin-page-header">
          <Title level={2}>Testimonials Management</Title>
        </div>

        {/* Statistics */}
        {statsData && (
          <Row gutter={[16, 16]} className="stats-grid">
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Total Testimonials"
                  value={statsData?.data?.stats?.total || 0}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Pending"
                  value={statsData?.data?.stats?.pending || 0}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Approved"
                  value={statsData?.data?.stats?.approved || 0}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stats-card">
                <Statistic
                  title="Featured"
                  value={statsData?.data?.stats?.featured || 0}
                  valueStyle={{ color: '#1677ff' }}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Actions */}
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddTestimonial}
                >
                  Add Testimonial
                </Button>
                {selectedRowKeys.length > 0 && (
                  <Space>
                    <Button
                      onClick={() => handleBulkAction('approve')}
                      icon={<CheckCircleOutlined />}
                    >
                      Approve Selected
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('reject')}
                      icon={<CloseCircleOutlined />}
                    >
                      Reject Selected
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('feature', 'true')}
                      icon={<StarOutlined />}
                    >
                      Feature Selected
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete selected testimonials?"
                      onConfirm={() => handleBulkAction('delete')}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete Selected
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              </Space>
            </Col>
            <Col>
              <Text type="secondary">
                {selectedRowKeys.length} of {testimonialsData?.pagination?.totalDocs || 0} selected
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Error Display */}
        {error && (
          <Card style={{ marginBottom: 16 }}>
            <Alert
              message="Error Loading Testimonials"
              description={error.message || 'Failed to load testimonials'}
              type="error"
              showIcon
            />
          </Card>
        )}



        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={testimonialsData?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: testimonialsData?.pagination?.totalDocs || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingTestimonial(null);
            form.resetFields();
            setFileList([]);
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={testimonialMutation.mutate}
            initialValues={{
              rating: 5,
              status: 'approved',
              featured: false
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter full name' }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="Position"
                  rules={[{ required: true, message: 'Please enter position' }]}
                >
                  <Input placeholder="Enter position" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="Company"
                  rules={[{ required: true, message: 'Please enter company' }]}
                >
                  <Input placeholder="Enter company" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="phone"
              label="Phone (Optional)"
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please select rating' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="content"
              label="Testimonial Content"
              rules={[
                { required: true, message: 'Please enter testimonial content' },
                { min: 20, message: 'Content must be at least 20 characters' },
                { max: 500, message: 'Content cannot exceed 500 characters' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter testimonial content..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="featured"
                  label="Featured"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="avatar"
              label="Avatar"
            >
              <Upload {...uploadProps} listType="picture-card">
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              name="notes"
              label="Admin Notes (Optional)"
            >
              <TextArea
                rows={2}
                placeholder="Add any admin notes..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={testimonialMutation.isPending}
                >
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    setEditingTestimonial(null);
                    form.resetFields();
                    setFileList([]);
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
} 