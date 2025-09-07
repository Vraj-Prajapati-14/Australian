import { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tag, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography, 
  Badge,
  Tooltip,
  Popconfirm,
  message,
  Drawer,
  Timeline,
  Divider,
  Avatar,
  Descriptions,
  Alert
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  SendOutlined,
  FileTextOutlined,
  CarOutlined,
  CalendarOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminContactsPage() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    enquiryType: '',
    priority: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [replyForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Modern CSS styles matching other admin pages
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
    overflow: 'hidden',
    marginBottom: '24px'
  };

  const statsCardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '24px',
    textAlign: 'center',
    height: '100%'
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

  const inputStyle = {
    borderRadius: '8px',
    border: '2px solid #f0f0f0',
    padding: '8px 12px',
    fontSize: '14px',
    transition: 'all 0.3s ease'
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

  const drawerStyle = {
    background: '#ffffff'
  };

  const contactHeaderStyle = {
    textAlign: 'center',
    marginBottom: '24px',
    padding: '24px',
    background: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  };

  const descriptionsStyle = {
    marginBottom: '24px'
  };

  const actionButtonsStyle = {
    textAlign: 'center',
    marginTop: '24px',
    padding: '24px',
    background: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  };

  // Fetch contacts with filters and pagination
  const { data: contactsData, isLoading, refetch } = useQuery({
    queryKey: ['contacts', filters, pagination.current, pagination.pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      });
      const response = await api.get(`/contacts?${params}`);
      return response.data;
    }
  });

  // Fetch contact statistics
  const { data: stats } = useQuery({
    queryKey: ['contactStats'],
    queryFn: async () => {
      const response = await api.get('/contacts/stats');
      return response.data;
    }
  });

  // Mutations
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/contacts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      message.success('Contact updated successfully');
      queryClient.invalidateQueries(['contacts']);
      queryClient.invalidateQueries(['contactStats']);
    },
    onError: (error) => {
      message.error('Failed to update contact: ' + error.message);
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      message.success('Contact deleted successfully');
      queryClient.invalidateQueries(['contacts']);
      queryClient.invalidateQueries(['contactStats']);
    },
    onError: (error) => {
      message.error('Failed to delete contact: ' + error.message);
    }
  });

  const sendReplyMutation = useMutation({
    mutationFn: async ({ contactId, replyData }) => {
      // This would be implemented in the backend
      const response = await api.post(`/contacts/${contactId}/reply`, replyData);
      return response.data;
    },
    onSuccess: () => {
      message.success('Reply sent successfully');
      setReplyModalVisible(false);
      replyForm.resetFields();
      queryClient.invalidateQueries(['contacts']);
    },
    onError: (error) => {
      message.error('Failed to send reply: ' + error.message);
    }
  });

  // Handle table change
  const handleTableChange = (paginationInfo, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle search
  const handleSearch = (value) => {
    handleFilterChange('search', value);
  };

  // Handle status update
  const handleStatusUpdate = (contactId, newStatus) => {
    updateContactMutation.mutate({
      id: contactId,
      data: { status: newStatus }
    });
  };

  // Handle reply submission
  const handleReplySubmit = async (values) => {
    if (!selectedContact) return;
    
    await sendReplyMutation.mutateAsync({
      contactId: selectedContact._id,
      replyData: {
        ...values,
        responseMethod: values.responseMethod || 'email'
      }
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'new': 'blue',
      'in-progress': 'orange',
      'contacted': 'cyan',
      'quoted': 'purple',
      'closed': 'green',
      'spam': 'red'
    };
    return colors[status] || 'default';
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'green',
      'normal': 'blue',
      'high': 'orange',
      'urgent': 'red'
    };
    return colors[priority] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.email}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.phone}
          </div>
        </div>
      )
    },
    {
      title: 'Enquiry',
      key: 'enquiry',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {record.enquiryType}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.serviceCategory?.title || 'N/A'}
          </div>
          {record.company && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.company}
            </div>
          )}
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
          style={{ width: 120 }}
          onChange={(value) => handleStatusUpdate(record._id, value)}
        >
          <Option value="new">New</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="contacted">Contacted</Option>
          <Option value="quoted">Quoted</Option>
          <Option value="closed">Closed</Option>
          <Option value="spam">Spam</Option>
        </Select>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Contacted', value: 'contacted' },
        { text: 'Quoted', value: 'quoted' },
        { text: 'Closed', value: 'closed' },
        { text: 'Spam', value: 'spam' }
      ]
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div>
          <div>{new Date(date).toLocaleDateString()}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(date).toLocaleTimeString()}
          </div>
        </div>
      ),
      sorter: true
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedContact(record);
                setDetailDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Reply">
            <Button
              type="text"
              icon={<MailOutlined />}
              onClick={() => {
                setSelectedContact(record);
                setReplyModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this contact?"
            onConfirm={() => deleteContactMutation.mutate(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
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
    <div className="admin-contacts-page">
      <div className="admin-contacts-header">
        <Title level={2}>Contact Management</Title>
      </div>
      
      {/* Statistics Cards */}
      <div className="admin-stats-cards">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <div className="admin-stats-card">
              <Statistic
                title="Total Enquiries"
                value={stats?.overall?.total || 0}
                prefix={<FileTextOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div className="admin-stats-card">
              <Statistic
                title="New"
                value={stats?.overall?.new || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ClockCircleOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div className="admin-stats-card">
              <Statistic
                title="In Progress"
                value={stats?.overall?.inProgress || 0}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={6}>
            <div className="admin-stats-card">
              <Statistic
                title="Urgent"
                value={stats?.overall?.urgent || 0}
                valueStyle={{ color: '#f5222d' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <div className="admin-filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              className="admin-filter-select"
            >
              <Option value="new">New</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="contacted">Contacted</Option>
              <Option value="quoted">Quoted</Option>
              <Option value="closed">Closed</Option>
              <Option value="spam">Spam</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Filter by Priority"
              allowClear
              style={{ width: '100%' }}
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              className="admin-filter-select"
            >
              <Option value="low">Low</Option>
              <Option value="normal">Normal</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Input.Search
              placeholder="Search contacts..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
              className="admin-search-input"
            />
          </Col>
          <Col xs={24} sm={6}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              style={{ width: '100%' }}
              className="admin-refresh-button"
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </div>

      {/* Contacts Table */}
      <div className="admin-table-card">
        <Table
          columns={columns}
          dataSource={contactsData?.contacts || []}
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: contactsData?.pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} contacts`
          }}
          onChange={handleTableChange}
          rowKey="_id"
          className="admin-contacts-table"
        />
      </div>

      {/* Reply Modal */}
      <Modal
        title="Send Reply"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        footer={null}
        width={600}
        className="admin-reply-modal"
      >
        {selectedContact && (
          <div>
            <Alert
              message="Reply to Contact"
              description={`Sending reply to ${selectedContact.firstName} ${selectedContact.lastName} (${selectedContact.email})`}
              type="info"
              style={{ marginBottom: 16 }}
            />
            
            <Form
              form={replyForm}
              layout="vertical"
              onFinish={handleReplySubmit}
              className="admin-reply-form"
            >
              <Form.Item
                label="Response Method"
                name="responseMethod"
                initialValue="email"
              >
                <Select>
                  <Option value="email">Email</Option>
                  <Option value="phone">Phone</Option>
                  <Option value="sms">SMS</Option>
                  <Option value="in-person">In Person</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input placeholder="Reply subject..." />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: 'Please enter your reply message' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Enter your reply message..."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    htmlType="submit"
                    loading={sendReplyMutation.isLoading}
                  >
                    Send Reply
                  </Button>
                  <Button onClick={() => setReplyModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Contact Details Drawer */}
      <Drawer
        title="Contact Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        className="admin-detail-drawer"
        closeIcon={<CloseOutlined />}
      >
        {selectedContact && (
          <div>
            {/* Mobile Close Button - Only visible on mobile */}
            <div className="mobile-drawer-close-button">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setDetailDrawerVisible(false)}
                className="mobile-close-btn"
              >
                Close
              </Button>
            </div>
            
            {/* Contact Header */}
            <div className="admin-contact-header">
              <Avatar size={64} icon={<UserOutlined />} className="admin-contact-avatar" />
              <div className="admin-contact-name">{selectedContact.firstName} {selectedContact.lastName}</div>
              <div className="admin-contact-tags">
                <Tag color={getStatusColor(selectedContact.status)}>
                  {selectedContact.status.toUpperCase()}
                </Tag>
                <Tag color={getPriorityColor(selectedContact.priority)}>
                  {selectedContact.priority.toUpperCase()}
                </Tag>
              </div>
            </div>

            {/* Contact Information */}
            <div className="admin-descriptions">
              <Descriptions title="Contact Information" bordered column={1}>
                <Descriptions.Item label="Email">
                  <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                </Descriptions.Item>
                {selectedContact.company && (
                  <Descriptions.Item label="Company">
                    {selectedContact.company}
                  </Descriptions.Item>
                )}
                {selectedContact.jobTitle && (
                  <Descriptions.Item label="Job Title">
                    {selectedContact.jobTitle}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            <Divider />

            {/* Enquiry Details */}
            <div className="admin-descriptions">
              <Descriptions title="Enquiry Details" bordered column={1}>
                <Descriptions.Item label="Enquiry Type">
                  {selectedContact.enquiryType}
                </Descriptions.Item>
                <Descriptions.Item label="Service Category">
                  {selectedContact.serviceCategory?.title || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Specific Service">
                  {selectedContact.specificService?.title || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                  {selectedContact.department?.name || 'N/A'}
                </Descriptions.Item>
                {selectedContact.vehicleType && (
                  <Descriptions.Item label="Vehicle Type">
                    {selectedContact.vehicleType}
                  </Descriptions.Item>
                )}
                {selectedContact.urgency && (
                  <Descriptions.Item label="Urgency">
                    {selectedContact.urgency}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            <Divider />

            {/* Vehicle Details */}
            {selectedContact.vehicleDetails && (
              <>
                <div className="admin-descriptions">
                  <Descriptions title="Vehicle Details" bordered column={1}>
                    <Descriptions.Item label="Details">
                      {selectedContact.vehicleDetails}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <Divider />
              </>
            )}

            {/* Message */}
            <div className="admin-descriptions">
              <Descriptions title="Message" bordered column={1}>
                <Descriptions.Item label="Enquiry Message">
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedContact.message}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider />

            {/* Metadata */}
            <div className="admin-descriptions">
              <Descriptions title="Submission Details" bordered column={1}>
                <Descriptions.Item label="Submitted">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Source">
                  {selectedContact.source}
                </Descriptions.Item>
                {selectedContact.ipAddress && (
                  <Descriptions.Item label="IP Address">
                    {selectedContact.ipAddress}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            {/* Action Buttons */}
            <div className="admin-action-buttons-container">
              <Space>
                <Button
                  type="primary"
                  icon={<MailOutlined />}
                  onClick={() => {
                    setDetailDrawerVisible(false);
                    setReplyModalVisible(true);
                  }}
                >
                  Send Reply
                </Button>
                <Button
                  icon={<PhoneOutlined />}
                  onClick={() => window.open(`tel:${selectedContact.phone}`)}
                >
                  Call
                </Button>
                <Button
                  icon={<MailOutlined />}
                  onClick={() => window.open(`mailto:${selectedContact.email}`)}
                >
                  Email
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
} 