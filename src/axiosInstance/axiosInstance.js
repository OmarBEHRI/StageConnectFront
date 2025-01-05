
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085', // Replace with your API's base URL
  timeout: 5000, // Optional: Set a timeout (in ms)
  headers: {
    'Content-Type': 'application/json', // Default content type
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional: Add an auth token
  },
});

export default axiosInstance;