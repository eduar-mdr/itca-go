import api from './api.service';

export const getAvailableTrips = () => api.get('/trips');

export const createTrip = (data) => api.post('/trips', data);

export const requestSeat = (id) => api.post(`/trips/${id}/request`);

export const updateTripStatus = (id, status) =>
  api.patch(`/trips/${id}/status`, { status });

export const updateTrip = (id, data) => api.put(`/trips/${id}`, data);

export const cancelRequest = (id) => api.post(`/trips/${id}/cancel-request`);

export const deleteTrip = (id) => api.delete(`/trips/${id}`);
