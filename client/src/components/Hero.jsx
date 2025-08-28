import { Button, Typography, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { PlayCircleOutlined, ArrowRightOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Hero({ 
  title, 
  subtitle, 
  backgroundUrl, 
  ctaText, 
  ctaLink, 
  showSubtitle = false,
  showVideo = false,
  videoUrl,
  secondaryCtaText,
  secondaryCtaLink,
  stats = []
}) {
  const bg = backgroundUrl || '';
  
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 0,
        overflow: 'hidden',
        background: bg
          ? `url(${bg}) center/cover no-repeat`
          : 'linear-gradient(135deg, #0b1a27 0%, #0e2436 50%, #163a57 100%)',
        color: '#fff',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Animated Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      {/* Background Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      {/* Content */}
      <div style={{ 
        position: 'relative', 
        maxWidth: 1200, 
        margin: '0 auto',
        width: '100%',
        padding: '100px 24px'
      }}>
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} lg={16}>
            <div style={{ textAlign: 'left' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-block',
                background: 'rgba(22, 119, 255, 0.2)',
                border: '1px solid rgba(22, 119, 255, 0.3)',
                borderRadius: '20px',
                padding: '8px 16px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1677ff',
                backdropFilter: 'blur(10px)'
              }}>
                Ute canopies INSTALLED in 4 Weeks
              </div>
              
              {/* Main Title */}
              <Title 
                level={1} 
                style={{ 
                  color: '#fff', 
                  marginBottom: 24,
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.02em'
                }}
              >
                {title}
              </Title>
              
              {/* Subtitle */}
              {showSubtitle && subtitle && (
                <Title 
                  level={2} 
                  style={{ 
                    color: '#cde3f9', 
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                    marginBottom: 40,
                    fontWeight: 400,
                    opacity: 0.9,
                    lineHeight: 1.4
                  }}
                >
                  {subtitle}
                </Title>
              )}
              
              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
                {ctaText && ctaLink && (
                  <Link to={ctaLink}>
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<ArrowRightOutlined />}
                      style={{
                        height: 60,
                        padding: '0 40px',
                        fontSize: 18,
                        fontWeight: 600,
                        borderRadius: 12,
                        background: '#1677ff',
                        border: 'none',
                        boxShadow: '0 8px 24px rgba(22, 119, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 32px rgba(22, 119, 255, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 24px rgba(22, 119, 255, 0.3)';
                      }}
                    >
                      {ctaText}
                    </Button>
                  </Link>
                )}
                
                {secondaryCtaText && secondaryCtaLink && (
                  <Link to={secondaryCtaLink}>
                    <Button 
                      size="large"
                      style={{
                        height: 60,
                        padding: '0 40px',
                        fontSize: 18,
                        fontWeight: 600,
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                      }}
                    >
                      {secondaryCtaText}
                    </Button>
                  </Link>
                )}
                
                {/* Phone CTA */}
                <Button 
                  size="large"
                  icon={<PhoneOutlined />}
                  style={{
                    height: 60,
                    padding: '0 32px',
                    fontSize: 18,
                    fontWeight: 600,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: '#fff',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  1300 368 161
                </Button>
              </div>
              
              {/* Stats Section */}
              {stats.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: 48, 
                  flexWrap: 'wrap',
                  paddingTop: 40,
                  borderTop: '1px solid rgba(255,255,255,0.2)'
                }}>
                  {stats.map((stat, index) => (
                    <div key={index} style={{ textAlign: 'left' }}>
                      <Statistic
                        title={<span style={{ 
                          color: '#cde3f9', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          opacity: 0.8
                        }}>{stat.label}</span>}
                        value={stat.value}
                        valueStyle={{ 
                          color: '#1677ff', 
                          fontSize: '2.5rem', 
                          fontWeight: 'bold',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
          
          {/* Right Column for Video or Image */}
          {showVideo && videoUrl && (
            <Col xs={24} lg={8}>
              <div style={{ 
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 32,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '100%',
                  height: 240,
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                  <PlayCircleOutlined style={{ 
                    fontSize: 64, 
                    color: '#fff',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }} />
                </div>
                <Paragraph style={{ 
                  color: '#cde3f9', 
                  marginTop: 20,
                  marginBottom: 0,
                  fontSize: '16px',
                  fontWeight: 500
                }}>
                  See how our service bodies work
                </Paragraph>
              </div>
            </Col>
          )}
        </Row>
      </div>
      
      {/* Bottom Wave Effect */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)'
      }} />
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

