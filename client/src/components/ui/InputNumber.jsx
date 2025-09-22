import React from 'react';
import PropTypes from 'prop-types';

/**
 * InputNumber Component - Reusable number input with increment/decrement buttons
 */
const InputNumber = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled = false,
  placeholder = 'Enter number',
  className = '',
  error = null,
  ...props
}) => {
  const inputClasses = [
    'input-number',
    disabled ? 'input-number-disabled' : '',
    error ? 'input-number-error' : '',
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange?.(newValue);
    } else if (e.target.value === '') {
      onChange?.(undefined);
    }
  };

  const handleIncrement = () => {
    if (!disabled) {
      const currentValue = value || 0;
      const newValue = Math.min(currentValue + step, max);
      onChange?.(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled) {
      const currentValue = value || 0;
      const newValue = Math.max(currentValue - step, min);
      onChange?.(newValue);
    }
  };

  return (
    <div className="input-number-wrapper">
      <div className="input-number-controls">
        <button
          type="button"
          className="input-number-btn input-number-decrement"
          onClick={handleDecrement}
          disabled={disabled || (value || 0) <= min}
        >
          −
        </button>
        <input
          type="number"
          className={inputClasses}
          value={value || ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          className="input-number-btn input-number-increment"
          onClick={handleIncrement}
          disabled={disabled || (value || 0) >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

InputNumber.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string
};

export default InputNumber;
