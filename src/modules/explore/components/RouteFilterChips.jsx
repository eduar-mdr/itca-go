import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Chip from '../../../components/chip/Chip';
import { useTheme } from '../../../context/ThemeContext';
import { spacing } from '../../../styles/theme';

const FILTERS = [
  { label: 'Todas', value: 'all' },
  { label: 'Institucionales', value: 'institutional' },
  { label: 'Carpooling', value: 'carpooling' },
];

export default function RouteFilterChips({ activeFilter, onFilterChange }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
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
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
});
