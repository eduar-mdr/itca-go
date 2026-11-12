import React, { useState, useCallback } from 'react';
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
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { routes, trips, filter, loading, refresh, setFilter } = useExploreRoutes();
  const { location } = useLocation();
  const [modalVisible, setModalVisible] = useState(false);

  const userRole = useSelector((s) => s.user.user?.role) || 'student';

  const handleModalClose = (created) => {
    setModalVisible(false);
    if (created) refresh();
  };

  const getListData = useCallback(() => {
    const routeItems = routes.map((r) => ({ ...r, _type: 'route' }));
    const tripItems = trips.map((t) => ({ ...t, _type: 'trip' }));

    if (filter === 'institutional') return routeItems;
    if (filter === 'carpooling') return tripItems;
    return [...routeItems, ...tripItems];
  }, [routes, trips, filter]);

  const handleCardPress = (item, type) => {
    if (type === 'route') {
      router.push(`/route-detail/${item._id}`);
    } else {
      router.push(`/trip-detail/${item._id}`);
    }
  };

  const listData = getListData();

  return (
    <View style={styles.container}>
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
            chipBackground="#ffffff"
            titleColor={lightTheme.accent}
            onNotificationPress={() => router.push('/notifications')}
          />
        </View>
      </View>

      <RouteFilterChips activeFilter={filter} onFilterChange={setFilter} />

      {loading && listData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={lightTheme.primary} />
          <Text style={styles.loadingText}>Cargando rutas...</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => `${item._type}-${item._id}`}
          renderItem={({ item }) => (
            <RouteCard
              item={item}
              type={item._type}
              onPress={() => handleCardPress(item, item._type)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} colors={[lightTheme.primary]} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay rutas o viajes disponibles</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
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
    backgroundColor: lightTheme.background,
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
    color: lightTheme.textSecondary,
    fontSize: fontSize.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: lightTheme.textSecondary,
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
    backgroundColor: lightTheme.accent,
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
