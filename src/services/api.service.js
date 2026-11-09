import axios from 'axios';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL
  || (Platform.OS === 'android' ? 'http://192.168.1.200:3000/api' : 'http://localhost:3000/api');

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Error de conexión con el servidor';
    return Promise.reject(new Error(message));
  },
);

export default api;
