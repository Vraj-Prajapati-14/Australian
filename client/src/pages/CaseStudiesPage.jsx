import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Avatar, 
  Tag, 
  Image, 
  Carousel,
  Spin,
  Divider,
  Statistic
} from 'antd';
import { 
  useQuery 
} from '@tanstack/react-query';
import { 
  UserOutlined, 
  StarOutlined, 
  CheckCircleOutlined,
  TrophyOutlined,
  HeartOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { api } from '../lib/api';

const { Title, Paragraph, Text } = Typography;

export default function CaseStudiesPage() {
  // Fetch case studies from database
  const { data: caseStudiesData, isLoading: caseStudiesLoading } = useQuery({ 
    queryKey: ['case-studies'], 
    queryFn: async () => (await api.get('/case-studies')).data 
  });

  // Fetch featured case studies
  const { data: featuredData, isLoading: featuredLoading } = useQuery({ 
    queryKey: ['case-studies-featured'], 
    queryFn: async () => (await api.get('/case-studies?featured=true')).data 
  });

  const caseStudies = caseStudiesData?.data || [];
  const featuredCaseStudies = featuredData?.data || [];

  if (caseStudiesLoading || featuredLoading) {
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
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
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
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <Title level={1} style={{ 
            color: 'white', 
            marginBottom: '24px',
            fontSize: '3.5rem',
            fontWeight: '700'
          }}>
            Case Studies & Success Stories
          </Title>
          <Paragraph style={{ 
            fontSize: '1.2rem', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            See how leading fleet managers & trade businesses make certain with Australian Equipment Solutions
          </Paragraph>
          <Space size="large" style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              size="large"
              href="/inspiration"
              style={{
                height: '56px',
                padding: '0 40px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '12px',
                background: 'white',
                color: '#667eea',
                border: 'none'
              }}
            >
              View Inspiration Gallery
            </Button>
            <Button 
              size="large"
              href="/contact"
              style={{
                height: '56px',
                padding: '0 40px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '12px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white'
              }}
            >
              Start Your Project
            </Button>
          </Space>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Stats Section */}
        <Row gutter={[32, 32]} style={{ margin: '60px 0' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{
              textAlign: 'center',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Case Studies</span>}
                value={caseStudies.length}
                prefix={<TrophyOutlined style={{ color: '#ffd700' }} />}
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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Happy Clients</span>}
                value={caseStudies.length * 2}
                suffix="+"
                prefix={<HeartOutlined style={{ color: '#ff6b6b' }} />}
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
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Vehicles Upgraded</span>}
                value={caseStudies.reduce((sum, study) => sum + (study.results?.vehiclesUpgraded || 0), 0)}
                suffix="+"
                prefix={<TeamOutlined style={{ color: '#51cf66' }} />}
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
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white'
            }}>
              <Statistic
                title={<span style={{ color: 'white', fontSize: '16px' }}>Years Experience</span>}
                value={32}
                prefix={<CheckCircleOutlined style={{ color: '#ffd700' }} />}
                valueStyle={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Featured Case Studies Carousel */}
        {featuredCaseStudies.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <Title level={2} style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1a1a1a'
            }}>
              Featured Case Studies
            </Title>
            <Paragraph style={{ 
              textAlign: 'center', 
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '60px',
              maxWidth: '800px',
              margin: '0 auto 60px'
            }}>
              Real stories from real customers who trust Australian Equipment Solutions
            </Paragraph>

            <Carousel
              autoplay
              dots={{ position: 'bottom' }}
              style={{ marginBottom: '40px' }}
              dotPosition="bottom"
            >
              {featuredCaseStudies.map((study) => (
                <div key={study._id}>
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    margin: '0 20px'
                  }}>
                    <Row gutter={0}>
                      <Col xs={24} md={12}>
                        <div style={{
                          height: '400px',
                          background: study.heroImage?.url 
                            ? `url(${study.heroImage.url}) center/cover`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          {!study.heroImage?.url && (
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '50%',
                              width: '120px',
                              height: '120px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '48px',
                              color: 'white'
                            }}>
                              <UserOutlined />
                            </div>
                          )}
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#667eea'
                          }}>
                            FEATURED
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div style={{ padding: '40px' }}>
                          <div style={{ marginBottom: '20px' }}>
                            {study.tags?.map((tag, index) => (
                              <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>
                                {tag}
                              </Tag>
                            ))}
                          </div>
                          <Title level={3} style={{ 
                            marginBottom: '12px',
                            color: '#1a1a1a',
                            fontSize: '1.8rem'
                          }}>
                            {study.title}
                          </Title>
                          <Text strong style={{ 
                            color: '#667eea',
                            fontSize: '16px',
                            display: 'block',
                            marginBottom: '16px'
                          }}>
                            {study.clientName}
                          </Text>
                          <Paragraph style={{ 
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#666',
                            marginBottom: '24px'
                          }}>
                            {study.shortDescription || study.description}
                          </Paragraph>
                          
                          {study.results && (
                            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                              {study.results.vehiclesUpgraded && (
                                <Col span={8}>
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                      {study.results.vehiclesUpgraded}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>Vehicles</div>
                                  </div>
                                </Col>
                              )}
                              {study.results.costSavings && (
                                <Col span={8}>
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                      ${study.results.costSavings}k
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>Saved</div>
                                  </div>
                                </Col>
                              )}
                              {study.results.efficiencyImprovement && (
                                <Col span={8}>
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                                      {study.results.efficiencyImprovement}%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>Efficiency</div>
                                  </div>
                                </Col>
                              )}
                            </Row>
                          )}

                          {study.testimonial && (
                            <div style={{ 
                              background: '#f8f9fa', 
                              padding: '20px', 
                              borderRadius: '12px',
                              borderLeft: '4px solid #667eea',
                              marginBottom: '24px'
                            }}>
                              <Paragraph style={{ 
                                fontStyle: 'italic', 
                                margin: 0,
                                fontSize: '14px',
                                color: '#666'
                              }}>
                                "{study.testimonial}"
                              </Paragraph>
                            </div>
                          )}

                          <Button 
                            type="primary" 
                            size="large"
                            href={`/case-studies/${study.slug}`}
                            style={{
                              height: '48px',
                              padding: '0 32px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              fontWeight: '600'
                            }}
                          >
                            Read Full Story
                            <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* All Case Studies Grid */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            All Case Studies
          </Title>
          <Paragraph style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Browse our complete collection of success stories
          </Paragraph>

          <Row gutter={[32, 32]}>
            {caseStudies.map((study) => (
              <Col key={study._id} xs={24} md={12} lg={8}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                  cover={
                    <div style={{
                      height: '200px',
                      background: study.heroImage?.url 
                        ? `url(${study.heroImage.url}) center/cover`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {!study.heroImage?.url && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '50%',
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          color: 'white'
                        }}>
                          <UserOutlined />
                        </div>
                      )}
                      {study.isFeatured && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#667eea'
                        }}>
                          FEATURED
                        </div>
                      )}
                    </div>
                  }
                >
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      {study.tags?.slice(0, 3).map((tag, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    
                    <Title level={4} style={{ 
                      marginBottom: '8px',
                      color: '#1a1a1a',
                      fontSize: '18px',
                      lineHeight: '1.4'
                    }}>
                      {study.title}
                    </Title>
                    
                    <Text strong style={{ 
                      color: '#667eea',
                      fontSize: '14px',
                      display: 'block',
                      marginBottom: '12px'
                    }}>
                      {study.clientName}
                    </Text>
                    
                    <Paragraph style={{ 
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#666',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {study.shortDescription || study.description}
                    </Paragraph>

                    {study.completionDate && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '16px',
                        color: '#999',
                        fontSize: '12px'
                      }}>
                        <CalendarOutlined style={{ marginRight: '4px' }} />
                        Completed {new Date(study.completionDate).getFullYear()}
                      </div>
                    )}

                    <Button 
                      type="primary" 
                      size="small"
                      href={`/case-studies/${study.slug}`}
                      style={{
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Read More
                      <ArrowRightOutlined style={{ marginLeft: '4px' }} />
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Why Choose Section */}
        <div style={{ marginBottom: '80px' }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Why Leading Businesses Choose Australian Equipment Solutions
          </Title>
          <Paragraph style={{ 
            textAlign: 'center', 
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            The same reasons you choose a leading vehicle brand
          </Paragraph>

          <Row gutter={[32, 32]} style={{ 
            background: 'white', 
            padding: '48px', 
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px',
                  color: 'white'
                }}>
                  <CheckCircleOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '16px', color: '#1a1a1a' }}>
                  Quality & Durability
                </Title>
                <Paragraph style={{ color: '#666', lineHeight: '1.6' }}>
                  Industry-leading quality with 36-month structural & corrosion warranty. Built to last in the toughest conditions.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px',
                  color: 'white'
                }}>
                  <StarOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '16px', color: '#1a1a1a' }}>
                  Technical Expertise
                </Title>
                <Paragraph style={{ color: '#666', lineHeight: '1.6' }}>
                  Decades of experience in mobile workspace design. Over 24,000 unique builds across every trade and industry.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '32px',
                  color: 'white'
                }}>
                  <EnvironmentOutlined />
                </div>
                <Title level={4} style={{ marginBottom: '16px', color: '#1a1a1a' }}>
                  National Support
                </Title>
                <Paragraph style={{ color: '#666', lineHeight: '1.6' }}>
                  Company-owned national installation network. Faster lead times, seamless servicing, and reliable spare parts.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              Ready to Join Our Success Stories?
            </Title>
            <Paragraph style={{ 
              fontSize: '18px', 
              lineHeight: '1.6', 
              marginBottom: '40px', 
              color: 'rgba(255,255,255,0.9)' 
            }}>
              Start your journey with Australian Equipment Solutions and experience the difference that quality, expertise, and support make.
            </Paragraph>
            <Space size="large" wrap>
              <Button 
                type="primary" 
                size="large" 
                href="/contact"
                style={{ 
                  height: '56px', 
                  padding: '0 40px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'white',
                  color: '#667eea',
                  border: 'none'
                }}
              >
                Get Started
              </Button>
              <Button 
                size="large" 
                href="/inspiration"
                style={{ 
                  height: '56px', 
                  padding: '0 40px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white'
                }}
              >
                View Inspiration Gallery
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
} 