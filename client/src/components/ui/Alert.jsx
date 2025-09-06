import React from 'react';
import PropTypes from 'prop-types';

/**
 * Alert Component - Reusable alert with multiple variants
 */
const Alert = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const baseClasses = 'alert';
  
  const variantClasses = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');
  
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };
  
  return (
    <div className={classes} {...props}>
      <div className="alert-content">
        {title && (
          <div className="alert-title">
            {title}
          </div>
        )}
        <div className="alert-message">
          {children}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string
};

export default Alert;
