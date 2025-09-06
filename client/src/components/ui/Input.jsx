import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input Component - Reusable input field with validation states
 */
const Input = ({
  label,
  error,
  success,
  disabled = false,
  required = false,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    success ? 'input-success' : '',
    disabled ? 'disabled' : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && (
        <div className="input-message error">
          {error}
        </div>
      )}
      {success && (
        <div className="input-message success">
          {success}
        </div>
      )}
    </div>
  );
};

/**
 * Textarea Component - Reusable textarea field
 */
const Textarea = ({
  label,
  error,
  success,
  disabled = false,
  required = false,
  fullWidth = true,
  rows = 4,
  className = '',
  ...props
}) => {
  const textareaClasses = [
    'input',
    'resize-vertical',
    error ? 'input-error' : '',
    success ? 'input-success' : '',
    disabled ? 'disabled' : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        disabled={disabled}
        required={required}
        rows={rows}
        {...props}
      />
      {error && (
        <div className="input-message error">
          {error}
        </div>
      )}
      {success && (
        <div className="input-message success">
          {success}
        </div>
      )}
    </div>
  );
};

/**
 * Select Component - Reusable select field
 */
const Select = ({
  label,
  options = [],
  error,
  success,
  disabled = false,
  required = false,
  fullWidth = true,
  placeholder,
  className = '',
  ...props
}) => {
  const selectClasses = [
    'input',
    error ? 'input-error' : '',
    success ? 'input-success' : '',
    disabled ? 'disabled' : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={selectClasses}
        disabled={disabled}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="input-message error">
          {error}
        </div>
      )}
      {success && (
        <div className="input-message success">
          {success}
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  error: PropTypes.string,
  success: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

// Attach sub-components to Input
Input.Textarea = Textarea;
Input.Select = Select;

export default Input;
