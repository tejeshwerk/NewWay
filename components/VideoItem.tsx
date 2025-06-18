// components/VideoItem.tsx
import { FontAwesome } from '@expo/vector-icons';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { Video as VideoType } from '../services/videoService';

const { width, height } = Dimensions.get('window');

interface VideoItemProps {
  video: VideoType;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const tw = useTailwind();
  const [paused, setPaused] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setPaused(p => !p)}
      style={tw('flex-1 bg-black justify-center items-center')}
    >
      <ExpoVideo
        source={{ uri: video.hlsUrl }}
        shouldPlay={!paused}
        isLooping
        resizeMode={ResizeMode.COVER}
        style={{ width, height }}
      />

      <View style={[tw('absolute right-4'), { top: height / 3 }]}>
        <TouchableOpacity style={tw('items-center mb-4')}>
          <FontAwesome
            name={video.userHasLiked ? 'heart' : 'heart-o'}
            size={32}
            color="#fff"
          />
          <Text style={tw('text-white mt-1')}>{video.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw('items-center')}>
          <FontAwesome name="share" size={32} color="#fff" />
          <Text style={tw('text-white mt-1')}>{video.shareCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default VideoItem;
