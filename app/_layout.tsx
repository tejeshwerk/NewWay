import React from 'react';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderRadius: 16,
          margin: 16,
          height: 60
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'For You',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="bookmark"
              size={24}
              color="#007AFF"
            />
          )
        }}
      />
      {/* Add other tabs (headlines, local, world) here by creating
          additional files under app/ and adding Tabs.Screen entries */}
    </Tabs>
  );
}
