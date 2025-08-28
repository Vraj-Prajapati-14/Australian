import { Row, Col, Card, Button, Typography, Space, Image, Tag, Select, Input, Spin } from 'antd';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { SearchOutlined, FilterOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function InspirationGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch inspiration data
  const { data: inspirationItems = [], isLoading } = useQuery({
    queryKey: ['inspiration-published', selectedCategory, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await api.get(`/inspiration/published?${params.toString()}`);
      return response.data?.data || [];
    }
  });

  // Filtering is now handled by the API
  const filteredItems = inspirationItems;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'ute', label: 'Ute' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'truck', label: 'Truck' },
    { value: 'fleet', label: 'Fleet' },
    { value: 'government', label: 'Government' },
    { value: 'emergency', label: 'Emergency' }
  ];

  return (
    <div>
      <Hero
        title="Inspiration Gallery"
        subtitle="Discover how HIDRIVE transforms vehicles into mobile workspaces. Browse our collection of successful builds and get inspired for your next project."
        ctaText="Get Quote"
        ctaLink="/contact"
        showSubtitle={true}
      />

      {/* Filters */}
      <Section title="" subtitle="">
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} md={8}>
            <Select
              placeholder="Select Category"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              prefix={<FilterOutlined />}
            >
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={16}>
            <Search
              placeholder="Search inspiration gallery..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
      </Section>

      {/* Gallery Grid */}
      <Section title="Inspiration Gallery" subtitle={`Showing ${filteredItems.length} items`}>
        <Spin spinning={isLoading}>
          <Row gutter={[24, 24]}>
            {filteredItems.map((item) => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <Card 
                  hoverable
                  cover={
                    item.image && item.image.url ? (
                      <div style={{ height: 250, position: 'relative' }}>
                        <Image
                          src={item.image.url}
                          alt={item.image.alt || item.title}
                          width="100%"
                          height="100%"
                          style={{ objectFit: 'cover' }}
                          preview={false}
                        />
                        <div style={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 12, 
                          display: 'flex', 
                          gap: 8 
                        }}>
                          <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            style={{ color: 'white' }}
                            size="small"
                          />
                          <Button 
                            type="text" 
                            icon={<HeartOutlined />} 
                            style={{ color: 'white' }}
                            size="small"
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        height: 250, 
                        background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 64,
                        position: 'relative'
                      }}>
                        <div style={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 12, 
                          display: 'flex', 
                          gap: 8 
                        }}>
                          <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            style={{ color: 'white' }}
                            size="small"
                          />
                          <Button 
                            type="text" 
                            icon={<HeartOutlined />} 
                            style={{ color: 'white' }}
                            size="small"
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 48, marginBottom: 8 }}>
                            {item.category === 'ute' && '🚗'}
                            {item.category === 'trailer' && '🚛'}
                            {item.category === 'truck' && '🚚'}
                            {item.category === 'fleet' && '🏢'}
                            {item.category === 'government' && '🏛️'}
                            {item.category === 'emergency' && '🚨'}
                          </div>
                          <Text style={{ color: 'white', fontSize: 16 }}>
                            {item.category.toUpperCase()}
                          </Text>
                        </div>
                      </div>
                    )
                  }
                  actions={[
                    <Button type="link" icon={<EyeOutlined />}>View</Button>,
                    <Button type="link" icon={<HeartOutlined />}>Save</Button>
                  ]}
                >
                  <Title level={5} style={{ marginBottom: 8 }}>{item.title}</Title>
                  <Paragraph style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
                    {item.description}
                  </Paragraph>
                  <div>
                    {item.tags.map((tag, index) => (
                      <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </Section>

      {/* Categories Showcase */}
      <Section title="Browse by Category" subtitle="Find inspiration for your specific needs">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ 
                  height: 200, 
                  background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  🚗
                </div>
              }
            >
              <Title level={4}>Ute Solutions</Title>
              <Paragraph>
                Lightweight canopies and service bodies designed for maximum payload and efficiency.
              </Paragraph>
              <Button type="primary" href="/ute">
                Explore Ute
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ 
                  height: 200, 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  🚛
                </div>
              }
            >
              <Title level={4}>Trailer Solutions</Title>
              <Paragraph>
                Versatile trailer configurations for any industry and application.
              </Paragraph>
              <Button type="primary" href="/trailer">
                Explore Trailers
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ 
                  height: 200, 
                  background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  🚚
                </div>
              }
            >
              <Title level={4}>Truck Solutions</Title>
              <Paragraph>
                Heavy-duty service bodies engineered for maximum performance and durability.
              </Paragraph>
              <Button type="primary" href="/truck">
                Explore Trucks
              </Button>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* CTA Section */}
      <Section title="" subtitle="">
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Title level={2}>Ready to Create Your Perfect Mobile Workspace?</Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
            Get inspired by our gallery and start building your custom solution today.
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" href="/contact">
              Get Quote
            </Button>
            <Button size="large" href="/case-studies">
              View Case Studies
            </Button>
          </Space>
        </div>
      </Section>
    </div>
  )
} 