import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="menu" size={24} color="#CCC" />
        <Text style={styles.title}>New Way</Text>
        <View style={styles.profileIcon}>
          <MaterialCommunityIcons name="account" size={24} color="#CCC" />
        </View>
      </View>

      <View style={styles.videoCard}>
        <Text style={styles.videoLabel}>VIDEO</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialCommunityIcons name="heart-outline" size={28} color="#AAA" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialCommunityIcons name="bookmark-outline" size={28} color="#AAA" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="share-variant" size={28} color="#AAA" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="bookmark" size={24} color="#007AFF" />
          <Text style={[styles.tabLabel, { color: '#007AFF' }]}>For You</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="view-headline" size={24} color="#AAA" />
          <Text style={[styles.tabLabel, { color: '#AAA' }]}>Headlines</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color="#AAA" />
          <Text style={[styles.tabLabel, { color: '#AAA' }]}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="earth" size={24} color="#AAA" />
          <Text style={[styles.tabLabel, { color: '#AAA' }]}>World</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 12,
    margin: 16,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileIcon: {
    backgroundColor: '#252525',
    padding: 6,
    borderRadius: 16,
  },
  videoCard: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: '#888',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    position: 'absolute',
    right: 16,
    top: '35%',
    alignItems: 'center',
  },
  actionBtn: {
    marginBottom: 24,
  },
  tabBar: {
    backgroundColor: '#000',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
  },
})
