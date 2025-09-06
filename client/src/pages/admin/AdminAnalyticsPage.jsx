import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Progress, 
  Table, 
  Tag, 
  Space,
  DatePicker,
  Select,
  Button,
  Tabs,
  Divider,
  List,
  Avatar,
  Tooltip,
  Spin,
  Alert,
  Badge,
  Descriptions,
  Modal
} from 'antd';
import { 
  EyeOutlined,
  UserOutlined,
  GlobalOutlined,
  MobileOutlined,
  DesktopOutlined,
  TabletOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FilterOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import AnalyticsTracker from '../../components/AnalyticsTracker';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'), 
    dayjs()
  ]);
  const [period, setPeriod] = useState('30d');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorModalVisible, setVisitorModalVisible] = useState(false);

  // Fetch analytics data
  const { data: analytics = {}, isLoading, error, refetch } = useQuery({ 
    queryKey: ['analytics', period], 
    queryFn: async () => {
      const response = await api.get(`/visitors/analytics?period=${period}`);
      return response.data || {};
    }
  });

  // Fetch recent visitors
  const { data: visitorsData = {}, isLoading: visitorsLoading, error: visitorsError } = useQuery({
    queryKey: ['recent-visitors'],
    queryFn: async () => {
      try {
        const response = await api.get('/visitors/recent?limit=50');
        return response.data || {};
      } catch (error) {
        console.error('Error fetching recent visitors:', error);
        return {};
      }
    }
  });

  const analyticsData = analytics.data || {};
  const visitors = visitorsData.visitors || [];

  const getChangeIndicator = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return <ArrowUpOutlined style={{ color: '#52c41a', marginLeft: 8 }} />;
    } else if (change < 0) {
      return <ArrowDownOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />;
    }
    return null;
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'Direct': return 'blue';
      case 'Organic Search': return 'green';
      case 'Social Media': return 'purple';
      case 'Referral': return 'orange';
      default: return 'default';
    }
  };

  const getDeviceColor = (device) => {
    switch (device) {
      case 'Desktop': return 'blue';
      case 'Mobile': return 'green';
      case 'Tablet': return 'orange';
      default: return 'default';
    }
  };

  const getCountryColor = (country) => {
    switch (country) {
      case 'Australia': return 'blue';
      case 'New Zealand': return 'green';
      case 'United States': return 'red';
      case 'United Kingdom': return 'purple';
      default: return 'default';
    }
  };

  const showVisitorDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setVisitorModalVisible(true);
  };

  // Modern CSS styles
  const containerStyle = {
    padding: '32px',
    background: '#ffffff',
    minHeight: '100vh'
  };

  const pageHeaderStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    color: '#1a1a1a',
    margin: 0,
    fontWeight: '700',
    fontSize: '28px',
    letterSpacing: '-0.5px'
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '16px',
    marginTop: '8px',
    lineHeight: '1.5'
  };

  const filtersCardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '24px'
  };

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    height: '100%'
  };

  const statCardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '24px',
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

  const tabsCardStyle = {
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  };

  const progressItemStyle = {
    marginBottom: '20px',
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    border: '1px solid #f0f0f0'
  };

  const progressHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const progressTagStyle = {
    borderRadius: '6px',
    fontWeight: '500',
    padding: '4px 8px'
  };

  const tableStyle = {
    background: '#ffffff'
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

  const trendCardStyle = {
    textAlign: 'center',
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    minWidth: '100px',
    margin: '0 8px'
  };

  const trendDateStyle = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px'
  };

  const trendValueStyle = {
    fontWeight: '700',
    color: '#1677ff',
    fontSize: '16px',
    marginBottom: '2px'
  };

  const trendViewsStyle = {
    fontSize: '10px',
    color: '#666'
  };

  // Visitors table columns
  const visitorColumns = [
    {
      title: 'Visitor',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar 
            size={32} 
            style={{ backgroundColor: record.email ? '#1677ff' : '#d9d9d9' }}
            icon={record.email ? <MailOutlined /> : <UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: '600' }}>
              {name || record.email || 'Anonymous User'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.ip}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Location',
      dataIndex: 'country',
      key: 'country',
      render: (country, record) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#666' }} />
          <div>
            <div>{country || 'Unknown'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.city || 'Unknown City'}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Device',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (deviceType, record) => (
        <Space>
          {deviceType === 'mobile' ? <MobileOutlined /> : 
           deviceType === 'tablet' ? <TabletOutlined /> : <DesktopOutlined />}
          <div>
            <div style={{ textTransform: 'capitalize' }}>{deviceType || 'Unknown'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.browser} {record.browserVersion}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Engagement',
      key: 'engagement',
      render: (_, record) => (
        <div>
          <div>Pages: {record.pageViews || 1}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Time: {Math.floor((record.timeOnPage || 0) / 60)}m {Math.floor((record.timeOnPage || 0) % 60)}s
          </div>
        </div>
      )
    },
    {
      title: 'Social Accounts',
      key: 'social',
      render: (_, record) => {
        const socialAccounts = record.socialAccounts || {};
        const accounts = Object.keys(socialAccounts).filter(key => socialAccounts[key]);
        
        return (
          <div>
            {accounts.length > 0 ? (
              <Space wrap>
                {accounts.map(account => (
                  <Tag key={account} color="blue" size="small">
                    {account}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">None detected</Text>
            )}
          </div>
        );
      }
    },
    {
      title: 'Last Seen',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: (lastSeen) => (
        <div>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {new Date(lastSeen).toLocaleString()}
        </div>
      ),
      sorter: (a, b) => new Date(a.lastSeen) - new Date(b.lastSeen)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => showVisitorDetails(record)}
        >
          <InfoCircleOutlined /> Details
        </Button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <Spin size="large" style={{ color: '#1677ff' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <Alert
          message="Error Loading Analytics"
          description="There was an error loading the analytics data. Please try refreshing the page."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => refetch()}>
              Refresh
            </Button>
          }
        />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          Overview
        </span>
      ),
      children: (
        <div>
          {/* Key Metrics */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={6}>
              <Card style={statCardStyle}>
                <Statistic
                  title="Total Visitors"
                  value={analyticsData.overview?.totalVisitors || 0}
                  valueStyle={{ color: '#1677ff', fontSize: '28px', fontWeight: '700' }}
                  prefix={<EyeOutlined style={{ fontSize: '20px' }} />}
                />
                <Text type="secondary" style={{ fontSize: '14px' }}>Last {period}</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={statCardStyle}>
                <Statistic
                  title="Unique Visitors"
                  value={analyticsData.overview?.uniqueVisitors || 0}
                  valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: '700' }}
                  prefix={<UserOutlined style={{ fontSize: '20px' }} />}
                />
                <Text type="secondary" style={{ fontSize: '14px' }}>Last {period}</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={statCardStyle}>
                <Statistic
                  title="Page Views"
                  value={analyticsData.overview?.totalPageViews || 0}
                  valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: '700' }}
                  prefix={<BarChartOutlined style={{ fontSize: '20px' }} />}
                />
                <Text type="secondary" style={{ fontSize: '14px' }}>Last {period}</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={statCardStyle}>
                <Statistic
                  title="Conversion Rate"
                  value={analyticsData.overview?.conversionRate || '0%'}
                  valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: '700' }}
                  prefix={<RiseOutlined style={{ fontSize: '20px' }} />}
                />
                <Text type="secondary" style={{ fontSize: '14px' }}>Last {period}</Text>
              </Card>
            </Col>
          </Row>

          {/* Secondary Metrics */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={8}>
              <Card title="Session Duration" style={cardStyle}>
                <Statistic
                  value={analyticsData.overview?.avgSessionDuration || '0m 0s'}
                  valueStyle={{ fontSize: '24px', color: '#1677ff', fontWeight: '700' }}
                />
                <Text type="secondary" style={{ fontSize: '14px' }}>Average session duration</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Bounce Rate" style={cardStyle}>
                <Statistic
                  value={analyticsData.overview?.bounceRate || '0%'}
                  valueStyle={{ fontSize: '24px', color: '#ff4d4f', fontWeight: '700' }}
                />
                <Text type="secondary" style={{ fontSize: '14px' }}>Visitors who left after one page</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="New vs Returning" style={cardStyle}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                      New: {(analyticsData.overview?.newVisitors || 0).toLocaleString()}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: '14px', color: '#666' }}>
                      Returning: {(analyticsData.overview?.returningVisitors || 0).toLocaleString()}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'traffic',
      label: (
        <span>
          <GlobalOutlined style={{ marginRight: '8px' }} />
          Traffic Sources
        </span>
      ),
      children: (
        <div>
          {/* Traffic Sources */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} lg={12}>
              <Card title="Traffic Sources" style={cardStyle}>
                <div>
                  {(analyticsData.traffic?.sources || []).map((source, index) => (
                    <div key={index} style={progressItemStyle}>
                      <div style={progressHeaderStyle}>
                        <Space>
                          <Tag color={getSourceColor(source.source)} style={progressTagStyle}>
                            {source.source}
                          </Tag>
                          <Text style={{ fontWeight: '500' }}>{source.visitors.toLocaleString()}</Text>
                        </Space>
                        <Text strong style={{ fontSize: '16px' }}>{source.percentage}%</Text>
                      </div>
                      <Progress 
                        percent={source.percentage} 
                        strokeColor={getSourceColor(source.source)}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Device Types" style={cardStyle}>
                <div>
                  {(analyticsData.traffic?.devices || []).map((device, index) => (
                    <div key={index} style={progressItemStyle}>
                      <div style={progressHeaderStyle}>
                        <Space>
                          <Tag color={getDeviceColor(device.device)} style={progressTagStyle}>
                            {device.device}
                          </Tag>
                          <Text style={{ fontWeight: '500' }}>{device.visitors.toLocaleString()}</Text>
                        </Space>
                        <Text strong style={{ fontSize: '16px' }}>{device.percentage}%</Text>
                      </div>
                      <Progress 
                        percent={device.percentage} 
                        strokeColor={getDeviceColor(device.device)}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Top Countries */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card title="Top Countries" style={cardStyle}>
                <div>
                  {(analyticsData.traffic?.countries || []).map((country, index) => (
                    <div key={index} style={progressItemStyle}>
                      <div style={progressHeaderStyle}>
                        <Space>
                          <Tag color={getCountryColor(country.country)} style={progressTagStyle}>
                            {country.country}
                          </Tag>
                          <Text style={{ fontWeight: '500' }}>{country.visitors.toLocaleString()}</Text>
                        </Space>
                        <Text strong style={{ fontSize: '16px' }}>{country.percentage}%</Text>
                      </div>
                      <Progress 
                        percent={country.percentage} 
                        strokeColor={getCountryColor(country.country)}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'visitors',
      label: (
        <span>
          <UserOutlined style={{ marginRight: '8px' }} />
          Recent Visitors
        </span>
      ),
      children: (
        <Card title="Recent Visitors" style={cardStyle}>
          {visitorsError ? (
            <Alert
              message="Error Loading Recent Visitors"
              description="There was an error loading recent visitors data. Please try refreshing the page."
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : null}
          
          {visitors.length > 0 ? (
            <Table
              dataSource={visitors}
              columns={visitorColumns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} visitors`
              }}
              size="small"
              style={tableStyle}
              loading={visitorsLoading}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                No recent visitors found
              </Text>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Visitor tracking will show data when users visit your public pages
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Make sure to visit your public website (not admin pages) to generate visitor data
              </Text>
            </div>
          )}
        </Card>
      )
    },
    {
      key: 'pages',
      label: (
        <span>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          Top Pages
        </span>
      ),
      children: (
        <Card title="Page Performance" style={cardStyle}>
          <Table
            dataSource={analyticsData.pages || []}
            columns={[
              {
                title: 'Page',
                dataIndex: 'page',
                key: 'page',
                render: (page) => (
                  <Text code style={{ fontSize: '14px' }}>{page}</Text>
                )
              },
              {
                title: 'Page Views',
                dataIndex: 'views',
                key: 'views',
                render: (views) => (
                  <Text strong style={{ color: '#1677ff' }}>
                    {views.toLocaleString()}
                  </Text>
                ),
                sorter: (a, b) => a.views - b.views
              },
              {
                title: 'Unique Views',
                dataIndex: 'uniqueViews',
                key: 'uniqueViews',
                render: (uniqueViews) => uniqueViews.toLocaleString()
              },
              {
                title: 'Avg Time',
                dataIndex: 'avgTime',
                key: 'avgTime',
                render: (time) => (
                  <Text style={{ color: '#666' }}>{time}</Text>
                )
              },
              {
                title: 'Bounce Rate',
                dataIndex: 'bounceRate',
                key: 'bounceRate',
                render: (rate) => (
                  <Tag 
                    color={parseInt(rate) < 40 ? 'green' : parseInt(rate) < 60 ? 'orange' : 'red'}
                    style={progressTagStyle}
                  >
                    {rate}
                  </Tag>
                )
              }
            ]}
            pagination={false}
            size="small"
            style={tableStyle}
          />
        </Card>
      )
    },
    {
      key: 'trends',
      label: (
        <span>
          <LineChartOutlined style={{ marginRight: '8px' }} />
          Trends
        </span>
      ),
      children: (
        <Card title="Daily Traffic Trends" style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {(analyticsData.trends?.daily || []).map((day, index) => (
                <div key={index} style={trendCardStyle}>
                  <div style={trendDateStyle}>
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={trendValueStyle}>
                    {day.visitors}
                  </div>
                  <div style={trendViewsStyle}>
                    {day.pageViews} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div style={containerStyle}>
      {/* Analytics Tracker - This will track when admin visits analytics page */}
      <AnalyticsTracker 
        page="/admin/analytics"
        customData={{ 
          userType: 'admin',
          pageType: 'analytics_dashboard'
        }}
      />

      {/* Page Header */}
      <div style={pageHeaderStyle}>
        <Title level={2} style={titleStyle}>
          Analytics Dashboard
        </Title>
        <Paragraph style={subtitleStyle}>
          Monitor your website performance, traffic sources, and user behavior analytics with detailed visitor tracking.
        </Paragraph>
      </div>

      {/* Filters */}
      <Card style={filtersCardStyle}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Time Period:
              </Text>
              <Select
                value={period}
                onChange={setPeriod}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="7d">Last 7 days</Option>
                <Option value="30d">Last 30 days</Option>
                <Option value="90d">Last 90 days</Option>
                <Option value="1y">Last year</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                <FilterOutlined style={{ marginRight: '8px' }} />
                Custom Range:
              </Text>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
                size="large"
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              style={primaryButtonStyle}
              size="large"
              onClick={() => refetch()}
            >
              Refresh Data
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Analytics Tabs */}
      <Card style={tabsCardStyle}>
        <Tabs
          defaultActiveKey="overview"
          items={tabItems}
          style={{ background: '#ffffff' }}
        />
      </Card>

      {/* Visitor Details Modal */}
      <Modal
        title="Visitor Details"
        open={visitorModalVisible}
        onCancel={() => setVisitorModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedVisitor && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
              {selectedVisitor.name || 'Anonymous'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedVisitor.email || 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">
              {selectedVisitor.ip}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {selectedVisitor.city}, {selectedVisitor.country}
            </Descriptions.Item>
            <Descriptions.Item label="Device">
              {selectedVisitor.deviceType} - {selectedVisitor.browser} {selectedVisitor.browserVersion}
            </Descriptions.Item>
            <Descriptions.Item label="Operating System">
              {selectedVisitor.os} {selectedVisitor.osVersion}
            </Descriptions.Item>
            <Descriptions.Item label="Screen Resolution">
              {selectedVisitor.screenResolution}
            </Descriptions.Item>
            <Descriptions.Item label="Connection Type">
              {selectedVisitor.connectionType || 'Unknown'}
            </Descriptions.Item>
            <Descriptions.Item label="Page Views">
              {selectedVisitor.pageViews || 1}
            </Descriptions.Item>
            <Descriptions.Item label="Time on Page">
              {Math.floor((selectedVisitor.timeOnPage || 0) / 60)}m {Math.floor((selectedVisitor.timeOnPage || 0) % 60)}s
            </Descriptions.Item>
            <Descriptions.Item label="Social Accounts" span={2}>
              {Object.keys(selectedVisitor.socialAccounts || {}).filter(key => selectedVisitor.socialAccounts[key]).length > 0 ? (
                <Space wrap>
                  {Object.keys(selectedVisitor.socialAccounts || {}).map(account => 
                    selectedVisitor.socialAccounts[account] && (
                      <Tag key={account} color="blue">{account}</Tag>
                    )
                  )}
                </Space>
              ) : (
                'None detected'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="First Visit">
              {new Date(selectedVisitor.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Activity">
              {new Date(selectedVisitor.lastSeen).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Current Page">
              {selectedVisitor.page}
            </Descriptions.Item>
            <Descriptions.Item label="Referrer">
              {selectedVisitor.referrer || 'Direct'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
} 