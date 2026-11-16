import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as authService from './auth.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const getAndRegisterPushToken = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[FCM] Permisos de notificación denegados');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'ITCA Go',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const tokenData = await Notifications.getDevicePushTokenAsync();
    const fcmToken = tokenData.data;

    await authService.saveFcmToken(fcmToken);
    console.log('[FCM] Token registrado exitosamente');

    return fcmToken;
  } catch (err) {
    console.error('[FCM] Error obteniendo/registrando token:', err.message);
    return null;
  }
};
