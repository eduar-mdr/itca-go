import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Button from '../button/Button';
import { lightTheme, spacing, borderRadius, fontSize } from '../../styles/theme';

const DEFAULT_REGION = { latitude: 13.6929, longitude: -89.2182, latitudeDelta: 0.02, longitudeDelta: 0.02 };

export default function LocationPicker({ label = 'Seleccionar ubicación', value, onChange, theme = lightTheme }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(value?.address || '');
  const [region, setRegion] = useState(
    value?.coordinates
      ? { latitude: value.coordinates[1], longitude: value.coordinates[0], latitudeDelta: 0.02, longitudeDelta: 0.02 }
      : DEFAULT_REGION
  );

  const handleOpen = () => {
    setAddress(value?.address || '');
    setRegion(
      value?.coordinates
        ? { latitude: value.coordinates[1], longitude: value.coordinates[0], latitudeDelta: 0.02, longitudeDelta: 0.02 }
        : DEFAULT_REGION
    );
    setOpen(true);
  };

  const handleConfirm = () => {
    if (!address.trim()) return;
    onChange({ coordinates: [region.longitude, region.latitude], address: address.trim() });
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
            <MapView
              style={styles.map}
              initialRegion={region}
              onRegionChangeComplete={setRegion}
            />
            <View style={styles.markerFixed}>
              <View style={[styles.markerDot, { backgroundColor: theme.accent }]} />
              <View style={[styles.markerStem, { backgroundColor: theme.accent }]} />
            </View>
          </View>

          <View style={styles.footer}>
            <Button title="Confirmar" variant="cta" onPress={handleConfirm} disabled={!address.trim()} />
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
