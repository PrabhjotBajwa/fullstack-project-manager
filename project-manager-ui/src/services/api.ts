import axios from 'axios';

// This line reads Vercel's environment variable (REACT_APP_API_URL).
// If it's not found (like when you run 'npm start' locally),
// it will use your local server "http://localhost:5286" as a fallback.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5286";

const api = axios.create({
  baseURL: API_URL, // Use the variable here
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;