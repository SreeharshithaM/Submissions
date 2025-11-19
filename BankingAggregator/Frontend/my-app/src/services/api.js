// services/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://localhost:7028/api/Auth/login', // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;