import React, { useState, useEffect } from 'react';
import { View, TextInput, Switch, Text, StyleSheet, ScrollView } from 'react-native';
import Dialog from '../../../components/dialog/Dialog';
import Button from '../../../components/button/Button';
import LocationPicker from '../../../components/location-picker/LocationPicker';
import SchedulePicker from '../../../components/schedule-picker/SchedulePicker';
import { useTheme } from '../../../context/ThemeContext';
import * as routeService from '../../../services/route.service';
import { spacing } from '../../../styles/theme';

export default function EditRouteModal({ visible, onClose, route }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [originLoc, setOriginLoc] = useState(null);
  const [destLoc, setDestLoc] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (route && visible) {
      setName(route.name || '');
      setDescription(route.description || '');
      setOriginLoc(
        route.originLocation?.coordinates
          ? { coordinates: route.originLocation.coordinates, address: route.origin }
          : null
      );
      setDestLoc(
        route.destinationLocation?.coordinates
          ? { coordinates: route.destinationLocation.coordinates, address: route.destination }
          : null
      );
      setSchedule(route.schedule || []);
      setActive(route.active !== false);
      setError(null);
    }
  }, [route, visible]);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = {
        name: name.trim(),
        description: description.trim(),
        active,
        schedule,
      };
      if (originLoc) {
        data.origin = originLoc.address;
        data.originLocation = { type: 'Point', coordinates: originLoc.coordinates };
      }
      if (destLoc) {
        data.destination = destLoc.address;
        data.destinationLocation = { type: 'Point', coordinates: destLoc.coordinates };
      }
      await routeService.updateRoute(route._id, data);
      setLoading(false);
      onClose(true);
    } catch (err) {
      setError(err.message || 'Error al actualizar la ruta');
      setLoading(false);
    }
  };

  return (
    <Dialog visible={visible} onClose={() => onClose()} title="Editar Ruta" fullScreen theme={theme}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}

        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.surface }]}
          placeholder="Nombre de la ruta"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.surface }]}
          placeholder="Descripción"
          placeholderTextColor={theme.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <LocationPicker label="Origen de la ruta" value={originLoc} onChange={setOriginLoc} theme={theme} />
        <LocationPicker label="Destino de la ruta" value={destLoc} onChange={setDestLoc} theme={theme} />
        <SchedulePicker value={schedule} onChange={setSchedule} theme={theme} />

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>Ruta activa</Text>
          <Switch
            value={active}
            onValueChange={setActive}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={active ? '#ffffff' : theme.surface}
          />
        </View>

        <Button
          title="Guardar cambios"
          variant="primary"
          onPress={handleSave}
          loading={loading}
          disabled={!name.trim()}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
