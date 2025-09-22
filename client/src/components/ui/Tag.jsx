import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tag Component - Reusable tag with different colors and sizes
 */
const Tag = ({
  children,
  color = 'default',
  size = 'default',
  closable = false,
  onClose,
  className = '',
  ...props
}) => {
  const tagClasses = [
    'tag',
    `tag-${color}`,
    `tag-${size}`,
    closable ? 'tag-closable' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  return (
    <span className={tagClasses} {...props}>
      <span className="tag-content">{children}</span>
      {closable && (
        <button 
          type="button" 
          className="tag-close" 
          onClick={handleClose}
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['default', 'blue', 'green', 'orange', 'red', 'purple', 'gold', 'cyan', 'magenta']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string
};

export default Tag;
