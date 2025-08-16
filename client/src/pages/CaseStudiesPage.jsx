import { Row, Col, Card, Button, Typography, Space, Avatar, Tag, Image } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { UserOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function CaseStudiesPage() {
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: async () => (await api.get('/projects')).data })

  const caseStudies = [
    {
      id: 1,
      title: "EMS Field Mechanic Fleet",
      company: "Elphinstone Mechanical Services",
      description: "EMS collaborated with HIDRIVE to design and manufacture our fleet of fit-for-purpose ute and truck service bodies, making life easier and more productive for our mechanical services team every day.",
      testimonial: "One of the reasons why mechanics join and stay at EMS is the gear we get to use, especially the vehicles. We couldn't be any happier with the HIDRIVE service bodies on our trucks and utes, they're so much easier and safer to work with.",
      author: "Alex",
      role: "Mechanic",
      image: "/ems-case-study.jpg",
      tags: ["Fleet", "Mechanical", "Ute", "Truck"]
    },
    {
      id: 2,
      title: "Modinex Ute Fleet",
      company: "Modinex",
      description: "Modinex trusted HIDRIVE to design and manufacture a fleet of premium, fit-for-purpose ute service bodies for the sales team.",
      testimonial: "We chose HIDRIVE because we're a premium Australian-made brand in our market – just like HIDRIVE. People see our utes before they see our samples and our staff, so our fleet has to look the part, inside and out.",
      author: "Leroy Parker",
      role: "Sales Director",
      image: "/modinex-case-study.jpg",
      tags: ["Fleet", "Sales", "Ute", "Premium"]
    },
    {
      id: 3,
      title: "Gecko Cleantech Spills Trailer",
      company: "Gecko Cleantech",
      description: "HIDRIVE collaborated with Gecko Cleantech to design and deliver a tailored spills cleanup trailer to keep airport runways (and passengers) safe at a busy Australia airport.",
      testimonial: "There are many great things about this HIDRIVE Trailer…you can move the shelves up and down, left and right, you can set it up however you want. And when the doors are open the weather seal stops the rain from coming in and wetting absorbent products.",
      author: "Gecko Team",
      role: "Operations",
      image: "/gecko-case-study.jpg",
      tags: ["Trailer", "Specialized", "Airport", "Safety"]
    },
    {
      id: 4,
      title: "Canberra Pest Control Fleet",
      company: "Canberra Pest Control",
      description: "Canberra Pest Control has had HIDRIVE build all our new vehicle service bodies for the last 3 years. The quality of the product is second to none and the after-sales service continues well after the vehicles are delivered.",
      testimonial: "I highly recommend HIDRIVE and will continue to use their products and services for many years to come.",
      author: "Bernard Dunne",
      role: "Pest Control Expert",
      image: "/canberra-pest-case-study.jpg",
      tags: ["Fleet", "Pest Control", "Service", "Quality"]
    },
    {
      id: 5,
      title: "Cummins South Pacific",
      company: "Cummins South Pacific",
      description: "Leading fleet managers and trade businesses make certain with HIDRIVE. For the same reasons you choose a leading vehicle brand, choose a HIDRIVE service body.",
      testimonial: "In my opinion they are leaders in their field when it comes to the quality and durability of their product, technical expertise, national coverage capability, competitive pricing and account management. They also provide strong after sales support and warranty work without any issues.",
      author: "Lorna Toynton",
      role: "Vehicle Management & Benefits Coordinator",
      image: "/cummins-case-study.jpg",
      tags: ["Fleet", "Management", "Corporate", "Support"]
    }
  ]

  return (
    <div>
      <Hero
        title="Case Studies & Success Stories"
        subtitle="See how leading fleet managers & trade businesses make certain with HIDRIVE"
        ctaText="View Inspiration Gallery"
        ctaLink="/inspiration"
        showSubtitle={true}
      />

      {/* Featured Case Studies */}
      <Section title="Featured Case Studies" subtitle="Real stories from real customers">
        <Row gutter={[24, 24]}>
          {caseStudies.slice(0, 3).map((study) => (
            <Col key={study.id} xs={24} md={8}>
              <Card 
                hoverable
                style={{ height: '100%' }}
                cover={
                  <div style={{ 
                    height: 200, 
                    background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 48
                  }}>
                    <UserOutlined />
                  </div>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  {study.tags.map((tag, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Title level={4}>{study.title}</Title>
                <Text strong style={{ color: '#1677ff' }}>{study.company}</Text>
                <Paragraph style={{ marginTop: 8 }}>
                  {study.description}
                </Paragraph>
                <div style={{ 
                  background: '#f5f5f5', 
                  padding: 16, 
                  borderRadius: 8, 
                  marginTop: 16,
                  borderLeft: '4px solid #1677ff'
                }}>
                  <Paragraph style={{ fontStyle: 'italic', margin: 0 }}>
                    "{study.testimonial}"
                  </Paragraph>
                  <div style={{ marginTop: 12 }}>
                    <Text strong>{study.author}</Text>
                    <br />
                    <Text type="secondary">{study.role}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* All Case Studies */}
      <Section title="All Case Studies" subtitle="Browse our complete collection of success stories">
        <Row gutter={[16, 16]}>
          {caseStudies.map((study) => (
            <Col key={study.id} xs={24} md={12}>
              <Card 
                hoverable
                style={{ height: '100%' }}
                cover={
                  <div style={{ 
                    height: 200, 
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 48
                  }}>
                    <UserOutlined />
                  </div>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  {study.tags.map((tag, index) => (
                    <Tag key={index} color="green" style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Title level={4}>{study.title}</Title>
                <Text strong style={{ color: '#52c41a' }}>{study.company}</Text>
                <Paragraph style={{ marginTop: 8 }}>
                  {study.description}
                </Paragraph>
                <div style={{ 
                  background: '#f6ffed', 
                  padding: 16, 
                  borderRadius: 8, 
                  marginTop: 16,
                  borderLeft: '4px solid #52c41a'
                }}>
                  <Paragraph style={{ fontStyle: 'italic', margin: 0 }}>
                    "{study.testimonial}"
                  </Paragraph>
                  <div style={{ marginTop: 12 }}>
                    <Text strong>{study.author}</Text>
                    <br />
                    <Text type="secondary">{study.role}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Section>

      {/* Why Choose Section */}
      <Section title="Why Leading Businesses Choose HIDRIVE" subtitle="The same reasons you choose a leading vehicle brand">
        <Row gutter={[32, 32]} style={{ background: '#f5f5f5', padding: '48px 24px', borderRadius: 12 }}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <Title level={4}>Quality & Durability</Title>
              <Paragraph>
                Industry-leading quality with 36-month structural & corrosion warranty. Built to last in the toughest conditions.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <StarOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
              <Title level={4}>Technical Expertise</Title>
              <Paragraph>
                Decades of experience in mobile workspace design. Over 24,000 unique builds across every trade and industry.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>National Support</Title>
              <Paragraph>
                Company-owned national installation network. Faster lead times, seamless servicing, and reliable spare parts.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Section>

      {/* CTA Section */}
      <Section title="" subtitle="">
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Title level={2}>Ready to Join Our Success Stories?</Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
            Start your journey with HIDRIVE and experience the difference that quality, expertise, and support make.
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" href="/contact">
              Get Started
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