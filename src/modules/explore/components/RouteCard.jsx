import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../../components/card/Card';
import { lightTheme, spacing, borderRadius, fontSize } from '../../../styles/theme';

const STATUS_COLORS = {
  available: '#2e7d32',
  full: lightTheme.accent,
  in_progress: lightTheme.primary,
  delayed: '#e65100',
  completed: lightTheme.textSecondary,
  cancelled: lightTheme.textSecondary,
};

const STATUS_LABELS = {
  available: 'Disponible',
  full: 'Lleno',
  in_progress: 'En proceso',
  delayed: 'Retrasado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export default function RouteCard({ item, type, onPress }) {
  if (type === 'route') {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Card style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.route}>{item.origin} → {item.destination}</Text>
          {item.schedule?.length > 0 && (
            <Text style={styles.detail}>Horarios: {item.schedule.slice(0, 2).join(', ')}{item.schedule.length > 2 ? '...' : ''}</Text>
          )}
          {item.assignedDriver && (
            <Text style={styles.detail}>Conductor: {item.assignedDriver.name || item.assignedDriver}</Text>
          )}
          <View style={[styles.badge, { backgroundColor: '#2e7d32' }]}>
            <Text style={styles.badgeText}>Ruta Institucional</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  const statusColor = STATUS_COLORS[item.status] || lightTheme.textSecondary;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card style={styles.card}>
        <Text style={styles.name}>{item.origin} → {item.destination}</Text>
        <Text style={styles.detail}>Salida: {formatDate(item.departureTime)}</Text>
        <Text style={styles.detail}>
          Cupos: {item.availableSeats}/{item.totalSeats}
        </Text>
        {item.driver && (
          <Text style={styles.detail}>Conductor: {item.driver.name || item.driver}</Text>
        )}
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{STATUS_LABELS[item.status] || item.status}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: lightTheme.textPrimary,
    marginBottom: spacing.xs,
  },
  route: {
    fontSize: fontSize.sm,
    color: lightTheme.primary,
    marginBottom: spacing.xs,
  },
  detail: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    marginBottom: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
