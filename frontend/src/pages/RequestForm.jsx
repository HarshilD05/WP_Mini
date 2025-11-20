import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormTextArea from '../components/FormTextArea';
import FormInput from '../components/FormInput';
import { submitRequest } from '../apis/requestAPI';
import { getDashboardPath } from '../utils/roleHelper';
import './RequestForm.css';

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    committee: '',
    venue: '',
    floor: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    stallPrice: '',
    stallDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill committee from sessionStorage
  useEffect(() => {
    const userCommittee = sessionStorage.getItem('userCommittee') || '';
    setFormData(prev => ({
      ...prev,
      committee: userCommittee
    }));
    setLoading(false);
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

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event eventName is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.committee.trim()) {
      newErrors.committee = 'Committee is required';
    }

    if (!formData.venue) {
      newErrors.venue = 'Please select a venue';
    }

    // Validate floor if stall is selected
    const isStallVenue = formData.venue === 'Stall';
    if (isStallVenue && !formData.floor) {
      newErrors.floor = 'Please select a floor for the stall';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate that end time is after start time (same day)
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    // Validate stall-specific fields if stall is selected
    if (isStallVenue) {
      if (!formData.stallPrice) {
        newErrors.stallPrice = 'Stall price is required for stall venues';
      } else if (isNaN(formData.stallPrice) || parseFloat(formData.stallPrice) < 0) {
        newErrors.stallPrice = 'Please enter a valid price';
      }

      if (!formData.stallDescription.trim()) {
        newErrors.stallDescription = 'Stall description is required for stall venues';
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
        // Prepare data for API - merge stall fields into description JSON
        const isStallVenue = formData.venue === 'Stall';
        const descriptionData = {
          description: formData.description,
          ...(isStallVenue && {
            stallFloor: formData.floor,
            stallPrice: formData.stallPrice,
            stallDescription: formData.stallDescription
          })
        };

        const requestData = {
          eventName: formData.eventName,
          description: JSON.stringify(descriptionData),
          committee: formData.committee,
          venue: formData.venue,
          eventDate: formData.eventDate,
          startTime: formData.startTime,
          endTime: formData.endTime
        };

        console.log("Request Data being sent to API:");
        console.log(requestData);

        const response = await submitRequest(requestData);
        
        // Show success message
        if (response.success) {
          alert(`Request submitted successfully! Request ID: ${response.requestId}`);
          
          // Navigate to home page based on user role
          const userRole = sessionStorage.getItem('userRole');
          const dashboardPath = getDashboardPath(userRole);
          navigate(dashboardPath);
        } else {
          throw new Error(response.message || 'Failed to submit request');
        }
      } catch (error) {
        alert(error.message || 'Error submitting request. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // No additional options needed

  const isStallVenue = formData.venue === 'Stall';

  // Venue options
  const venueOptions = [
    { value: 'Seminar Hall', label: 'Seminar Hall' },
    { value: 'Canteen', label: 'Canteen' },
    { value: 'Stall', label: 'Stall' },
    { value: 'Library Meeting Room', label: 'Library Meeting Room' }
  ];

  // Floor options for stall
  const floorOptions = [
    { value: 'Ground', label: 'Ground Floor' },
    { value: '1', label: '1st Floor' },
    { value: '2', label: '2nd Floor' },
    { value: '3', label: '3rd Floor' },
    { value: '4', label: '4th Floor' },
    { value: '5', label: '5th Floor' },
    { value: '6', label: '6th Floor' }
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
          {/* Event Name */}
          <FormInput
            label="Event Name"
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            required={true}
          />
          {errors.eventName && <span className="error-message">{errors.eventName}</span>}

          {/* Committee (auto-filled, read-only) */}
          <FormInput
            label="Committee"
            type="text"
            name="committee"
            value={formData.committee}
            onChange={handleChange}
            placeholder="Committee name"
            required={true}
            readOnly={true}
            disabled={true}
          />
          {errors.committee && <span className="error-message">{errors.committee}</span>}

          {/* Venue and Floor (if stall) in same row */}
          <div className="location-row">
            <div className="location-col">
              <label className="form-label">
                Venue <span className="required">*</span>
              </label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="form-input"
                required={true}
              >
                <option value="">Select venue</option>
                {venueOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.venue && <span className="error-message">{errors.venue}</span>}
            </div>

            {isStallVenue && (
              <div className="floor-col">
                <label className="form-label">
                  Floor <span className="required">*</span>
                </label>
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="form-input"
                  required={true}
                >
                  <option value="">Select floor</option>
                  {floorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.floor && <span className="error-message">{errors.floor}</span>}
              </div>
            )}
          </div>

          {/* Event Date */}
          <div className="form-group">
            <label className="form-label">
              Event Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="form-input"
              required={true}
            />
            {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
          </div>

          {/* Start and End Time in a row */}
          <div className="datetime-row">
            <div className="datetime-col">
              <label className="form-label">
                Start Time <span className="required">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="form-input"
                required={true}
              />
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>

            <div className="datetime-col">
              <label className="form-label">
                End Time <span className="required">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="form-input"
                required={true}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
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
          {isStallVenue && (
            <div className="stall-section">
              <h3 className="section-title">Stall Information</h3>
              
              <FormInput
                label="Stall Price (₹)"
                type="number"
                name="stallPrice"
                value={formData.stallPrice}
                onChange={handleChange}
                placeholder="Enter stall price"
                required={isStallVenue}
              />
              {errors.stallPrice && <span className="error-message">{errors.stallPrice}</span>}

              <FormTextArea
                label="Stall Description"
                name="stallDescription"
                value={formData.stallDescription}
                onChange={handleChange}
                placeholder="Describe what will be displayed/sold at the stall"
                required={isStallVenue}
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
                  const userCommittee = sessionStorage.getItem('userCommittee') || '';
                  setFormData({
                    eventName: '',
                    description: '',
                    committee: userCommittee,
                    venue: '',
                    floor: '',
                    eventDate: '',
                    startTime: '',
                    endTime: '',
                    stallPrice: '',
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
