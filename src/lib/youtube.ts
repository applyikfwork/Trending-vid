
import type { YouTubeVideo } from './types';

const API_KEY = 'AIzaSyCyEF3GUU7_zRp4-qQQhn7gccrifsdDUgY';
const VIDEOS_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
const SEARCH_API_URL = 'https://www.googleapis.com/youtube/v3/search';

async function fetchFromApi(url: URL) {
  if (!API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not set. Please add your YouTube API key in the Secrets tool.');
  }
  url.searchParams.append('key', API_KEY);

  try {
    const response = await fetch(url.toString(), {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      const errorMessage = errorData.error?.errors?.[0]?.message || errorData.error?.message || 'Failed to fetch data from YouTube.';
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Network or parsing error:', error);
    if (error instanceof Error) {
      // Re-throw the specific error message from the API or a generic one
      throw new Error(error.message || 'An unexpected error occurred while fetching videos.');
    }
    throw new Error('An unexpected error occurred while fetching videos.');
  }
}

export async function getTrendingVideos(regionCode: string, categoryId: string = '0'): Promise<YouTubeVideo[]> {
  const url = new URL(VIDEOS_API_URL);
  url.searchParams.append('part', 'snippet,statistics');
  url.searchParams.append('chart', 'mostPopular');
  url.searchParams.append('maxResults', '50');
  url.searchParams.append('regionCode', regionCode);
  if (categoryId !== '0') {
    url.searchParams.append('videoCategoryId', categoryId);
  }
  
  const data = await fetchFromApi(url);
  return data.items || [];
}

export async function getTrendingShorts(regionCode: string): Promise<YouTubeVideo[]> {
  const searchUrl = new URL(SEARCH_API_URL);
  searchUrl.searchParams.append('part', 'id');
  searchUrl.searchParams.append('q', '#shorts');
  searchUrl.searchParams.append('type', 'video');
  searchUrl.searchParams.append('videoDuration', 'short');
  searchUrl.searchParams.append('order', 'date');
  searchUrl.searchParams.append('relevanceLanguage', 'en');
  searchUrl.searchParams.append('maxResults', '50');
  searchUrl.searchParams.append('regionCode', regionCode);
  
  const searchData = await fetchFromApi(searchUrl);
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

  if (!videoIds) {
    return [];
  }

  const videosUrl = new URL(VIDEOS_API_URL);
  videosUrl.searchParams.append('part', 'snippet,statistics');
  videosUrl.searchParams.append('id', videoIds);
    
  const videosData = await fetchFromApi(videosUrl);
  return videosData.items || [];
}
