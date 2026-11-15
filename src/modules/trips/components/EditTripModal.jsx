import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView } from 'react-native';
import Dialog from '../../../components/dialog/Dialog';
import Button from '../../../components/button/Button';
import Dropdown from '../../../components/dropdown/Dropdown';
import LocationPicker from '../../../components/location-picker/LocationPicker';
import DateTimePicker from '../../../components/datetime-picker/DateTimePicker';
import { useTheme } from '../../../context/ThemeContext';
import * as tripService from '../../../services/trip.service';
import { spacing } from '../../../styles/theme';

const STATUS_OPTIONS = [
  { label: 'Disponible', value: 'available' },
  { label: 'Lleno', value: 'full' },
  { label: 'En curso', value: 'in_progress' },
  { label: 'Retrasado', value: 'delayed' },
  { label: 'Cancelado', value: 'cancelled' },
  { label: 'Completado', value: 'completed' },
];

export default function EditTripModal({ visible, onClose, trip }) {
  const { theme } = useTheme();
  const [originLoc, setOriginLoc] = useState(null);
  const [destLoc, setDestLoc] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [totalSeats, setTotalSeats] = useState('');
  const [simulatedPrice, setSimulatedPrice] = useState('');
  const [status, setStatus] = useState('available');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trip && visible) {
      setOriginLoc(
        trip.originLocation?.coordinates
          ? { coordinates: trip.originLocation.coordinates, address: trip.origin }
          : null
      );
      setDestLoc(
        trip.destinationLocation?.coordinates
          ? { coordinates: trip.destinationLocation.coordinates, address: trip.destination }
          : null
      );
      setDepartureTime(trip.departureTime ? new Date(trip.departureTime) : null);
      setTotalSeats(String(trip.totalSeats || ''));
      setSimulatedPrice(String(trip.simulatedPrice || ''));
      setStatus(trip.status || 'available');
      setError(null);
    }
  }, [trip, visible]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = {};
      if (originLoc) {
        data.origin = originLoc.address;
        data.originLocation = { type: 'Point', coordinates: originLoc.coordinates };
      }
      if (destLoc) {
        data.destination = destLoc.address;
        data.destinationLocation = { type: 'Point', coordinates: destLoc.coordinates };
      }
      if (departureTime) data.departureTime = departureTime.toISOString();
      if (totalSeats.trim()) data.totalSeats = parseInt(totalSeats, 10);
      if (simulatedPrice.trim()) data.simulatedPrice = parseFloat(simulatedPrice);

      await tripService.updateTrip(trip._id, data);

      if (status !== trip.status) {
        await tripService.updateTripStatus(trip._id, status);
      }

      setLoading(false);
      onClose(true);
    } catch (err) {
      setError(err.message || 'Error al actualizar el viaje');
      setLoading(false);
    }
  };

  return (
    <Dialog visible={visible} onClose={() => onClose()} title="Editar Viaje" fullScreen theme={theme}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}

        <LocationPicker label="Origen" value={originLoc} onChange={setOriginLoc} theme={theme} />
        <LocationPicker label="Destino" value={destLoc} onChange={setDestLoc} theme={theme} />
        <DateTimePicker label="Fecha y hora de salida" value={departureTime} onChange={setDepartureTime} mode="datetime" theme={theme} />

        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.surface }]}
          placeholder="Cupos totales"
          placeholderTextColor={theme.textSecondary}
          value={totalSeats}
          onChangeText={setTotalSeats}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.surface }]}
          placeholder="Precio simulado"
          placeholderTextColor={theme.textSecondary}
          value={simulatedPrice}
          onChangeText={setSimulatedPrice}
          keyboardType="decimal-pad"
        />

        <Dropdown
          label="Estado"
          options={STATUS_OPTIONS}
          selectedValue={status}
          onValueChange={setStatus}
          theme={theme}
        />

        <View style={styles.spacer} />

        <Button
          title="Guardar cambios"
          variant="primary"
          onPress={handleSave}
          loading={loading}
          theme={theme}
        />
      </ScrollView>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  spacer: {
    height: spacing.sm,
  },
});
