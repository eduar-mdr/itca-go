import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import * as authService from '../../../services/auth.service';
import { setUser, setToken, setLoading, setError, clearUser } from '../stores/userSlice';

const useAuthModule = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [localError, setLocalError] = useState(null);

  const register = async (email, password, userData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();

      dispatch(setToken(token));

      const response = await authService.syncUser({
        name: userData.name,
        role: userData.role || 'student',
        studentId: userData.studentId,
        phone: userData.phone,
      });

      dispatch(setUser(response.data));
      dispatch(setLoading(false));
    } catch (err) {
      const message = getFirebaseErrorMessage(err.code) || err.message;
      dispatch(setError(message));
      setLocalError(message);
    }
  };

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();

      dispatch(setToken(token));

      const response = await authService.getProfile();
      dispatch(setUser(response.data));
      dispatch(setLoading(false));
    } catch (err) {
      const message = getFirebaseErrorMessage(err.code) || err.message;
      dispatch(setError(message));
      setLocalError(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return { register, login, logout, loading, error: error || localError };
};

const getFirebaseErrorMessage = (code) => {
  const messages = {
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
  };
  return messages[code] || null;
};

export default useAuthModule;
