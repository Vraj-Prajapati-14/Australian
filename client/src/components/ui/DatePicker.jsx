import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * DatePicker Component - Simple date picker
 */
const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  format = 'YYYY-MM-DD',
  disabled = false,
  className = '',
  error = null,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const datePickerRef = useRef(null);

  const datePickerClasses = [
    'datepicker',
    isOpen ? 'datepicker-open' : '',
    disabled ? 'datepicker-disabled' : '',
    error ? 'datepicker-error' : '',
    className
  ].filter(Boolean).join(' ');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
  };

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    onChange?.(dateString);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    onChange?.(value);
  };

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day calendar-day-empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isSelected = selectedDate === dateString;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'calendar-day-today' : ''} ${isSelected ? 'calendar-day-selected' : ''}`}
          onClick={() => handleDateSelect(dateString)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="datepicker-wrapper" ref={datePickerRef}>
      <input
        type="text"
        className={datePickerClasses}
        value={formatDate(selectedDate)}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        {...props}
      />
      
      {isOpen && (
        <div className="datepicker-dropdown">
          <div className="calendar">
            <div className="calendar-header">
              <div className="calendar-month-year">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="calendar-weekdays">
              <div className="calendar-weekday">Sun</div>
              <div className="calendar-weekday">Mon</div>
              <div className="calendar-weekday">Tue</div>
              <div className="calendar-weekday">Wed</div>
              <div className="calendar-weekday">Thu</div>
              <div className="calendar-weekday">Fri</div>
              <div className="calendar-weekday">Sat</div>
            </div>
            <div className="calendar-days">
              {generateCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  format: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string
};

export default DatePicker;
