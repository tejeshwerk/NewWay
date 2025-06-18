import { Slot } from 'expo-router';
import 'expo-router/entry';
import React from 'react';
import { TailwindProvider } from 'tailwind-rn';


import utilities from '../tailwind.json';

export default function RootLayout(): JSX.Element {
  return (
    <TailwindProvider utilities={utilities as any}>
      <Slot />
    </TailwindProvider>
  );
}
