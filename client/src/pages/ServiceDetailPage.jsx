import { Typography, Row, Col, Card, Image, Space, Tag, Button, Divider } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';

const { Title, Paragraph, Text } = Typography;

export default function ServiceDetailPage() {
  const { slug, subSlug } = useParams();
  
  // If we have both slug and subSlug, we're viewing a sub-service
  const isSubService = subSlug;
  const serviceSlug = isSubService ? subSlug : slug;
  
  const { data: service, isLoading } = useQuery({ 
    queryKey: ['service', serviceSlug], 
    queryFn: async () => (await api.get(`/services/${serviceSlug}`)).data 
  });

  const { data: parentService } = useQuery({ 
    queryKey: ['service', slug], 
    queryFn: async () => (await api.get(`/services/${slug}`)).data,
    enabled: isSubService // Only fetch parent service if we're viewing a sub-service
  });

  if (isLoading) return <div>Loading...</div>;
  if (!service) return <div>Service not found</div>;

  return (
    <div>
      {/* Breadcrumb navigation for sub-services */}
      {isSubService && parentService && (
        <div style={{ padding: '16px 24px', background: '#f5f5f5' }}>
          <Space>
            <Link to="/services">
              <Button type="text" icon={<ArrowLeftOutlined />}>
                All Services
              </Button>
            </Link>
            <Text>/</Text>
            <Link to={`/services/${slug}`}>
              <Button type="text">{parentService.title}</Button>
            </Link>
            <Text>/</Text>
            <Text strong>{service.title}</Text>
          </Space>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        title={service.title}
        subtitle={service.shortDescription || service.summary}
        backgroundImage={service.heroImage?.url}
        showOverlay={true}
      />

      <Section>
        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Service Overview */}
            <Card style={{ marginBottom: 24 }}>
              <Title level={2} style={{ marginBottom: 16 }}>
                {isSubService ? 'Service Details' : 'Overview'}
              </Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                {service.summary}
              </Paragraph>
              {service.content && (
                <div 
                  dangerouslySetInnerHTML={{ __html: service.content }} 
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <Card style={{ marginBottom: 24 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                  Key Features
                </Title>
                <Row gutter={[16, 16]}>
                  {service.features.map((feature, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>{feature}</Text>
                      </Space>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* Specifications */}
            {service.specifications && (
              <Card style={{ marginBottom: 24 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                  Specifications
                </Title>
                <Row gutter={[16, 16]}>
                  {Object.entries(service.specifications).map(([key, value]) => (
                    value && (
                      <Col xs={24} sm={12} key={key}>
                        <div>
                          <Text strong style={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </Text>
                          <br />
                          <Text>{value}</Text>
                        </div>
                      </Col>
                    )
                  ))}
                </Row>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Pricing Card */}
            {service.pricing && (
              <Card style={{ marginBottom: 24 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                  Pricing
                </Title>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1677ff' }}>
                    ${service.pricing.base?.toLocaleString()}
                  </Text>
                  <br />
                  <Text type="secondary">Starting Price</Text>
                </div>
                {service.pricing.includes && service.pricing.includes.length > 0 && (
                  <div>
                    <Text strong>Includes:</Text>
                    <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                      {service.pricing.includes.map((item, index) => (
                        <li key={index}>
                          <Text>{item}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button type="primary" block size="large" style={{ marginTop: 16 }}>
                  Get Quote
                </Button>
              </Card>
            )}

            {/* Contact Card */}
            <Card>
              <Title level={4} style={{ marginBottom: 16 }}>
                Need Help?
              </Title>
              <Paragraph>
                Our team is here to help you find the perfect solution for your needs.
              </Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block>
                  Contact Sales
                </Button>
                <Button block>
                  Request Demo
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Sub-services for main services */}
        {!isSubService && service.subServices && service.subServices.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <Divider />
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
              Related Services
            </Title>
            <Row gutter={[24, 24]}>
              {service.subServices
                .filter(sub => sub.status === 'active')
                .map(subService => (
                  <Col xs={24} sm={12} lg={8} key={subService._id}>
                    <Card
                      hoverable
                      cover={
                        subService.heroImage?.url && (
                          <Image
                            alt={subService.heroImage.alt || subService.title}
                            src={subService.heroImage.url}
                            height={200}
                            style={{ objectFit: 'cover' }}
                          />
                        )
                      }
                    >
                      <Card.Meta
                        title={subService.title}
                        description={subService.shortDescription}
                      />
                      <div style={{ marginTop: 16 }}>
                        <Link to={`/services/${slug}/${subService.slug}`}>
                          <Button type="primary">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        )}
      </Section>
    </div>
  );
}

