import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

const getRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
};

export default function NotificationItem({ notification, onPress, theme = lightTheme }) {
  const isUnread = !notification.read;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isUnread ? theme.surface : theme.background,
          borderLeftColor: isUnread ? theme.accent : 'transparent',
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }, isUnread && styles.titleUnread]}>
          {notification.title}
        </Text>
        <Text style={[styles.body, { color: theme.textSecondary }]} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
      <Text style={[styles.time, { color: theme.textSecondary }]}>{getRelativeTime(notification.createdAt)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderLeftWidth: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  titleUnread: {
    fontWeight: '700',
  },
  body: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  time: {
    fontSize: fontSize.xs,
  },
});
