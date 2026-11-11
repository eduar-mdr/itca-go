import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as routeService from '../../../services/route.service';
import * as tripService from '../../../services/trip.service';
import {
  setRoutes,
  setTrips,
  setFilter as setFilterAction,
  setLoading,
  setError,
} from '../stores/exploreSlice';

export default function useExploreRoutes() {
  const dispatch = useDispatch();
  const { routes, trips, filter, loading, error } = useSelector((s) => s.explore);

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const [routesRes, tripsRes] = await Promise.all([
        routeService.getActiveRoutes(),
        tripService.getAvailableTrips(),
      ]);

      dispatch(setRoutes(routesRes.data));
      dispatch(setTrips(tripsRes.data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err.message || 'Error al cargar datos'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    if (filter === 'institutional') return routes;
    if (filter === 'carpooling') return trips;
    return [...routes, ...trips];
  }, [routes, trips, filter]);

  const changeFilter = useCallback(
    (value) => dispatch(setFilterAction(value)),
    [dispatch],
  );

  return {
    items: filteredItems,
    routes,
    trips,
    filter,
    loading,
    error,
    refresh: fetchData,
    setFilter: changeFilter,
  };
}
