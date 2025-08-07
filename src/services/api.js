// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// export const recordScan = async () => {
//   const response = await axios.post(`${API_BASE_URL}/scans`, {
//     userAgent: navigator.userAgent,
//     timestamp: new Date(),
//   });
//   return response.data;
// };

// export const fetchAnalytics = async () => {
//   const response = await axios.get(`${API_BASE_URL}/analytics`);
//   return response.data;
// };


import axios from 'axios';

// Configure API base URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'mongodb+srv://rohitharbola91:Admin@123rohit%4012345@cluster0.taxynj1.mongodb.net/yourdbname?retryWrites=true&w=majority'
  ? 'https://your-vercel-app.vercel.app/api'  // Your production backend URL
  : 'http://localhost:5000/api';              // Local development

// Create configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced error handling for MongoDB Atlas
const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    return {
      error: true,
      message: 'Request timeout. Please try again.',
      isNetworkError: true
    };
  }

  if (!error.response) {
    return {
      error: true,
      message: 'Cannot connect to server. Check your connection.',
      isNetworkError: true
    };
  }

  // MongoDB Atlas specific errors
  if (error.response.data?.error?.includes('MongoDB')) {
    return {
      error: true,
      message: 'Database operation failed',
      isDatabaseError: true,
      details: process.env.NODE_ENV === 'development' 
        ? error.response.data.error 
        : undefined
    };
  }

  return {
    error: true,
    message: error.response.data?.message || 'Request failed',
    status: error.response.status
  };
};

/**
 * Records a scan event in MongoDB Atlas
 * @returns {Promise<{success: boolean, scanId: string}>}
 */
export const recordScan = async () => {
  try {
    const response = await api.post('/scans', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('MongoDB Atlas scan recording error:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches analytics data from MongoDB Atlas
 * @returns {Promise<{totalScans: number, uniqueUsers: number, averageTimeSpent: string}>}
 */
export const fetchAnalytics = async () => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('MongoDB Atlas analytics fetch error:', error);
    throw handleApiError(error);
  }
};

// Optional: Add retry for production
export const recordScanWithRetry = async (retries = 3) => {
  try {
    return await recordScan();
  } catch (error) {
    if (retries <= 0 || !error.isNetworkError) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return recordScanWithRetry(retries - 1);
  }
};