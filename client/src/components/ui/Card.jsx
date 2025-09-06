import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component - Reusable card with header, body, and footer sections
 */
const Card = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}) => {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: '',
    elevated: 'card-elevated',
    bordered: 'card-bordered',
    flat: 'card-flat'
  };
  
  const hoverClass = hover ? '' : 'no-hover';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    hoverClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Body Component
 */
const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Footer Component
 */
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Title Component
 */
const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`card-title ${className}`} {...props}>
      {children}
    </h3>
  );
};

/**
 * Card Subtitle Component
 */
const CardSubtitle = ({ children, className = '', ...props }) => {
  return (
    <p className={`card-subtitle ${className}`} {...props}>
      {children}
    </p>
  );
};

/**
 * Card Text Component
 */
const CardText = ({ children, className = '', ...props }) => {
  return (
    <p className={`card-text ${className}`} {...props}>
      {children}
    </p>
  );
};

/**
 * Card Image Component
 */
const CardImage = ({ src, alt, className = '', ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`card-image w-full h-48 object-cover ${className}`} 
      {...props} 
    />
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'flat']),
  hover: PropTypes.bool,
  className: PropTypes.string
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardSubtitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Text = CardText;
Card.Image = CardImage;

export default Card;
