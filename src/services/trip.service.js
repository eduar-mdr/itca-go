import api from './api.service';

export const getAvailableTrips = () => api.get('/trips');

export const createTrip = (data) => api.post('/trips', data);

export const requestSeat = (id) => api.post(`/trips/${id}/request`);

export const updateTripStatus = (id, status) =>
  api.patch(`/trips/${id}/status`, { status });

export const deleteTrip = (id) => api.delete(`/trips/${id}`);
