import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { getRequestsByMonth, getCalendarDay } from '../apis/calendarAPI';
import './CalendarView.css';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [eventDates, setEventDates] = useState([]); // <-- ARRAY OF DATES ONLY
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  // ⬇ Fetch month overview (only event dates)
  useEffect(() => {
    const fetchMonthEvents = async () => {
      setLoading(true);
      try {
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth();

        const data = await getRequestsByMonth(year, month);
        console.log(data);
        // Backend returns { success, month, event_on: ["YYYY-MM-DD"] }
        setEventDates(data.event_on || []);
      } catch (error) {
        console.error('Error loading monthly events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthEvents();
  }, [activeStartDate]);

  // ⬇ Check whether this tile/day has events
  const hasEvents = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
     console.log('Checking date:', dateStr, 'In array?', eventDates.includes(dateStr));
  
    return eventDates.includes(dateStr);
  };

  // ⬇ When user clicks a day tile
  const handleDayClick = async (value) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const yearMonth = `${year}-${month}`;

    // Only fetch details if we know this day has events
    if (!hasEvents(value)) return;

    try {
      const data = await getCalendarDay(yearMonth, day);

      setSelectedDay({
        date: value,
        requests: data.events || []
      });

      setShowDayModal(true);
    } catch (error) {
      console.error('Error fetching day events:', error);
    }
  };

  // ⬇ Colored indicator inside calendar tile
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    if (hasEvents(date)) {
      return (
        <div className="event-dot"></div>
      );
    }

    return null;
  };

  // ⬇ Time formatting helper
  const formatTimeRange = (start, end) => {
    const s = new Date(`1970-01-01T${start}:00`);
    const e = new Date(`1970-01-01T${end}:00`);
    return `${format(s, 'h:mm a')} - ${format(e, 'h:mm a')}`;
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
          <div className="calendar-content-wrapper">
            <div className="calendar-main">
              <Calendar
                onChange={setDate}
                value={date}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) =>
                  setActiveStartDate(activeStartDate)
                }
                onClickDay={handleDayClick}
                tileContent={tileContent}
                showNeighboringMonth={true}
                next2Label={null}
                prev2Label={null}
                calendarType="iso8601"
                tileClassName={({ date: tileDate, view }) => {
                  const classes = [];

                  if (view === 'month') {
                    if (tileDate.getDay() === 0) classes.push('sunday-tile');
                    if (tileDate.getMonth() !== activeStartDate.getMonth()) {
                      classes.push('neighboring-month');
                    }
                  }

                  return classes.join(' ');
                }}
              />
            </div>
            
            {/* Legend */}
            
            {/* <div className="calendar-legend">
              <h3>Event Key</h3>
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
            </div> */}

          </div>
        )}

        {/* ⬇ Day Details Modal */}
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
                {selectedDay.requests.map((event) => (
                  <div key={event._id} className="event-card">
                    <div className="event-card-header">
                      <div className="event-status-indicator" />
                      <div className="event-card-info">
                        <h3>{event.eventName}</h3>
                        <span className={`status-badge status-${event.status}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>

                    <div className="event-card-details">
                      <div className="detail-row">
                        <strong>Committee:</strong>
                        <span>{event.committee}</span>
                      </div>

                      <div className="detail-row">
                        <strong>Time:</strong>
                        <span>{formatTimeRange(event.startTime, event.endTime)}</span>
                      </div>

                      <div className="detail-row">
                        <strong>Venue:</strong>
                        <span>{event.venue}</span>
                      </div>

                      <div className="detail-row">
                        <strong>Description:</strong>
                        <span>{event.description}</span>
                      </div>
                    </div>
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
