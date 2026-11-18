import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Map, Camera } from '@maplibre/maplibre-react-native';
import Button from '../button/Button';
import { lightTheme, spacing, borderRadius, fontSize } from '../../styles/theme';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

const DEFAULT_CENTER = [-89.2182, 13.6929];

export default function LocationPicker({ label = 'Seleccionar ubicación', value, onChange, theme = lightTheme }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(value?.address || '');
  const [center, setCenter] = useState(
    value?.coordinates ? value.coordinates : DEFAULT_CENTER
  );
  const selectedCoord = useRef(value?.coordinates || DEFAULT_CENTER);

  const handleOpen = () => {
    setAddress(value?.address || '');
    const c = value?.coordinates || DEFAULT_CENTER;
    setCenter(c);
    selectedCoord.current = c;
    setOpen(true);
  };

  const handleRegionChange = (event) => {
    const center = event?.nativeEvent?.center;
    if (center) {
      selectedCoord.current = center;
    }
  };

  const handleConfirm = () => {
    if (!address.trim()) return;
    onChange({ coordinates: selectedCoord.current, address: address.trim() });
    setOpen(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleOpen} style={[styles.field, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <Text style={[styles.fieldText, { color: value?.address ? theme.textPrimary : theme.textSecondary }]}>
          {value?.address || label}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: theme.textSecondary }]}>X</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{label}</Text>
            <View style={styles.closeBtn} />
          </View>

          <TextInput
            style={[styles.addressInput, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.textPrimary }]}
            placeholder="Nombre del lugar"
            placeholderTextColor={theme.textSecondary}
            value={address}
            onChangeText={setAddress}
          />

          <View style={styles.mapWrapper}>
            <Map
              style={styles.map}
              mapStyle={STYLE_URL}
              onRegionDidChange={handleRegionChange}
            >
              <Camera initialViewState={{ center, zoom: 14 }} />
            </Map>

            <View style={styles.markerFixed}>
              <View style={[styles.markerDot, { backgroundColor: theme.accent }]} />
              <View style={[styles.markerStem, { backgroundColor: theme.accent }]} />
            </View>
          </View>

          <View style={styles.footer}>
            <Button title="Confirmar" variant="cta" onPress={handleConfirm} disabled={!address.trim()} theme={theme} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: spacing.sm,
  },
  fieldText: {
    fontSize: fontSize.md,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  addressInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    margin: spacing.md,
    fontSize: fontSize.md,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -8,
    marginTop: -28,
    alignItems: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  markerStem: {
    width: 3,
    height: 14,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  footer: {
    padding: spacing.md,
  },
});
