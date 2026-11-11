import api from './api.service';

export const getRouteComments = (routeId) => api.get(`/routes/${routeId}/comments`);

export const addRouteComment = (routeId, text) => api.post(`/routes/${routeId}/comments`, { text });

export const getTripComments = (tripId) => api.get(`/trips/${tripId}/comments`);

export const addTripComment = (tripId, text) => api.post(`/trips/${tripId}/comments`, { text });
