import { Row, Col, Card, Button, Typography, Space, Divider, Image, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { ContainerOutlined, ToolOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function TrailerPage() {
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: async () => (await api.get('/services')).data })

  const trailerServices = services?.filter(s => s.category?.includes('trailer')) || []

  return (
    <div>
      <Hero
        title="Trailer Service Bodies & Canopies"
        subtitle="Versatile, customizable solutions for any industry. Built for performance and reliability."
        ctaText="Get Quote"
        ctaLink="/contact"
        showSubtitle={true}
      />

      {/* Trailer Types */}
      <Section title="Trailer Service Body Types" subtitle="Choose the perfect solution for your needs">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  <ContainerOutlined />
                </div>
              }
            >
              <Title level={3}>Service Body Trailers</Title>
              <Paragraph>
                Professional-grade trailers with integrated storage and workspace solutions. Perfect for mobile service operations.
              </Paragraph>
              <Button type="primary" size="large">
                Learn More
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  <CheckCircleOutlined />
                </div>
              }
            >
              <Title level={3}>Trailer Packs</Title>
              <Paragraph>
                Complete trailer solutions with pre-configured storage and equipment. Ready to work straight from delivery.
              </Paragraph>
              <Button type="primary" size="large">
                Learn More
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  <ToolOutlined />
                </div>
              }
            >
              <Title level={3}>All-Rounder Packs</Title>
              <Paragraph>
                Versatile trailer configurations that adapt to multiple applications. The perfect solution for diverse operational needs.
              </Paragraph>
              <Button type="primary" size="large">
                Learn More
              </Button>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Key Features */}
      <Section title="Why Choose HIDRIVE Trailer Solutions" subtitle="Engineered for versatility and durability">
        <Row gutter={[32, 32]} style={{ marginTop: 48 }}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Heavy-Duty Construction
                </Title>
                <Paragraph>
                  Built to withstand the toughest conditions. Our trailer service bodies are constructed using premium materials and proven engineering principles.
                </Paragraph>
              </div>
              
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Modular Design
                </Title>
                <Paragraph>
                  Customize your trailer with our modular system. Add or remove components as your needs change over time.
                </Paragraph>
              </div>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Integrated Storage
                </Title>
                <Paragraph>
                  Every inch of space is optimized for efficiency. Custom drawers, shelves, and compartments keep everything organized and accessible.
                </Paragraph>
              </div>
              
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Easy Towing
                </Title>
                <Paragraph>
                  Designed for optimal weight distribution and towing stability. Get to your destination safely and efficiently.
                </Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </Section>

      {/* Trailer Services */}
      <Section title="Trailer Service Solutions" subtitle="Professional solutions for every industry">
        <Row gutter={[16, 16]}>
          {trailerServices.slice(0, 6).map((service) => (
            <Col key={service._id} xs={24} sm={12} md={8}>
              <Card 
                hoverable
                cover={
                  <div style={{ 
                    height: 200, 
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 48,
                    color: '#666'
                  }}>
                    <ContainerOutlined />
                  </div>
                }
              >
                <Title level={4}>{service.name}</Title>
                <Paragraph>{service.description}</Paragraph>
                <Button type="primary" href={`/services/${service.slug}`}>
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Applications */}
      <Section title="Industry Applications" subtitle="Trailer solutions for every sector">
        <Row gutter={[24, 24]} style={{ background: '#f5f5f5', padding: '48px 24px', borderRadius: 12 }}>
          <Col xs={24} md={8}>
            <Title level={4}>Construction</Title>
            <Paragraph>
              Mobile workshops and tool storage for construction sites. Keep your team equipped and productive.
            </Paragraph>
            <Tag color="blue">Tools</Tag>
            <Tag color="green">Equipment</Tag>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Maintenance</Title>
            <Paragraph>
              Service trailers for maintenance operations. Complete mobile workshops with all necessary equipment.
            </Paragraph>
            <Tag color="orange">Workshop</Tag>
            <Tag color="purple">Service</Tag>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Emergency Response</Title>
            <Paragraph>
              Rapid response trailers for emergency services. Quick deployment with essential equipment and supplies.
            </Paragraph>
            <Tag color="red">Emergency</Tag>
            <Tag color="cyan">Response</Tag>
          </Col>
        </Row>
      </Section>

      {/* CTA Section */}
      <Section title="" subtitle="">
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Title level={2}>Ready for Your Perfect Trailer Solution?</Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
            Get a custom quote for your trailer service body or canopy.
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" href="/contact">
              Get Quote
            </Button>
            <Button size="large" href="/inspiration">
              View Inspiration Gallery
            </Button>
          </Space>
        </div>
      </Section>
    </div>
  )
} 