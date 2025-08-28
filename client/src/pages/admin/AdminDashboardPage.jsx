import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Space, Tag, Progress, Button, Spin, Alert } from 'antd';
import { 
  CarOutlined, 
  ContainerOutlined, 
  TruckOutlined, 
  ToolOutlined,
  UserOutlined,
  FileTextOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  // Fetch data for dashboard
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: subServices = [], isLoading: subServicesLoading, error: subServicesError } = useQuery({ 
    queryKey: ['subServices'], 
    queryFn: async () => (await api.get('/sub-services')).data || []
  });

  const { data: caseStudies = [], isLoading: caseStudiesLoading, error: caseStudiesError } = useQuery({ 
    queryKey: ['caseStudies'], 
    queryFn: async () => (await api.get('/case-studies')).data || []
  });

  const { data: inspirationItems = [], isLoading: inspirationLoading, error: inspirationError } = useQuery({ 
    queryKey: ['inspirationItems'], 
    queryFn: async () => (await api.get('/inspiration')).data || []
  });

  // Use API data with proper error handling and safety checks
  const activeServices = Array.isArray(services) ? services.filter(s => s.status === 'active') : [];
  const activeSubServices = Array.isArray(subServices) ? subServices.filter(s => s.status === 'active') : [];
  const publishedCaseStudies = Array.isArray(caseStudies) ? caseStudies.filter(c => c.status === 'published') : [];
  const publishedInspiration = Array.isArray(inspirationItems) ? inspirationItems.filter(i => i.status === 'published') : [];

  // Check for any loading states
  const isLoading = servicesLoading || subServicesLoading || caseStudiesLoading || inspirationLoading;
  
  // Check for any errors
  const hasError = servicesError || subServicesError || caseStudiesError || inspirationError;

  // Statistics
  const stats = [
    {
      title: 'Total Services',
      value: activeServices.length,
      icon: <CarOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
      color: '#1677ff'
    },
    {
      title: 'Sub-Services',
      value: activeSubServices.length,
      icon: <ContainerOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Case Studies',
      value: publishedCaseStudies.length,
      icon: <FileTextOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fa8c16'
    },
    {
      title: 'Inspiration Items',
      value: publishedInspiration.length,
      icon: <PictureOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#722ed1'
    }
  ];

  // Recent activity (placeholder for now)
  const recentActivity = [
    { action: 'New sub-service added', item: 'Fiberglass Canopy', time: '2 hours ago', type: 'add' },
    { action: 'Service updated', item: 'Truck Service Bodies', time: '4 hours ago', type: 'edit' },
    { action: 'Case study published', item: 'Mining Company Solution', time: '1 day ago', type: 'publish' },
    { action: 'Inspiration item featured', item: 'Modern Ute Design', time: '2 days ago', type: 'feature' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'published':
        return 'green';
      case 'inactive':
      case 'draft':
        return 'red';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'add':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'edit':
        return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
      case 'publish':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'feature':
        return <CheckCircleOutlined style={{ color: '#722ed1' }} />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  // Helper function to safely get category name
  const getCategoryName = (category) => {
    if (!category) return null;
    if (typeof category === 'string') return category;
    if (typeof category === 'object' && category.name) return category.name;
    return null;
  };

  // Helper function to safely get category color
  const getCategoryColor = (category) => {
    const categoryName = getCategoryName(category);
    if (!categoryName) return 'default';
    
    const name = categoryName.toLowerCase();
    if (name === 'ute') return 'blue';
    if (name === 'trailer') return 'green';
    if (name === 'truck') return 'orange';
    if (name === 'accessories') return 'purple';
    return 'default';
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '48px', 
        textAlign: 'center', 
        background: '#ffffff',
        minHeight: '100vh'
      }}>
        <Spin size="large" style={{ color: '#1677ff' }} />
        <div style={{ marginTop: 16 }}>
          <Text style={{ color: '#666', fontSize: '16px' }}>Loading dashboard data...</Text>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ 
        padding: '48px', 
        background: '#ffffff',
        minHeight: '100vh'
      }}>
        <Alert
          message="Error Loading Dashboard"
          description="There was an error loading the dashboard data. Please try refreshing the page."
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Button type="primary" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  const containerStyle = {
    padding: '32px',
    background: '#ffffff',
    minHeight: '100vh'
  };

  const pageTitleStyle = {
    color: '#262626',
    marginBottom: 32,
    fontWeight: '700',
    fontSize: '28px'
  };

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    height: '100%'
  };

  const statCardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: '24px'
  };

  const statValueStyle = {
    color: '#262626',
    fontSize: '28px',
    fontWeight: '700',
    marginTop: '8px'
  };

  const statTitleStyle = {
    color: '#666',
    fontSize: '14px',
    fontWeight: '500'
  };

  const activityItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    border: '1px solid #f0f0f0'
  };

  const activityTextStyle = {
    fontWeight: '600',
    fontSize: '14px',
    color: '#262626',
    marginBottom: '4px'
  };

  const activitySubTextStyle = {
    color: '#666',
    fontSize: '12px'
  };

  const tableStyle = {
    background: '#ffffff'
  };

  return (
    <div style={containerStyle}>
      <Title level={2} style={pageTitleStyle}>
        Dashboard Overview
      </Title>
      
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card style={statCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={statTitleStyle}>{stat.title}</div>
                  <div style={{ ...statValueStyle, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            style={cardStyle}
          >
            <div>
              {recentActivity.map((activity, index) => (
                <div key={index} style={activityItemStyle}>
                  {getActivityIcon(activity.type)}
                  <div style={{ flex: 1 }}>
                    <div style={activityTextStyle}>
                      {activity.action}
                    </div>
                    <div style={activitySubTextStyle}>
                      {activity.item} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card 
            title="Quick Actions"
            style={cardStyle}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button type="primary" block icon={<PlusOutlined />} style={{ height: '44px', borderRadius: '8px' }}>
                Add New Service
              </Button>
              <Button block icon={<ContainerOutlined />} style={{ height: '44px', borderRadius: '8px' }}>
                Add New Sub-Service
              </Button>
              <Button block icon={<FileTextOutlined />} style={{ height: '44px', borderRadius: '8px' }}>
                Create Case Study
              </Button>
              <Button block icon={<PictureOutlined />} style={{ height: '44px', borderRadius: '8px' }}>
                Add Inspiration Item
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Featured Items */}
        <Col xs={24} lg={12}>
          <Card 
            title="Featured Items" 
            extra={<Button type="link" style={{ color: '#1677ff' }}>View All</Button>}
            style={cardStyle}
          >
            <div>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ color: '#262626' }}>Featured Services:</Text>
                <div style={{ marginTop: 8 }}>
                  {activeServices.filter(s => s.isFeatured).map(service => (
                    <Tag key={service._id} color="blue" style={{ marginBottom: 8 }}>
                      {service.title}
                    </Tag>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ color: '#262626' }}>Featured Sub-Services:</Text>
                <div style={{ marginTop: 8 }}>
                  {activeSubServices.filter(s => s.isFeatured).slice(0, 5).map(sub => (
                    <Tag key={sub._id} color="green" style={{ marginBottom: 8 }}>
                      {sub.title}
                    </Tag>
                  ))}
                  {activeSubServices.filter(s => s.isFeatured).length > 5 && (
                    <Tag color="default">+{activeSubServices.filter(s => s.isFeatured).length - 5} more</Tag>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Data Summary */}
        <Col xs={24} lg={12}>
          <Card 
            title="Data Summary"
            style={cardStyle}
          >
            <div>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ color: '#262626' }}>Content Overview:</Text>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#666' }}>Active Services:</Text>
                    <Text strong style={{ color: '#1677ff' }}>{activeServices.length}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#666' }}>Active Sub-Services:</Text>
                    <Text strong style={{ color: '#52c41a' }}>{activeSubServices.length}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#666' }}>Published Case Studies:</Text>
                    <Text strong style={{ color: '#fa8c16' }}>{publishedCaseStudies.length}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#666' }}>Published Inspiration:</Text>
                    <Text strong style={{ color: '#722ed1' }}>{publishedInspiration.length}</Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Tables */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Services Table */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Services" 
            extra={<Button type="link" style={{ color: '#1677ff' }}>View All</Button>}
            style={cardStyle}
          >
            <Table
              dataSource={activeServices.slice(0, 5)}
              columns={[
                {
                  title: 'Service',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      {getCategoryName(record.category) && (
                        <Tag color={getCategoryColor(record.category)}>
                          {getCategoryName(record.category)}
                        </Tag>
                      )}
                    </div>
                  )
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>
                      {status === 'active' ? 'Active' : 'Inactive'}
                    </Tag>
                  )
                },
                {
                  title: 'Featured',
                  dataIndex: 'isFeatured',
                  key: 'isFeatured',
                  render: (featured) => (
                    <Tag color={featured ? 'gold' : 'default'}>
                      {featured ? 'Yes' : 'No'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
              style={tableStyle}
            />
          </Card>
        </Col>

        {/* Sub-Services Table */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Sub-Services" 
            extra={<Button type="link" style={{ color: '#1677ff' }}>View All</Button>}
            style={cardStyle}
          >
            <Table
              dataSource={activeSubServices.slice(0, 5)}
              columns={[
                {
                  title: 'Sub-Service',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.parentService?.title || activeServices.find(s => s._id === record.parentService)?.title || 'N/A'}
                      </Text>
                    </div>
                  )
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>
                      {status === 'active' ? 'Active' : 'Inactive'}
                    </Tag>
                  )
                },
                {
                  title: 'Featured',
                  dataIndex: 'isFeatured',
                  key: 'isFeatured',
                  render: (featured) => (
                    <Tag color={featured ? 'gold' : 'default'}>
                      {featured ? 'Yes' : 'No'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
              style={tableStyle}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

