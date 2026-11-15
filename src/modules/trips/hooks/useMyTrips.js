import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as authService from '../../../services/auth.service';
import {
  setCreatedRoutes,
  setSubscribedRoutes,
  setCreatedTrips,
  setSubscribedTrips,
  setLoading,
  setError,
} from '../stores/myTripsSlice';

export default function useMyTrips() {
  const dispatch = useDispatch();
  const {
    createdRoutes,
    subscribedRoutes,
    createdTrips,
    subscribedTrips,
    loading,
    error,
  } = useSelector((s) => s.myTrips);

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const [routesRes, tripsRes] = await Promise.all([
        authService.getMyRoutes(),
        authService.getMyTrips(),
      ]);

      const allRoutes = routesRes.data || [];
      const allTrips = tripsRes.data || [];

      dispatch(setCreatedRoutes(allRoutes.filter((r) => r.relationship === 'owner')));
      dispatch(setSubscribedRoutes(allRoutes.filter((r) => r.relationship === 'subscribed')));
      dispatch(setCreatedTrips(allTrips.filter((t) => t.relationship === 'owner')));
      dispatch(setSubscribedTrips(allTrips.filter((t) => t.relationship === 'passenger')));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err.message || 'Error al cargar tus viajes'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    createdRoutes,
    subscribedRoutes,
    createdTrips,
    subscribedTrips,
    loading,
    error,
    refresh: fetchData,
  };
}
