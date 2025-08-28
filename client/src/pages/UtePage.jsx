import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Space, Divider, Image as AntdImage, Tag, Empty } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export default function UtePage() {
  // Fetch services and sub-services data
  const { data: services = [] } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: subServices = [] } = useQuery({ 
    queryKey: ['subServices'], 
    queryFn: async () => (await api.get('/sub-services')).data || []
  });

  // Get ute services and sub-services from API
  const uteService = services.find(s => s.category === 'ute' && s.status === 'active');
  const uteSubServices = subServices.filter(s => s.parentService === uteService?._id && s.status === 'active') || [];

  const features = [
    {
      title: 'Lightweight & Strong',
      description: 'Our aluminium construction provides the perfect balance of strength and weight, ensuring your vehicle maintains optimal performance.',
      icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
    },
    {
      title: 'Fast Installation',
      description: 'Professional installation completed in just 2-3 hours, minimizing downtime and getting you back on the road quickly.',
      icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
    },
    {
      title: 'Customizable Design',
      description: 'Tailor your canopy with custom storage solutions, lighting, and accessories to match your specific needs.',
      icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
    },
    {
      title: 'Perfect Fit',
      description: 'Precisely engineered for your specific vehicle model, ensuring a seamless fit and professional appearance.',
      icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
    }
  ];

  const serviceBodyVariations = [
    {
      name: 'Tradesman Pack',
      description: 'Complete solution for tradespeople with integrated tool storage and workspace.',
      features: ['Tool Drawers', 'Work Bench', 'Ladder Racks', 'Power Outlets'],
      image: 'https://via.placeholder.com/300x200',
      price: 'From $4,500'
    },
    {
      name: 'Security Pack',
      description: 'High-security solution with reinforced construction and advanced locking systems.',
      features: ['Reinforced Doors', 'Advanced Locks', 'Alarm Integration', 'GPS Tracking'],
      image: 'https://via.placeholder.com/300x200',
      price: 'From $5,200'
    },
    {
      name: 'Utility Pack',
      description: 'Versatile solution for utility companies with specialized equipment storage.',
      features: ['Equipment Racks', 'Cable Management', 'Safety Equipment', 'Weather Protection'],
      image: 'https://via.placeholder.com/300x200',
      price: 'From $4,800'
    }
  ];

  const governmentSolutions = [
    {
      name: 'Emergency Services',
      description: 'Specialized solutions for police, fire, and emergency response vehicles.',
      features: ['Emergency Lighting', 'Equipment Mounting', 'Secure Storage', 'Quick Access']
    },
    {
      name: 'Government Fleet',
      description: 'Compliant solutions meeting all government standards and requirements.',
      features: ['ISO Certified', 'Compliance Ready', 'Fleet Branding', 'Maintenance Access']
    },
    {
      name: 'Defense Applications',
      description: 'Military-grade solutions for defense and security applications.',
      features: ['Military Spec', 'Heavy-Duty', 'Custom Mounting', 'Security Clearance']
    }
  ];

  if (!uteService) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Empty description="No ute services available" />
      </div>
    );
  }

  return (
    <div>
      <Hero
        title="Ute Canopies & Service Bodies"
        subtitle="Professional ute solutions engineered for performance and durability. Lightweight, strong, and perfectly fitted for your vehicle."
        ctaText="Get Quote"
        ctaLink="/contact"
        showSubtitle={true}
      />

      {/* Canopy Types */}
      <Section title="Canopy Types" subtitle="Choose the perfect solution for your needs">
        <Row gutter={[24, 24]}>
          {uteSubServices.map(subService => (
            <Col xs={24} md={8} key={subService._id}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', height: '100%' }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <AntdImage
                      alt={subService.name}
                      src={subService.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                    {subService.featured && (
                      <Tag 
                        color="gold" 
                        style={{ 
                          position: 'absolute', 
                          top: 16, 
                          right: 16,
                          fontWeight: 'bold'
                        }}
                      >
                        Featured
                      </Tag>
                    )}
                  </div>
                }
              >
                <Title level={3}>{subService.name}</Title>
                <Paragraph>
                  {subService.shortDescription}
                </Paragraph>
                
                <div style={{ marginBottom: 16 }}>
                  <Space wrap>
                    {subService.features?.slice(0, 3).map(feature => (
                      <Tag key={feature} color="blue" size="small">
                        {feature}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 18 }}>
                    From ${subService.pricing?.base?.toLocaleString()}
                  </Text>
                </div>

                <Button type="primary" size="large" block>
                  Get Quote
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Key Features */}
      <Section title="Why Choose HIDRIVE Ute Solutions" subtitle="Engineered for performance and reliability">
        <Row gutter={[32, 32]} style={{ marginTop: 48 }}>
          {features.map((feature, index) => (
            <Col xs={24} md={12} key={index}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ marginTop: 4 }}>
                  {feature.icon}
                </div>
                <div>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#666' }}>
                    {feature.description}
                  </Paragraph>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Service Body Variations */}
      <Section title="Service Body Variations" subtitle="Complete solutions for every application">
        <Row gutter={[24, 24]}>
          {serviceBodyVariations.map((variation, index) => (
            <Col xs={24} md={8} key={index}>
              <Card 
                hoverable 
                style={{ height: '100%' }}
                cover={
                  <AntdImage
                    alt={variation.name}
                    src={variation.image}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <Title level={4}>{variation.name}</Title>
                <Paragraph style={{ marginBottom: 16 }}>
                  {variation.description}
                </Paragraph>
                
                <div style={{ marginBottom: 16 }}>
                  <Space wrap>
                    {variation.features.map(feature => (
                      <Tag key={feature} color="green" size="small">
                        {feature}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Text strong style={{ fontSize: 18 }}>
                    {variation.price}
                  </Text>
                  <Button type="primary" size="small">
                    Learn More
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Government Sector Solutions */}
      <Section title="Government Sector Solutions" subtitle="Compliant solutions for government operations">
        <Row gutter={[24, 24]} style={{ background: '#f5f5f5', padding: '48px 24px', borderRadius: 12 }}>
          {governmentSolutions.map((solution, index) => (
            <Col xs={24} md={8} key={index}>
              <Title level={4}>{solution.name}</Title>
              <Paragraph style={{ marginBottom: 16 }}>
                {solution.description}
              </Paragraph>
              <Space wrap>
                {solution.features.map(feature => (
                  <Tag key={feature} color="blue">
                    {feature}
                  </Tag>
                ))}
              </Space>
            </Col>
          ))}
        </Row>
      </Section>

      {/* CTA Section */}
      <Section title="" subtitle="">
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Title level={2}>Ready for Your Perfect Ute Solution?</Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
            Get a custom quote for your ute canopy or service body.
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
  );
} 