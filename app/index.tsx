import React from 'react'
import { SafeAreaView, Text, StyleSheet } from 'react-native'
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New Way</Text>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' }
})
