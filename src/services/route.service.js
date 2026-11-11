import api from './api.service';

export const getActiveRoutes = () => api.get('/routes/active');

export const getRouteById = (id) => api.get(`/routes/${id}`);

export const createRoute = (data) => api.post('/routes', data);

export const updateRoute = (id, data) => api.put(`/routes/${id}`, data);

export const updateRouteLocation = (id, coordinates) =>
  api.patch(`/routes/${id}/location`, { coordinates });

export const deleteRoute = (id) => api.delete(`/routes/${id}`);

export const subscribeToRoute = (id) => api.post(`/routes/${id}/subscribe`);
