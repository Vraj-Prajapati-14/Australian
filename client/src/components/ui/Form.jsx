import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Form Component - Reusable form with validation
 */
const Form = ({
  children,
  onFinish,
  initialValues = {},
  layout = 'vertical',
  size = 'default',
  className = '',
  ...props
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, rules = []) => {
    for (const rule of rules) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        return rule.message || `${name} is required`;
      }
      if (rule.min && value && value.length < rule.min) {
        return rule.message || `${name} must be at least ${rule.min} characters`;
      }
      if (rule.max && value && value.length > rule.max) {
        return rule.message || `${name} must be no more than ${rule.max} characters`;
      }
      if (rule.pattern && value && !rule.pattern.test(value)) {
        return rule.message || `${name} format is invalid`;
      }
      if (rule.validator && typeof rule.validator === 'function') {
        const result = rule.validator(value);
        if (result !== true) {
          return result || `${name} is invalid`;
        }
      }
    }
    return null;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    let hasErrors = false;

    React.Children.forEach(children, (child) => {
      if (child && child.props && child.props.name) {
        const fieldName = child.props.name;
        const fieldValue = values[fieldName];
        const fieldRules = child.props.rules || [];
        
        const error = validateField(fieldName, fieldValue, fieldRules);
        if (error) {
          newErrors[fieldName] = error;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);

    if (!hasErrors && onFinish) {
      onFinish(values);
    }
  };

  const handleFieldChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const setFieldsValue = (newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  };

  const resetFields = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const validateFields = async () => {
    return new Promise((resolve, reject) => {
      const newErrors = {};
      let hasErrors = false;

      React.Children.forEach(children, (child) => {
        if (child && child.props && child.props.name) {
          const fieldName = child.props.name;
          const fieldValue = values[fieldName];
          const fieldRules = child.props.rules || [];
          
          const error = validateField(fieldName, fieldValue, fieldRules);
          if (error) {
            newErrors[fieldName] = error;
            hasErrors = true;
          }
        }
      });

      setErrors(newErrors);

      if (hasErrors) {
        reject(newErrors);
      } else {
        resolve(values);
      }
    });
  };

  const formContext = {
    values,
    errors,
    touched,
    handleFieldChange,
    handleFieldBlur,
    setFieldsValue,
    resetFields,
    validateFields
  };

  const formClasses = [
    'form',
    `form-${layout}`,
    `form-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <form className={formClasses} onSubmit={handleSubmit} {...props}>
      <FormContext.Provider value={formContext}>
        {children}
      </FormContext.Provider>
    </form>
  );
};

/**
 * Form Item Component
 */
const FormItem = ({
  name,
  label,
  rules = [],
  children,
  className = '',
  ...props
}) => {
  const formContext = React.useContext(FormContext);
  
  if (!formContext) {
    throw new Error('FormItem must be used within a Form component');
  }

  const { values, errors, touched, handleFieldChange, handleFieldBlur } = formContext;
  
  const value = values[name];
  const error = errors[name];
  const isTouched = touched[name];
  const showError = isTouched && error;

  const handleChange = (e) => {
    const newValue = e.target ? e.target.value : e;
    handleFieldChange(name, newValue);
  };

  const handleBlur = () => {
    handleFieldBlur(name);
  };

  const itemClasses = [
    'form-item',
    showError ? 'form-item-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClasses} {...props}>
      {label && (
        <label className="form-label">
          {label}
          {rules.some(rule => rule.required) && <span className="form-required">*</span>}
        </label>
      )}
      <div className="form-control">
        {React.cloneElement(children, {
          value: value || '',
          onChange: handleChange,
          onBlur: handleBlur,
          error: showError ? error : null
        })}
      </div>
      {showError && (
        <div className="form-error-message">
          {error}
        </div>
      )}
    </div>
  );
};

// Create Form Context
const FormContext = React.createContext();

// Attach sub-components to Form
Form.Item = FormItem;

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onFinish: PropTypes.func,
  initialValues: PropTypes.object,
  layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string
};

FormItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  rules: PropTypes.array,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Form;
