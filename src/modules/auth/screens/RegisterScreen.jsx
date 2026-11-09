import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../../components/button/Button';
import Dropdown from '../../../components/dropdown/Dropdown';
import { lightTheme, spacing } from '../../../styles/theme';
import useAuthModule from '../hooks/useAuthModule';

const ROLE_OPTIONS = [
  { label: 'Estudiante', value: 'student' },
  { label: 'Conductor', value: 'driver' },
];

const RegisterScreen = () => {
  const router = useRouter();
  const { register, loading, error } = useAuthModule();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const studentIdRef = useRef(null);
  const phoneRef = useRef(null);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    register(email.trim(), password, {
      name: name.trim(),
      role,
      studentId: studentId.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appName}>ITCA Go</Text>
          <Text style={styles.subtitle}>Crear Cuenta</Text>
        </View>

        <View style={styles.form}>
          {error && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor={lightTheme.textSecondary}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            blurOnSubmit={false}
          />

          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={lightTheme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />

          <View style={styles.inputWrapper}>
            <TextInput
              ref={passwordRef}
              style={styles.inputFlex}
              placeholder="Contraseña"
              placeholderTextColor={lightTheme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="next"
              onSubmitEditing={() => studentIdRef.current?.focus()}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputAction}>
              <Text style={styles.toggleIcon}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
            </TouchableOpacity>
          </View>

          <Dropdown
            label="Rol"
            options={ROLE_OPTIONS}
            selectedValue={role}
            onValueChange={setRole}
          />

          <TextInput
            ref={studentIdRef}
            style={styles.input}
            placeholder="Carnet estudiantil (opcional)"
            placeholderTextColor={lightTheme.textSecondary}
            value={studentId}
            onChangeText={setStudentId}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            blurOnSubmit={false}
          />

          <TextInput
            ref={phoneRef}
            style={styles.input}
            placeholder="Teléfono (opcional)"
            placeholderTextColor={lightTheme.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <Button
            title="Crear Cuenta"
            variant="cta"
            onPress={handleRegister}
            loading={loading}
          />

          <Text style={styles.link} onPress={() => router.back()}>
            ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia Sesión</Text>
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
    marginBottom: 32,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: lightTheme.primary,
  },
  subtitle: {
    fontSize: 16,
    color: lightTheme.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: 14,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.border,
    borderRadius: 10,
    backgroundColor: lightTheme.surface,
  },
  inputFlex: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: lightTheme.textPrimary,
  },
  inputAction: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
  },
  toggleIcon: {
    fontSize: 13,
    color: lightTheme.primary,
    fontWeight: '600',
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

export default RegisterScreen;
