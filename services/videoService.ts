export interface Video {
    id: string;
    hlsUrl: string;
    thumbnailUrl: string;
    title: string;
    sourceName: string;
    publishDate: string;
    likeCount: number;
    shareCount: number;
    userHasLiked: boolean;
  }
  
  export const fetchForYouVideos = async (offset = 0, limit = 3): Promise<Video[]> => {
    await new Promise(res => setTimeout(res, 800));
    return Array.from({ length: limit }).map((_, i) => ({
      id: `video-${offset + i}`,
      hlsUrl: 'https://example.com/video.m3u8',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      title: `Sample Video #${offset + i + 1}`,
      sourceName: 'NewsSource',
      publishDate: new Date().toISOString(),
      likeCount: Math.floor(Math.random() * 1000),
      shareCount: Math.floor(Math.random() * 1000),
      userHasLiked: false,
    }));
  };
  