import React from 'react';
import PropTypes from 'prop-types';

/**
 * Container Component - Responsive container with max-width constraints
 */
const Container = ({
  children,
  size = 'lg',
  fluid = false,
  className = '',
  ...props
}) => {
  const baseClasses = fluid ? '' : 'container';
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };
  
  const classes = [
    baseClasses,
    !fluid && sizeClasses[size],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full']),
  fluid: PropTypes.bool,
  className: PropTypes.string
};

export default Container;
