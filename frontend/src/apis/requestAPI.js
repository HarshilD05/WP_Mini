import locationsData from '../data/locations.json';
import facultiesData from '../data/faculties.json';

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
 * Submits a permission request
 * TODO: Implement server API call
 * @param {Object} requestData - The request form data
 * @returns {Promise<Object>} Response from server
 */
export const submitRequest = async (requestData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/requests', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(requestData),
    // });
    // const data = await response.json();
    // return data;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Request submitted:', requestData);
    return {
      success: true,
      message: 'Request submitted successfully',
      requestId: Math.random().toString(36).substr(2, 9)
    };
  } catch (error) {
    console.error('Error submitting request:', error);
    throw error;
  }
};
