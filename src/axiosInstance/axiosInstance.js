import axios from 'axios';

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085', // Replace with your API's base URL
  timeout: 5000, // Optional: Set a timeout (in ms)
  headers: {
    'Content-Type': 'application/json', // Default content type
    Authorization: token ? `Bearer ${token}` : '', // Optional: Add an auth token
  },
});

export default axiosInstance;