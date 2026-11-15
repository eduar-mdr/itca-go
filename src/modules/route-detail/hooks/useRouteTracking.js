import { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import * as routeService from '../../../services/route.service';

export default function useRouteTracking(routeId) {
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const watcherRef = useRef(null);

  const startTracking = async () => {
    try {
      setLoading(true);
      setError(null);

      await routeService.updateRouteStatus(routeId, 'in_progress');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50,
          timeInterval: 5000,
        },
        (position) => {
          const { longitude, latitude } = position.coords;
          routeService.updateRouteLocation(routeId, [longitude, latitude])
            .catch(() => {});
        }
      );

      watcherRef.current = watcher;
      setIsTracking(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error al iniciar el seguimiento');
      setLoading(false);
    }
  };

  const stopTracking = async (finalStatus = 'completed') => {
    try {
      setLoading(true);

      if (watcherRef.current) {
        watcherRef.current.remove();
        watcherRef.current = null;
      }

      await routeService.updateRouteStatus(routeId, finalStatus);

      setIsTracking(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error al detener el seguimiento');
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watcherRef.current) {
        watcherRef.current.remove();
        watcherRef.current = null;
      }
    };
  }, []);

  return { isTracking, startTracking, stopTracking, loading, error };
}
