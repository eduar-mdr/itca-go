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

export default function ProfileCard({ user }) {
  if (!user) return null;

  const isDriver = user.role === 'driver';

  return (
    <Card style={styles.card}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: lightTheme.primary }]}>
          <Text style={styles.avatarText}>{getInitials(user.name).toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={[styles.roleBadge, { backgroundColor: isDriver ? lightTheme.primary : lightTheme.accent }]}>
        <Text style={styles.roleText}>{roleLabels[user.role] || user.role}</Text>
      </View>

      {user.studentId ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Carnet</Text>
          <Text style={styles.infoValue}>{user.studentId}</Text>
        </View>
      ) : null}

      {user.phone ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
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
    color: lightTheme.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
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
    borderTopColor: lightTheme.border,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: lightTheme.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: lightTheme.textPrimary,
    fontWeight: '600',
  },
});
