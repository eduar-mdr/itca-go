import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../../components/button/Button';
import { lightTheme } from '../../../styles/theme';
import useAuthModule from '../hooks/useAuthModule';

const LoginScreen = () => {
  const router = useRouter();
  const { login, loading, error } = useAuthModule();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    login(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appName}>ITCA Go</Text>
          <Text style={styles.subtitle}>Movilidad Estudiantil</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={lightTheme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={lightTheme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Iniciar Sesión"
            variant="primary"
            onPress={handleLogin}
            loading={loading}
          />

          <Text style={styles.link} onPress={() => router.push('/register')}>
            ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: lightTheme.primary,
  },
  subtitle: {
    fontSize: 14,
    color: lightTheme.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: lightTheme.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: lightTheme.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: lightTheme.textPrimary,
    backgroundColor: lightTheme.surface,
  },
  error: {
    color: lightTheme.accent,
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    color: lightTheme.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  linkBold: {
    color: lightTheme.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
