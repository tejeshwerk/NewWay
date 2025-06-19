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
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';

// ——— Your Firebase web config ———
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "newway-73103.firebaseapp.com",
  projectId: "newway-73103",
  storageBucket: "newway-73103.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Guard against duplicate initialization
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

const IndexScreen: React.FC = () => {
  const [videos, setVideos] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'videos'),
      orderBy('fetchedAt', 'desc'),
      limit(10)
    );
    const unsub = onSnapshot(q, (snap: any) => {
      const docs: DocumentData[] = snap.docs.map((d: any) => d.data());
      console.log('🔔 videos:', docs);
      setVideos(docs);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(_: DocumentData, idx: number) => idx.toString()}
        renderItem={({ item }: { item: DocumentData }) => (
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

export default IndexScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  loader: { flex: 1, justifyContent: 'center' },
  card: { margin: 16, borderRadius: 12, overflow: 'hidden' },
  video: { width: '100%', height: 200 },
  headline: { color: '#FFF', marginTop: 8, fontSize: 16, fontWeight: 'bold' }
});
