import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../../src/styles/theme';

const TripsTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mis Viajes</Text>
      <Text style={styles.placeholder}>Viajes activos e inscripciones - Fase 4</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.background,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: lightTheme.textPrimary,
  },
  placeholder: {
    fontSize: 14,
    color: lightTheme.textSecondary,
    marginTop: 8,
  },
});

export default TripsTab;
