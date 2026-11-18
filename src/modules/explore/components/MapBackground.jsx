import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Map, Camera, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { useTheme } from '../../../context/ThemeContext';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

const DEFAULT_CENTER = [-89.2796, 13.6769];

const toCoord = (geoPoint) => {
  if (!geoPoint?.coordinates || geoPoint.coordinates.length < 2) return null;
  const [lng, lat] = geoPoint.coordinates;
  if (lng === 0 && lat === 0) return null;
  return [lng, lat];
};

export default function MapBackground({ routes = [], trips = [], userLocation, onMarkerPress }) {
  const { theme } = useTheme();

  const center = userLocation
    ? [userLocation.longitude, userLocation.latitude]
    : DEFAULT_CENTER;

  const routesGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: routes
      .map((route) => {
        const coord = toCoord(route.currentLocation) || toCoord(route.originLocation);
        if (!coord) return null;
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coord },
          properties: { id: route._id, name: route.name, itemType: 'route' },
        };
      })
      .filter(Boolean),
  }), [routes]);

  const tripsGeoJSON = useMemo(() => ({
    type: 'FeatureCollection',
    features: trips
      .map((trip) => {
        const coord = toCoord(trip.originLocation);
        if (!coord) return null;
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coord },
          properties: { id: trip._id, name: trip.origin, itemType: 'trip' },
        };
      })
      .filter(Boolean),
  }), [trips]);

  const handleRoutePress = (event) => {
    const feature = event?.nativeEvent?.features?.[0];
    if (!feature?.properties?.id) return;
    const route = routes.find(r => r._id === feature.properties.id);
    if (route) onMarkerPress?.(route, 'route');
  };

  const handleTripPress = (event) => {
    const feature = event?.nativeEvent?.features?.[0];
    if (!feature?.properties?.id) return;
    const trip = trips.find(t => t._id === feature.properties.id);
    if (trip) onMarkerPress?.(trip, 'trip');
  };

  return (
    <Map style={styles.map} mapStyle={STYLE_URL}>
      <Camera initialViewState={{ center, zoom: 12 }} />

      <GeoJSONSource id="routes-source" data={routesGeoJSON} onPress={handleRoutePress}>
        <Layer
          id="routes-circles"
          type="circle"
          paint={{
            'circle-radius': 12,
            'circle-color': theme.primary,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />
        <Layer
          id="routes-labels"
          type="symbol"
          layout={{
            'text-field': 'R',
            'text-size': 11,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': '#ffffff',
          }}
        />
      </GeoJSONSource>

      <GeoJSONSource id="trips-source" data={tripsGeoJSON} onPress={handleTripPress}>
        <Layer
          id="trips-circles"
          type="circle"
          paint={{
            'circle-radius': 12,
            'circle-color': theme.accent,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />
        <Layer
          id="trips-labels"
          type="symbol"
          layout={{
            'text-field': 'V',
            'text-size': 11,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': '#ffffff',
          }}
        />
      </GeoJSONSource>
    </Map>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
