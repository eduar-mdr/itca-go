import api from './api.service';

export const syncUser = (userData) => api.post('/users/sync', userData);

export const getProfile = () => api.get('/users/profile');
