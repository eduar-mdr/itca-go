import React from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import RouteCard from '../../explore/components/RouteCard';
import AppHeader from '../../../components/header/AppHeader';
import useMyTrips from '../hooks/useMyTrips';
import { lightTheme, spacing, fontSize } from '../../../styles/theme';

const EMPTY_ROUTES = 'No estás inscrito en ninguna ruta';
const EMPTY_TRIPS = 'No tienes viajes activos';

export default function TripsScreen() {
  const router = useRouter();
  const { myTrips, myRoutes, loading, refresh } = useMyTrips();

  const sections = [
    {
      title: 'Mis Rutas Inscritas',
      data: myRoutes.map((r) => ({ ...r, _type: 'route' })),
      emptyText: EMPTY_ROUTES,
    },
    {
      title: 'Mis Viajes',
      data: myTrips.map((t) => ({ ...t, _type: 'trip' })),
      emptyText: EMPTY_TRIPS,
    },
  ];

  const handlePress = (item) => {
    if (item._type === 'route') {
      router.push(`/route-detail/${item._id}`);
    } else {
      router.push(`/trip-detail/${item._id}`);
    }
  };

  if (loading && myTrips.length === 0 && myRoutes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
        <Text style={styles.loadingText}>Cargando tus viajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Mis Viajes"
        onNotificationPress={() => router.push('/notifications')}
      />
    <SectionList
      style={styles.listContainer}
      sections={sections}
      keyExtractor={(item) => `${item._type}-${item._id}`}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderItem={({ item }) => (
        <RouteCard item={item} type={item._type} onPress={() => handlePress(item)} />
      )}
      renderSectionFooter={({ section }) =>
        section.data.length === 0 ? (
          <Text style={styles.emptyText}>{section.emptyText}</Text>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} colors={[lightTheme.primary]} />
      }
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  listContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.background,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: lightTheme.textSecondary,
    fontSize: fontSize.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: lightTheme.textPrimary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: lightTheme.textSecondary,
    fontSize: fontSize.sm,
    paddingVertical: spacing.lg,
  },
});
