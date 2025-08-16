import { Row, Col, Card, Button, Typography, Space, Divider, Statistic } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import { 
  CarOutlined, 
  TruckOutlined, 
  StarOutlined, 
  CheckCircleOutlined, 
  ContainerOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ToolOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: async () => (await api.get('/settings')).data })
  const { data: mainServices } = useQuery({ queryKey: ['mainServices'], queryFn: async () => (await api.get('/services/main')).data })
  const { data: featuredServices } = useQuery({ queryKey: ['featuredServices'], queryFn: async () => (await api.get('/services/featured')).data })
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: async () => (await api.get('/projects')).data })

  const hero = settings?.hero || {}

  const heroStats = [
    { value: '290+', label: 'STAFF' },
    { value: '2000+', label: 'TAILORED VEHICLES PER YEAR' },
    { value: '36', label: 'MONTH WARRANTY' },
    { value: '24,000+', label: 'UNIQUE BUILDS' }
  ];

  return (
    <div>
      <Hero
        title="Service bodies & Canopies for Utes, trailers & trucks"
        subtitle="Fit-for-purpose. On time. Nationally."
        backgroundUrl={hero?.background?.url}
        ctaText="Explore Services"
        ctaLink="/services"
        secondaryCtaText="View Case Studies"
        secondaryCtaLink="/case-studies"
        showSubtitle={true}
        showVideo={true}
        videoUrl="https://example.com/video"
        stats={heroStats}
      />

      {/* Vehicle Type Showcase */}
      <Section title="Choose Your Vehicle Type" subtitle="Professional service bodies designed for your specific needs">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center', 
                height: '100%',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)', 
                  height: 240, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 80,
                  borderRadius: '12px 12px 0 0'
                }}>
                  <CarOutlined />
                </div>
              }
            >
              <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>Ute Canopies</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                Lightweight, durable canopies installed in 4 weeks. Maximize payload without compromise.
              </Paragraph>
              <Button 
                type="primary" 
                size="large" 
                href="/ute"
                style={{ 
                  height: 48, 
                  padding: '0 32px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                Explore Ute Solutions
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center', 
                height: '100%',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', 
                  height: 240, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 80,
                  borderRadius: '12px 12px 0 0'
                }}>
                  <ContainerOutlined />
                </div>
              }
            >
              <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>Trailer Service Bodies</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                Versatile trailer solutions with customizable configurations for any industry.
              </Paragraph>
              <Button 
                type="primary" 
                size="large" 
                href="/trailer"
                style={{ 
                  height: 48, 
                  padding: '0 32px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                Explore Trailer Solutions
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center', 
                height: '100%',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)', 
                  height: 240, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 80,
                  borderRadius: '12px 12px 0 0'
                }}>
                  <TruckOutlined />
                </div>
              }
            >
              <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>Truck Service Bodies</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                Heavy-duty service bodies engineered for maximum durability and functionality.
              </Paragraph>
              <Button 
                type="primary" 
                size="large" 
                href="/truck"
                style={{ 
                  height: 48, 
                  padding: '0 32px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600
                }}
              >
                Explore Truck Solutions
              </Button>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Why Choose Section */}
      <Section 
        title="Why Choose HIDRIVE" 
        subtitle="Industry-leading quality and innovation"
        style={{ background: '#f8f9fa' }}
      >
        <Row gutter={[48, 48]} style={{ marginTop: 48 }}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ 
                background: 'white', 
                padding: 32, 
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 12, fontSize: 20 }} />
                  Maximise Payload Without Compromise
                </Title>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  Our co-bonded aluminium canopies are among the lightest on the market, allowing you to carry more gear while staying within GVM limits. Engineered for strength, durability, and functionality.
                </Paragraph>
              </div>
              
              <div style={{ 
                background: 'white', 
                padding: 32, 
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  <ToolOutlined style={{ color: '#1677ff', marginRight: 12, fontSize: 20 }} />
                  Tailored to Your Needs
                </Title>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  Whatever your trade or industry, we work with you to create your ideal mobile workspace. Our service bodies are engineered specifically for your vehicle make and model.
                </Paragraph>
              </div>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ 
                background: 'white', 
                padding: 32, 
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  <GlobalOutlined style={{ color: '#52c41a', marginRight: 12, fontSize: 20 }} />
                  Nationwide Installation & Support
                </Title>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  HIDRIVE is Australia's only service body manufacturer with a company-owned national installation network. This means faster lead times, seamless servicing, and reliable spare parts availability.
                </Paragraph>
              </div>
              
              <div style={{ 
                background: 'white', 
                padding: 32, 
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  <SafetyCertificateOutlined style={{ color: '#1677ff', marginRight: 12, fontSize: 20 }} />
                  Built to Perform, Designed to Last
                </Title>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                  Choose HIDRIVE to make certain your fleet is fit for your purpose and built for durability and performance — keeping your team organised, productive, and ready for every job.
                </Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </Section>

      {/* Stats Section */}
      <Section title="" subtitle="">
        <Row gutter={[32, 32]} style={{ 
          background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)', 
          padding: '64px 32px', 
          borderRadius: 16,
          color: 'white'
        }}>
          <Col xs={12} md={6} style={{ textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>STAFF</span>}
              value={290}
              suffix="+"
              valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={12} md={6} style={{ textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>TAILORED VEHICLES PER YEAR</span>}
              value={2000}
              suffix="+"
              valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={12} md={6} style={{ textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>MONTH WARRANTY</span>}
              value={36}
              valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
            />
          </Col>
          <Col xs={12} md={6} style={{ textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>UNIQUE BUILDS</span>}
              value={24000}
              suffix="+"
              valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
            />
          </Col>
        </Row>
      </Section>

      {/* Featured Services */}
      <Section title="Featured Services" subtitle="Tailored, fit-for-purpose solutions for every trade and industry.">
        <Row gutter={[24, 24]}>
          {(featuredServices || []).slice(0, 6).map((service) => (
            <Col key={service._id} xs={24} sm={12} md={8}>
              <ServiceCard service={service} />
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Button 
            type="primary" 
            size="large" 
            href="/services"
            style={{ 
              height: 56, 
              padding: '0 40px',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600
            }}
          >
            View All Services
          </Button>
        </div>
      </Section>

      {/* Case Studies Preview */}
      <Section 
        title="Success Stories" 
        subtitle="See how we help teams stay organised, productive and ready for every job."
        style={{ background: '#f8f9fa' }}
      >
        <Row gutter={[24, 24]}>
          {(projects || []).slice(0, 3).map((project) => (
            <Col key={project._id} xs={24} md={8}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Button 
            type="primary" 
            size="large" 
            href="/case-studies"
            style={{ 
              height: 56, 
              padding: '0 40px',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600
            }}
          >
            View All Case Studies
          </Button>
        </div>
      </Section>

      {/* Process Section */}
      <Section title="Our Process" subtitle="From consultation to installation, we make it simple">
        <Row gutter={[32, 32]} style={{ marginTop: 48 }}>
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#1677ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold'
              }}>
                1
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>We Listen</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                We understand your needs and requirements to create the perfect solution.
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#52c41a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold'
              }}>
                2
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>We Design</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                Our experts design your custom service body with precision and care.
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#fa8c16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold'
              }}>
                3
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>We Build</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                Quality manufacturing using the latest technology and materials.
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} md={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#722ed1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold'
              }}>
                4
              </div>
              <Title level={4} style={{ marginBottom: 16 }}>We Install</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                Professional installation by our certified technicians nationwide.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Section>
    </div>
  );
}

