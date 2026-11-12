import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { lightTheme, spacing, borderRadius, fontSize } from '../../../styles/theme';

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

export default function NotificationItem({ notification, onPress }) {
  const isUnread = !notification.read;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isUnread ? lightTheme.surface : lightTheme.background,
          borderLeftColor: isUnread ? lightTheme.accent : 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, isUnread && styles.titleUnread]}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>
      <Text style={styles.time}>{getRelativeTime(notification.createdAt)}</Text>
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
    borderBottomColor: lightTheme.border,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    color: lightTheme.textPrimary,
    marginBottom: 2,
  },
  titleUnread: {
    fontWeight: '700',
  },
  body: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    lineHeight: 20,
  },
  time: {
    fontSize: fontSize.xs,
    color: lightTheme.textSecondary,
  },
});
