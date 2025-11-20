import requestsData from '../data/requests.json';

/**
 * Fetches all permission requests
 * Currently reads from local JSON file
 * TODO: Update to fetch from server API endpoint
 * @returns {Promise<Array>} Array of request objects
 */
export const getRequests = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/requests');
    // const data = await response.json();
    // return data;
    
    return requestsData;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

/**
 * Fetches requests for a specific date
 * @param {Date} date - The date to fetch requests for
 * @returns {Promise<Array>} Array of request objects for that date
 */
export const getRequestsByDate = async (date) => {
  try {
    const requests = await getRequests();
    const targetDate = date.toISOString().split('T')[0];
    
    return requests.filter(request => {
      const requestDate = new Date(request.fromDateTime).toISOString().split('T')[0];
      return requestDate === targetDate;
    });
  } catch (error) {
    console.error('Error fetching requests by date:', error);
    throw error;
  }
};

/**
 * Fetches requests for a specific month
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {Promise<Array>} Array of request objects for that month
 */
export const getRequestsByMonth = async (year, month) => {
  try {
    const requests = await getRequests();
    
    return requests.filter(request => {
      const requestDate = new Date(request.fromDateTime);
      return requestDate.getFullYear() === year && requestDate.getMonth() === month;
    });
  } catch (error) {
    console.error('Error fetching requests by month:', error);
    throw error;
  }
};
