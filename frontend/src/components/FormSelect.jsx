import React from 'react';
import './FormSelect.css';

const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false,
  disabled = false,
  placeholder = 'Select an option'
}) => {
  return (
    <div className="form-select-container">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="form-select"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
