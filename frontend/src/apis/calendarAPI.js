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
 * Get calendar overview for a specific month
 * Example: "2025-01"
 * -> Fetches list of dates that have events
 */
export const getCalendarMonth = async (yearMonth) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/requests/getCalendar/${yearMonth}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

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
 * Get events for a specific day
 * yearMonth: "2025-01"
 * day: "12"
 * -> Fetches all events for that date
 */
export const getCalendarDay = async (yearMonth, day) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/requests/getCalendar/${yearMonth}/${day}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

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
 * Helper: Get events for a JS Date object
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
 * Helper: Get requests for a specific month (year, monthIndex)
 * monthIndex = 0–11
 */
export const getRequestsByMonth = async (year, monthIndex) => {
  try {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const yearMonth = `${year}-${monthStr}`;

    return await getCalendarMonth(yearMonth);
  } catch (error) {
    console.error('Error fetching requests by month:', error);
    throw error;
  }
};
