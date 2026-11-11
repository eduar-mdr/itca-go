import { useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import * as routeService from '../../../services/route.service';
import * as tripService from '../../../services/trip.service';

export default function useSubscription(id, type, item) {
  const userId = useSelector((s) => s.user.user?._id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSubscribed = useMemo(() => {
    if (!item || !userId) return false;
    if (type === 'route') {
      return (item.subscribers || []).some(
        (s) => (typeof s === 'string' ? s : s._id) === userId
      );
    }
    const isPassenger = (item.passengers || []).some(
      (p) => (typeof p === 'string' ? p : p._id) === userId
    );
    const isDriver = (typeof item.driver === 'string' ? item.driver : item.driver?._id) === userId;
    return isPassenger || isDriver;
  }, [item, userId, type]);

  const subscribe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (type === 'route') {
        await routeService.subscribeToRoute(id);
      } else {
        await tripService.requestSeat(id);
      }

      if (item?.hasActiveChat) {
        const label = type === 'route' ? 'ruta' : 'viaje';
        Alert.alert(
          'Diálogo en curso',
          `Esta ${label} tiene un diálogo activo. Revisa la sección de comentarios.`
        );
      }

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Error al suscribirse');
      setLoading(false);
      return false;
    }
  }, [id, type, item]);

  return { subscribe, loading, error, isSubscribed };
}
