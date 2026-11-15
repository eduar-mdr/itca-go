import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../../components/card/Card';
import { lightTheme, spacing, borderRadius, fontSize } from '../../../styles/theme';

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
};

const roleLabels = { student: 'Estudiante', driver: 'Conductor' };

export default function ProfileCard({ user, theme = lightTheme }) {
  if (!user) return null;

  const isDriver = user.role === 'driver';

  return (
    <Card style={styles.card} theme={theme}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{getInitials(user.name).toUpperCase()}</Text>
        </View>
      </View>

      <Text style={[styles.name, { color: theme.textPrimary }]}>{user.name}</Text>
      <Text style={[styles.email, { color: theme.textSecondary }]}>{user.email}</Text>

      <View style={[styles.roleBadge, { backgroundColor: isDriver ? theme.primary : theme.accent }]}>
        <Text style={styles.roleText}>{roleLabels[user.role] || user.role}</Text>
      </View>

      {user.studentId ? (
        <View style={[styles.infoRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Carnet</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.studentId}</Text>
        </View>
      ) : null}

      {user.phone ? (
        <View style={[styles.infoRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Teléfono</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user.phone}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  roleBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  roleText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: fontSize.sm,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
