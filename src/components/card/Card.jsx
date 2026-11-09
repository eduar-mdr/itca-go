import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../../styles/theme';

export default function Card({ children, style, theme }) {
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
