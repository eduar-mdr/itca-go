import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as tripService from '../../../services/trip.service';
import * as routeService from '../../../services/route.service';
import { setMyTrips, setMyRoutes, setLoading, setError } from '../stores/myTripsSlice';

export default function useMyTrips() {
  const dispatch = useDispatch();
  const { myTrips, myRoutes, loading, error } = useSelector((s) => s.myTrips);
  const userId = useSelector((s) => s.user.user?._id);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const [tripsRes, routesRes] = await Promise.all([
        tripService.getAvailableTrips(),
        routeService.getActiveRoutes(),
      ]);

      const allTrips = tripsRes.data || [];
      const allRoutes = routesRes.data || [];

      // NOTE: GET /trips only returns status=available. Trips with other statuses
      // (in_progress, full, delayed) won't appear here. A dedicated backend
      // endpoint for "my trips" would be needed to cover all statuses.
      const filteredTrips = allTrips.filter(
        (t) =>
          t.driver?._id === userId ||
          (t.passengers || []).some((p) => (typeof p === 'string' ? p === userId : p._id === userId)),
      );

      const filteredRoutes = allRoutes.filter(
        (r) =>
          r.assignedDriver?._id === userId ||
          (r.subscribers || []).some((s) => (typeof s === 'string' ? s === userId : s._id === userId)),
      );

      dispatch(setMyTrips(filteredTrips));
      dispatch(setMyRoutes(filteredRoutes));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err.message || 'Error al cargar tus viajes'));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { myTrips, myRoutes, loading, error, refresh: fetchData };
}
