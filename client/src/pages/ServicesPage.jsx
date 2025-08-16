import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Space, Tag, Image, Empty } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch services and sub-services data
  const { data: services = [] } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: subServices = [] } = useQuery({ 
    queryKey: ['subServices'], 
    queryFn: async () => (await api.get('/sub-services')).data || []
  });

  // Mock data for now - replace with actual API calls
  const mockServices = [
    {
      _id: '1',
      name: 'Ute Canopies',
      slug: 'ute-canopies',
      description: 'Professional ute canopy solutions for all vehicle types',
      shortDescription: 'Lightweight, strong canopies for utes',
      category: 'ute',
      image: 'https://via.placeholder.com/400x300',
      featured: true,
      status: 'active',
      order: 1
    },
    {
      _id: '2',
      name: 'Trailer Service Bodies',
      slug: 'trailer-service-bodies',
      description: 'Versatile trailer solutions for mobile operations',
      shortDescription: 'Mobile service solutions on trailers',
      category: 'trailer',
      image: 'https://via.placeholder.com/400x300',
      featured: true,
      status: 'active',
      order: 2
    },
    {
      _id: '3',
      name: 'Truck Service Bodies',
      slug: 'truck-service-bodies',
      description: 'Heavy-duty truck solutions for industrial applications',
      shortDescription: 'Heavy-duty industrial solutions',
      category: 'truck',
      image: 'https://via.placeholder.com/400x300',
      featured: true,
      status: 'active',
      order: 3
    },
    {
      _id: '4',
      name: 'Accessories & Parts',
      slug: 'accessories-parts',
      description: 'Essential accessories and replacement parts for all vehicle types',
      shortDescription: 'Quality accessories and parts',
      category: 'accessories',
      image: 'https://via.placeholder.com/400x300',
      featured: false,
      status: 'active',
      order: 4
    }
  ];

  const mockSubServices = [
    {
      _id: '1',
      name: 'Aluminium Canopy',
      slug: 'aluminium-canopy',
      description: 'Lightweight aluminium canopy with integrated storage',
      shortDescription: 'Lightweight aluminium construction',
      parentService: '1',
      parentServiceName: 'Ute Canopies',
      image: 'https://via.placeholder.com/300x200',
      features: ['Lightweight', 'Strong', 'Customizable'],
      specifications: {
        material: 'Aluminium',
        weight: '45kg',
        installation: '2-3 hours'
      },
      pricing: {
        base: 2500,
        currency: 'AUD'
      },
      featured: true,
      status: 'active',
      order: 1
    },
    {
      _id: '2',
      name: 'Steel Canopy',
      slug: 'steel-canopy',
      description: 'Heavy-duty steel canopy for maximum security',
      shortDescription: 'Maximum security steel construction',
      parentService: '1',
      parentServiceName: 'Ute Canopies',
      image: 'https://via.placeholder.com/300x200',
      features: ['Maximum Security', 'Durable', 'Heavy-duty'],
      specifications: {
        material: 'Steel',
        weight: '85kg',
        installation: '3-4 hours'
      },
      pricing: {
        base: 3200,
        currency: 'AUD'
      },
      featured: false,
      status: 'active',
      order: 2
    },
    {
      _id: '3',
      name: 'Service Body Trailer',
      slug: 'service-body-trailer',
      description: 'Professional-grade trailer with integrated storage and workspace',
      shortDescription: 'Mobile workshop on wheels',
      parentService: '2',
      parentServiceName: 'Trailer Service Bodies',
      image: 'https://via.placeholder.com/300x200',
      features: ['Mobile Workshop', 'Integrated Storage', 'Professional Grade'],
      specifications: {
        material: 'Aluminium/Steel',
        weight: '200kg',
        installation: '1-2 days'
      },
      pricing: {
        base: 8500,
        currency: 'AUD'
      },
      featured: true,
      status: 'active',
      order: 1
    },
    {
      _id: '4',
      name: 'Trailer Pack',
      slug: 'trailer-pack',
      description: 'Complete trailer solution with pre-configured equipment',
      shortDescription: 'Ready-to-work trailer solution',
      parentService: '2',
      parentServiceName: 'Trailer Service Bodies',
      image: 'https://via.placeholder.com/300x200',
      features: ['Pre-configured', 'Ready to Work', 'Complete Solution'],
      specifications: {
        material: 'Aluminium/Steel',
        weight: '250kg',
        installation: '1-2 days'
      },
      pricing: {
        base: 12000,
        currency: 'AUD'
      },
      featured: true,
      status: 'active',
      order: 2
    },
    {
      _id: '5',
      name: 'Service Body Truck',
      slug: 'service-body-truck',
      description: 'Heavy-duty service body for industrial truck applications',
      shortDescription: 'Industrial strength truck solution',
      parentService: '3',
      parentServiceName: 'Truck Service Bodies',
      image: 'https://via.placeholder.com/300x200',
      features: ['Heavy-Duty', 'Industrial Grade', 'Maximum Payload'],
      specifications: {
        material: 'Aluminium/Steel',
        weight: '400kg',
        installation: '2-3 days'
      },
      pricing: {
        base: 18000,
        currency: 'AUD'
      },
      featured: true,
      status: 'active',
      order: 1
    },
    {
      _id: '6',
      name: 'Crane Mounted Truck',
      slug: 'crane-mounted-truck',
      description: 'Truck service body with integrated crane system',
      shortDescription: 'Crane-equipped truck solution',
      parentService: '3',
      parentServiceName: 'Truck Service Bodies',
      image: 'https://via.placeholder.com/300x200',
      features: ['Integrated Crane', 'Heavy Lifting', 'Professional Grade'],
      specifications: {
        material: 'Aluminium/Steel',
        weight: '600kg',
        installation: '3-4 days'
      },
      pricing: {
        base: 25000,
        currency: 'AUD'
      },
      featured: false,
      status: 'active',
      order: 2
    }
  ];

  // Use mock data for now, replace with actual data when API is ready
  const activeServices = mockServices.filter(s => s.status === 'active');
  const activeSubServices = mockSubServices.filter(s => s.status === 'active');

  const categories = [
    { key: 'all', name: 'All Services', count: activeServices.length },
    { key: 'ute', name: 'Ute', count: activeServices.filter(s => s.category === 'ute').length },
    { key: 'trailer', name: 'Trailer', count: activeServices.filter(s => s.category === 'trailer').length },
    { key: 'truck', name: 'Truck', count: activeServices.filter(s => s.category === 'truck').length },
    { key: 'accessories', name: 'Accessories', count: activeServices.filter(s => s.category === 'accessories').length }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? activeServices 
    : activeServices.filter(s => s.category === selectedCategory);

  const getSubServicesForService = (serviceId) => {
    return activeSubServices.filter(sub => sub.parentService === serviceId);
  };

  return (
    <div>
      <Hero
        title="Our Services"
        subtitle="Professional vehicle solutions engineered for performance, durability, and efficiency. From ute canopies to heavy-duty truck service bodies."
        ctaText="Get Quote"
        ctaLink="/contact"
        showSubtitle={true}
      />

      {/* Category Filter */}
      <Section title="" subtitle="">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Space size="large" wrap>
            {categories.map(category => (
              <Button
                key={category.key}
                type={selectedCategory === category.key ? 'primary' : 'default'}
                size="large"
                onClick={() => setSelectedCategory(category.key)}
                style={{ 
                  borderRadius: '24px',
                  padding: '8px 24px',
                  height: '40px'
                }}
              >
                {category.name}
                <Tag 
                  color={selectedCategory === category.key ? 'white' : 'default'}
                  style={{ marginLeft: 8 }}
                >
                  {category.count}
                </Tag>
              </Button>
            ))}
          </Space>
        </div>
      </Section>

      {/* Services Grid */}
      <Section title="Our Solutions" subtitle="Choose the perfect solution for your needs">
        {filteredServices.length === 0 ? (
          <Empty 
            description="No services found for this category"
            style={{ margin: '48px 0' }}
          />
        ) : (
          <Row gutter={[32, 32]}>
            {filteredServices.map(service => {
              const serviceSubServices = getSubServicesForService(service._id);
              
              return (
                <Col xs={24} lg={12} key={service._id}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    cover={
                      <div style={{ position: 'relative' }}>
                        <Image
                          alt={service.name}
                          src={service.image}
                          style={{ height: 250, objectFit: 'cover' }}
                        />
                        {service.featured && (
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
                    actions={[
                      <Button 
                        type="primary" 
                        key="view" 
                        href={`/${service.category}`}
                        icon={<ArrowRightOutlined />}
                      >
                        View Details
                      </Button>
                    ]}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <Tag color={
                        service.category === 'ute' ? 'blue' : 
                        service.category === 'trailer' ? 'green' : 
                        service.category === 'truck' ? 'orange' : 'purple'
                      }>
                        {service.category.toUpperCase()}
                      </Tag>
                    </div>
                    
                    <Title level={3} style={{ marginBottom: 16 }}>
                      {service.name}
                    </Title>
                    
                    <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                      {service.description}
                    </Paragraph>

                    {serviceSubServices.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>
                          Available Options:
                        </Text>
                        <Space wrap>
                          {serviceSubServices.slice(0, 3).map(sub => (
                            <Tag key={sub._id} color="blue">
                              {sub.name}
                            </Tag>
                          ))}
                          {serviceSubServices.length > 3 && (
                            <Tag color="default">
                              +{serviceSubServices.length - 3} more
                            </Tag>
                          )}
                        </Space>
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: 16
                    }}>
                      <Text type="secondary">
                        {serviceSubServices.length} option{serviceSubServices.length !== 1 ? 's' : ''} available
                      </Text>
                      <Link to={`/${service.category}`}>
                        <Button type="link" icon={<ArrowRightOutlined />}>
                          Explore All Options
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Section>

      {/* Featured Sub-Services */}
      <Section title="Featured Solutions" subtitle="Our most popular and innovative products">
        <Row gutter={[24, 24]}>
          {activeSubServices
            .filter(sub => sub.featured)
            .slice(0, 6)
            .map(subService => (
              <Col xs={24} sm={12} md={8} key={subService._id}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={
                    <Image
                      alt={subService.name}
                      src={subService.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                >
                  <div style={{ marginBottom: 12 }}>
                    <Tag color="blue">{subService.parentServiceName}</Tag>
                    {subService.featured && (
                      <Tag color="gold" style={{ marginLeft: 8 }}>Featured</Tag>
                    )}
                  </div>
                  
                  <Title level={4} style={{ marginBottom: 12 }}>
                    {subService.name}
                  </Title>
                  
                  <Paragraph style={{ marginBottom: 16 }}>
                    {subService.shortDescription}
                  </Paragraph>

                  <div style={{ marginBottom: 16 }}>
                    <Space wrap>
                      {subService.features?.slice(0, 3).map(feature => (
                        <Tag key={feature} icon={<CheckCircleOutlined />} color="green">
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
                      From ${subService.pricing?.base?.toLocaleString()}
                    </Text>
                    <Button type="primary" size="small">
                      Get Quote
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Section>

      {/* CTA Section */}
      <Section title="" subtitle="">
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 24px',
          background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
          borderRadius: 12,
          color: 'white'
        }}>
          <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
            Ready to Get Started?
          </Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32, color: 'white' }}>
            Get a custom quote for your vehicle solution. Our team is ready to help you find the perfect fit.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              href="/contact"
              style={{ 
                background: 'white', 
                color: '#1677ff',
                border: 'none',
                height: '48px',
                padding: '0 32px',
                fontWeight: 'bold'
              }}
            >
              Get Quote
            </Button>
            <Button 
              size="large" 
              href="/inspiration"
              style={{ 
                color: 'white', 
                borderColor: 'white',
                height: '48px',
                padding: '0 32px'
              }}
            >
              View Inspiration Gallery
            </Button>
          </Space>
        </div>
      </Section>
    </div>
  );
}

