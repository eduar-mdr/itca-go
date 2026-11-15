import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../../components/button/Button';
import { useTheme } from '../../../context/ThemeContext';
import { spacing } from '../../../styles/theme';
import useAuthModule from '../hooks/useAuthModule';

const LoginScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, loading, error } = useAuthModule();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef(null);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    login(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.primary }]}>ITCA Go</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Movilidad Estudiantil</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Iniciar Sesión</Text>

          {error && <Text style={[styles.error, { color: theme.accent }]}>{error}</Text>}

          <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <TextInput
              style={[styles.inputFlex, { color: theme.textPrimary }]}
              placeholder="Correo electrónico"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail('')} style={styles.inputAction}>
                <Text style={[styles.clearIcon, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <TextInput
              ref={passwordRef}
              style={[styles.inputFlex, { color: theme.textPrimary }]}
              placeholder="Contraseña"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputAction}>
              <Text style={[styles.toggleIcon, { color: theme.primary }]}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Iniciar Sesión"
            variant="primary"
            onPress={handleLogin}
            loading={loading}
            theme={theme}
          />

          <Text style={[styles.link, { color: theme.textSecondary }]} onPress={() => router.push('/register')}>
            ¿No tienes cuenta? <Text style={[styles.linkBold, { color: theme.primary }]}>Regístrate</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputFlex: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  inputAction: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
  },
  clearIcon: {
    fontSize: 16,
  },
  toggleIcon: {
    fontSize: 13,
    fontWeight: '600',
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 12,
  },
  linkBold: {
    fontWeight: '600',
  },
});

export default LoginScreen;
