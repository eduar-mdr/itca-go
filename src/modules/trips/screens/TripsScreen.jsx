import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import RouteCard from '../../explore/components/RouteCard';
import RouteManageCard from '../components/RouteManageCard';
import EditRouteModal from '../components/EditRouteModal';
import EditTripModal from '../components/EditTripModal';
import AppHeader from '../../../components/header/AppHeader';
import Chip from '../../../components/chip/Chip';
import { useTheme } from '../../../context/ThemeContext';
import useNotifications from '../../notifications/hooks/useNotifications';
import useMyTrips from '../hooks/useMyTrips';
import * as routeService from '../../../services/route.service';
import * as tripService from '../../../services/trip.service';
import { spacing, fontSize } from '../../../styles/theme';

export default function TripsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const userRole = useSelector((s) => s.user.user?.role) || 'student';
  const { createdRoutes, subscribedRoutes, createdTrips, subscribedTrips, loading, refresh } = useMyTrips();
  const { unreadCount } = useNotifications();

  const [activeTab, setActiveTab] = useState('institutional');
  const [subFilter, setSubFilter] = useState('all');
  const [editRoute, setEditRoute] = useState(null);
  const [editTrip, setEditTrip] = useState(null);

  const handlePress = (item, type) => {
    if (type === 'route') router.push(`/route-detail/${item._id}`);
    else router.push(`/trip-detail/${item._id}`);
  };

  const handleToggleRouteActive = async (route) => {
    Alert.alert(
      route.active ? 'Desactivar ruta' : 'Activar ruta',
      `¿${route.active ? 'Desactivar' : 'Activar'} "${route.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await routeService.updateRoute(route._id, { active: !route.active });
              refresh();
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleTripStatusChange = (trip) => {
    setEditTrip(trip);
  };

  const handleStartRoute = async (route) => {
    const isInProgress = route.status === 'in_progress';
    Alert.alert(
      isInProgress ? 'Finalizar ruta' : 'Iniciar ruta',
      isInProgress
        ? `¿Finalizar el recorrido de "${route.name}"?`
        : `¿Iniciar el recorrido de "${route.name}"? Se enviará tu ubicación en tiempo real.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const newStatus = isInProgress ? 'completed' : 'in_progress';
              await routeService.updateRouteStatus(route._id, newStatus);
              refresh();
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleModalClose = (success) => {
    setEditRoute(null);
    setEditTrip(null);
    if (success) refresh();
  };

  const showSubFilter = () => {
    if (activeTab === 'institutional' && userRole === 'student') return false;
    return true;
  };

  const getListData = () => {
    if (activeTab === 'institutional') {
      if (userRole === 'student') return subscribedRoutes;
      if (subFilter === 'all') return [...createdRoutes, ...subscribedRoutes];
      return subFilter === 'created' ? createdRoutes : subscribedRoutes;
    }
    if (subFilter === 'all') return [...createdTrips, ...subscribedTrips];
    return subFilter === 'created' ? createdTrips : subscribedTrips;
  };

  const getEmptyText = () => {
    if (activeTab === 'institutional') {
      if (userRole === 'student') return 'No estás inscrito en ninguna ruta';
      if (subFilter === 'all') return 'No tienes rutas';
      return subFilter === 'created' ? 'No tienes rutas creadas' : 'No estás inscrito en ninguna ruta';
    }
    if (subFilter === 'all') return 'No tienes viajes';
    return subFilter === 'created' ? 'No tienes viajes creados' : 'No estás inscrito en ningún viaje';
  };

  const isManageItem = (item) => {
    if (activeTab === 'institutional' && userRole === 'student') return false;
    if (subFilter === 'created') return true;
    if (subFilter === 'all') return item.relationship === 'owner';
    return false;
  };

  const listData = getListData();
  const itemType = activeTab === 'institutional' ? 'route' : 'trip';

  if (loading && createdRoutes.length === 0 && subscribedRoutes.length === 0 && createdTrips.length === 0 && subscribedTrips.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Cargando tus viajes...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Mis Viajes"
        notificationCount={unreadCount}
        onNotificationPress={() => router.push('/notifications')}
        theme={theme}
      />

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'institutional' && { borderBottomColor: theme.primary }]}
          onPress={() => { setActiveTab('institutional'); setSubFilter('all'); }}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'institutional' ? theme.primary : theme.textSecondary },
            activeTab === 'institutional' && styles.tabTextActive,
          ]}>
            Institucionales
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'carpooling' && { borderBottomColor: theme.primary }]}
          onPress={() => { setActiveTab('carpooling'); setSubFilter('all'); }}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'carpooling' ? theme.primary : theme.textSecondary },
            activeTab === 'carpooling' && styles.tabTextActive,
          ]}>
            Carpooling
          </Text>
        </TouchableOpacity>
      </View>

      {showSubFilter() && (
        <View style={styles.chipsRow}>
          <Chip
            label="Todas"
            active={subFilter === 'all'}
            onPress={() => setSubFilter('all')}
            theme={theme}
          />
          <Chip
            label="Creadas"
            active={subFilter === 'created'}
            onPress={() => setSubFilter('created')}
            theme={theme}
          />
          <Chip
            label="Inscritas"
            active={subFilter === 'subscribed'}
            onPress={() => setSubFilter('subscribed')}
            theme={theme}
          />
        </View>
      )}

      <FlatList
        data={listData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) =>
          isManageItem(item) ? (
            <RouteManageCard
              item={item}
              type={itemType}
              onPress={() => handlePress(item, itemType)}
              onEdit={() => itemType === 'route' ? setEditRoute(item) : setEditTrip(item)}
              onStatusChange={() => itemType === 'route' ? handleToggleRouteActive(item) : handleTripStatusChange(item)}
              onStartRoute={() => handleStartRoute(item)}
            />
          ) : (
            <RouteCard
              item={item}
              type={itemType}
              onPress={() => handlePress(item, itemType)}
            />
          )
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} colors={[theme.primary]} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{getEmptyText()}</Text>
        }
      />

      <EditRouteModal
        visible={!!editRoute}
        onClose={handleModalClose}
        route={editRoute}
      />

      <EditTripModal
        visible={!!editTrip}
        onClose={handleModalClose}
        trip={editTrip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
  },
  tabsRow: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: fontSize.md,
  },
  tabTextActive: {
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    paddingVertical: spacing.xl,
  },
});
