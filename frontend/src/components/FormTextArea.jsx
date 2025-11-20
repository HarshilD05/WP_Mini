import React from 'react';
import './FormTextArea.css';

const FormTextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  rows = 4 
}) => {
  return (
    <div className="form-textarea-container">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className="form-textarea"
      />
    </div>
  );
};

export default FormTextArea;
