import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, borderRadius, fontSize } from '../../styles/theme';

export default function Dialog({
  visible,
  onClose,
  title,
  children,
  fullScreen = false,
  theme,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={fullScreen ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, !fullScreen && styles.centered]}>
        <View
          style={[
            styles.content,
            { backgroundColor: theme.background },
            fullScreen ? styles.fullScreen : styles.centered_content,
          ]}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: theme.textSecondary }]}>
                X
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    overflow: 'hidden',
  },
  fullScreen: {
    flex: 1,
  },
  centered_content: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: borderRadius.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  body: {
    padding: spacing.md,
  },
});
