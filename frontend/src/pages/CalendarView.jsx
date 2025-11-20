import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import { getRequestsByMonth } from '../apis/calendarAPI';
import './CalendarView.css';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // Fetch requests for the current visible month
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth();
        const data = await getRequestsByMonth(year, month);
        setRequests(data);
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeStartDate]);

  // Get requests for a specific day
  const getRequestsForDay = (day) => {
    return requests.filter(request => {
      const requestDate = new Date(request.fromDateTime);
      return isSameDay(requestDate, day);
    });
  };

  // Get status color for request
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // Orange
      case 'approved':
        return '#10b981'; // Green
      case 'rejected':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  // Get location color
  const getLocationColor = (location) => {
    switch (location) {
      case 'Seminar Hall':
        return '#3b82f6'; // Blue
      case 'Library Seminar Hall':
        return '#8b5cf6'; // Purple
      case 'Stall':
        return '#ec4899'; // Pink
      case 'Canteen':
        return '#14b8a6'; // Teal
      default:
        return '#6b7280'; // Gray
    }
  };

  // Custom tile content - adds colored lines for events
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayRequests = getRequestsForDay(date);
      
      if (dayRequests.length > 0) {
        return (
          <div className="event-indicators">
            {dayRequests.map((request, index) => (
              <div
                key={request.id}
                className="event-line"
                style={{ backgroundColor: getLocationColor(request.location) }}
                title={`${request.committee} - ${request.location}`}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Handle day click
  const handleDayClick = (value) => {
    const dayRequests = getRequestsForDay(value);
    if (dayRequests.length > 0) {
      setSelectedDay({ date: value, requests: dayRequests });
      setShowDayModal(true);
    }
  };

  // Format time range
  const formatTimeRange = (fromDateTime, toDateTime) => {
    const from = new Date(fromDateTime);
    const to = new Date(toDateTime);
    return `${format(from, 'h:mm a')} - ${format(to, 'h:mm a')}`;
  };

  // Handle month navigation
  const handleActiveStartDateChange = ({ activeStartDate: newActiveStartDate }) => {
    setActiveStartDate(newActiveStartDate);
  };

  return (
    <div className="calendar-view-page">
      <div className="calendar-container">
        <div className="calendar-header">
          <h1>Event Calendar</h1>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading calendar...</p>
          </div>
        ) : (
          <div className="calendar-wrapper">
            <Calendar
              onChange={setDate}
              value={date}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={handleActiveStartDateChange}
              onClickDay={handleDayClick}
              tileContent={tileContent}
              showNeighboringMonth={true}
              next2Label={null}
              prev2Label={null}
              calendarType="iso8601"
              tileClassName={({ date: tileDate, view }) => {
                const classes = [];
                
                if (view === 'month') {
                  // Mark Sundays
                  if (tileDate.getDay() === 0) {
                    classes.push('sunday-tile');
                  }
                  
                  // Hide neighboring month dates
                  if (tileDate.getMonth() !== activeStartDate.getMonth()) {
                    classes.push('neighboring-month');
                  }
                }
                
                return classes.join(' ');
              }}
            />

            {/* Legend */}
            <div className="calendar-legend">
                <h3>Location Types</h3>
                <div className="legend-items">
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span>Seminar Hall</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
                    <span>Library Seminar Hall</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#ec4899' }}></div>
                    <span>Stall</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#14b8a6' }}></div>
                    <span>Canteen</span>
                </div>
                </div>
            </div>
          </div>
        )}

        {/* Day Details Modal */}
        {showDayModal && selectedDay && (
          <div className="modal-overlay" onClick={() => setShowDayModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Events on {format(selectedDay.date, 'MMMM d, yyyy')}</h2>
                <button className="close-button" onClick={() => setShowDayModal(false)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                {selectedDay.requests.map((request) => (
                  <div key={request.id} className="event-card">
                    <div className="event-card-header">
                      <div 
                        className="event-status-indicator"
                        style={{ backgroundColor: getLocationColor(request.location) }}
                      />
                      <div className="event-card-info">
                        <h3>{request.committee}</h3>
                        <span className={`status-badge status-${request.status}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="event-card-details">
                      <div className="detail-row">
                        <strong>Time:</strong>
                        <span>{formatTimeRange(request.fromDateTime, request.toDateTime)}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Location:</strong>
                        <span>
                          {request.location}
                          {request.floor && ` - Floor ${request.floor}`}
                        </span>
                      </div>
                      <div className="detail-row">
                        <strong>Faculty:</strong>
                        <span>{request.facultyName}</span>
                      </div>
                      <div className="detail-row">
                        <strong>Submitted by:</strong>
                        <span>{request.submittedBy}</span>
                      </div>
                    </div>

                    <div className="event-description">
                      <strong>Description:</strong>
                      <p>{request.description}</p>
                    </div>

                    {request.stallDescription && (
                      <div className="stall-info">
                        <strong>Stall Details:</strong>
                        <p>{request.stallDescription}</p>
                        <div className="stall-cost">Cost: ₹{request.stallCost}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
