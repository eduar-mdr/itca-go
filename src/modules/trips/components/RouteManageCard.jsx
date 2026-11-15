import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../../components/card/Card';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../styles/theme';

const STATUS_LABELS = {
  available: { text: 'Disponible', color: '#4caf50' },
  full: { text: 'Lleno', color: '#f44336' },
  in_progress: { text: 'En curso', color: '#2196f3' },
  delayed: { text: 'Retrasado', color: '#ff9800' },
  cancelled: { text: 'Cancelado', color: '#9e9e9e' },
  completed: { text: 'Completado', color: '#777' },
};

export default function RouteManageCard({ item, type, onEdit, onStatusChange, onPress }) {
  const { theme } = useTheme();

  const isRoute = type === 'route';
  const statusInfo = !isRoute && STATUS_LABELS[item.status];

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card style={styles.card} theme={theme}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={1}>
            {isRoute ? item.name : `${item.origin} → ${item.destination}`}
          </Text>
          {isRoute ? (
            <View style={[styles.badge, { backgroundColor: item.active ? '#4caf50' : '#9e9e9e' }]}>
              <Text style={styles.badgeText}>{item.active ? 'Activa' : 'Inactiva'}</Text>
            </View>
          ) : statusInfo ? (
            <View style={[styles.badge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.badgeText}>{statusInfo.text}</Text>
            </View>
          ) : null}
        </View>

        {isRoute && (
          <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.origin} → {item.destination}
          </Text>
        )}

        {!isRoute && (
          <Text style={[styles.detail, { color: theme.textSecondary }]}>
            Cupos: {item.availableSeats}/{item.totalSeats} · {item.driver?.name || 'Sin conductor'}
          </Text>
        )}

        {isRoute && item.schedule?.length > 0 && (
          <Text style={[styles.schedule, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.schedule.slice(0, 3).join(' · ')}
          </Text>
        )}

        <View style={[styles.actions, { borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Text style={[styles.actionText, { color: theme.primary }]}>Editar</Text>
          </TouchableOpacity>

          {isRoute ? (
            <TouchableOpacity onPress={onStatusChange} style={styles.actionBtn}>
              <Text style={[styles.actionText, { color: item.active ? theme.accent : '#4caf50' }]}>
                {item.active ? 'Desactivar' : 'Activar'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onStatusChange} style={styles.actionBtn}>
              <Text style={[styles.actionText, { color: theme.primary }]}>Estado</Text>
            </TouchableOpacity>
          )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  detail: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  schedule: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  actionBtn: {
    paddingVertical: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
