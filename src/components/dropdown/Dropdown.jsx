import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { lightTheme, spacing, borderRadius, fontSize } from '../../styles/theme';

export default function Dropdown({
  label,
  options = [],
  selectedValue,
  onValueChange,
  theme = lightTheme,
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === selectedValue);

  const handleSelect = (value) => {
    onValueChange(value);
    setOpen(false);
  };

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedOption ? theme.textPrimary : theme.textSecondary },
          ]}
        >
          {selectedOption ? selectedOption.label : 'Seleccionar...'}
        </Text>
        <Text style={[styles.arrow, { color: theme.textSecondary }]}>v</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={[styles.listContainer, { backgroundColor: theme.background }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.value)}
                    style={[
                      styles.option,
                      { borderBottomColor: theme.border },
                      isSelected && { backgroundColor: theme.primary + '18' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? theme.primary : theme.textPrimary },
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  triggerText: {
    fontSize: fontSize.md,
    flex: 1,
  },
  arrow: {
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  listContainer: {
    borderRadius: borderRadius.md,
    maxHeight: '60%',
    overflow: 'hidden',
  },
  option: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: fontSize.md,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});
