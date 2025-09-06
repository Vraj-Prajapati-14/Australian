import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component - Reusable button with multiple variants and sizes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '', // default size
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className
  ].filter(Boolean).join(' ');
  
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = React.isValidElement(icon) ? icon : (
      <span className="icon">{icon}</span>
    );
    
    return (
      <span className={`icon-wrapper ${iconPosition === 'right' ? 'order-2' : ''}`}>
        {loading ? <span className="spinner spinner-sm" /> : iconElement}
      </span>
    );
  };
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className="btn-content">
        {children}
      </span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export default Button;
