import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const toLatLng = (geoPoint) => {
  if (!geoPoint?.coordinates || geoPoint.coordinates.length < 2) return null;
  return { latitude: geoPoint.coordinates[1], longitude: geoPoint.coordinates[0] };
};

const DEFAULT_REGION = {
  latitude: 13.6929,
  longitude: -89.2182,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapHeader({ originLocation, destinationLocation, currentLocation }) {
  const mapRef = useRef(null);
  const originCoord = toLatLng(originLocation);
  const destCoord = toLatLng(destinationLocation);
  const currentCoord = toLatLng(currentLocation);

  useEffect(() => {
    if (!mapRef.current) return;
    const points = [originCoord, destCoord, currentCoord].filter(Boolean);
    if (points.length >= 2) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [originCoord?.latitude, destCoord?.latitude, currentCoord?.latitude]);

  const initialRegion = originCoord
    ? { ...DEFAULT_REGION, latitude: originCoord.latitude, longitude: originCoord.longitude }
    : DEFAULT_REGION;

  return (
    <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion} showsUserLocation>
      {originCoord && (
        <Marker coordinate={originCoord} pinColor="green" title="Origen" />
      )}
      {destCoord && (
        <Marker coordinate={destCoord} pinColor="red" title="Destino" />
      )}
      {currentCoord && (
        <Marker coordinate={currentCoord} pinColor="blue" title="Ubicación actual" />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 250,
    width: '100%',
  },
});
