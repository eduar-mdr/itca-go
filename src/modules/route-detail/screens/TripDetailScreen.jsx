import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapHeader from '../components/MapHeader';
import PassengersList from '../components/PassengersList';
import PassengersDialog from '../components/PassengersDialog';
import DiscussionSection from '../components/DiscussionSection';
import SubscribeActionButton from '../components/SubscribeActionButton';
import Card from '../../../components/card/Card';
import useRouteDetail from '../hooks/useRouteDetail';
import useComments from '../hooks/useComments';
import useSubscription from '../hooks/useSubscription';
import { lightTheme, spacing, borderRadius, fontSize } from '../../../styles/theme';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-SV', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const STATUS_LABELS = {
  available: { text: 'Disponible', bg: '#4caf50' },
  full: { text: 'Lleno', bg: lightTheme.accent },
  in_progress: { text: 'En proceso', bg: lightTheme.primary },
  completed: { text: 'Completado', bg: '#777' },
  cancelled: { text: 'Cancelado', bg: '#d32f2f' },
  delayed: { text: 'Retrasado', bg: '#ff9800' },
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { item, loading, error } = useRouteDetail(id, 'trip');
  const { comments, sendComment, loading: commentsLoading } = useComments(id, 'trip');
  const { subscribe, loading: subLoading, isSubscribed } = useSubscription(id, 'trip', item);
  const [dialogVisible, setDialogVisible] = useState(false);

  if (loading || !item) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  const passengers = item.passengers || [];
  const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.available;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MapHeader
          originLocation={item.originLocation}
          destinationLocation={item.destinationLocation}
        />

        <Card style={styles.infoCard}>
          <View style={styles.headerRow}>
            <Text style={styles.route}>{item.origin} → {item.destination}</Text>
            <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
              <Text style={styles.badgeText}>{statusInfo.text}</Text>
            </View>
          </View>

          <Text style={styles.departure}>{formatDate(item.departureTime)}</Text>

          <View style={styles.seatsRow}>
            <Text style={styles.label}>Cupos: </Text>
            <Text style={styles.seats}>
              {item.availableSeats} / {item.totalSeats} disponibles
            </Text>
          </View>

          {item.driver && (
            <Text style={styles.driver}>Conductor: {item.driver.name}</Text>
          )}

          {item.simulatedPrice > 0 && (
            <Text style={styles.price}>Precio: ${item.simulatedPrice.toFixed(2)}</Text>
          )}
        </Card>

        <PassengersList
          passengers={passengers}
          onShowAll={() => setDialogVisible(true)}
        />

        <DiscussionSection
          comments={comments}
          onSendComment={sendComment}
          loading={commentsLoading}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SubscribeActionButton
        type="trip"
        isSubscribed={isSubscribed}
        onSubscribe={subscribe}
        loading={subLoading}
        availableSeats={item.availableSeats}
      />

      <PassengersDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        passengers={passengers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.background,
  },
  scroll: {
    paddingBottom: 100,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  route: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: lightTheme.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  departure: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    marginBottom: spacing.sm,
  },
  seatsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: lightTheme.textPrimary,
  },
  seats: {
    fontSize: fontSize.sm,
    color: lightTheme.primary,
    fontWeight: '600',
  },
  driver: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    marginTop: spacing.xs,
  },
  price: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    marginTop: spacing.xs,
  },
  error: {
    color: lightTheme.accent,
    marginTop: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});
