import locationsData from '../data/locations.json';
import facultiesData from '../data/faculties.json';

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
 * Create a new request
 * @param {Object} requestData - The request form data
 * @param {string} requestData.title - Event title
 * @param {string} requestData.description - Event description
 * @param {string} requestData.committee - Committee name
 * @param {string} requestData.venue - Event venue
 * @param {string} requestData.date - Event date
 * @param {string} requestData.startTime - Event start time
 * @param {string} requestData.endTime - Event end time
 * @returns {Promise<Object>} Response from server
 */
export const createRequest = async (requestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * Get committee-specific requests (for Lead/Chairperson)
 * @returns {Promise<Array>} Array of request objects
 */
export const getMyRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requests');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching my requests:', error);
    throw error;
  }
};

/**
 * Get all requests (for TPO, VP, Principal)
 * @param {string} status - Optional status filter (pending, approved, complete)
 * @returns {Promise<Array>} Array of request objects
 */
export const getAllRequests = async (status = null) => {
  try {
    const url = status 
      ? `${API_BASE_URL}/api/requests?status=${status}`
      : `${API_BASE_URL}/api/requests`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requests');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all requests:', error);
    throw error;
  }
};

/**
 * Approve a request
 * @param {string} reqId - Request ID
 * @returns {Promise<Object>} Response from server
 */
export const approveRequest = async (reqId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/${reqId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving request:', error);
    throw error;
  }
};

/**
 * Reject a request
 * @param {string} reqId - Request ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Response from server
 */
export const rejectRequest = async (reqId, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests/${reqId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

/**
 * Fetches the list of available locations
 * Currently reads from local JSON file
 * TODO: Update to fetch from server API endpoint
 * @returns {Promise<Array>} Array of location objects
 */
export const getLocations = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/locations');
    // const data = await response.json();
    // return data;
    
    return locationsData;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

/**
 * Fetches the list of faculty members
 * Currently reads from local JSON file
 * TODO: Update to fetch from server API endpoint
 * @returns {Promise<Array>} Array of faculty objects
 */
export const getFaculties = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/faculties');
    // const data = await response.json();
    // return data;
    
    return facultiesData;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    throw error;
  }
};

/**
 * Submits a permission request (legacy - use createRequest instead)
 * @param {Object} requestData - The request form data
 * @returns {Promise<Object>} Response from server
 */
export const submitRequest = async (requestData) => {
  return createRequest(requestData);
};
