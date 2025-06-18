import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="menu" size={24} color="#FFF" />
        <Text style={styles.title}>New Way</Text>
        <MaterialCommunityIcons name="account-circle" size={24} color="#FFF" />
      </View>

      {/* VIDEO CARD */}
      <View style={styles.videoCard}>
        <Text style={styles.videoLabel}>VIDEO</Text>
        <View style={styles.sideIcons}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="heart-outline" size={28} color="#AAA" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bookmark-outline" size={28} color="#AAA" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="share-variant" size={28} color="#AAA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItemActive}>
          <MaterialCommunityIcons name="bookmark" size={24} color="#007AFF" />
          <Text style={styles.tabLabelActive}>For You</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="view-headline" size={24} color="#AAA" />
          <Text style={styles.tabLabel}>Headlines</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color="#AAA" />
          <Text style={styles.tabLabel}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="earth" size={24} color="#AAA" />
          <Text style={styles.tabLabel}>World</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoCard: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: '#CCCCCC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sideIcons: {
    position: 'absolute',
    right: 16,
    top: '35%',
    alignItems: 'center',
    gap: 24,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabItemActive: {
    alignItems: 'center',
  },
  tabLabel: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
  },
});
