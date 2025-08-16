import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Space, Tag, Progress, Button } from 'antd';
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
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  // Fetch data for dashboard
  const { data: services = [] } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: subServices = [] } = useQuery({ 
    queryKey: ['subServices'], 
    queryFn: async () => (await api.get('/sub-services')).data || []
  });

  const { data: caseStudies = [] } = useQuery({ 
    queryKey: ['caseStudies'], 
    queryFn: async () => (await api.get('/case-studies')).data || []
  });

  const { data: inspirationItems = [] } = useQuery({ 
    queryKey: ['inspirationItems'], 
    queryFn: async () => (await api.get('/inspiration')).data || []
  });

  // Mock data for now - replace with actual API calls
  const mockServices = [
    { _id: '1', name: 'Ute Canopies', category: 'ute', status: 'active', featured: true },
    { _id: '2', name: 'Trailer Service Bodies', category: 'trailer', status: 'active', featured: true },
    { _id: '3', name: 'Truck Service Bodies', category: 'truck', status: 'active', featured: true },
    { _id: '4', name: 'Accessories & Parts', category: 'accessories', status: 'active', featured: false }
  ];

  const mockSubServices = [
    { _id: '1', name: 'Aluminium Canopy', parentService: '1', status: 'active', featured: true },
    { _id: '2', name: 'Steel Canopy', parentService: '1', status: 'active', featured: false },
    { _id: '3', name: 'Service Body Trailer', parentService: '2', status: 'active', featured: true },
    { _id: '4', name: 'Trailer Pack', parentService: '2', status: 'active', featured: true },
    { _id: '5', name: 'Service Body Truck', parentService: '3', status: 'active', featured: true },
    { _id: '6', name: 'Crane Mounted Truck', parentService: '3', status: 'inactive', featured: false }
  ];

  const mockCaseStudies = [
    { _id: '1', title: 'City Council Fleet Upgrade', company: 'City Council', status: 'published', featured: true },
    { _id: '2', title: 'Mining Company Solution', company: 'Mining Corp', status: 'published', featured: true },
    { _id: '3', title: 'Emergency Services', company: 'Fire Department', status: 'draft', featured: false }
  ];

  const mockInspirationItems = [
    { _id: '1', title: 'Modern Ute Design', category: 'ute', status: 'published', featured: true },
    { _id: '2', title: 'Industrial Trailer', category: 'trailer', status: 'published', featured: true },
    { _id: '3', title: 'Heavy Duty Truck', category: 'truck', status: 'published', featured: false },
    { _id: '4', title: 'Custom Accessories', category: 'accessories', status: 'draft', featured: false }
  ];

  // Use mock data for now
  const activeServices = mockServices.filter(s => s.status === 'active');
  const activeSubServices = mockSubServices.filter(s => s.status === 'active');
  const publishedCaseStudies = mockCaseStudies.filter(c => c.status === 'published');
  const publishedInspiration = mockInspirationItems.filter(i => i.status === 'published');

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

  // Category breakdown
  const categoryBreakdown = [
    { category: 'Ute', count: activeSubServices.filter(s => mockServices.find(ms => ms._id === s.parentService)?.category === 'ute').length, color: '#1677ff' },
    { category: 'Trailer', count: activeSubServices.filter(s => mockServices.find(ms => ms._id === s.parentService)?.category === 'trailer').length, color: '#52c41a' },
    { category: 'Truck', count: activeSubServices.filter(s => mockServices.find(ms => ms._id === s.parentService)?.category === 'truck').length, color: '#fa8c16' },
    { category: 'Accessories', count: activeSubServices.filter(s => mockServices.find(ms => ms._id === s.parentService)?.category === 'accessories').length, color: '#722ed1' }
  ];

  // Recent activity
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

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard Overview</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary">{stat.title}</Text>
                  <div>
                    <Statistic 
                      value={stat.value} 
                      valueStyle={{ color: stat.color, fontSize: '24px', fontWeight: 'bold' }}
                    />
                  </div>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Category Breakdown */}
        <Col xs={24} lg={12}>
          <Card title="Services by Category" style={{ height: '100%' }}>
            <div style={{ marginBottom: 24 }}>
              {categoryBreakdown.map((item, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>{item.category}</Text>
                    <Text>{item.count} services</Text>
                  </div>
                  <Progress 
                    percent={Math.round((item.count / Math.max(...categoryBreakdown.map(c => c.count))) * 100)} 
                    strokeColor={item.color}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" style={{ height: '100%' }}>
            <div>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  marginBottom: 16,
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: '8px'
                }}>
                  {getActivityIcon(activity.type)}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {activity.action}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {activity.item} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Featured Items */}
        <Col xs={24} lg={12}>
          <Card title="Featured Items" extra={<Button type="link">View All</Button>}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Featured Services:</Text>
                <div style={{ marginTop: 8 }}>
                  {activeServices.filter(s => s.featured).map(service => (
                    <Tag key={service._id} color="blue" style={{ marginBottom: 8 }}>
                      {service.name}
                    </Tag>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Text strong>Featured Sub-Services:</Text>
                <div style={{ marginTop: 8 }}>
                  {activeSubServices.filter(s => s.featured).slice(0, 5).map(sub => (
                    <Tag key={sub._id} color="green" style={{ marginBottom: 8 }}>
                      {sub.name}
                    </Tag>
                  ))}
                  {activeSubServices.filter(s => s.featured).length > 5 && (
                    <Tag color="default">+{activeSubServices.filter(s => s.featured).length - 5} more</Tag>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button type="primary" block icon={<CarOutlined />}>
                Add New Service
              </Button>
              <Button block icon={<ContainerOutlined />}>
                Add New Sub-Service
              </Button>
              <Button block icon={<FileTextOutlined />}>
                Create Case Study
              </Button>
              <Button block icon={<PictureOutlined />}>
                Add Inspiration Item
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Data Tables */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Services Table */}
        <Col xs={24} lg={12}>
          <Card title="Recent Services" extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={mockServices.slice(0, 5)}
              columns={[
                {
                  title: 'Service',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{text}</div>
                      <Tag color={
                        record.category === 'ute' ? 'blue' : 
                        record.category === 'trailer' ? 'green' : 
                        record.category === 'truck' ? 'orange' : 'purple'
                      }>
                        {record.category}
                      </Tag>
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
                  dataIndex: 'featured',
                  key: 'featured',
                  render: (featured) => (
                    <Tag color={featured ? 'gold' : 'default'}>
                      {featured ? 'Yes' : 'No'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Sub-Services Table */}
        <Col xs={24} lg={12}>
          <Card title="Recent Sub-Services" extra={<Button type="link">View All</Button>}>
            <Table
              dataSource={mockSubServices.slice(0, 5)}
              columns={[
                {
                  title: 'Sub-Service',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{text}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {mockServices.find(s => s._id === record.parentService)?.name}
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
                  dataIndex: 'featured',
                  key: 'featured',
                  render: (featured) => (
                    <Tag color={featured ? 'gold' : 'default'}>
                      {featured ? 'Yes' : 'No'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

