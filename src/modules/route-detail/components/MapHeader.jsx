import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

const DEFAULT_CENTER = [-89.2182, 13.6929];
const DEFAULT_ZOOM = 13;

const toCoord = (geoPoint) => {
  if (!geoPoint?.coordinates || geoPoint.coordinates.length < 2) return null;
  return geoPoint.coordinates;
};

const getBounds = (points) => {
  const coords = points.filter(Boolean);
  if (coords.length === 0) return null;
  if (coords.length === 1) return null;

  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);

  return {
    ne: [Math.max(...lngs) + 0.005, Math.max(...lats) + 0.005],
    sw: [Math.min(...lngs) - 0.005, Math.min(...lats) - 0.005],
  };
};

export default function MapHeader({ originLocation, destinationLocation, currentLocation }) {
  const cameraRef = useRef(null);
  const originCoord = toCoord(originLocation);
  const destCoord = toCoord(destinationLocation);
  const currentCoord = toCoord(currentLocation);

  const bounds = getBounds([originCoord, destCoord, currentCoord]);
  const center = originCoord || DEFAULT_CENTER;

  useEffect(() => {
    if (!cameraRef.current || !currentCoord) return;
    const newBounds = getBounds([originCoord, destCoord, currentCoord]);
    if (newBounds) {
      cameraRef.current.fitBounds(newBounds.ne, newBounds.sw, 50, 300);
    }
  }, [currentCoord?.[0], currentCoord?.[1]]);

  return (
    <MapLibreGL.MapView style={styles.map} styleURL={STYLE_URL}>
      <MapLibreGL.Camera
        ref={cameraRef}
        defaultSettings={
          bounds
            ? { bounds: { ne: bounds.ne, sw: bounds.sw, paddingTop: 50, paddingBottom: 50, paddingLeft: 50, paddingRight: 50 } }
            : { centerCoordinate: center, zoomLevel: DEFAULT_ZOOM }
        }
      />

      {originCoord && (
        <MapLibreGL.MarkerView coordinate={originCoord}>
          <View style={[styles.marker, { backgroundColor: '#4caf50' }]}>
            <View style={styles.markerInner} />
          </View>
        </MapLibreGL.MarkerView>
      )}

      {destCoord && (
        <MapLibreGL.MarkerView coordinate={destCoord}>
          <View style={[styles.marker, { backgroundColor: '#f44336' }]}>
            <View style={styles.markerInner} />
          </View>
        </MapLibreGL.MarkerView>
      )}

      {currentCoord && (
        <MapLibreGL.MarkerView coordinate={currentCoord}>
          <View style={[styles.marker, { backgroundColor: '#2196f3' }]}>
            <View style={styles.markerInner} />
          </View>
        </MapLibreGL.MarkerView>
      )}
    </MapLibreGL.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 250,
    width: '100%',
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 3,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
});
