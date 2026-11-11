import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../../../components/button/Button';
import { spacing } from '../../../styles/theme';

export default function SubscribeActionButton({ type, isSubscribed, onSubscribe, loading, availableSeats }) {
  if (type === 'route') {
    return (
      <View style={styles.container}>
        <Button
          title={isSubscribed ? 'Ya estás inscrito' : 'Inscribirse a esta ruta'}
          variant={isSubscribed ? 'secondary' : 'cta'}
          onPress={onSubscribe}
          loading={loading}
          disabled={isSubscribed}
        />
      </View>
    );
  }

  const noSeats = availableSeats === 0 && !isSubscribed;
  let title = `Reservar cupo (${availableSeats} disponibles)`;
  if (isSubscribed) title = 'Cupo reservado';
  if (noSeats) title = 'Sin cupos disponibles';

  return (
    <View style={styles.container}>
      <Button
        title={title}
        variant={isSubscribed || noSeats ? 'secondary' : 'cta'}
        onPress={onSubscribe}
        loading={loading}
        disabled={isSubscribed || noSeats}
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
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
