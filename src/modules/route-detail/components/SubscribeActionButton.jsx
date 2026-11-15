import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import Button from '../../../components/button/Button';
import { lightTheme, spacing } from '../../../styles/theme';

export default function SubscribeActionButton({
  type,
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  loading,
  availableSeats,
  status,
  theme = lightTheme,
}) {
  const handleUnsubscribe = () => {
    const label = type === 'route' ? 'esta ruta' : 'este viaje';
    Alert.alert(
      '¿Estás seguro?',
      `Se cancelará tu inscripción en ${label}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: onUnsubscribe },
      ]
    );
  };

  if (type === 'route') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background + 'F2', borderTopColor: theme.border }]}>
        {isSubscribed ? (
          <Button
            title="Desuscribirse"
            variant="secondary"
            onPress={handleUnsubscribe}
            loading={loading}
            theme={theme}
          />
        ) : (
          <Button
            title="Inscribirse a esta ruta"
            variant="cta"
            onPress={onSubscribe}
            loading={loading}
            theme={theme}
          />
        )}
      </View>
    );
  }

  const isInProgress = status === 'in_progress';
  const noSeats = availableSeats === 0 && !isSubscribed;

  const getButton = () => {
    if (isSubscribed) {
      if (isInProgress) {
        return (
          <Button
            title="No puedes salir de un viaje en curso"
            variant="secondary"
            disabled
            theme={theme}
          />
        );
      }
      return (
        <Button
          title="Cancelar reserva"
          variant="secondary"
          onPress={handleUnsubscribe}
          loading={loading}
          theme={theme}
        />
      );
    }

    if (noSeats) {
      return (
        <Button
          title="Sin cupos disponibles"
          variant="secondary"
          disabled
          theme={theme}
        />
      );
    }

    return (
      <Button
        title={`Reservar cupo (${availableSeats} disponibles)`}
        variant="cta"
        onPress={onSubscribe}
        loading={loading}
        theme={theme}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background + 'F2', borderTopColor: theme.border }]}>
      {getButton()}
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
