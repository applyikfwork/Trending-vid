
import type { YouTubeVideo } from './types';

const API_KEY = "AIzaSyCyEF3GUU7_zRp4-qQQhn7gccrifsdDUgY";
const VIDEOS_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
const SEARCH_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function getTrendingVideos(regionCode: string, categoryId: string = '0'): Promise<YouTubeVideo[]> {
  const url = new URL(VIDEOS_API_URL);
  url.searchParams.append('part', 'snippet,statistics');
  url.searchParams.append('chart', 'mostPopular');
  url.searchParams.append('maxResults', '50');
  url.searchParams.append('regionCode', regionCode);
  if (categoryId !== '0') {
    url.searchParams.append('videoCategoryId', categoryId);
  }
  url.searchParams.append('key', API_KEY);

  try {
    const response = await fetch(url.toString(), {
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

export async function getTrendingShorts(regionCode: string): Promise<YouTubeVideo[]> {
  const searchUrl = new URL(SEARCH_API_URL);
  searchUrl.searchParams.append('part', 'id');
  searchUrl.searchParams.append('q', '#shorts');
  searchUrl.searchParams.append('type', 'video');
  searchUrl.searchParams.append('videoDuration', 'short');
  searchUrl.searchParams.append('order', 'date');
  searchUrl.searchParams.append('maxResults', '50');
  searchUrl.searchParams.append('regionCode', regionCode);
  searchUrl.searchParams.append('key', API_KEY);
  
  try {
    const searchResponse = await fetch(searchUrl.toString(), {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube Search API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to search for trending shorts.');
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    if (!videoIds) {
      return [];
    }

    const videosUrl = new URL(VIDEOS_API_URL);
    videosUrl.searchParams.append('part', 'snippet,statistics');
    videosUrl.searchParams.append('id', videoIds);
    videosUrl.searchParams.append('key', API_KEY);
    
    const videosResponse = await fetch(videosUrl.toString(), {
      next: { revalidate: 3600 }
    });

    if (!videosResponse.ok) {
      const errorData = await videosResponse.json();
      console.error('YouTube Videos API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch shorts details.');
    }
    
    const videosData = await videosResponse.json();
    return videosData.items || [];

  } catch (error) {
    console.error('Network or parsing error in getTrendingShorts:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching shorts.');
  }
}
