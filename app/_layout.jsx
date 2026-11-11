import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebase';
import store from '../src/stores';
import { setToken, clearUser } from '../src/modules/auth/stores/userSlice';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useSelector((state) => state.user);

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="route-detail/[id]" options={{ headerShown: true, title: 'Detalle de Ruta' }} />
      <Stack.Screen name="trip-detail/[id]" options={{ headerShown: true, title: 'Detalle de Viaje' }} />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default RootLayout;
