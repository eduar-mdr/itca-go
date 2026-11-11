import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Button from '../button/Button';
import { lightTheme, spacing, borderRadius, fontSize } from '../../styles/theme';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const AMPM = ['AM', 'PM'];

const pad = (n) => String(n).padStart(2, '0');

const buildDays = () => Array.from({ length: 31 }, (_, i) => i + 1);
const buildYears = () => {
  const y = new Date().getFullYear();
  return [y, y + 1, y + 2];
};
const buildHours = () => Array.from({ length: 12 }, (_, i) => i + 1);
const buildMinutes = () => Array.from({ length: 60 }, (_, i) => i);

const formatDate = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const formatTime = (d) => {
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(m)} ${ap}`;
};
const formatDateTime = (d) => `${formatDate(d)} ${formatTime(d)}`;

export function formatTimeValue(date) {
  return formatTime(date);
}

export default function DateTimePicker({ label = 'Seleccionar', value, onChange, mode = 'datetime', theme = lightTheme }) {
  const [open, setOpen] = useState(false);
  const now = value || new Date();

  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [hour, setHour] = useState(now.getHours() % 12 || 12);
  const [minute, setMinute] = useState(now.getMinutes());
  const [ampm, setAmpm] = useState(now.getHours() >= 12 ? 'PM' : 'AM');

  const handleOpen = () => {
    const d = value || new Date();
    setDay(d.getDate());
    setMonth(d.getMonth());
    setYear(d.getFullYear());
    setHour(d.getHours() % 12 || 12);
    setMinute(d.getMinutes());
    setAmpm(d.getHours() >= 12 ? 'PM' : 'AM');
    setOpen(true);
  };

  const handleConfirm = () => {
    let h = hour;
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const result = new Date(year, month, day, h, minute, 0);
    onChange(result);
    setOpen(false);
  };

  const displayText = value
    ? (mode === 'date' ? formatDate(value) : mode === 'time' ? formatTime(value) : formatDateTime(value))
    : null;

  const showDate = mode === 'date' || mode === 'datetime';
  const showTime = mode === 'time' || mode === 'datetime';

  return (
    <View>
      <TouchableOpacity onPress={handleOpen} style={[styles.field, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <Text style={[styles.fieldText, { color: displayText ? theme.textPrimary : theme.textSecondary }]}>
          {displayText || label}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={[styles.content, { backgroundColor: theme.background }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{label}</Text>

            <View style={styles.columns}>
              {showDate && (
                <>
                  <Column data={buildDays()} selected={day} onSelect={setDay} label="Día" format={(v) => pad(v)} theme={theme} />
                  <Column data={Array.from({ length: 12 }, (_, i) => i)} selected={month} onSelect={setMonth} label="Mes" format={(v) => MONTHS[v]} theme={theme} />
                  <Column data={buildYears()} selected={year} onSelect={setYear} label="Año" format={(v) => String(v)} theme={theme} />
                </>
              )}
              {showTime && (
                <>
                  <Column data={buildHours()} selected={hour} onSelect={setHour} label="Hora" format={(v) => pad(v)} theme={theme} />
                  <Column data={buildMinutes()} selected={minute} onSelect={setMinute} label="Min" format={(v) => pad(v)} theme={theme} />
                  <Column data={AMPM} selected={ampm} onSelect={setAmpm} label="" format={(v) => v} theme={theme} />
                </>
              )}
            </View>

            <View style={styles.footer}>
              <Button title="Confirmar" variant="cta" onPress={handleConfirm} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function Column({ data, selected, onSelect, label, format, theme }) {
  return (
    <View style={styles.column}>
      {label ? <Text style={[styles.colLabel, { color: theme.textSecondary }]}>{label}</Text> : <View style={{ height: 20 }} />}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item)}
        style={styles.colList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = item === selected;
          return (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              style={[styles.colItem, isSelected && { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.colItemText, { color: isSelected ? '#ffffff' : theme.textPrimary }]}>
                {format(item)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    maxHeight: '75%',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  column: {
    flex: 1,
    maxWidth: 80,
  },
  colLabel: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  colList: {
    height: 200,
  },
  colItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: 2,
  },
  colItemText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  footer: {
    marginTop: spacing.md,
  },
});
