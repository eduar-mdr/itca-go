import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationItem from '../components/NotificationItem';
import useNotifications from '../hooks/useNotifications';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, fontSize } from '../../../styles/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {notifications.length > 0 && (
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={[styles.markAll, { color: theme.primary }]}>Marcar todas como leídas</Text>
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
            theme={theme}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No tienes notificaciones</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  markAll: {
    fontSize: fontSize.sm,
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
  },
});
