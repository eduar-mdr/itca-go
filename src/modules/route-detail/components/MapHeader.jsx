import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Map, Camera, ViewAnnotation } from '@maplibre/maplibre-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, fontSize, borderRadius } from '../../../styles/theme';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

const DEFAULT_CENTER = [-89.2182, 13.6929];

const toCoord = (geoPoint) => {
  if (!geoPoint?.coordinates || geoPoint.coordinates.length < 2) return null;
  const [lng, lat] = geoPoint.coordinates;
  if (lng === 0 && lat === 0) return null;
  return [lng, lat];
};

const fitBoundsForPoints = (points) => {
  const coords = points.filter(Boolean);
  if (coords.length < 2) return null;
  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  return {
    ne: [Math.max(...lngs) + 0.008, Math.max(...lats) + 0.008],
    sw: [Math.min(...lngs) - 0.008, Math.min(...lats) - 0.008],
  };
};

export default function MapHeader({ originLocation, destinationLocation, currentLocation, originLabel, destinationLabel }) {
  const { theme } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const cameraRef = useRef(null);

  const originCoord = toCoord(originLocation);
  const destCoord = toCoord(destinationLocation);
  const currentCoord = toCoord(currentLocation);
  const center = originCoord || DEFAULT_CENTER;
  const allPoints = [originCoord, destCoord, currentCoord];
  const bounds = fitBoundsForPoints(allPoints);

  const handleMapLoaded = useCallback(() => {
    if (bounds && cameraRef.current) {
      cameraRef.current.fitBounds(bounds.ne, bounds.sw, 40, 500);
    }
  }, []);

  const toggleMarker = (id) => {
    setSelectedMarker(prev => prev === id ? null : id);
  };

  return (
    <Map
      style={styles.map}
      mapStyle={STYLE_URL}
      onDidFinishLoadingMap={handleMapLoaded}
      scrollEnabled={true}
      zoomEnabled={true}
      pitchEnabled={false}
      rotateEnabled={false}
    >
      <Camera
        ref={cameraRef}
        initialViewState={{ center, zoom: 13 }}
      />

      {originCoord && (
        <ViewAnnotation id="origin" lngLat={originCoord} anchor={{ x: 0.5, y: 1 }}>
          <TouchableOpacity onPress={() => toggleMarker('origin')} activeOpacity={0.8}>
            {selectedMarker === 'origin' && (
              <View style={[styles.tooltip, { backgroundColor: theme.textPrimary }]}>
                <Text style={[styles.tooltipText, { color: theme.background }]}>{originLabel || 'Origen'}</Text>
              </View>
            )}
            <View style={[styles.marker, { backgroundColor: '#4caf50' }]}>
              <Text style={styles.markerLetter}>O</Text>
            </View>
          </TouchableOpacity>
        </ViewAnnotation>
      )}

      {destCoord && (
        <ViewAnnotation id="destination" lngLat={destCoord} anchor={{ x: 0.5, y: 1 }}>
          <TouchableOpacity onPress={() => toggleMarker('destination')} activeOpacity={0.8}>
            {selectedMarker === 'destination' && (
              <View style={[styles.tooltip, { backgroundColor: theme.textPrimary }]}>
                <Text style={[styles.tooltipText, { color: theme.background }]}>{destinationLabel || 'Destino'}</Text>
              </View>
            )}
            <View style={[styles.marker, { backgroundColor: '#f44336' }]}>
              <Text style={styles.markerLetter}>D</Text>
            </View>
          </TouchableOpacity>
        </ViewAnnotation>
      )}

      {currentCoord && (
        <ViewAnnotation id="current" lngLat={currentCoord} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={[styles.currentMarker, { borderColor: '#2196f3' }]}>
            <View style={[styles.currentDot, { backgroundColor: '#2196f3' }]} />
          </View>
        </ViewAnnotation>
      )}
    </Map>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 250,
    width: '100%',
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 3,
  },
  markerLetter: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  currentMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tooltip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    alignSelf: 'center',
    maxWidth: 200,
  },
  tooltipText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
});
