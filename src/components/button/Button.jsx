import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { lightTheme, spacing, borderRadius, fontSize } from '../../styles/theme';

const variantStyles = (theme = lightTheme) => ({
  primary: {
    container: { backgroundColor: theme.primary },
    text: { color: '#ffffff' },
    indicator: '#ffffff',
  },
  secondary: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.primary },
    text: { color: theme.primary },
    indicator: theme.primary,
  },
  cta: {
    container: { backgroundColor: theme.accent },
    text: { color: '#ffffff' },
    indicator: '#ffffff',
  },
});

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  theme = lightTheme,
}) {
  const variants = variantStyles(theme);
  const current = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.container,
        current.container,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={current.indicator} size="small" />
      ) : (
        <Text style={[styles.text, current.text]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
