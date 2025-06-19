import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Video } from 'expo-av';
import {
  initializeApp,
  getApps,
  getApp
} from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';

// Firebase config (from Console → Project Settings → SDK)
const firebaseConfig = {
  apiKey: "AIzaSyA1b2C3d4E5f6GhI7J8k9L0MnOpQrStUv",
  authDomain: "newway-73103.firebaseapp.com",
  projectId: "newway-73103",
  storageBucket: "newway-73103.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Only initialize Firebase once
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const db = getFirestore(app);

const VideosFeed: React.FC = () => {
  const [videos, setVideos] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videosQuery = query(
      collection(db, 'videos'),
      orderBy('fetchedAt', 'desc'),
      limit(10)
    );

    // explicitly type parameters as any
    const unsubscribe = onSnapshot(videosQuery, (snap: any) => {
      const docs: DocumentData[] = snap.docs.map((doc: any) => doc.data());
      console.log('📦 fetched videos:', docs);
      setVideos(docs);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item: DocumentData, index: number) =>
          item.fetchedAt?.toMillis
            ? item.fetchedAt.toMillis().toString()
            : index.toString()
        }
        renderItem={({
          item
        }: {
          item: DocumentData;
        }) => (
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
  );
};

export default VideosFeed;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  loader: { flex: 1, justifyContent: 'center' },
  card: { margin: 16, borderRadius: 12, overflow: 'hidden' },
  video: { width: '100%', height: 200 },
  headline: { color: '#FFF', marginTop: 8, fontSize: 16, fontWeight: 'bold' }
});
