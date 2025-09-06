import React from 'react';
import { Card, Button, Tag, Typography, Space } from 'antd';
import { ArrowRightOutlined, StarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

const ServiceCard = ({ 
  service, 
  variant = 'default',
  showImage = true,
  showDescription = true,
  showFeatures = false,
  showStats = false,
  className = ''
}) => {
  const {
    _id,
    name,
    title,
    description,
    shortDescription,
    image,
    heroImage,
    category,
    features = [],
    isFeatured = false,
    slug,
    duration,
    price,
    rating
  } = service;

  const cardImage = image?.url || heroImage?.url || '/placeholder-service.jpg';
  const serviceName = name || title || 'Service';
  const serviceDesc = shortDescription || description?.substring(0, 120) + '...';

  return (
    <Card
      hoverable
      className={`service-card ${variant} ${className}`}
      cover={showImage ? (
        <div className="service-card-image">
          <img 
            alt={serviceName} 
            src={cardImage}
            className="service-image"
            onError={(e) => {
              e.target.src = '/placeholder-service.jpg';
            }}
          />
          {isFeatured && (
            <div className="featured-badge">
              <StarOutlined />
              <span>Featured</span>
            </div>
          )}
          {category && (
            <Tag color="blue" className="category-tag">
              {category}
            </Tag>
          )}
          <div className="service-overlay">
            <div className="service-overlay-content">
              <Link to={`/services/${slug || _id}`}>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ArrowRightOutlined />}
                  className="overlay-button"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      actions={variant === 'detailed' ? [
        <Link to={`/services/${slug || _id}`} key="view">
          <Button type="primary" icon={<ArrowRightOutlined />}>
            View Details
          </Button>
        </Link>
      ] : undefined}
    >
      <Meta
        title={
          <div className="service-title">
            <Title level={4} className="service-name">
              {serviceName}
            </Title>
            {isFeatured && variant === 'compact' && (
              <StarOutlined className="featured-icon" />
            )}
          </div>
        }
        description={
          <div className="service-content">
            {showDescription && (
              <Paragraph className="service-description">
                {serviceDesc}
              </Paragraph>
            )}
            
            {showStats && (
              <div className="service-stats">
                <Space size="large" wrap>
                  {duration && (
                    <div className="stat-item">
                      <ClockCircleOutlined className="stat-icon" />
                      <Text className="stat-text">{duration}</Text>
                    </div>
                  )}
                  {price && (
                    <div className="stat-item">
                      <Text className="stat-text price">${price}</Text>
                    </div>
                  )}
                  {rating && (
                    <div className="stat-item">
                      <StarOutlined className="stat-icon" />
                      <Text className="stat-text">{rating}/5</Text>
                    </div>
                  )}
                </Space>
              </div>
            )}
            
            {showFeatures && features.length > 0 && (
              <div className="service-features">
                <Title level={5}>Key Features:</Title>
                <ul>
                  {features.slice(0, 3).map((feature, index) => (
                    <li key={index}>
                      <CheckCircleOutlined className="feature-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {variant === 'default' && (
              <Link to={`/services/${slug || _id}`} className="service-link">
                Learn More <ArrowRightOutlined />
              </Link>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default ServiceCard;

