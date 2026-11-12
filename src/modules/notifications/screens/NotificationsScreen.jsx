import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationItem from '../components/NotificationItem';
import useNotifications from '../hooks/useNotifications';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markRead, markAllRead } = useNotifications();

  const handlePress = (notification) => {
    markRead(notification.id);
    if (notification.entityId) {
      const path =
        notification.type === 'trip'
          ? `/trip-detail/${notification.entityId}`
          : `/route-detail/${notification.entityId}`;
      router.push(path);
    }
  };

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handlePress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: lightTheme.border,
  },
  markAll: {
    fontSize: fontSize.sm,
    color: lightTheme.primary,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: lightTheme.textSecondary,
  },
});
