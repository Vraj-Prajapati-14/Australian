import React from 'react';
import PropTypes from 'prop-types';

/**
 * Switch Component - Reusable toggle switch
 */
const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'default',
  className = '',
  ...props
}) => {
  const switchClasses = [
    'switch',
    `switch-${size}`,
    checked ? 'switch-checked' : '',
    disabled ? 'switch-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={switchClasses} onClick={handleToggle} {...props}>
      <div className="switch-track">
        <div className="switch-thumb" />
      </div>
    </div>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string
};

export default Switch;
