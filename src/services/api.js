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

// Point to your Vercel API routes - NOT directly to MongoDB
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // Uses Vercel's built-in API routes
  : 'http://localhost:5000/api'; // Local dev backend

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const recordScan = async () => {
  try {
    const response = await api.post('/scans', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw {
      error: true,
      message: error.response?.data?.message || 'Request failed',
      status: error.response?.status
    };
  }
};

export const fetchAnalytics = async () => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw {
      error: true,
      message: error.response?.data?.message || 'Request failed',
      status: error.response?.status
    };
  }
};