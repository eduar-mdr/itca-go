import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as routeService from '../../../services/route.service';
import api from '../../../services/api.service';
import * as realtimeService from '../../../services/realtime.service';
import { setCurrentItem, setLoading, setError, clearDetail } from '../stores/routeDetailSlice';

export default function useRouteDetail(id, type) {
  const dispatch = useDispatch();
  const { currentItem, loading, error } = useSelector((s) => s.routeDetail);
  const [realtimeLocation, setRealtimeLocation] = useState(null);

  const fetchItem = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      let res;
      if (type === 'route') {
        res = await routeService.getRouteById(id);
      } else {
        res = await api.get(`/trips/${id}`);
      }
      dispatch(setCurrentItem({ item: res.data, type }));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err.message || 'Error al cargar detalle'));
    }
  }, [id, type, dispatch]);

  useEffect(() => {
    fetchItem();
    return () => dispatch(clearDetail());
  }, [fetchItem, dispatch]);

  useEffect(() => {
    if (!id) return;

    let unsubscribe;
    if (type === 'route') {
      unsubscribe = realtimeService.subscribeToRouteLocation(id, (loc) => {
        setRealtimeLocation(loc);
      });
    } else {
      unsubscribe = realtimeService.subscribeToTripStatus(id, (data) => {
        if (currentItem) {
          dispatch(setCurrentItem({
            item: { ...currentItem, status: data.status, availableSeats: data.availableSeats },
            type,
          }));
        }
      });
    }

    return () => unsubscribe?.();
  }, [id, type]);

  return { item: currentItem, loading, error, realtimeLocation, refresh: fetchItem };
}
