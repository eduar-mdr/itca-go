import api from './api.service';

export const syncUser = (userData) => api.post('/users/sync', userData);

export const getProfile = () => api.get('/users/profile');

export const getMyRoutes = () => api.get('/users/my-routes');

export const getMyTrips = () => api.get('/users/my-trips');

export const saveFcmToken = (fcmToken) => api.post('/users/fcm-token', { fcmToken });
