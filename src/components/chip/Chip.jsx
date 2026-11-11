import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { lightTheme, spacing, borderRadius } from '../../styles/theme';

export default function Chip({ label, active = false, icon, onPress, theme = lightTheme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.container,
        active
          ? { backgroundColor: theme.primary, borderColor: theme.primary }
          : { backgroundColor: '#ffffff', borderColor: theme.border },
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
    justifyContent: 'center',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  labelWithIcon: {
    marginLeft: spacing.xs,
  },
});
