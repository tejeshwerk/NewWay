import React, { useEffect, useState } from 'react'
import { SafeAreaView, FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { Video } from 'expo-av'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, orderBy, onSnapshot, DocumentData, limit } from 'firebase/firestore'

// TODO: replace with your Firebase web config or use env variables
const firebaseConfig = { /* your config */ }
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function VideosFeed() {
  const [videos, setVideos] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'videos'),
      orderBy('fetchedAt', 'desc'),
      limit(10)
    )
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setVideos(snapshot.docs.map((doc: any) => doc.data()))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return <ActivityIndicator style={styles.loader} />
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item: any) => item.fetchedAt.toMillis().toString()}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.card}>
            <Video
              source={{ uri: item.videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
            />
            <Text style={styles.headline}>{item.headline}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  loader: { flex: 1, justifyContent: 'center' },
  card: { margin: 16, borderRadius: 12, overflow: 'hidden' },
  video: { width: '100%', height: 200 },
  headline: { color: '#FFF', marginTop: 8, fontSize: 16, fontWeight: 'bold' }
})
