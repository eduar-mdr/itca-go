import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as routeService from '../../../services/route.service';
import api from '../../../services/api.service';
import * as realtimeService from '../../../services/realtime.service';
import { setCurrentItem, setLoading, setError, clearDetail } from '../stores/routeDetailSlice';

export default function useRouteDetail(id, type) {
  const dispatch = useDispatch();
  const { currentItem, loading, error } = useSelector((s) => s.routeDetail);
  const [realtimeLocation, setRealtimeLocation] = useState(null);
  const isFirstLoad = useRef(true);

  const fetchItem = useCallback(async () => {
    try {
      if (isFirstLoad.current) dispatch(setLoading(true));
      let res;
      if (type === 'route') {
        res = await routeService.getRouteById(id);
      } else {
        res = await api.get(`/trips/${id}`);
      }
      dispatch(setCurrentItem({ item: res.data, type }));
      if (isFirstLoad.current) {
        dispatch(setLoading(false));
        isFirstLoad.current = false;
      }
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

    const unsubscribers = [];

    if (type === 'route') {
      unsubscribers.push(
        realtimeService.subscribeToRouteLocation(id, (loc) => {
          setRealtimeLocation(loc);
        })
      );
      unsubscribers.push(
        realtimeService.subscribeToRouteChanges(id, () => {
          if (!isFirstLoad.current) fetchItem();
        })
      );
    } else {
      unsubscribers.push(
        realtimeService.subscribeToTripStatus(id, () => {
          if (!isFirstLoad.current) fetchItem();
        })
      );
    }

    return () => unsubscribers.forEach((unsub) => unsub?.());
  }, [id, type, fetchItem]);

  return { item: currentItem, loading, error, realtimeLocation, refresh: fetchItem };
}
