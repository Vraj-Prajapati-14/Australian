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
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Fetch data for dashboard
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services');
        // Services API returns array directly, not wrapped in data property
        return response.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: async () => {
      try {
        const response = await api.get('/projects');
        return response.data?.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  const { data: caseStudies = [], isLoading: caseStudiesLoading, error: caseStudiesError } = useQuery({ 
    queryKey: ['caseStudies'], 
    queryFn: async () => {
      try {
        const response = await api.get('/case-studies');
        return response.data?.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  const { data: inspirationItems = [], isLoading: inspirationLoading, error: inspirationError } = useQuery({ 
    queryKey: ['inspirationItems'], 
    queryFn: async () => {
      try {
        const response = await api.get('/inspiration');
        return response.data?.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  // Use API data with proper error handling and safety checks
  const allServices = Array.isArray(services) ? services : [];
  
  // Filter main services and sub-services properly
  const mainServices = allServices.filter(s => s.isMainService === true);
  const subServices = allServices.filter(s => s.isMainService === false);
  
  const activeServices = allServices.filter(s => s.status === 'active' || s.status === 'published' || !s.status);
  const activeProjects = Array.isArray(projects) ? projects.filter(p => p.status === 'active' || p.status === 'completed') : [];
  const publishedCaseStudies = Array.isArray(caseStudies) ? caseStudies.filter(c => c.status === 'active') : [];
  const publishedInspiration = Array.isArray(inspirationItems) ? inspirationItems.filter(i => i.status === 'published') : [];

  // Calculate totals correctly
  const totalMainServices = mainServices.length;
  const totalSubServices = subServices.length;

  // Check for any loading states
  const isLoading = servicesLoading || projectsLoading || caseStudiesLoading || inspirationLoading;
  
  // Check for any errors
  const hasError = servicesError || projectsError || caseStudiesError || inspirationError;

  // Statistics
  const stats = [
    {
      title: 'Main Services',
      value: totalMainServices,
      icon: <CarOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
      color: '#1677ff'
    },
    {
      title: 'Sub-Services',
      value: totalSubServices,
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'completed':
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

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-service':
        navigate('/admin/services');
        break;
      case 'add-project':
        navigate('/admin/projects');
        break;
      case 'add-case-study':
        navigate('/admin/case-studies');
        break;
      case 'add-inspiration':
        navigate('/admin/inspiration');
        break;
      default:
        break;
    }
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
        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card 
            title="Quick Actions"
            style={cardStyle}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button 
                type="primary" 
                block 
                icon={<PlusOutlined />} 
                style={{ height: '44px', borderRadius: '8px' }}
                onClick={() => handleQuickAction('add-service')}
              >
                Add New Service
              </Button>
              <Button 
                block 
                icon={<ContainerOutlined />} 
                style={{ height: '44px', borderRadius: '8px' }}
                onClick={() => handleQuickAction('add-project')}
              >
                Add New Project
              </Button>
              <Button 
                block 
                icon={<FileTextOutlined />} 
                style={{ height: '44px', borderRadius: '8px' }}
                onClick={() => handleQuickAction('add-case-study')}
              >
                Create Case Study
              </Button>
              <Button 
                block 
                icon={<PictureOutlined />} 
                style={{ height: '44px', borderRadius: '8px' }}
                onClick={() => handleQuickAction('add-inspiration')}
              >
                Add Inspiration Item
              </Button>
            </div>
          </Card>
        </Col>

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
                  {mainServices.filter(s => s.isFeatured).slice(0, 3).map(service => (
                    <Tag key={service._id} color="blue" style={{ marginBottom: 8 }}>
                      {service.title}
                    </Tag>
                  ))}
                  {mainServices.filter(s => s.isFeatured).length === 0 && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>No featured services</Text>
                  )}
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ color: '#262626' }}>Featured Projects:</Text>
                <div style={{ marginTop: 8 }}>
                  {activeProjects.filter(p => p.isFeatured).slice(0, 3).map(project => (
                    <Tag key={project._id} color="green" style={{ marginBottom: 8 }}>
                      {project.title}
                    </Tag>
                  ))}
                  {activeProjects.filter(p => p.isFeatured).length === 0 && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>No featured projects</Text>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Tables */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Services Hierarchy */}
        <Col xs={24} lg={12}>
          <Card 
            title="Services Hierarchy" 
            extra={<Button type="link" style={{ color: '#1677ff' }} onClick={() => navigate('/admin/services')}>Manage Services</Button>}
            style={cardStyle}
          >
            <div>
              {mainServices.slice(0, 5).map((service, index) => (
                <div key={service._id} style={{ 
                  marginBottom: index < mainServices.slice(0, 5).length - 1 ? '16px' : '0',
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CarOutlined style={{ color: '#1677ff', fontSize: '16px' }} />
                      <Text strong style={{ color: '#262626' }}>{service.title}</Text>
                      <Tag color={getStatusColor(service.status)} size="small">
                        {service.status === 'active' ? 'Active' : service.status === 'published' ? 'Published' : 'Inactive'}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {service.subServices ? service.subServices.length : 0} sub-services
                    </Text>
                  </div>
                  
                  {service.subServices && service.subServices.length > 0 && (
                    <div style={{ marginTop: '8px', marginLeft: '24px' }}>
                      {service.subServices.slice(0, 3).map((subService, subIndex) => (
                        <div key={subService._id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: subIndex < Math.min(service.subServices.length, 3) - 1 ? '4px' : '0'
                        }}>
                          <ContainerOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                          <Text style={{ fontSize: '12px', color: '#666' }}>{subService.title}</Text>
                          <Tag color={getStatusColor(subService.status)} size="small" style={{ fontSize: '10px' }}>
                            {subService.status === 'active' ? 'Active' : 'Inactive'}
                          </Tag>
                        </div>
                      ))}
                      {service.subServices.length > 3 && (
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            +{service.subServices.length - 3} more sub-services
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {mainServices.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Text type="secondary">No main services found</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Services Table */}
        <Col xs={24} lg={12}>
          <Card 
            title="Main Services Overview" 
            extra={<Button type="link" style={{ color: '#1677ff' }} onClick={() => navigate('/admin/services')}>View All</Button>}
            style={cardStyle}
          >
            <Table
              dataSource={mainServices.slice(0, 5)}
              columns={[
                {
                  title: 'Main Service',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      {record.subServices && record.subServices.length > 0 && (
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {record.subServices.length} sub-service{record.subServices.length !== 1 ? 's' : ''}
                          </Text>
                          <div style={{ marginTop: '2px' }}>
                            {record.subServices.slice(0, 2).map((sub, index) => (
                              <Tag key={index} size="small" color="blue" style={{ fontSize: '10px', marginRight: '4px' }}>
                                {sub.title}
                              </Tag>
                            ))}
                            {record.subServices.length > 2 && (
                              <Tag size="small" color="default" style={{ fontSize: '10px' }}>
                                +{record.subServices.length - 2} more
                              </Tag>
                            )}
                          </div>
                        </div>
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
                      {status === 'active' ? 'Active' : status === 'published' ? 'Published' : 'Inactive'}
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

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Projects Table */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Projects" 
            extra={<Button type="link" style={{ color: '#1677ff' }} onClick={() => navigate('/admin/projects')}>View All</Button>}
            style={cardStyle}
          >
            <Table
              dataSource={activeProjects.slice(0, 5)}
              columns={[
                {
                  title: 'Project',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.clientName || 'N/A'}
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
                      {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Planned'}
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
            title="Sub-Services Overview" 
            extra={<Button type="link" style={{ color: '#52c41a' }} onClick={() => navigate('/admin/services')}>Manage Services</Button>}
            style={cardStyle}
          >
            <Table
              dataSource={subServices.slice(0, 5)}
              columns={[
                {
                  title: 'Sub-Service',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        Parent: {record.parentService?.title || 'N/A'}
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
                      {status === 'active' ? 'Active' : status === 'published' ? 'Published' : 'Inactive'}
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

