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

  // Fetch categories for filtering
  const { data: categories = [] } = useQuery({ 
    queryKey: ['service-categories'], 
    queryFn: async () => (await api.get('/service-categories')).data || []
  });

  // Use API data instead of mock data
  const activeServices = services.filter(s => s.status === 'active') || [];
  const activeSubServices = subServices.filter(s => s.status === 'active') || [];

  // Create category filter options from fetched categories
  const categoryOptions = [
    { key: 'all', name: 'All Services', count: activeServices.length },
    ...categories.map(category => ({
      key: category.slug,
      name: category.name,
      count: activeServices.filter(s => s.category === category.slug).length
    }))
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
             {categoryOptions.map(category => (
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

