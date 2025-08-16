import { Button, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { PlayCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';

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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      
      {/* Content */}
      <div style={{ 
        position: 'relative', 
        maxWidth: 1200, 
        margin: '0 auto',
        width: '100%',
        padding: '80px 24px'
      }}>
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} lg={16}>
            <div style={{ textAlign: 'left' }}>
              {/* Main Title */}
              <Title 
                level={1} 
                style={{ 
                  color: '#fff', 
                  marginBottom: 24,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
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
                    lineHeight: 1.3
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
                        height: 56,
                        padding: '0 32px',
                        fontSize: 18,
                        fontWeight: 600,
                        borderRadius: 8,
                        background: '#1677ff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
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
                        height: 56,
                        padding: '0 32px',
                        fontSize: 18,
                        fontWeight: 600,
                        borderRadius: 8,
                        background: 'transparent',
                        border: '2px solid #fff',
                        color: '#fff'
                      }}
                    >
                      {secondaryCtaText}
                    </Button>
                  </Link>
                )}
                
                {showVideo && videoUrl && (
                  <Button 
                    size="large"
                    icon={<PlayCircleOutlined />}
                    style={{
                      height: 56,
                      padding: '0 32px',
                      fontSize: 18,
                      fontWeight: 600,
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.1)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      color: '#fff',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Watch Video
                  </Button>
                )}
              </div>
              
              {/* Stats Section */}
              {stats.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: 32, 
                  flexWrap: 'wrap',
                  paddingTop: 32,
                  borderTop: '1px solid rgba(255,255,255,0.2)'
                }}>
                  {stats.map((stat, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: 'bold', 
                        color: '#1677ff',
                        marginBottom: 4
                      }}>
                        {stat.value}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#cde3f9',
                        opacity: 0.8
                      }}>
                        {stat.label}
                      </div>
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
                borderRadius: 12,
                padding: 24,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '100%',
                  height: 200,
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <PlayCircleOutlined style={{ fontSize: 48, color: '#fff' }} />
                </div>
                <Paragraph style={{ 
                  color: '#cde3f9', 
                  marginTop: 16,
                  marginBottom: 0
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
        height: 60,
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 100%)'
      }} />
    </div>
  );
}

