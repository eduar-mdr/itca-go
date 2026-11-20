import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import MapBackground from '../components/MapBackground';
import RouteFilterChips from '../components/RouteFilterChips';
import RouteCard from '../components/RouteCard';
import CreateTripModal from '../components/CreateTripModal';
import useExploreRoutes from '../hooks/useExploreRoutes';
import AppHeader from '../../../components/header/AppHeader';
import useLocation from '../../../hooks/useLocation';
import useNotifications from '../../notifications/hooks/useNotifications';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, fontSize } from '../../../styles/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { routes, trips, filter, loading, refresh, setFilter } = useExploreRoutes();
  const { location } = useLocation();
  const [modalVisible, setModalVisible] = useState(false);

  const userRole = useSelector((s) => s.user.user?.role) || 'student';
  const { unreadCount } = useNotifications();

  const handleModalClose = (created) => {
    setModalVisible(false);
    if (created) refresh();
  };

  const listData = useMemo(() => {
    const routeItems = routes.map((r) => ({ ...r, _type: 'route' }));
    const tripItems = trips.map((t) => ({ ...t, _type: 'trip' }));

    if (filter === 'institutional') return routeItems;
    if (filter === 'carpooling') return tripItems;
    return [...routeItems, ...tripItems];
  }, [routes, trips, filter]);

  const handleCardPress = useCallback((item, type) => {
    if (type === 'route') {
      router.push(`/route-detail/${item._id}`);
    } else {
      router.push(`/trip-detail/${item._id}`);
    }
  }, [router]);

  const renderItem = useCallback(({ item }) => (
    <RouteCard
      item={item}
      type={item._type}
      onPress={() => handleCardPress(item, item._type)}
    />
  ), [handleCardPress]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.mapContainer}>
        <MapBackground
          routes={routes}
          trips={trips}
          userLocation={location}
          onMarkerPress={handleCardPress}
        />
        <View style={styles.headerOverlay}>
          <AppHeader
            title="ITCA Go"
            transparent
            titleInChip
            chipBackground={isDark ? theme.accent : '#ffffff'}
            titleColor={isDark ? '#ffffff' : theme.accent}
            notificationCount={unreadCount}
            onNotificationPress={() => router.push('/notifications')}
            theme={theme}
          />
        </View>
      </View>

      <RouteFilterChips activeFilter={filter} onFilterChange={setFilter} />

      {loading && listData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Cargando rutas...</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => `${item._type}-${item._id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} colors={[theme.primary]} />
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay rutas o viajes disponibles</Text>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <CreateTripModal
        visible={modalVisible}
        onClose={handleModalClose}
        userRole={userRole}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: '45%',
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    marginTop: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
