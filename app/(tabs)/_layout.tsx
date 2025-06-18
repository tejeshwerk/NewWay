import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#000' },
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof FontAwesome>['name'] = 'home';
          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'explore':
              iconName = 'newspaper-o';
              break;
            case 'local':
              iconName = 'map-marker';
              break;
            case 'world':
              iconName = 'globe';
              break;
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'For You' }} />
      <Tabs.Screen name="explore" options={{ title: 'Headlines' }} />
      <Tabs.Screen name="local" options={{ title: 'Local' }} />
      <Tabs.Screen name="world" options={{ title: 'World' }} />
    </Tabs>
  );
}