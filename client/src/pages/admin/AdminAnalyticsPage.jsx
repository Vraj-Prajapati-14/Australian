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
  Tooltip
} from 'antd';
import { 
  EyeOutlined,
  UserOutlined,
  GlobalOutlined,
  MobileOutlined,
  DesktopOutlined,
  TabletOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()]);
  const [period, setPeriod] = useState('30d');

  // Fetch analytics data
  const { data: analytics = {}, isLoading } = useQuery({ 
    queryKey: ['analytics', period], 
    queryFn: async () => (await api.get(`/analytics?period=${period}`)).data || {}
  });

  // Mock data for now - replace with actual API calls
  const mockAnalytics = {
    overview: {
      totalVisitors: 15420,
      uniqueVisitors: 8920,
      newVisitors: 6540,
      returningVisitors: 2380,
      pageViews: 45680,
      avgSessionDuration: '2m 34s',
      bounceRate: '32.5%',
      conversionRate: '4.2%'
    },
    traffic: {
      sources: [
        { source: 'Direct', visitors: 4560, percentage: 29.6 },
        { source: 'Organic Search', visitors: 6780, percentage: 44.0 },
        { source: 'Social Media', visitors: 2340, percentage: 15.2 },
        { source: 'Referral', visitors: 1740, percentage: 11.3 }
      ],
      devices: [
        { device: 'Desktop', visitors: 9250, percentage: 60.0 },
        { device: 'Mobile', visitors: 5550, percentage: 36.0 },
        { device: 'Tablet', visitors: 620, percentage: 4.0 }
      ],
      countries: [
        { country: 'Australia', visitors: 12340, percentage: 80.0 },
        { country: 'New Zealand', visitors: 1540, percentage: 10.0 },
        { country: 'United States', visitors: 770, percentage: 5.0 },
        { country: 'United Kingdom', visitors: 770, percentage: 5.0 }
      ]
    },
    pages: [
      { page: '/', views: 12560, uniqueViews: 8920, avgTime: '2m 45s', bounceRate: '28%' },
      { page: '/ute', views: 4560, uniqueViews: 3240, avgTime: '3m 12s', bounceRate: '35%' },
      { page: '/trailer', views: 3890, uniqueViews: 2780, avgTime: '2m 58s', bounceRate: '38%' },
      { page: '/truck', views: 3240, uniqueViews: 2340, avgTime: '3m 25s', bounceRate: '42%' },
      { page: '/services', views: 2980, uniqueViews: 2150, avgTime: '2m 15s', bounceRate: '45%' },
      { page: '/case-studies', views: 2340, uniqueViews: 1680, avgTime: '4m 12s', bounceRate: '25%' },
      { page: '/contact', views: 1850, uniqueViews: 1340, avgTime: '1m 45s', bounceRate: '55%' }
    ],
    trends: {
      daily: [
        { date: '2024-01-01', visitors: 420, pageViews: 1250 },
        { date: '2024-01-02', visitors: 380, pageViews: 1180 },
        { date: '2024-01-03', visitors: 450, pageViews: 1320 },
        { date: '2024-01-04', visitors: 520, pageViews: 1450 },
        { date: '2024-01-05', visitors: 480, pageViews: 1380 },
        { date: '2024-01-06', visitors: 350, pageViews: 980 },
        { date: '2024-01-07', visitors: 320, pageViews: 890 }
      ]
    }
  };

  const getChangeIndicator = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return <TrendingUpOutlined style={{ color: '#52c41a', marginLeft: 8 }} />;
    } else if (change < 0) {
      return <TrendingDownOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />;
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

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined />
          Overview
        </span>
      ),
      children: (
        <div>
          {/* Key Metrics */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Visitors"
                  value={mockAnalytics.overview.totalVisitors}
                  valueStyle={{ color: '#1677ff' }}
                  prefix={<EyeOutlined />}
                />
                <Text type="secondary">Last 30 days</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Unique Visitors"
                  value={mockAnalytics.overview.uniqueVisitors}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<UserOutlined />}
                />
                <Text type="secondary">Last 30 days</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Page Views"
                  value={mockAnalytics.overview.pageViews}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<BarChartOutlined />}
                />
                <Text type="secondary">Last 30 days</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Conversion Rate"
                  value={mockAnalytics.overview.conversionRate}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<TrendingUpOutlined />}
                />
                <Text type="secondary">Last 30 days</Text>
              </Card>
            </Col>
          </Row>

          {/* Secondary Metrics */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={8}>
              <Card title="Session Duration">
                <Statistic
                  value={mockAnalytics.overview.avgSessionDuration}
                  valueStyle={{ fontSize: '24px', color: '#1677ff' }}
                />
                <Text type="secondary">Average session duration</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Bounce Rate">
                <Statistic
                  value={mockAnalytics.overview.bounceRate}
                  valueStyle={{ fontSize: '24px', color: '#ff4d4f' }}
                />
                <Text type="secondary">Visitors who left after one page</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="New vs Returning">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>New: {mockAnalytics.overview.newVisitors.toLocaleString()}</Text>
                  </div>
                  <div>
                    <Text>Returning: {mockAnalytics.overview.returningVisitors.toLocaleString()}</Text>
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
          <GlobalOutlined />
          Traffic Sources
        </span>
      ),
      children: (
        <div>
          {/* Traffic Sources */}
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} lg={12}>
              <Card title="Traffic Sources">
                <div>
                  {mockAnalytics.traffic.sources.map((source, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Space>
                          <Tag color={getSourceColor(source.source)}>{source.source}</Tag>
                          <Text>{source.visitors.toLocaleString()}</Text>
                        </Space>
                        <Text strong>{source.percentage}%</Text>
                      </div>
                      <Progress 
                        percent={source.percentage} 
                        strokeColor={getSourceColor(source.source)}
                        showInfo={false}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Device Types">
                <div>
                  {mockAnalytics.traffic.devices.map((device, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Space>
                          <Tag color={getDeviceColor(device.device)}>{device.device}</Tag>
                          <Text>{device.visitors.toLocaleString()}</Text>
                        </Space>
                        <Text strong>{device.percentage}%</Text>
                      </div>
                      <Progress 
                        percent={device.percentage} 
                        strokeColor={getDeviceColor(device.device)}
                        showInfo={false}
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
              <Card title="Top Countries">
                <div>
                  {mockAnalytics.traffic.countries.map((country, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Space>
                          <Tag color={getCountryColor(country.country)}>{country.country}</Tag>
                          <Text>{country.visitors.toLocaleString()}</Text>
                        </Space>
                        <Text strong>{country.percentage}%</Text>
                      </div>
                      <Progress 
                        percent={country.percentage} 
                        strokeColor={getCountryColor(country.country)}
                        showInfo={false}
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
      key: 'pages',
      label: (
        <span>
          <BarChartOutlined />
          Top Pages
        </span>
      ),
      children: (
        <Card title="Page Performance">
          <Table
            dataSource={mockAnalytics.pages}
            columns={[
              {
                title: 'Page',
                dataIndex: 'page',
                key: 'page',
                render: (page) => (
                  <Text code>{page}</Text>
                )
              },
              {
                title: 'Page Views',
                dataIndex: 'views',
                key: 'views',
                render: (views) => views.toLocaleString(),
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
                key: 'avgTime'
              },
              {
                title: 'Bounce Rate',
                dataIndex: 'bounceRate',
                key: 'bounceRate',
                render: (rate) => (
                  <Tag color={parseInt(rate) < 40 ? 'green' : parseInt(rate) < 60 ? 'orange' : 'red'}>
                    {rate}
                  </Tag>
                )
              }
            ]}
            pagination={false}
            size="small"
          />
        </Card>
      )
    },
    {
      key: 'trends',
      label: (
        <span>
          <LineChartOutlined />
          Trends
        </span>
      ),
      children: (
        <Card title="Daily Traffic Trends">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Text>Last 7 days:</Text>
              {mockAnalytics.trends.daily.map((day, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '4px', minWidth: '80px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#1677ff' }}>
                    {day.visitors}
                  </div>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    {day.pageViews} views
                  </div>
                </div>
              ))}
            </Space>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Analytics Dashboard</Title>
      <Paragraph style={{ marginBottom: 32 }}>
        Monitor your website performance, traffic sources, and user behavior analytics.
      </Paragraph>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Text strong>Time Period:</Text>
            <Select
              value={period}
              onChange={setPeriod}
              style={{ width: '100%', marginTop: 8 }}
            >
              <Option value="7d">Last 7 days</Option>
              <Option value="30d">Last 30 days</Option>
              <Option value="90d">Last 90 days</Option>
              <Option value="1y">Last year</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>Custom Range:</Text>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Button type="primary" style={{ marginTop: 32 }}>
              Refresh Data
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Analytics Tabs */}
      <Tabs
        defaultActiveKey="overview"
        items={tabItems}
        style={{ background: 'white', padding: '24px', borderRadius: '8px' }}
      />
    </div>
  );
} 