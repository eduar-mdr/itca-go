import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../../components/button/Button';
import { lightTheme, spacing } from '../../../styles/theme';

export default function TrackingButton({
  routeStatus,
  isOwner,
  isTracking,
  onStart,
  onStop,
  loading,
  theme = lightTheme,
}) {
  if (!isOwner) return null;

  const isIdle = routeStatus === 'idle' || routeStatus === 'completed';

  return (
    <View style={[styles.container, { backgroundColor: theme.background + 'F2', borderTopColor: theme.border }]}>
      {isTracking && (
        <Text style={[styles.trackingLabel, { color: theme.accent }]}>
          Enviando ubicación...
        </Text>
      )}

      {isIdle && !isTracking ? (
        <Button
          title="Iniciar Ruta"
          variant="cta"
          onPress={onStart}
          loading={loading}
          theme={theme}
        />
      ) : (
        <View style={styles.row}>
          <View style={styles.btnHalf}>
            <Button
              title="Finalizar"
              variant="cta"
              onPress={() => onStop('completed')}
              loading={loading}
              theme={theme}
            />
          </View>
          <View style={styles.btnHalf}>
            <Button
              title="Pausar"
              variant="secondary"
              onPress={() => onStop('idle')}
              loading={loading}
              theme={theme}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  trackingLabel: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btnHalf: {
    flex: 1,
  },
});
