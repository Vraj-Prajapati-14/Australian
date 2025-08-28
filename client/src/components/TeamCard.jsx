import { Card, Typography, Space, Tag, Button, Avatar } from 'antd';
import { LinkedinOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function TeamCard({ member, variant = 'default' }) {
  const imageUrl = member?.image?.url;
  const isLeadership = member?.isLeadership;

  const renderLeadershipBadge = () => {
    if (!isLeadership) return null;
    return (
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(250, 140, 22, 0.3)'
      }}>
        Leadership
      </div>
    );
  };

  const renderRegionBadge = () => {
    if (!member?.region || member.region === 'National') return null;
    return (
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'rgba(255,255,255,0.9)',
        color: '#1677ff',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        zIndex: 2,
        backdropFilter: 'blur(10px)'
      }}>
        {member.region}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Card
        hoverable
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          height: '100%'
        }}
        bodyStyle={{ padding: '24px' }}
        cover={
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={member.name} 
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
                <Avatar size={80} style={{ background: 'rgba(255,255,255,0.2)' }}>
                  {member.name?.charAt(0)}
                </Avatar>
              </div>
            )}
            {renderLeadershipBadge()}
            {renderRegionBadge()}
          </div>
        }
      >
        <Title level={4} style={{ marginBottom: 8, color: '#1677ff', fontSize: '1.1rem' }}>
          {member.name}
        </Title>
        <Paragraph style={{ 
          color: '#fa8c16', 
          fontWeight: 600, 
          marginBottom: 12,
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {member.position}
        </Paragraph>
        <Paragraph style={{ 
          color: '#666', 
          fontSize: '13px',
          lineHeight: 1.5,
          marginBottom: 16,
          minHeight: '40px'
        }}>
          {member.bio?.slice(0, 80)}...
        </Paragraph>
        
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {member?.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#666' }}>
              <MailOutlined style={{ color: '#1677ff' }} />
              <Text style={{ fontSize: '12px' }}>{member.email}</Text>
            </div>
          )}
          {member?.region && member.region !== 'National' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#666' }}>
              <EnvironmentOutlined style={{ color: '#52c41a' }} />
              <Text style={{ fontSize: '12px' }}>{member.region}</Text>
            </div>
          )}
        </Space>
      </Card>
    );
  }

  return (
    <Card
      hoverable
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        height: '100%',
        background: 'white'
      }}
      bodyStyle={{ padding: 0 }}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={member.name} 
              style={{ 
                height: 280, 
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
              height: 280,
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '4rem'
            }}>
              <Avatar size={120} style={{ background: 'rgba(255,255,255,0.2)' }}>
                {member.name?.charAt(0)}
              </Avatar>
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
          
          {renderLeadershipBadge()}
          {renderRegionBadge()}
        </div>
      }
    >
      <div style={{ padding: '32px' }}>
        {/* Name and Position */}
        <Title level={3} style={{ 
          marginBottom: 8, 
          color: '#1677ff', 
          fontSize: '1.4rem',
          fontWeight: 700
        }}>
          {member.name}
        </Title>
        
        <Paragraph style={{ 
          color: '#fa8c16', 
          fontWeight: 600, 
          marginBottom: 16,
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {member.position}
        </Paragraph>

        {/* Department */}
        <div style={{ marginBottom: 16 }}>
          <Tag 
            color="blue" 
            style={{ 
              borderRadius: '12px', 
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {member.department}
          </Tag>
        </div>

        {/* Bio */}
        <Paragraph style={{ 
          color: '#666', 
          fontSize: '14px',
          lineHeight: 1.6,
          marginBottom: 20,
          minHeight: '60px'
        }}>
          {member.bio}
        </Paragraph>

        {/* Contact Info */}
        <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 20 }}>
          {member?.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '14px' }}>
              <MailOutlined style={{ color: '#1677ff', fontSize: '16px' }} />
              <Text style={{ color: '#666', fontSize: '14px' }}>{member.email}</Text>
            </div>
          )}
          {member?.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '14px' }}>
              <PhoneOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              <Text style={{ color: '#666', fontSize: '14px' }}>{member.phone}</Text>
            </div>
          )}
          {member?.region && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '14px' }}>
              <EnvironmentOutlined style={{ color: '#fa8c16', fontSize: '16px' }} />
              <Text style={{ color: '#666', fontSize: '14px' }}>{member.region}</Text>
            </div>
          )}
        </Space>

        {/* Experience and Specialties */}
        {member?.experience && (
          <div style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: 600, color: '#1677ff', fontSize: '13px' }}>
              Experience:
            </Text>
            <Text style={{ color: '#666', fontSize: '13px', marginLeft: 8 }}>
              {member.experience}
            </Text>
          </div>
        )}

        {/* Specialties */}
        {member?.specialties && member.specialties.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 600, color: '#1677ff', fontSize: '13px', display: 'block', marginBottom: 8 }}>
              Specialties:
            </Text>
            <Space wrap>
              {member.specialties.slice(0, 3).map((specialty, index) => (
                <Tag 
                  key={index}
                  style={{
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: '#f0f8ff',
                    color: '#1677ff',
                    border: '1px solid #d6e4ff'
                  }}
                >
                  {specialty}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {/* Social Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {member?.linkedin && (
            <Button 
              type="primary" 
              size="small"
              icon={<LinkedinOutlined />}
              href={member.linkedin}
              target="_blank"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                background: '#1677ff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(22, 119, 255, 0.2)'
              }}
            >
              Connect
            </Button>
          )}
          
          <div style={{ fontSize: '12px', color: '#999' }}>
            Since {member?.startDate ? new Date(member.startDate).getFullYear() : 'N/A'}
          </div>
        </div>
      </div>
    </Card>
  );
} 