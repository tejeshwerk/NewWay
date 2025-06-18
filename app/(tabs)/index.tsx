import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItemInfo, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import VideoItem from '../../components/VideoItem';
import { fetchForYouVideos, Video } from '../../services/videoService';

export default function ForYouScreen() {
  const tw = useTailwind();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const offsetRef = useRef(0);

  const load = async () => {
    setLoading(true);
    const newOnes = await fetchForYouVideos(offsetRef.current);
    setVideos(v => [...v, ...newOnes]);
    offsetRef.current += 3;
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onViewable = useRef(({ viewableItems }: any) => {
    if (
      viewableItems[0]?.index === videos.length - 1 &&
      !loading
    ) load();
  }).current;

  if (loading && videos.length === 0) {
    return (
      <View style={tw('flex-1 justify-center items-center bg-black')}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={tw('flex-1 bg-black')}>
      <FlatList
        data={videos}
        pagingEnabled
        keyExtractor={i => i.id}
        renderItem={({ item }: ListRenderItemInfo<Video>) => <VideoItem video={item} />}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}