import { Card, Tag, Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function ProjectCard({ project }) {
  const img = project?.heroImage?.url || project?.coverImage?.url;
  const shortDescription = project?.shortDescription || project?.description?.slice(0, 120);
  
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
              alt={project.title} 
              style={{ 
                height: 240, 
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
              height: 240,
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem'
            }}>
              🚛
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
          
          {/* Status badge */}
          {project?.status && (
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: project.status === 'completed' ? '#52c41a' : '#fa8c16',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              {project.status}
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
          {project.title}
        </Title>
        
        {/* Client and Date */}
        <Space style={{ marginBottom: 16, fontSize: '14px', color: '#666' }}>
          {project?.clientName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserOutlined />
              {project.clientName}
            </span>
          )}
          {project?.completionDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarOutlined />
              {new Date(project.completionDate).getFullYear()}
            </span>
          )}
        </Space>
        
        {/* Description */}
        <Paragraph 
          style={{ 
            marginBottom: 20,
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#666',
            minHeight: '44px'
          }}
        >
          {shortDescription}
        </Paragraph>
        
        {/* Tags */}
        <div style={{ marginBottom: 20 }}>
          {(project.tags || []).slice(0, 3).map((tag, index) => (
            <Tag 
              key={index}
              style={{
                marginBottom: '8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                background: '#f0f8ff',
                color: '#1677ff',
                border: '1px solid #d6e4ff'
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
        
        {/* CTA Button */}
        <Link to={`/case-studies/${project.slug}`}>
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
            View Case Study
          </Button>
        </Link>
      </div>
    </Card>
  );
}

