import { Card, Tag, Typography, Button, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined, StarOutlined, ToolOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function ServiceCard({ service }) {
  const img = service?.heroImage?.url;
  const shortDescription = service?.shortDescription || service?.summary?.slice(0, 100);
  
  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease'
      }}
      bodyStyle={{ padding: 0 }}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {img ? (
            <img 
              src={img} 
              alt={service.title} 
              style={{ 
                height: 200, 
                width: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          ) : (
            <div style={{
              height: 200,
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem'
            }}>
              <ToolOutlined style={{ fontSize: '3rem' }} />
            </div>
          )}
          
          {/* Overlay with gradient */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            pointerEvents: 'none'
          }} />
          
          {/* Featured badge */}
          {service?.isFeatured && (
            <div style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: '#fa8c16',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <StarOutlined />
              Featured
            </div>
          )}
          
          {/* Price badge */}
          {service?.pricing?.base && (
            <div style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              background: 'rgba(255,255,255,0.9)',
              color: '#1677ff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              backdropFilter: 'blur(10px)'
            }}>
              From ${service.pricing.base.toLocaleString()}
            </div>
          )}
        </div>
      }
    >
      <div style={{ padding: '24px' }}>
        {/* Title */}
        <Title 
          level={4} 
          style={{ 
            marginBottom: 12,
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: '#1677ff'
          }}
        >
          {service.title}
        </Title>
        
        {/* Description */}
        <Paragraph 
          style={{ 
            marginBottom: 16,
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#666',
            minHeight: '44px'
          }}
        >
          {shortDescription}
        </Paragraph>
        
        {/* Features */}
        {service?.features && service.features.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space wrap>
              {service.features.slice(0, 2).map((feature, index) => (
                <Tag 
                  key={index}
                  style={{
                    marginBottom: '4px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: '#f6ffed',
                    color: '#52c41a',
                    border: '1px solid #b7eb8f'
                  }}
                >
                  {feature}
                </Tag>
              ))}
            </Space>
          </div>
        )}
        
        <Divider style={{ margin: '16px 0' }} />
        
        {/* Bottom section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Installation time */}
          {service?.installationTime && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              ⏱️ {service.installationTime}
            </div>
          )}
          
          {/* CTA Button */}
          <Link to={`/services/${service.slug}`}>
            <Button 
              type="primary" 
              size="small"
              icon={<ArrowRightOutlined />}
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                background: '#1677ff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(22, 119, 255, 0.2)'
              }}
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

