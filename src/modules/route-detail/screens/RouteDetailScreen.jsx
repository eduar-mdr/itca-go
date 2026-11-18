import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import MapHeader from '../components/MapHeader';
import DiscussionSection from '../components/DiscussionSection';
import SubscribeActionButton from '../components/SubscribeActionButton';
import TrackingButton from '../components/TrackingButton';
import PassengersList from '../components/PassengersList';
import PassengersDialog from '../components/PassengersDialog';
import Card from '../../../components/card/Card';
import useRouteDetail from '../hooks/useRouteDetail';
import useComments from '../hooks/useComments';
import useSubscription from '../hooks/useSubscription';
import useRouteTracking from '../hooks/useRouteTracking';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../styles/theme';

const ROUTE_STATUS_LABELS = {
  idle: { text: 'Sin iniciar', color: '#9e9e9e' },
  in_progress: { text: 'En curso', color: '#2196f3' },
  completed: { text: 'Completado', color: '#777' },
};

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const userId = useSelector((s) => s.user.user?._id);
  const { item, loading, error, realtimeLocation } = useRouteDetail(id, 'route');
  const { comments, sendComment, loading: commentsLoading } = useComments(id, 'route');
  const { subscribe, unsubscribe, loading: subLoading, isSubscribed } = useSubscription(id, 'route', item);
  const { isTracking, startTracking, stopTracking, loading: trackingLoading } = useRouteTracking(id);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [mapTouchActive, setMapTouchActive] = useState(false);
  const scrollRef = useRef(null);

  if (loading || !item) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}
      </View>
    );
  }

  const subscribers = item.subscribers || [];
  const isOwner = item.assignedDriver && (item.assignedDriver._id === userId || item.assignedDriver === userId);
  const statusInfo = ROUTE_STATUS_LABELS[item.status] || ROUTE_STATUS_LABELS.idle;

  const handleSendComment = (text) => {
    sendComment(text);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!mapTouchActive}
        nestedScrollEnabled={true}
      >
        <View
          onTouchStart={() => setMapTouchActive(true)}
          onTouchEnd={() => setMapTouchActive(false)}
          onTouchCancel={() => setMapTouchActive(false)}
        >
          <MapHeader
            originLocation={item.originLocation}
            destinationLocation={item.destinationLocation}
            currentLocation={realtimeLocation || item.currentLocation}
            originLabel={item.origin}
            destinationLabel={item.destination}
          />
        </View>

        <Card style={styles.infoCard} theme={theme}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={2}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </View>
          </View>
          {item.description ? <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text> : null}
          <Text style={[styles.route, { color: theme.textPrimary }]}>{item.origin} → {item.destination}</Text>

          {item.schedule?.length > 0 && (
            <View style={styles.scheduleRow}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Horarios: </Text>
              <Text style={[styles.scheduleText, { color: theme.textSecondary }]}>{item.schedule.join('  ·  ')}</Text>
            </View>
          )}

          {item.assignedDriver && (
            <Text style={[styles.driver, { color: theme.textSecondary }]}>Conductor: {typeof item.assignedDriver === 'object' ? item.assignedDriver.name : 'Asignado'}</Text>
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
          onSendComment={handleSendComment}
          loading={commentsLoading}
          theme={theme}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {isOwner ? (
        <TrackingButton
          routeStatus={item.status || 'idle'}
          isOwner={isOwner}
          isTracking={isTracking}
          onStart={startTracking}
          onStop={stopTracking}
          loading={trackingLoading}
          theme={theme}
        />
      ) : (
        <SubscribeActionButton
          type="route"
          isSubscribed={isSubscribed}
          onSubscribe={subscribe}
          onUnsubscribe={unsubscribe}
          loading={subLoading}
          theme={theme}
        />
      )}

      <PassengersDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        passengers={subscribers.map((s, i) => (typeof s === 'object' ? s : { _id: String(i), name: 'Suscriptor' }))}
        theme={theme}
      />
    </KeyboardAvoidingView>
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: '700',
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
