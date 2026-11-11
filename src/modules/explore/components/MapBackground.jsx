import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text } from 'react-native';
import { lightTheme } from '../../../styles/theme';

const DEFAULT_REGION = {
  latitude: 13.6929,
  longitude: -89.2182,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const toLatLng = (geoPoint) => {
  if (!geoPoint?.coordinates || geoPoint.coordinates.length < 2) return null;
  return { latitude: geoPoint.coordinates[1], longitude: geoPoint.coordinates[0] };
};

export default function MapBackground({ routes = [], trips = [], userLocation, onMarkerPress }) {
  const region = userLocation
    ? { ...DEFAULT_REGION, latitude: userLocation.latitude, longitude: userLocation.longitude }
    : DEFAULT_REGION;

  return (
    <MapView style={styles.map} initialRegion={region} showsUserLocation>
      {routes.map((route) => {
        const coord = toLatLng(route.currentLocation) || toLatLng(route.originLocation);
        if (!coord) return null;
        return (
          <Marker
            key={`route-${route._id}`}
            coordinate={coord}
            pinColor={lightTheme.primary}
            onPress={() => onMarkerPress?.(route, 'route')}
          >
            <Callout>
              <Text style={styles.callout}>{route.name}</Text>
            </Callout>
          </Marker>
        );
      })}

      {trips.map((trip) => {
        const routeLocation = trip.route?.originLocation || trip.route?.currentLocation;
        const coord = toLatLng(routeLocation);
        if (!coord) return null;
        return (
          <Marker
            key={`trip-${trip._id}`}
            coordinate={coord}
            pinColor={lightTheme.accent}
            onPress={() => onMarkerPress?.(trip, 'trip')}
          >
            <Callout>
              <Text style={styles.callout}>{trip.origin}</Text>
            </Callout>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    fontSize: 13,
    fontWeight: '600',
    color: lightTheme.textPrimary,
    maxWidth: 180,
  },
});
