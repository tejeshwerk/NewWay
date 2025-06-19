import React from 'react'
import { Text, useColorScheme, StyleSheet, TextProps } from 'react-native'
export function ThemedText(props: TextProps) {
  const scheme = useColorScheme()
  return <Text style={[styles.text, scheme === 'dark' ? styles.dark : styles.light]} {...props}/>
}
const styles = StyleSheet.create({
  text: { fontSize: 16 },
  dark: { color: '#FFF' },
  light: { color: '#000' }
})
