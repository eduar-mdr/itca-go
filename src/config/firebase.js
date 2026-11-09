import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

// Reemplazar con los valores reales de Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'itca-go.firebaseapp.com',
  projectId: 'itca-go',
  storageBucket: 'itca-go.firebasestorage.app',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID',
  appId: 'TU_APP_ID',
  databaseURL: 'https://itca-go-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const database = getDatabase(app);

export { app, auth, database };
