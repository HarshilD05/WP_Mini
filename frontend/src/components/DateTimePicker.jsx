import React from 'react';
import './DateTimePicker.css';

const DateTimePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  min = null
}) => {
  return (
    <div className="datetime-picker-container">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <input
        type="datetime-local"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        className="datetime-input"
      />
    </div>
  );
};

export default DateTimePicker;
