import { useState, useEffect } from 'react';
import '../../styles/admin-forms.css';
import { 
  Button, 
  Modal, 
  Input, 
  Card, 
  Table, 
  Tag, 
  Select
} from '../../components/ui';
// Helper components for icons
const EyeIcon = () => <span>👁️</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const MailIcon = () => <span>📧</span>;
const PhoneIcon = () => <span>📞</span>;
const UserIcon = () => <span>👤</span>;
const ClockIcon = () => <span>🕐</span>;
const CheckIcon = () => <span>✅</span>;
const ExclamationIcon = () => <span>⚠️</span>;
const MessageIcon = () => <span>💬</span>;
const SearchIcon = () => <span>🔍</span>;
const FilterIcon = () => <span>🔧</span>;
const ReloadIcon = () => <span>🔄</span>;
const SendIcon = () => <span>📤</span>;
const FileIcon = () => <span>📄</span>;
const CarIcon = () => <span>🚗</span>;
const CalendarIcon = () => <span>📅</span>;
const CloseIcon = () => <span>❌</span>;
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

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
  const [replyData, setReplyData] = useState({
    subject: '',
    message: ''
  });
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };
  const queryClient = useQueryClient();

  // Fetch contacts data
  const { data: contactsData, isLoading: loading, error } = useQuery({ 
    queryKey: ['contacts', pagination.current, pagination.pageSize, filters], 
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: pagination.current,
          limit: pagination.pageSize,
        });
        
        if (filters.status) params.append('status', filters.status);
        if (filters.enquiryType) params.append('enquiryType', filters.enquiryType);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.search) params.append('search', filters.search);
        
        const response = await api.get(`/contacts?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching contacts:', error);
        return { contacts: [], pagination: { total: 0 } };
      }
    }
  });

  const contacts = contactsData?.contacts || [];
  
  // Update pagination when data changes
  useEffect(() => {
    if (contactsData?.pagination) {
      setPagination(prev => ({
        ...prev,
        total: contactsData.pagination.total
      }));
    }
  }, [contactsData]);

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ contactId, replyData }) => api.post(`/contacts/${contactId}/reply`, replyData),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      showMessage('success', 'Reply sent successfully');
      setReplyModalVisible(false);
      setReplyData({ subject: '', message: '' });
    },
    onError: (error) => {
      console.error('Reply error:', error);
      showMessage('error', 'Error sending reply');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (contactId) => api.delete(`/contacts/${contactId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      showMessage('success', 'Contact deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      showMessage('error', 'Error deleting contact');
    }
  });

  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyData({
      subject: `Re: ${contact.subject || 'Your enquiry'}`,
      message: ''
    });
    setReplyModalVisible(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyData.subject || !replyData.message) {
      showMessage('error', 'Please fill in all fields');
      return;
    }
    
    try {
      await replyMutation.mutateAsync({ 
        contactId: selectedContact._id, 
        replyData 
      });
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteMutation.mutateAsync(contactId);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setDetailDrawerVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'blue';
      case 'read': return 'green';
      case 'replied': return 'purple';
      case 'closed': return 'gray';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {`${record.firstName || ''} ${record.lastName || ''}`.trim() || 'Anonymous'}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.email}
          </div>
          {record.phone && (
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.phone}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'enquiryType',
      key: 'subject',
      render: (enquiryType) => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {enquiryType || 'General Enquiry'}
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'enquiryType',
      key: 'enquiryType',
      render: (type) => (
        <Tag color="blue">
          {type || 'General'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'New'}
        </Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'urgency',
      key: 'priority',
      render: (urgency) => (
        <Tag color={getPriorityColor(urgency)}>
          {urgency ? urgency.charAt(0).toUpperCase() + urgency.slice(1) : 'Medium'}
        </Tag>
      )
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>{new Date(record.createdAt).toLocaleDateString()}</div>
          <div style={{ color: '#666' }}>
            {new Date(record.createdAt).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(record)}
          >
            <EyeIcon />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleReply(record)}
          >
            <SendIcon />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleDelete(record._id)}
          >
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Contact Messages</h1>
        <p className="page-description">Manage customer enquiries and contact messages</p>
      </div>

      <Card>
        <div className="card-header">
          <div>
            <h2 className="card-title">Messages ({contacts.length})</h2>
            <p className="card-subtitle">View and manage all contact messages</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '200px' }}>
            <Input
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              prefix={<SearchIcon />}
            />
          </div>
          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => setFilters({...filters, status: value})}
            options={[
              { value: '', label: 'All Status' },
              { value: 'new', label: 'New' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'quoted', label: 'Quoted' },
              { value: 'closed', label: 'Closed' },
              { value: 'spam', label: 'Spam' }
            ]}
            allowClear
          />
          <Select
            placeholder="Filter by type"
            value={filters.enquiryType}
            onChange={(value) => setFilters({...filters, enquiryType: value})}
            options={[
              { value: '', label: 'All Types' },
              { value: 'general', label: 'General' },
              { value: 'service', label: 'Service' },
              { value: 'quote', label: 'Quote' },
              { value: 'support', label: 'Support' },
              { value: 'warranty', label: 'Warranty' },
              { value: 'installation', label: 'Installation' },
              { value: 'parts', label: 'Parts' },
              { value: 'fleet', label: 'Fleet' }
            ]}
            allowClear
          />
          <Select
            placeholder="Filter by priority"
            value={filters.priority}
            onChange={(value) => setFilters({...filters, priority: value})}
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'emergency', label: 'Emergency' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={contacts}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize
              }));
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Reply Modal */}
      <Modal
        title="Reply to Contact"
        isOpen={replyModalVisible}
        onClose={() => setReplyModalVisible(false)}
        size="lg"
      >
        {selectedContact && (
          <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                To: {selectedContact.name} ({selectedContact.email})
              </label>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Subject *
              </label>
              <Input
                value={replyData.subject}
                onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Message *
              </label>
              <textarea
                value={replyData.message}
                onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                rows={6}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Type your reply here..."
                required
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setReplyModalVisible(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary"
                disabled={replyMutation.isPending}
              >
                {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        title="Contact Details"
        isOpen={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        size="lg"
      >
        {selectedContact && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Name
                </label>
                <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {selectedContact.name || 'Anonymous'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Email
                </label>
                <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {selectedContact.email}
                </div>
              </div>
            </div>
            
            {selectedContact.phone && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Phone
                </label>
                <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {selectedContact.phone}
                </div>
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Subject
              </label>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                {selectedContact.subject || 'No subject'}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Message
              </label>
              <div style={{ 
                padding: '12px', 
                background: '#f5f5f5', 
                borderRadius: '6px',
                whiteSpace: 'pre-wrap',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {selectedContact.message}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Status
                </label>
                <Tag color={getStatusColor(selectedContact.status)}>
                  {selectedContact.status ? selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1) : 'New'}
                </Tag>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Type
                </label>
                <Tag color="blue">
                  {selectedContact.enquiryType || 'General'}
                </Tag>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Priority
                </label>
                <Tag color={getPriorityColor(selectedContact.priority)}>
                  {selectedContact.priority ? selectedContact.priority.charAt(0).toUpperCase() + selectedContact.priority.slice(1) : 'Medium'}
                </Tag>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Date Received
              </label>
              <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                {new Date(selectedContact.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button 
                variant="outline"
                onClick={() => setDetailDrawerVisible(false)}
              >
                Close
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  setDetailDrawerVisible(false);
                  handleReply(selectedContact);
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}