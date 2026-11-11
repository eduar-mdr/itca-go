import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapHeader from '../components/MapHeader';
import DiscussionSection from '../components/DiscussionSection';
import SubscribeActionButton from '../components/SubscribeActionButton';
import PassengersList from '../components/PassengersList';
import PassengersDialog from '../components/PassengersDialog';
import Card from '../../../components/card/Card';
import useRouteDetail from '../hooks/useRouteDetail';
import useComments from '../hooks/useComments';
import useSubscription from '../hooks/useSubscription';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { item, loading, error, realtimeLocation } = useRouteDetail(id, 'route');
  const { comments, sendComment, loading: commentsLoading } = useComments(id, 'route');
  const { subscribe, loading: subLoading, isSubscribed } = useSubscription(id, 'route', item);
  const [dialogVisible, setDialogVisible] = useState(false);

  if (loading || !item) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  const subscribers = item.subscribers || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MapHeader
          originLocation={item.originLocation}
          destinationLocation={item.destinationLocation}
          currentLocation={realtimeLocation || item.currentLocation}
        />

        <Card style={styles.infoCard}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
          <Text style={styles.route}>{item.origin} → {item.destination}</Text>

          {item.schedule?.length > 0 && (
            <View style={styles.scheduleRow}>
              <Text style={styles.label}>Horarios: </Text>
              <Text style={styles.scheduleText}>{item.schedule.join('  ·  ')}</Text>
            </View>
          )}

          {item.assignedDriver && (
            <Text style={styles.driver}>Conductor: {item.assignedDriver.name}</Text>
          )}

          <Text style={styles.subs}>Inscritos: {subscribers.length}</Text>
        </Card>

        <PassengersList
          passengers={subscribers.map((s, i) => (typeof s === 'object' ? s : { _id: String(i), name: 'Suscriptor' }))}
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
        type="route"
        isSubscribed={isSubscribed}
        onSubscribe={subscribe}
        loading={subLoading}
      />

      <PassengersDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        passengers={subscribers.map((s, i) => (typeof s === 'object' ? s : { _id: String(i), name: 'Suscriptor' }))}
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
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: lightTheme.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    marginBottom: spacing.sm,
  },
  route: {
    fontSize: fontSize.md,
    color: lightTheme.textPrimary,
    marginBottom: spacing.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: lightTheme.textPrimary,
  },
  scheduleText: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    flex: 1,
  },
  driver: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
    marginTop: spacing.xs,
  },
  subs: {
    fontSize: fontSize.sm,
    color: lightTheme.primary,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  error: {
    color: lightTheme.accent,
    marginTop: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});
