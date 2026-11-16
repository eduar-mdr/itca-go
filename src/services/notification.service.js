import * as authService from './auth.service';

export const registerFcmToken = async (token) => {
  try {
    await authService.saveFcmToken(token);
  } catch (err) {
    console.error('[FCM] Error registering token:', err.message);
  }
};
