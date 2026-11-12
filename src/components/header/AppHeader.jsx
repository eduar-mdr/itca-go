import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightTheme, spacing, fontSize, borderRadius } from '../../styles/theme';

export default function AppHeader({
  title = 'ITCA Go',
  transparent = false,
  titleInChip = false,
  titleColor,
  chipBackground,
  onNotificationPress,
  notificationCount = 0,
  theme = lightTheme,
}) {
  const insets = useSafeAreaInsets();
  const bgColor = transparent ? 'transparent' : theme.background;
  const borderColor = transparent ? 'transparent' : theme.border;
  const resolvedTitleColor = titleColor || theme.textPrimary;
  const notifBg = chipBackground || theme.surface;

  const renderTitle = () => {
    if (titleInChip) {
      const chipBg = chipBackground || '#ffffff';
      const chipText = titleColor || theme.accent;
      return (
        <View style={[styles.chip, { backgroundColor: chipBg }]}>
          <Text style={[styles.chipText, { color: chipText }]}>{title}</Text>
        </View>
      );
    }
    return <Text style={[styles.title, { color: resolvedTitleColor }]}>{title}</Text>;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderBottomColor: borderColor, paddingTop: insets.top + spacing.xs }]}>
      {renderTitle()}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <View style={[styles.bellIcon, { backgroundColor: notifBg }]}>
            <Text style={[styles.bellText, { color: transparent ? theme.textPrimary : theme.textPrimary }]}>N</Text>
          </View>
          {notificationCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
    paddingBottom: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  chip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  chipText: {
    fontSize: fontSize.md,
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
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
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
});
