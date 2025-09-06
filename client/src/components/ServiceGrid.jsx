import React from 'react';
import { Row, Col, Empty } from 'antd';
import ServiceCard from './ServiceCard';

const ServiceGrid = ({ 
  services = [], 
  loading = false,
  variant = 'default',
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  showImage = true,
  showDescription = true,
  showFeatures = false,
  className = '',
  emptyMessage = 'No services found'
}) => {
  if (loading) {
    return (
      <div className={`service-grid-loading ${className}`}>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col key={i} xs={columns.xs} sm={columns.sm} md={columns.md} lg={columns.lg}>
              <ServiceCard 
                service={{}} 
                variant={variant}
                showImage={showImage}
                showDescription={showDescription}
                showFeatures={showFeatures}
                className="loading"
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className={`service-grid-empty ${className}`}>
        <Empty 
          description={emptyMessage}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className={`service-grid ${className}`}>
      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col 
            key={service._id} 
            xs={columns.xs} 
            sm={columns.sm} 
            md={columns.md} 
            lg={columns.lg}
          >
            <ServiceCard 
              service={service}
              variant={variant}
              showImage={showImage}
              showDescription={showDescription}
              showFeatures={showFeatures}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ServiceGrid;
