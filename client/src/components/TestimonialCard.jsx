import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Avatar, Rate, Tag } from 'antd';
import { StarFilled, QuoteOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TestimonialCard = ({ 
  testimonial, 
  variant = 'default',
  showAvatar = true,
  showRating = true,
  showService = true,
  className = ''
}) => {
  const {
    _id,
    clientName,
    clientTitle,
    company,
    content,
    rating = 5,
    service,
    image,
    isVerified = false,
    date
  } = testimonial;

  const avatarUrl = image?.url || '';
  const displayName = clientName || 'Anonymous Client';
  const displayTitle = clientTitle || 'Client';
  const displayCompany = company || '';

  return (
    <Card
      className={`testimonial-card ${variant} ${className}`}
      bodyStyle={{ padding: 0 }}
    >
      <div className="testimonial-content">
        {/* Quote Icon */}
        <div className="quote-icon">
          <QuoteOutlined />
        </div>

        {/* Main Content */}
        <div className="testimonial-main">
          {/* Rating */}
          {showRating && (
            <div className="testimonial-rating">
              <Rate 
                disabled 
                value={rating} 
                character={<StarFilled />}
                className="rating-stars"
              />
              <Text className="rating-text">{rating}/5</Text>
            </div>
          )}

          {/* Content */}
          <Paragraph className="testimonial-text">
            "{content}"
          </Paragraph>

          {/* Service Tag */}
          {showService && service && (
            <div className="service-tag-container">
              <Tag color="blue" className="service-tag">
                {service}
              </Tag>
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="client-info">
          {showAvatar && (
            <Avatar 
              size={48}
              src={avatarUrl}
              icon={!avatarUrl ? <UserOutlined /> : null}
              className="client-avatar"
            />
          )}
          
          <div className="client-details">
            <Title level={5} className="client-name">
              {displayName}
              {isVerified && (
                <span className="verified-badge">
                  ✓
                </span>
              )}
            </Title>
            
            {displayTitle && (
              <Text className="client-title">
                {displayTitle}
              </Text>
            )}
            
            {displayCompany && (
              <Text className="client-company">
                {displayCompany}
              </Text>
            )}
            
            {date && (
              <Text className="testimonial-date">
                {new Date(date).toLocaleDateString()}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
