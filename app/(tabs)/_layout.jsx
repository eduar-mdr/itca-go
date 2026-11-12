import { Tabs } from 'expo-router';
import { lightTheme } from '../../src/styles/theme';
import Ionicons from '@react-native-vector-icons/ionicons';

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
        options={{ title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          )
         }}
      />
      <Tabs.Screen
        name="trips"
        options={{ title: 'Mis Viajes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
