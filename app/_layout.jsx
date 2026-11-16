import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import store from '../src/stores';
import { setToken, clearUser } from '../src/modules/auth/stores/userSlice';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import useNotifications from '../src/modules/notifications/hooks/useNotifications';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { theme, isDark } = useTheme();
  useNotifications();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        dispatch(setToken(token));
      } else {
        dispatch(clearUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, router]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.textPrimary,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="route-detail/[id]" options={{ headerShown: true, title: 'Detalle de Ruta' }} />
        <Stack.Screen name="trip-detail/[id]" options={{ headerShown: true, title: 'Detalle de Viaje' }} />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notificaciones' }} />
      </Stack>
    </>
  );
};

const RootLayout = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default RootLayout;
