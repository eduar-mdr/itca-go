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
import { useTheme } from '../../../context/ThemeContext';
import { spacing, fontSize } from '../../../styles/theme';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { item, loading, error, realtimeLocation } = useRouteDetail(id, 'route');
  const { comments, sendComment, loading: commentsLoading } = useComments(id, 'route');
  const { subscribe, unsubscribe, loading: subLoading, isSubscribed } = useSubscription(id, 'route', item);
  const [dialogVisible, setDialogVisible] = useState(false);

  if (loading || !item) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}
      </View>
    );
  }

  const subscribers = item.subscribers || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MapHeader
          originLocation={item.originLocation}
          destinationLocation={item.destinationLocation}
          currentLocation={realtimeLocation || item.currentLocation}
        />

        <Card style={styles.infoCard} theme={theme}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
          {item.description ? <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text> : null}
          <Text style={[styles.route, { color: theme.textPrimary }]}>{item.origin} → {item.destination}</Text>

          {item.schedule?.length > 0 && (
            <View style={styles.scheduleRow}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Horarios: </Text>
              <Text style={[styles.scheduleText, { color: theme.textSecondary }]}>{item.schedule.join('  ·  ')}</Text>
            </View>
          )}

          {item.assignedDriver && (
            <Text style={[styles.driver, { color: theme.textSecondary }]}>Conductor: {item.assignedDriver.name}</Text>
          )}

          <Text style={[styles.subs, { color: theme.primary }]}>Inscritos: {subscribers.length}</Text>
        </Card>

        <PassengersList
          passengers={subscribers.map((s, i) => (typeof s === 'object' ? s : { _id: String(i), name: 'Suscriptor' }))}
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
        type="route"
        isSubscribed={isSubscribed}
        onSubscribe={subscribe}
        onUnsubscribe={unsubscribe}
        loading={subLoading}
        theme={theme}
      />

      <PassengersDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        passengers={subscribers.map((s, i) => (typeof s === 'object' ? s : { _id: String(i), name: 'Suscriptor' }))}
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
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  route: {
    fontSize: fontSize.md,
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
  },
  scheduleText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  driver: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  subs: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  error: {
    marginTop: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});
