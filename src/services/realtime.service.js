import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';

export const subscribeToRouteLocation = (routeId, callback) => {
  const locationRef = ref(database, `routes/${routeId}/currentLocation`);
  const handler = onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({ coordinates: data.coordinates, updatedAt: data.updatedAt });
    }
  });
  return () => off(locationRef, 'value', handler);
};

export const subscribeToTripStatus = (tripId, callback) => {
  const tripRef = ref(database, `trips/${tripId}`);
  const handler = onValue(tripRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        status: data.status,
        availableSeats: data.availableSeats,
        updatedAt: data.updatedAt,
      });
    }
  });
  return () => off(tripRef, 'value', handler);
};

export const subscribeToComments = (entityType, entityId, callback) => {
  const commentsRef = ref(database, `comments/${entityType}_${entityId}`);
  const handler = onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.keys(data).map((key) => ({ _id: key, ...data[key] }));
      callback(list);
    } else {
      callback([]);
    }
  });
  return () => off(commentsRef, 'value', handler);
};
