import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useTheme } from '../../../context/ThemeContext';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

const DEFAULT_CENTER = [-89.2796, 13.6769];
const DEFAULT_ZOOM = 12;

const toCoord = (geoPoint) => {
  if (!geoPoint?.coordinates || geoPoint.coordinates.length < 2) return null;
  return geoPoint.coordinates;
};

export default function MapBackground({ routes = [], trips = [], userLocation, onMarkerPress }) {
  const { theme } = useTheme();

  const center = userLocation
    ? [userLocation.longitude, userLocation.latitude]
    : DEFAULT_CENTER;

  return (
    <MapLibreGL.MapView style={styles.map} styleURL={STYLE_URL}>
      <MapLibreGL.Camera
        defaultSettings={{ centerCoordinate: center, zoomLevel: DEFAULT_ZOOM }}
      />

      {userLocation && (
        <MapLibreGL.UserLocation visible />
      )}

      {routes.map((route) => {
        const coord = toCoord(route.currentLocation) || toCoord(route.originLocation);
        if (!coord) return null;
        return (
          <MapLibreGL.MarkerView
            key={`route-${route._id}`}
            coordinate={coord}
          >
            <View
              style={[styles.marker, { backgroundColor: theme.primary }]}
              onTouchEnd={() => onMarkerPress?.(route, 'route')}
            >
              <Text style={styles.markerText}>R</Text>
            </View>
          </MapLibreGL.MarkerView>
        );
      })}

      {trips.map((trip) => {
        const coord = toCoord(trip.originLocation);
        if (!coord) return null;
        return (
          <MapLibreGL.MarkerView
            key={`trip-${trip._id}`}
            coordinate={coord}
          >
            <View
              style={[styles.marker, { backgroundColor: theme.accent }]}
              onTouchEnd={() => onMarkerPress?.(trip, 'trip')}
            >
              <Text style={styles.markerText}>V</Text>
            </View>
          </MapLibreGL.MarkerView>
        );
      })}
    </MapLibreGL.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  markerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
