import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ProfileCard from '../components/ProfileCard';
import Button from '../../../components/button/Button';
import AppHeader from '../../../components/header/AppHeader';
import useProfile from '../hooks/useProfile';
import { lightTheme, spacing } from '../../../styles/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, loading } = useProfile();

  return (
    <View style={styles.container}>
      <AppHeader
        title="Perfil"
        onNotificationPress={() => router.push('/notifications')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileCard user={user} />

        <View style={styles.logoutContainer}>
          <Button
            title="Cerrar Sesión"
            variant="cta"
            onPress={logout}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  content: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
});
