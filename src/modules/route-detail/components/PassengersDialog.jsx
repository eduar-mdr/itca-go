import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Dialog from '../../../components/dialog/Dialog';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

export default function PassengersDialog({ visible, onClose, passengers = [], theme = lightTheme }) {
  const renderItem = ({ item }) => {
    const initials = item.name
      ? item.name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase()
      : '??';

    return (
      <View style={[styles.row, { borderBottomColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
          {item.email && <Text style={[styles.email, { color: theme.textSecondary }]}>{item.email}</Text>}
        </View>
      </View>
    );
  };

  return (
    <Dialog visible={visible} onClose={onClose} title="Pasajeros" theme={theme}>
      <FlatList
        data={passengers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>Sin pasajeros</Text>
        }
      />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  email: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  empty: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
