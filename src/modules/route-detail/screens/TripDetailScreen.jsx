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
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../styles/theme';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-SV', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { item, loading, error } = useRouteDetail(id, 'trip');
  const { comments, sendComment, loading: commentsLoading } = useComments(id, 'trip');
  const { subscribe, loading: subLoading, isSubscribed } = useSubscription(id, 'trip', item);
  const [dialogVisible, setDialogVisible] = useState(false);

  const statusLabels = {
    available: { text: 'Disponible', bg: '#4caf50' },
    full: { text: 'Lleno', bg: theme.accent },
    in_progress: { text: 'En proceso', bg: theme.primary },
    completed: { text: 'Completado', bg: '#777' },
    cancelled: { text: 'Cancelado', bg: '#d32f2f' },
    delayed: { text: 'Retrasado', bg: '#ff9800' },
  };

  if (loading || !item) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}
      </View>
    );
  }

  const passengers = item.passengers || [];
  const statusInfo = statusLabels[item.status] || statusLabels.available;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MapHeader
          originLocation={item.originLocation}
          destinationLocation={item.destinationLocation}
        />

        <Card style={styles.infoCard} theme={theme}>
          <View style={styles.headerRow}>
            <Text style={[styles.route, { color: theme.textPrimary }]}>{item.origin} → {item.destination}</Text>
            <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
              <Text style={styles.badgeText}>{statusInfo.text}</Text>
            </View>
          </View>

          <Text style={[styles.departure, { color: theme.textSecondary }]}>{formatDate(item.departureTime)}</Text>

          <View style={styles.seatsRow}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Cupos: </Text>
            <Text style={[styles.seats, { color: theme.primary }]}>
              {item.availableSeats} / {item.totalSeats} disponibles
            </Text>
          </View>

          {item.driver && (
            <Text style={[styles.driver, { color: theme.textSecondary }]}>Conductor: {item.driver.name}</Text>
          )}

          {item.simulatedPrice > 0 && (
            <Text style={[styles.price, { color: theme.textSecondary }]}>Precio: ${item.simulatedPrice.toFixed(2)}</Text>
          )}
        </Card>

        <PassengersList
          passengers={passengers}
          onShowAll={() => setDialogVisible(true)}
          theme={theme}
        />

        <DiscussionSection
          comments={comments}
          onSendComment={sendComment}
          loading={commentsLoading}
          theme={theme}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SubscribeActionButton
        type="trip"
        isSubscribed={isSubscribed}
        onSubscribe={subscribe}
        loading={subLoading}
        availableSeats={item.availableSeats}
        theme={theme}
      />

      <PassengersDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        passengers={passengers}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: spacing.sm,
  },
  seatsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  seats: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  driver: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  price: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  error: {
    marginTop: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});
