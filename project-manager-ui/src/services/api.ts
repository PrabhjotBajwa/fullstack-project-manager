import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5286/api' // Match your C# backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;