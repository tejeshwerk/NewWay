import React from 'react';
import { Text, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

export default function HeadlinesScreen() {
  const tw = useTailwind();
  return (
    <View style={tw('flex-1 justify-center items-center bg-black')}>
      <Text style={tw('text-white text-lg')}>Headlines coming soon!</Text>
    </View>
  );
}