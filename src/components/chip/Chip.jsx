import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../styles/theme';

export default function Chip({ label, active = false, icon, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.container,
        {
          backgroundColor: active ? theme.primary : theme.surface,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      {icon && <>{icon}</>}
      <Text
        style={[
          styles.label,
          { color: active ? '#ffffff' : theme.textPrimary },
          icon && styles.labelWithIcon,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  labelWithIcon: {
    marginLeft: spacing.xs,
  },
});
