import { Tabs } from 'expo-router';
import { lightTheme } from '../../src/styles/theme';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: lightTheme.primary,
        tabBarInactiveTintColor: lightTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: lightTheme.background,
          borderTopColor: lightTheme.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Explorar' }}
      />
      <Tabs.Screen
        name="trips"
        options={{ title: 'Mis Viajes' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil' }}
      />
    </Tabs>
  );
};

export default TabsLayout;
