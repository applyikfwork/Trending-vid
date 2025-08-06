import type { YouTubeVideo } from './types';

const API_KEY = "AIzaSyCyEF3GUU7_zRp4-qQQhn7gccrifsdDUgY";
const API_URL = 'https://www.googleapis.com/youtube/v3/videos';

export async function getTrendingVideos(regionCode: string): Promise<YouTubeVideo[]> {
  const url = `${API_URL}?part=snippet,statistics&chart=mostPopular&maxResults=24&regionCode=${regionCode}&key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch trending videos.');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Network or parsing error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching videos.');
  }
}
