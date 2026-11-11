import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Chip from '../chip/Chip';
import Button from '../button/Button';
import DateTimePicker, { formatTimeValue } from '../datetime-picker/DateTimePicker';
import { lightTheme, spacing, fontSize } from '../../styles/theme';

export default function SchedulePicker({ label = 'Horarios', value = [], onChange, theme = lightTheme }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeSelected = (date) => {
    const formatted = formatTimeValue(date);
    if (!value.includes(formatted)) {
      onChange([...value, formatted]);
    }
    setShowPicker(false);
  };

  const handleRemove = (time) => {
    onChange(value.filter((t) => t !== time));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>

      <View style={styles.chipRow}>
        {value.length === 0 && (
          <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Sin horarios agregados</Text>
        )}
        {value.map((time) => (
          <Chip
            key={time}
            label={`${time}  x`}
            active={false}
            onPress={() => handleRemove(time)}
            theme={theme}
          />
        ))}
      </View>

      {showPicker ? (
        <DateTimePicker
          label="Seleccionar hora"
          value={null}
          onChange={handleTimeSelected}
          mode="time"
          theme={theme}
        />
      ) : (
        <Button
          title="Agregar horario"
          variant="secondary"
          onPress={() => setShowPicker(true)}
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    minHeight: 32,
    alignItems: 'center',
  },
  placeholder: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
});
