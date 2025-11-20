import React, { useState, useEffect } from 'react';
import FormSelect from '../components/FormSelect';
import FormTextArea from '../components/FormTextArea';
import DateTimePicker from '../components/DateTimePicker';
import FormInput from '../components/FormInput';
import { getLocations, getFaculties, submitRequest } from '../apis/requestAPI';
import './RequestForm.css';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    faculty: '',
    location: '',
    floor: '',
    fromDateTime: '',
    toDateTime: '',
    description: '',
    stallCost: '',
    stallDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch locations and faculties on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsData, facultiesData] = await Promise.all([
          getLocations(),
          getFaculties()
        ]);
        setLocations(locationsData);
        setFaculties(facultiesData);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading form data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.faculty) {
      newErrors.faculty = 'Please select a faculty member';
    }

    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    // Validate floor if stall is selected
    const isStallLocation = formData.location === 'stall';
    if (isStallLocation && !formData.floor) {
      newErrors.floor = 'Please select a floor for the stall';
    }

    if (!formData.fromDateTime) {
      newErrors.fromDateTime = 'From date and time is required';
    }

    if (!formData.toDateTime) {
      newErrors.toDateTime = 'To date and time is required';
    }

    if (formData.fromDateTime && formData.toDateTime) {
      if (new Date(formData.toDateTime) <= new Date(formData.fromDateTime)) {
        newErrors.toDateTime = 'End date must be after start date';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    // Validate stall-specific fields if stall location is selected
    if (isStallLocation) {
      if (!formData.stallCost) {
        newErrors.stallCost = 'Stall cost is required for stall locations';
      } else if (isNaN(formData.stallCost) || parseFloat(formData.stallCost) < 0) {
        newErrors.stallCost = 'Please enter a valid cost';
      }

      if (!formData.stallDescription.trim()) {
        newErrors.stallDescription = 'Stall description is required for stall locations';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);
      try {
        const response = await submitRequest(formData);
        alert(`Request submitted successfully! Request ID: ${response.requestId}`);
        
        // Reset form after successful submission
        setFormData({
          faculty: '',
          location: '',
          floor: '',
          fromDateTime: '',
          toDateTime: '',
          description: '',
          stallCost: '',
          stallDescription: ''
        });
        setErrors({});
      } catch (error) {
        alert('Error submitting request. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const isStallLocation = formData.location === 'stall';

  // Format faculties for select dropdown
  const facultyOptions = faculties.map(faculty => ({
    value: faculty.email,
    label: `${faculty.name} (${faculty.department})`
  }));

  // Format locations for select dropdown
  const locationOptions = locations.map(location => ({
    value: location.value,
    label: location.label
  }));

  // Floor options for stall
  const floorOptions = [
    { value: 'ground', label: 'Ground' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' }
  ];

  if (loading) {
    return (
      <div className="request-form-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="request-form-page">
      <div className="request-form-container">
        <div className="form-header">
          <h1>Event Permission Request</h1>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          {/* To (Faculty) */}
          <FormSelect
            label="To (Faculty Member)"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            options={facultyOptions}
            required={true}
            placeholder="Select faculty member"
          />
          {errors.faculty && <span className="error-message">{errors.faculty}</span>}

          {/* Location and Floor (if stall) */}
          <div className="location-row">
            <div className="location-col">
              <FormSelect
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                options={locationOptions}
                required={true}
                placeholder="Select event location"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            {isStallLocation && (
              <div className="floor-col">
                <FormSelect
                  label="Floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  options={floorOptions}
                  required={true}
                  placeholder="Select floor"
                />
                {errors.floor && <span className="error-message">{errors.floor}</span>}
              </div>
            )}
          </div>

          {/* From and To Date & Time in a row */}
          <div className="datetime-row">
            <div className="datetime-col">
              <DateTimePicker
                label="From Date & Time"
                name="fromDateTime"
                value={formData.fromDateTime}
                onChange={handleChange}
                required={true}
              />
              {errors.fromDateTime && <span className="error-message">{errors.fromDateTime}</span>}
            </div>

            <div className="datetime-col">
              <DateTimePicker
                label="To Date & Time"
                name="toDateTime"
                value={formData.toDateTime}
                onChange={handleChange}
                required={true}
                min={formData.fromDateTime}
              />
              {errors.toDateTime && <span className="error-message">{errors.toDateTime}</span>}
            </div>
          </div>

          {/* Event Description */}
          <FormTextArea
            label="Event Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide details about your event, including purpose, expected attendees, etc."
            required={true}
            rows={5}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}

          {/* Dynamic Stall Fields */}
          {isStallLocation && (
            <div className="stall-section">
              <h3 className="section-title">Stall Information</h3>
              
              <FormInput
                label="Stall Cost (₹)"
                type="number"
                name="stallCost"
                value={formData.stallCost}
                onChange={handleChange}
                placeholder="Enter estimated cost"
                required={isStallLocation}
              />
              {errors.stallCost && <span className="error-message">{errors.stallCost}</span>}

              <FormTextArea
                label="Stall Description"
                name="stallDescription"
                value={formData.stallDescription}
                onChange={handleChange}
                placeholder="Describe what will be displayed/sold at the stall"
                required={isStallLocation}
                rows={4}
              />
              {errors.stallDescription && <span className="error-message">{errors.stallDescription}</span>}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              disabled={submitting}
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? All data will be lost.')) {
                  setFormData({
                    faculty: '',
                    location: '',
                    floor: '',
                    fromDateTime: '',
                    toDateTime: '',
                    description: '',
                    stallCost: '',
                    stallDescription: ''
                  });
                  setErrors({});
                }
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
