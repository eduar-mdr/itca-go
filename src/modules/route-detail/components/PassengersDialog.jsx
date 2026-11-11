import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Dialog from '../../../components/dialog/Dialog';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

export default function PassengersDialog({ visible, onClose, passengers = [] }) {
  const renderItem = ({ item }) => {
    const initials = item.name
      ? item.name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase()
      : '??';

    return (
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.email && <Text style={styles.email}>{item.email}</Text>}
        </View>
      </View>
    );
  };

  return (
    <Dialog visible={visible} onClose={onClose} title="Pasajeros" theme={lightTheme}>
      <FlatList
        data={passengers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Sin pasajeros</Text>
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
    borderBottomColor: lightTheme.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightTheme.primary,
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
    color: lightTheme.textPrimary,
  },
  email: {
    fontSize: fontSize.xs,
    color: lightTheme.textSecondary,
    marginTop: 2,
  },
  empty: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
