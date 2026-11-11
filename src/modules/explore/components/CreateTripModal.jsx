import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text } from 'react-native';
import Dialog from '../../../components/dialog/Dialog';
import Button from '../../../components/button/Button';
import Dropdown from '../../../components/dropdown/Dropdown';
import LocationPicker from '../../../components/location-picker/LocationPicker';
import DateTimePicker from '../../../components/datetime-picker/DateTimePicker';
import SchedulePicker from '../../../components/schedule-picker/SchedulePicker';
import { lightTheme, spacing } from '../../../styles/theme';
import useCreateTrip from '../hooks/useCreateTrip';

const TYPE_OPTIONS = [
  { label: 'Viaje Compartido', value: 'trip' },
  { label: 'Ruta Institucional', value: 'route' },
];

export default function CreateTripModal({ visible, onClose, userRole }) {
  const { createTrip, createRoute, loading, error } = useCreateTrip();
  const [pubType, setPubType] = useState('trip');

  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [totalSeats, setTotalSeats] = useState('');
  const [simulatedPrice, setSimulatedPrice] = useState('');

  const [routeName, setRouteName] = useState('');
  const [routeDesc, setRouteDesc] = useState('');
  const [routeOriginLocation, setRouteOriginLocation] = useState(null);
  const [routeDestLocation, setRouteDestLocation] = useState(null);
  const [routeSchedule, setRouteSchedule] = useState([]);

  const resetForm = () => {
    setOriginLocation(null);
    setDestinationLocation(null);
    setDepartureTime(null);
    setTotalSeats('');
    setSimulatedPrice('');
    setRouteName('');
    setRouteDesc('');
    setRouteOriginLocation(null);
    setRouteDestLocation(null);
    setRouteSchedule([]);
    setPubType('trip');
  };

  const handleSubmitTrip = async () => {
    if (!originLocation || !destinationLocation || !departureTime || !totalSeats.trim()) return;
    const success = await createTrip({
      origin: originLocation.address,
      destination: destinationLocation.address,
      originLocation: { type: 'Point', coordinates: originLocation.coordinates },
      destinationLocation: { type: 'Point', coordinates: destinationLocation.coordinates },
      departureTime: departureTime.toISOString(),
      totalSeats: parseInt(totalSeats, 10),
      simulatedPrice: parseFloat(simulatedPrice) || 0,
    });
    if (success) { resetForm(); onClose(true); }
  };

  const handleSubmitRoute = async () => {
    if (!routeName.trim() || !routeOriginLocation || !routeDestLocation) return;
    const success = await createRoute({
      name: routeName.trim(),
      description: routeDesc.trim(),
      origin: routeOriginLocation.address,
      destination: routeDestLocation.address,
      originLocation: { type: 'Point', coordinates: routeOriginLocation.coordinates },
      destinationLocation: { type: 'Point', coordinates: routeDestLocation.coordinates },
      schedule: routeSchedule,
    });
    if (success) { resetForm(); onClose(true); }
  };

  const showType = userRole === 'driver' ? pubType : 'trip';

  return (
    <Dialog visible={visible} onClose={() => onClose()} title="Publicar" fullScreen theme={lightTheme}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {error && <Text style={styles.error}>{error}</Text>}

        {userRole === 'driver' && (
          <Dropdown
            label="Tipo de publicación"
            options={TYPE_OPTIONS}
            selectedValue={pubType}
            onValueChange={setPubType}
          />
        )}

        <View style={styles.spacer} />

        {showType === 'trip' ? (
          <>
            <LocationPicker label="Seleccionar origen" value={originLocation} onChange={setOriginLocation} />
            <LocationPicker label="Seleccionar destino" value={destinationLocation} onChange={setDestinationLocation} />
            <DateTimePicker label="Fecha y hora de salida" value={departureTime} onChange={setDepartureTime} mode="datetime" />
            <TextInput style={styles.input} placeholder="Cupos disponibles" placeholderTextColor={lightTheme.textSecondary} value={totalSeats} onChangeText={setTotalSeats} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Precio simulado (opcional)" placeholderTextColor={lightTheme.textSecondary} value={simulatedPrice} onChangeText={setSimulatedPrice} keyboardType="decimal-pad" />
            <Button title="Publicar Viaje" variant="cta" onPress={handleSubmitTrip} loading={loading} disabled={!originLocation || !destinationLocation || !departureTime || !totalSeats.trim()} />
          </>
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Nombre de la ruta" placeholderTextColor={lightTheme.textSecondary} value={routeName} onChangeText={setRouteName} />
            <TextInput style={styles.input} placeholder="Descripción" placeholderTextColor={lightTheme.textSecondary} value={routeDesc} onChangeText={setRouteDesc} multiline />
            <LocationPicker label="Seleccionar origen de la ruta" value={routeOriginLocation} onChange={setRouteOriginLocation} />
            <LocationPicker label="Seleccionar destino de la ruta" value={routeDestLocation} onChange={setRouteDestLocation} />
            <SchedulePicker value={routeSchedule} onChange={setRouteSchedule} />
            <Button title="Publicar Ruta" variant="primary" onPress={handleSubmitRoute} loading={loading} disabled={!routeName.trim() || !routeOriginLocation || !routeDestLocation} />
          </>
        )}
      </ScrollView>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: lightTheme.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: lightTheme.textPrimary,
    backgroundColor: lightTheme.surface,
    marginBottom: spacing.sm,
  },
  error: {
    color: lightTheme.accent,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  spacer: {
    height: spacing.sm,
  },
});
