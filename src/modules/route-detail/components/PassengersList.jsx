import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../../components/card/Card';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

export default function PassengersList({ passengers = [], maxVisible = 3, onShowAll, theme = lightTheme }) {
  const visible = passengers.slice(0, maxVisible);
  const hasMore = passengers.length > maxVisible;

  return (
    <Card style={styles.card} theme={theme}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Pasajeros ({passengers.length})</Text>

      {passengers.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>Sin pasajeros aún</Text>
      ) : (
        <>
          {visible.map((p) => (
            <View key={p._id} style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>
                  {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              <Text style={[styles.name, { color: theme.textPrimary }]}>{p.name}</Text>
            </View>
          ))}
          {hasMore && (
            <TouchableOpacity onPress={onShowAll}>
              <Text style={[styles.showAll, { color: theme.primary }]}>Ver todos ({passengers.length})</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  empty: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  name: {
    fontSize: fontSize.sm,
  },
  showAll: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
