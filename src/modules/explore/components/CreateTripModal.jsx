import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text } from 'react-native';
import Dialog from '../../../components/dialog/Dialog';
import Button from '../../../components/button/Button';
import Dropdown from '../../../components/dropdown/Dropdown';
import LocationPicker from '../../../components/location-picker/LocationPicker';
import DateTimePicker from '../../../components/datetime-picker/DateTimePicker';
import SchedulePicker from '../../../components/schedule-picker/SchedulePicker';
import { useTheme } from '../../../context/ThemeContext';
import { spacing } from '../../../styles/theme';
import useCreateTrip from '../hooks/useCreateTrip';

const TYPE_OPTIONS = [
  { label: 'Viaje Compartido', value: 'trip' },
  { label: 'Ruta Institucional', value: 'route' },
];

export default function CreateTripModal({ visible, onClose, userRole }) {
  const { theme } = useTheme();
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

  const tripPriceRef = useRef(null);
  const routeDescRef = useRef(null);

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

  const isTripValid = originLocation && destinationLocation && departureTime && totalSeats.trim();
  const isRouteValid = routeName.trim() && routeOriginLocation && routeDestLocation && routeSchedule.length > 0;

  const handleSubmitTrip = async () => {
    if (!isTripValid) return;
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
    if (!isRouteValid) return;
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
  const inputStyle = [styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.surface }];

  return (
    <Dialog visible={visible} onClose={() => onClose()} title="Publicar" fullScreen theme={theme}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}

        {userRole === 'driver' && (
          <Dropdown
            label="Tipo de publicación"
            options={TYPE_OPTIONS}
            selectedValue={pubType}
            onValueChange={setPubType}
            theme={theme}
          />
        )}

        <View style={styles.spacer} />

        {showType === 'trip' ? (
          <>
            <LocationPicker label="Seleccionar origen" value={originLocation} onChange={setOriginLocation} theme={theme} />
            <LocationPicker label="Seleccionar destino" value={destinationLocation} onChange={setDestinationLocation} theme={theme} />
            <DateTimePicker label="Fecha y hora de salida" value={departureTime} onChange={setDepartureTime} mode="datetime" theme={theme} />
            <TextInput
              style={inputStyle}
              placeholder="Cupos disponibles"
              placeholderTextColor={theme.textSecondary}
              value={totalSeats}
              onChangeText={setTotalSeats}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => tripPriceRef.current?.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={tripPriceRef}
              style={inputStyle}
              placeholder="Precio simulado (opcional)"
              placeholderTextColor={theme.textSecondary}
              value={simulatedPrice}
              onChangeText={setSimulatedPrice}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={handleSubmitTrip}
            />
            <Button title="Publicar Viaje" variant="cta" onPress={handleSubmitTrip} loading={loading} disabled={!isTripValid} theme={theme} />
          </>
        ) : (
          <>
            <TextInput
              style={inputStyle}
              placeholder="Nombre de la ruta"
              placeholderTextColor={theme.textSecondary}
              value={routeName}
              onChangeText={setRouteName}
              returnKeyType="next"
              onSubmitEditing={() => routeDescRef.current?.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={routeDescRef}
              style={inputStyle}
              placeholder="Descripción"
              placeholderTextColor={theme.textSecondary}
              value={routeDesc}
              onChangeText={setRouteDesc}
              returnKeyType="done"
              multiline
            />
            <LocationPicker label="Seleccionar origen de la ruta" value={routeOriginLocation} onChange={setRouteOriginLocation} theme={theme} />
            <LocationPicker label="Seleccionar destino de la ruta" value={routeDestLocation} onChange={setRouteDestLocation} theme={theme} />
            <SchedulePicker value={routeSchedule} onChange={setRouteSchedule} theme={theme} />
            <Button title="Publicar Ruta" variant="primary" onPress={handleSubmitRoute} loading={loading} disabled={!isRouteValid} theme={theme} />
          </>
        )}
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
