import { useState } from 'react';
import { useSelector } from 'react-redux';
import * as tripService from '../../../services/trip.service';
import * as routeService from '../../../services/route.service';

export default function useCreateTrip() {
  const userRole = useSelector((s) => s.user.user?.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTrip = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await tripService.createTrip(data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message || 'Error al crear viaje');
      setLoading(false);
      return null;
    }
  };

  const createRoute = async (data) => {
    if (userRole !== 'driver') {
      setError('Solo los conductores pueden crear rutas institucionales');
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await routeService.createRoute(data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.message || 'Error al crear ruta');
      setLoading(false);
      return null;
    }
  };

  return { createTrip, createRoute, loading, error, userRole };
}
