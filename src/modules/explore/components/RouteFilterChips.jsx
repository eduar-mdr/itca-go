import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Chip from '../../../components/chip/Chip';
import { lightTheme, spacing } from '../../../styles/theme';

const FILTERS = [
  { label: 'Todas', value: 'all' },
  { label: 'Institucionales', value: 'institutional' },
  { label: 'Carpooling', value: 'carpooling' },
];

export default function RouteFilterChips({ activeFilter, onFilterChange }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            active={activeFilter === f.value}
            onPress={() => onFilterChange(f.value)}
            theme={lightTheme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: lightTheme.background,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
});
