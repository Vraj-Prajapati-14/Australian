import { Row, Col, Card, Button, Typography, Space, Divider, Image, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { TruckOutlined, ToolOutlined, CheckCircleOutlined, BuildOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function TruckPage() {
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: async () => (await api.get('/services')).data })

  const truckServices = services?.filter(s => s.category?.includes('truck')) || []

  return (
    <div>
      <Hero
        title="Truck Service Bodies & Canopies"
        subtitle="Heavy-duty solutions engineered for maximum performance and durability. Built different to be light & strong."
        ctaText="Get Quote"
        ctaLink="/contact"
        showSubtitle={true}
      />

      {/* Truck Types */}
      <Section title="Truck Service Body Types" subtitle="Professional solutions for heavy-duty applications">
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
                  <TruckOutlined />
                </div>
              }
            >
              <Title level={3}>Service Body Trucks</Title>
              <Paragraph>
                Heavy-duty service bodies designed for maximum payload and durability. Perfect for demanding industrial applications.
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
                  <BuildOutlined />
                </div>
              }
            >
              <Title level={3}>Crane Mounted</Title>
              <Paragraph>
                Service bodies with integrated crane systems. Handle heavy loads and equipment with precision and safety.
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
              <Title level={3}>Specialized Configurations</Title>
              <Paragraph>
                Custom truck service bodies for specific industries. Tailored solutions that meet your exact requirements.
              </Paragraph>
              <Button type="primary" size="large">
                Learn More
              </Button>
            </Card>
          </Col>
        </Row>
      </Section>

      {/* Key Features */}
      <Section title="Why Choose HIDRIVE Truck Solutions" subtitle="Built different to be light & strong">
        <Row gutter={[32, 32]} style={{ marginTop: 48 }}>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Aircraft-Grade Construction
                </Title>
                <Paragraph>
                  Our aluminium service bodies are engineered using the same techniques as aircraft construction. Polyurethane adhesives and oven bonding ensure years of vibration resistance.
                </Paragraph>
              </div>
              
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Integrated Manufacturing
                </Title>
                <Paragraph>
                  We design, manufacture and install everything in-house. From shelves and benches to towbars and accessories - complete control over quality and delivery.
                </Paragraph>
              </div>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}> 
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  Comprehensive Support
                </Title>
                <Paragraph>
                  National installation network with dedicated customer care. We coordinate with dealers, fleet managers and all stakeholders for seamless delivery.
                </Paragraph>
              </div>
              
              <div>
                <Title level={4}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  GVM Upgrades & Compliance
                </Title>
                <Paragraph>
                  Handle your compliant GVM upgrade, bullbar, towbar and fleet branding. One-stop solution for all your truck modification needs.
                </Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </Section>

      {/* Truck Services */}
      <Section title="Truck Service Solutions" subtitle="Heavy-duty solutions for every industry">
        <Row gutter={[16, 16]}>
          {truckServices.slice(0, 6).map((service) => (
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
                    <TruckOutlined />
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

      {/* Government & Industry */}
      <Section title="Government & Industry Solutions" subtitle="Compliant solutions for demanding applications">
        <Row gutter={[24, 24]} style={{ background: '#f5f5f5', padding: '48px 24px', borderRadius: 12 }}>
          <Col xs={24} md={8}>
            <Title level={4}>Government Fleet</Title>
            <Paragraph>
              Compliant truck service bodies for government operations. Built to meet all standards and requirements.
            </Paragraph>
            <Tag color="blue">ISO Certified</Tag>
            <Tag color="green">Compliant</Tag>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Mining & Construction</Title>
            <Paragraph>
              Heavy-duty solutions for the toughest environments. Built to withstand extreme conditions and heavy loads.
            </Paragraph>
            <Tag color="orange">Heavy-Duty</Tag>
            <Tag color="red">Durable</Tag>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Utility & Service</Title>
            <Paragraph>
              Professional service bodies for utility companies and service providers. Maximum efficiency and reliability.
            </Paragraph>
            <Tag color="purple">Utility</Tag>
            <Tag color="cyan">Service</Tag>
          </Col>
        </Row>
      </Section>

      {/* Finance Section */}
      <Section title="Finance Options" subtitle="Flexible payment solutions for your truck service body">
        <Row gutter={[24, 24]} style={{ background: '#e6f7ff', padding: '48px 24px', borderRadius: 12 }}>
          <Col xs={24} md={16}>
            <Title level={3}>Finance for HIDRIVE Service Bodies</Title>
            <Paragraph style={{ fontSize: 16 }}>
              Now available from $104 per week. Flexible payment terms to suit your business needs and cash flow requirements.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button type="primary" size="large" style={{ height: 56, padding: '0 32px' }}>
              Find Out More
            </Button>
          </Col>
        </Row>
      </Section>

      {/* CTA Section */}
      <Section title="" subtitle="">
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Title level={2}>Ready for Your Heavy-Duty Solution?</Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
            Get a custom quote for your truck service body or canopy.
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