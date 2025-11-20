const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

/**
 * Get auth headers with token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Get calendar events for a specific month (returns dates with events)
 * @param {string} yearMonth - Format: "YYYY-MM" (e.g., "2025-01")
 * @returns {Promise<Array>} Array of dates with events
 */
export const getCalendarMonth = async (yearMonth) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/getCalendar/${yearMonth}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch calendar');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching calendar for month:', error);
    throw error;
  }
};

/**
 * Get events for a specific date (only approved events)
 * @param {string} yearMonth - Format: "YYYY-MM" (e.g., "2025-01")
 * @param {string} day - Day of month (e.g., "12")
 * @returns {Promise<Array>} Array of approved events for that date
 */
export const getCalendarDay = async (yearMonth, day) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/getCalendar/${yearMonth}/${day}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch events for date');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching events for date:', error);
    throw error;
  }
};

/**
 * Fetches requests for a specific date (legacy helper)
 * @param {Date} date - The date to fetch requests for
 * @returns {Promise<Array>} Array of request objects for that date
 */
export const getRequestsByDate = async (date) => {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const yearMonth = `${year}-${month}`;
    
    return await getCalendarDay(yearMonth, day);
  } catch (error) {
    console.error('Error fetching requests by date:', error);
    throw error;
  }
};

/**
 * Fetches requests for a specific month (legacy helper)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {Promise<Array>} Array of request objects for that month
 */
export const getRequestsByMonth = async (year, month) => {
  try {
    const monthStr = String(month + 1).padStart(2, '0');
    const yearMonth = `${year}-${monthStr}`;
    
    return await getCalendarMonth(yearMonth);
  } catch (error) {
    console.error('Error fetching requests by month:', error);
    throw error;
  }
};
