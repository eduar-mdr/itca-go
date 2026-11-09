import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, fontSize } from '../../styles/theme';

export default function AppHeader({
  title = 'ITCA Go',
  onNotificationPress,
  notificationCount = 0,
  theme,
}) {
  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <View style={[styles.bellIcon, { borderColor: theme.textSecondary }]}>
            <Text style={[styles.bellText, { color: theme.textPrimary }]}>N</Text>
          </View>
          {notificationCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>U</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  notificationButton: {
    position: 'relative',
  },
  bellIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
