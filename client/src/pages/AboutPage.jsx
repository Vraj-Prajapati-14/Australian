import React, { useEffect, useRef, useState } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Card, 
  Space, 
  Divider, 
  Spin,
  Tabs,
  Avatar,
  Button,
  Tag,
  List
} from 'antd';
import { 
  TeamOutlined, 
  TrophyOutlined, 
  HeartOutlined, 
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  GlobalOutlined,
  CarOutlined,
  BuildOutlined,
  SettingOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import TeamCard from '../components/TeamCard';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function AboutPage() {
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const journeyRef = useRef(null);

  // Intersection Observer for journey steps
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = entry.target.dataset.stepIndex;
            setVisibleSteps(prev => new Set([...prev, stepIndex]));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    const stepElements = document.querySelectorAll('.journey-step');
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const { data: settings, isLoading: settingsLoading } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => (await api.get('/settings')).data 
  });

  const { data: teamData, isLoading: teamLoading } = useQuery({ 
    queryKey: ['team'], 
    queryFn: async () => (await api.get('/team')).data 
  });

  const { data: leadershipData, isLoading: leadershipLoading } = useQuery({ 
    queryKey: ['team-leadership'], 
    queryFn: async () => (await api.get('/team/leadership')).data 
  });

  // Accept both raw array and { data } shape
  const teamMembers = Array.isArray(teamData) ? teamData : (teamData?.data || []);
  const leadershipTeam = Array.isArray(leadershipData) ? leadershipData : (leadershipData?.data || []);

  // Group team members by department
  const teamByDepartment = Array.isArray(teamMembers) ? teamMembers.reduce((acc, member) => {
    const dept = member.department?.name || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {}) : {};

  const departmentTabs = Object.keys(teamByDepartment).map(dept => ({
    key: dept,
    label: dept,
    children: (
      <div style={{ padding: '20px 0' }}>
        <Row gutter={[24, 24]} justify="center">
          {teamByDepartment[dept].map((member) => (
            <Col xs={24} sm={12} md={8} lg={6} key={member._id}>
              <div style={{
                textAlign: 'center',
                padding: '20px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                {/* Profile Image */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  overflow: 'hidden',
                  border: '4px solid #fff',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  position: 'relative'
                }}>
                  {member.avatar?.url || member.image?.url ? (
                    <img 
                      src={member.avatar?.url || member.image?.url} 
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <Avatar 
                      size={120} 
                      icon={<UserOutlined />}
                      style={{ 
                        backgroundColor: '#1677ff',
                        fontSize: '48px'
                      }}
                    />
                  )}
                </div>

                {/* Name */}
                <Title level={4} style={{ 
                  margin: '0 0 8px 0',
                  color: '#1a1a1a',
                  fontWeight: '600'
                }}>
                  {member.name}
                </Title>

                {/* Position */}
                <Text style={{ 
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {member.role || member.position}
                </Text>

                {/* Department Badge */}
                {member.department?.name && (
                  <Tag color="blue" style={{ marginBottom: '12px' }}>
                    {member.department.name}
                  </Tag>
                )}

                {/* Contact Info */}
                <div style={{ marginTop: '12px' }}>
                  {member.email && (
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<MailOutlined />}
                      style={{ color: '#1677ff' }}
                      onClick={() => window.open(`mailto:${member.email}`)}
                    />
                  )}
                  {member.phone && (
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<PhoneOutlined />}
                      style={{ color: '#1677ff' }}
                      onClick={() => window.open(`tel:${member.phone}`)}
                    />
                  )}
                  {member.linkedin && (
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<LinkedinOutlined />}
                      style={{ color: '#1677ff' }}
                      onClick={() => window.open(member.linkedin, '_blank')}
                    />
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  }));

  // Journey Map Data
  const journeySteps = [
    {
      year: '1993',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize the automotive industry with innovative service body solutions',
      icon: '🚀'
    },
    {
      year: '2000',
      title: 'First Major Project',
      description: 'Successfully completed our first large-scale installation project and established national presence',
      icon: '🏆'
    },
    {
      year: '2005',
      title: 'ISO Certification',
      description: 'Achieved ISO 9001 (Quality), ISO 14001 (Environment) and ISO 45001 (Safety) compliance',
      icon: '📈'
    },
    {
      year: '2010',
      title: 'Innovation Hub',
      description: 'Launched our innovation and research division with 190+ modular accessories',
      icon: '💡'
    },
    {
      year: '2015',
      title: 'Digital Transformation',
      description: 'Implemented cutting-edge digital solutions and processes for enhanced customer experience',
      icon: '🌐'
    },
    {
      year: '2023',
      title: 'Industry Leader',
      description: 'Recognized as Australia\'s only manufacturer with company-owned national installation network',
      icon: '👑'
    }
  ];

  // Fit for Purpose Checklist
  const fitForPurposeChecklist = [
    {
      question: 'Is it aluminium?',
      answer: 'for durability, the lowest weight and maximum payload?',
      icon: <CarOutlined />
    },
    {
      question: 'Can you work out of it?',
      answer: 'Gullwing doors that shelter from rain and sun?',
      icon: <ToolOutlined />
    },
    {
      question: 'Will your gear move around?',
      answer: 'How will you fit, organise and tie-down tools and stock?',
      icon: <CheckCircleOutlined />
    },
    {
      question: 'Is it secure?',
      answer: 'e.g. central locking.',
      icon: <SafetyCertificateOutlined />
    },
    {
      question: 'Is your seal on the door?',
      answer: 'Seals around the entrance are easily damaged when loading or unloading, letting in dust/water thereafter.',
      icon: <EnvironmentOutlined />
    },
    {
      question: 'Is it durable?',
      answer: 'A Australian Equipment Solutions will not develop structural cracks or rust.',
      icon: <StarOutlined />
    },
    {
      question: 'Has it got integrated roof, ceiling, wall and underfloor fixing tracks?',
      answer: 'Consider how you\'ll add or move accessories without drilling.',
      icon: <GlobalOutlined />
    },
    {
      question: 'Do your utes look, function and perform consistently?',
      answer: 'Ensure your team has a consistent fleet, nationally.',
      icon: <TeamOutlined />
    },
    {
      question: 'Have you reviewed our 120 accessory groups?',
      answer: 'Ensure your mobile teams are productive.',
      icon: <BuildOutlined />
    },
    {
      question: 'Do you have national safety compliance?',
      answer: 'Be ready for any mining, construction, airport or roadside job.',
      icon: <SecurityScanOutlined />
    }
  ];

  if (settingsLoading || teamLoading || leadershipLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '40px 0'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <Title level={1} style={{ 
            color: 'white', 
            marginBottom: '24px',
            fontSize: '3.5rem',
            fontWeight: '700'
          }}>
            Australian Equipment Solutions: The Hiway
          </Title>
          <Paragraph style={{ 
            fontSize: '1.2rem', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            At Australian Equipment Solutions, sustained success is founded on the principles established in our three pillars: <strong>People, Customers</strong>, and <strong>Quality</strong>. This proven but different approach is what we call <strong>The Hiway</strong>.
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            style={{
              height: '56px',
              padding: '0 40px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              background: 'white',
              color: '#1a1a1a',
              border: 'none',
              marginTop: '32px'
            }}
          >
            Get to know us
          </Button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Stats Section */}
        <Row gutter={[32, 32]} style={{ marginBottom: '80px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{
              textAlign: 'center',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Years Experience</span>}
                value={32}
                prefix={<TrophyOutlined style={{ color: '#ffd700', fontSize: '24px' }} />}
                valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{
              textAlign: 'center',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #2c2c2c 0%, #404040 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Staff Nationwide</span>}
                value={settings?.company?.stats?.staff || 290}
                suffix="+"
                prefix={<HeartOutlined style={{ color: '#ff6b6b', fontSize: '24px' }} />}
                valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{
              textAlign: 'center',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #404040 0%, #555555 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Accessories Available</span>}
                value={190}
                suffix="+"
                prefix={<CheckCircleOutlined style={{ color: '#51cf66', fontSize: '24px' }} />}
                valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{
              textAlign: 'center',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #555555 0%, #666666 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Unique Builds</span>}
                value={settings?.company?.stats?.uniqueBuilds || 24000}
                suffix="+"
                prefix={<TeamOutlined style={{ color: '#ffd700', fontSize: '24px' }} />}
                valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Australian Manufacturing Excellence Section */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            marginBottom: '60px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Australian Manufacturing Excellence
          </Title>
          
          <Row gutter={[48, 48]} style={{ marginBottom: '60px' }}>
            <Col xs={24} md={12}>
              <div style={{ 
                background: 'white', 
                padding: '40px', 
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '100%'
              }}>
                <Title level={3} style={{ color: '#1a1a1a', marginBottom: '24px' }}>
                  Industry Leadership
                </Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#666', marginBottom: '24px' }}>
                  Australian Equipment Solutions is Australia's only manufacturer of service bodies for utes, trailers and trucks with a company-owned national installation network. We build fit-for-purpose aluminium canopies for trades and industry, and we are ISO 9001 (Quality), ISO 14001 (Environment) and ISO 45001 (Safety) compliant.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#666', marginBottom: '24px' }}>
                  Australian Equipment Solutions is vertically integrated, offering over 190 modular and electrical accessories to turn your service body into a truly mobile workspace. These range from shelving, benches, roof storage and drawers, to towbars, inverters, lighting and much more.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#666', marginBottom: '24px' }}>
                  Built like an aircraft fuselage, our light and strong aluminium canopies are engineered to maximise payload and stability, improve fuel efficiency, and be resistant to corrosion, UV damage and vibration.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.7', color: '#666' }}>
                  Our service bodies have been bulletproof in the field since 1993. Through 32 years of continuous improvement, our products have evolved into the high-performance range you see today.
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div style={{ 
                background: 'white', 
                padding: '40px', 
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '100%'
              }}>
                <Title level={3} style={{ color: '#1a1a1a', marginBottom: '24px' }}>
                  Why Choose Us?
                </Title>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={4} style={{ color: '#1a1a1a', marginBottom: '12px' }}>
                      <TrophyOutlined style={{ marginRight: '12px', color: '#fa8c16', fontSize: '18px' }} />
                      Industry Leadership
                    </Title>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      Australia's leading service body manufacturer with a company-owned national installation network.
                    </Paragraph>
                  </div>
                  
                  <div>
                    <Title level={4} style={{ color: '#1a1a1a', marginBottom: '12px' }}>
                      <SafetyCertificateOutlined style={{ marginRight: '12px', color: '#52c41a', fontSize: '18px' }} />
                      Triple ISO Certification
                    </Title>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      ISO 9001 (Quality), ISO 14001 (Environment) and ISO 45001 (Safety) compliant.
                    </Paragraph>
                  </div>
                  
                  <div>
                    <Title level={4} style={{ color: '#1a1a1a', marginBottom: '12px' }}>
                      <ToolOutlined style={{ marginRight: '12px', color: '#1a1a1a', fontSize: '18px' }} />
                      190+ Accessories
                    </Title>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      Comprehensive range of modular and electrical accessories for complete mobile workspace solutions.
                    </Paragraph>
                  </div>
                  
                  <div>
                    <Title level={4} style={{ color: '#1a1a1a', marginBottom: '12px' }}>
                      <StarOutlined style={{ marginRight: '12px', color: '#fa8c16', fontSize: '18px' }} />
                      32 Years of Excellence
                    </Title>
                    <Paragraph style={{ color: '#666', margin: 0 }}>
                      Our service bodies have been bulletproof in the field since 1993, evolving through continuous improvement.
                    </Paragraph>
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        {/* Journey Map Section */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            marginBottom: '60px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Our Journey
          </Title>
          
          <div style={{
            position: 'relative',
            padding: '40px 0'
          }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #333333 100%)',
              transform: 'translateX(-50%)',
              borderRadius: '2px',
              boxShadow: '0 0 20px rgba(26, 26, 26, 0.3)'
            }} />

            {journeySteps.map((step, index) => (
              <div 
                key={index} 
                className="journey-step"
                data-step-index={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '60px',
                  position: 'relative',
                  opacity: visibleSteps.has(index.toString()) ? 1 : 0,
                  transform: visibleSteps.has(index.toString()) ? 'translateY(0)' : 'translateY(50px)',
                  transition: 'all 0.8s ease',
                  transitionDelay: `${index * 0.2}s`
                }}
              >
                {/* Left Side */}
                {index % 2 === 0 && (
                  <>
                    <div style={{ flex: 1, paddingRight: '60px', textAlign: 'right' }}>
                      <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          right: '-12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '12px solid transparent',
                          borderBottom: '12px solid transparent',
                          borderLeft: '12px solid white'
                        }} />
                        <Title level={4} style={{ 
                          color: '#1a1a1a',
                          marginBottom: '8px',
                          fontSize: '1.2rem'
                        }}>
                          {step.year}
                        </Title>
                        <Title level={5} style={{ 
                          marginBottom: '8px',
                          color: '#1a1a1a'
                        }}>
                          {step.title}
                        </Title>
                        <Paragraph style={{ 
                          color: '#666',
                          margin: 0,
                          lineHeight: '1.6'
                        }}>
                          {step.description}
                        </Paragraph>
                      </div>
                    </div>
                    
                    {/* Center Icon */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: 'white',
                      boxShadow: '0 8px 24px rgba(26, 26, 26, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8)',
                      border: '3px solid white',
                      zIndex: 1,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(26, 26, 26, 0.6), 0 0 0 6px rgba(255, 255, 255, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 26, 26, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8)';
                    }}>
                      {step.icon}
                    </div>
                    
                    <div style={{ flex: 1, paddingLeft: '60px' }} />
                  </>
                )}

                {/* Right Side */}
                {index % 2 === 1 && (
                  <>
                    <div style={{ flex: 1, paddingRight: '60px' }} />
                    
                    {/* Center Icon */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: 'white',
                      boxShadow: '0 8px 24px rgba(26, 26, 26, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8)',
                      border: '3px solid white',
                      zIndex: 1,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(26, 26, 26, 0.6), 0 0 0 6px rgba(255, 255, 255, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 26, 26, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.8)';
                    }}>
                      {step.icon}
                    </div>
                    
                    <div style={{ flex: 1, paddingLeft: '60px' }}>
                      <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: '-12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '12px solid transparent',
                          borderBottom: '12px solid transparent',
                          borderRight: '12px solid white'
                        }} />
                        <Title level={4} style={{ 
                          color: '#1a1a1a',
                          marginBottom: '8px',
                          fontSize: '1.2rem'
                        }}>
                          {step.year}
                        </Title>
                        <Title level={5} style={{ 
                          marginBottom: '8px',
                          color: '#1a1a1a'
                        }}>
                          {step.title}
                        </Title>
                        <Paragraph style={{ 
                          color: '#666',
                          margin: 0,
                          lineHeight: '1.6'
                        }}>
                          {step.description}
                        </Paragraph>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fit for Purpose Checklist Section */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Your 10 Point Fit-for-purpose Checklist
          </Title>
          <Paragraph style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Make certain your service body meets all requirements
          </Paragraph>

          <Row gutter={[24, 24]}>
            {fitForPurposeChecklist.map((item, index) => (
              <Col key={index} xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                      color: 'white',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      boxShadow: '0 4px 16px rgba(26, 26, 26, 0.3)'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{ 
                        marginBottom: '8px', 
                        color: '#1a1a1a',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {item.question}
                      </Title>
                      <Paragraph style={{ 
                        color: '#666', 
                        margin: 0,
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {item.answer}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Team Section */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Meet Our Team
          </Title>
          <Paragraph style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Our dedicated team of professionals is committed to delivering exceptional service and innovative solutions.
          </Paragraph>

          {/* Leadership Team */}
          {Array.isArray(leadershipTeam) && leadershipTeam.length > 0 && (
            <div style={{ marginBottom: '60px' }}>
              <Title level={3} style={{ 
                textAlign: 'center', 
                marginBottom: '40px',
                color: '#1a1a1a',
                fontSize: '2rem'
              }}>
                Leadership Team
              </Title>
              <Row gutter={[32, 32]} justify="center">
                {leadershipTeam.map((member) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={member._id}>
                    <div style={{
                      textAlign: 'center',
                      padding: '24px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                      color: 'white',
                      boxShadow: '0 12px 40px rgba(26, 26, 26, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(26, 26, 26, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(26, 26, 26, 0.3)';
                    }}>
                      {/* Leadership Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        LEADERSHIP
                      </div>

                      {/* Profile Image */}
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        overflow: 'hidden',
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        position: 'relative'
                      }}>
                        {member.avatar?.url || member.image?.url ? (
                          <img 
                            src={member.avatar?.url || member.image?.url} 
                            alt={member.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          />
                        ) : (
                          <Avatar 
                            size={120} 
                            icon={<UserOutlined />}
                            style={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              fontSize: '48px'
                            }}
                          />
                        )}
                      </div>

                      {/* Name */}
                      <Title level={4} style={{ 
                        margin: '0 0 8px 0',
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {member.name}
                      </Title>

                      {/* Position */}
                      <Text style={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'block',
                        marginBottom: '12px'
                      }}>
                        {member.role || member.position}
                      </Text>

                      {/* Contact Info */}
                      <div style={{ marginTop: '12px' }}>
                        {member.email && (
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<MailOutlined />}
                            style={{ color: 'white' }}
                            onClick={() => window.open(`mailto:${member.email}`)}
                          />
                        )}
                        {member.phone && (
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<PhoneOutlined />}
                            style={{ color: 'white' }}
                            onClick={() => window.open(`tel:${member.phone}`)}
                          />
                        )}
                        {member.linkedin && (
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<LinkedinOutlined />}
                            style={{ color: 'white' }}
                            onClick={() => window.open(member.linkedin, '_blank')}
                          />
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Department Teams */}
          {departmentTabs.length > 0 && (
            <div>
              <Title level={3} style={{ 
                textAlign: 'center', 
                marginBottom: '40px',
                color: '#1a1a1a',
                fontSize: '2rem'
              }}>
                Our Departments
              </Title>
              <Tabs 
                defaultActiveKey={departmentTabs[0]?.key} 
                centered
                size="large"
                style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                items={departmentTabs}
              />
            </div>
          )}

          {/* Fallback for no team data */}
          {(!Array.isArray(teamMembers) || teamMembers.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <TeamOutlined style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px' }} />
              <Title level={4} style={{ color: '#666' }}>
                Team information coming soon
              </Title>
              <Paragraph style={{ color: '#999' }}>
                We're currently updating our team profiles. Check back soon!
              </Paragraph>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
          padding: '80px 40px',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Title level={2} style={{ color: 'white', marginBottom: '24px', fontSize: '2.5rem' }}>
              Ready to Make Certain?
            </Title>
            <Paragraph style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '40px', color: 'rgba(255,255,255,0.9)' }}>
              Contact our mobile workspace specialists to create a service body that's truly fit for your purpose.
            </Paragraph>
            <Space size="large" wrap>
              <Button 
                type="primary" 
                size="large" 
                href="/contact"
                style={{ 
                  height: '56px', 
                  padding: '0 40px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'white',
                  color: '#1a1a1a',
                  border: 'none'
                }}
              >
                Contact Us
              </Button>
              <Button 
                size="large" 
                href="/services"
                style={{ 
                  height: '56px', 
                  padding: '0 40px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white'
                }}
              >
                Explore Services
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
} 