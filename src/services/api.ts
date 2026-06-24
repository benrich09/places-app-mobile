import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️  Change this to your machine's local IP when testing on a real device
// e.g. 'http://192.168.1.100:3000/api'
// On Android emulator use: 'http://10.0.2.2:3000/api'
export const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; name: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
};

// Places
export const placesAPI = {
  getByCategory: (category: string, city?: string) =>
    api.get(`/places/category/${category}`, { params: { city } }),
  getAll: (city?: string) =>
    api.get('/places', { params: { city } }),
  getNearby: (lat: number, lng: number, radius?: number, category?: string) =>
    api.get('/places/nearby', { params: { lat, lng, radius, category } }),
  getById: (id: string) =>
    api.get(`/places/${id}`),
};

// History
export const historyAPI = {
  getHistory: () => api.get('/history'),
  logVisit: (data: { placeId: string; placeName: string; placeCategory: string; placeCity: string }) =>
    api.post('/history', data),
  clearHistory: () => api.delete('/history'),
};

// User
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: { name?: string; phone?: string }) =>
    api.patch('/users/me', data),
};

export default api;