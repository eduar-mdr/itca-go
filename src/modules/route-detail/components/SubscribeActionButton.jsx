import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../../components/button/Button';
import { lightTheme, spacing } from '../../../styles/theme';

export default function SubscribeActionButton({ type, isSubscribed, onSubscribe, loading, availableSeats, theme = lightTheme }) {
  if (type === 'route') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background + 'F2', borderTopColor: theme.border }]}>
        <Button
          title={isSubscribed ? 'Ya estás inscrito' : 'Inscribirse a esta ruta'}
          variant={isSubscribed ? 'secondary' : 'cta'}
          onPress={onSubscribe}
          loading={loading}
          disabled={isSubscribed}
          theme={theme}
        />
      </View>
    );
  }

  const noSeats = availableSeats === 0 && !isSubscribed;
  let title = `Reservar cupo (${availableSeats} disponibles)`;
  if (isSubscribed) title = 'Cupo reservado';
  if (noSeats) title = 'Sin cupos disponibles';

  return (
    <View style={[styles.container, { backgroundColor: theme.background + 'F2', borderTopColor: theme.border }]}>
      <Button
        title={title}
        variant={isSubscribed || noSeats ? 'secondary' : 'cta'}
        onPress={onSubscribe}
        loading={loading}
        disabled={isSubscribed || noSeats}
        theme={theme}
      />
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
});
