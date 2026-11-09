import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../../src/styles/theme';

const ExploreTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explorar</Text>
      <Text style={styles.placeholder}>Mapa y rutas activas - Fase 2</Text>
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

export default ExploreTab;
