import React from 'react';
import PropTypes from 'prop-types';

/**
 * Section Component - Reusable section with padding and background options
 */
const Section = ({
  children,
  padding = 'default',
  background = 'default',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-4',
    default: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
    '2xl': 'py-20',
    '3xl': 'py-24',
    '4xl': 'py-32'
  };
  
  const backgroundClasses = {
    default: '',
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
    accent: 'bg-accent-50',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50',
    white: 'bg-white'
  };
  
  const classes = [
    paddingClasses[padding],
    backgroundClasses[background],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
};

/**
 * Section Header Component
 */
const SectionHeader = ({
  title,
  subtitle,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  const classes = [
    'mb-8',
    alignClasses[align],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...props}>
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Section Content Component
 */
const SectionContent = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg', 'xl', '2xl', '3xl', '4xl']),
  background: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'dark', 'light', 'white']),
  className: PropTypes.string
};

SectionHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string
};

SectionContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

// Attach sub-components to Section
Section.Header = SectionHeader;
Section.Content = SectionContent;

export default Section;
