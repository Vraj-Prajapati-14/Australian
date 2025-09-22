import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Select Component - Reusable select dropdown
 */
const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  allowClear = false,
  mode = 'single', // single, multiple, tags
  className = '',
  error = null,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectClasses = [
    'select',
    isOpen ? 'select-open' : '',
    disabled ? 'select-disabled' : '',
    error ? 'select-error' : '',
    className
  ].filter(Boolean).join(' ');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    if (mode === 'multiple') {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else if (mode === 'tags') {
      const currentValues = Array.isArray(value) ? value : [];
      if (!currentValues.includes(optionValue)) {
        const newValues = [...currentValues, optionValue];
        onChange?.(newValues);
      }
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (tagValue) => {
    if (mode === 'multiple' || mode === 'tags') {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.filter(v => v !== tagValue);
      onChange?.(newValues);
    }
  };

  const handleClear = () => {
    onChange?.(mode === 'multiple' || mode === 'tags' ? [] : '');
  };

  const getDisplayValue = () => {
    if (mode === 'multiple' || mode === 'tags') {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (values.length === 1) {
        const option = options.find(opt => opt.value === values[0]);
        return option ? option.label : values[0];
      }
      return `${values.length} items selected`;
    } else {
      if (!value) return placeholder;
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
  };

  const renderTags = () => {
    if (mode !== 'multiple' && mode !== 'tags') return null;
    
    const values = Array.isArray(value) ? value : [];
    return values.map(val => {
      const option = options.find(opt => opt.value === val);
      const label = option ? option.label : val;
      
      return (
        <span key={val} className="select-tag">
          {label}
          <button
            type="button"
            className="select-tag-remove"
            onClick={() => handleRemoveTag(val)}
          >
            ×
          </button>
        </span>
      );
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="select-wrapper" ref={selectRef}>
      <div className={selectClasses} onClick={handleToggle} {...props}>
        <div className="select-content">
          {renderTags()}
          <span className="select-placeholder">
            {getDisplayValue()}
          </span>
        </div>
        <div className="select-actions">
          {allowClear && value && (
            <button
              type="button"
              className="select-clear"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ×
            </button>
          )}
          <span className="select-arrow">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="select-dropdown" ref={dropdownRef}>
          {mode === 'tags' && (
            <div className="select-search">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Type to add new tag"
                className="select-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newTag = e.target.value.trim();
                    if (newTag && !options.some(opt => opt.value === newTag)) {
                      handleSelect(newTag);
                      setSearchValue('');
                    }
                  }
                }}
              />
            </div>
          )}
          <div className="select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = mode === 'multiple' || mode === 'tags'
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
                
                return (
                  <div
                    key={option.value}
                    className={`select-option ${isSelected ? 'select-option-selected' : ''}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                );
              })
            ) : (
              <div className="select-option select-option-empty">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  mode: PropTypes.oneOf(['single', 'multiple', 'tags']),
  className: PropTypes.string,
  error: PropTypes.string
};

export default Select;
