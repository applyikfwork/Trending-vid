import { YouTubeVideo } from './types';
import { getUserVotingHistory, getUserFavorites } from './user-stats';

export interface RecommendationEngine {
  generateRecommendations(userId: string, allVideos: YouTubeVideo[]): Promise<YouTubeVideo[]>;
}

export class AIRecommendationEngine implements RecommendationEngine {
  async generateRecommendations(userId: string, allVideos: YouTubeVideo[]): Promise<YouTubeVideo[]> {
    try {
      // Get user's voting history and favorites
      const [votingHistory, favorites] = await Promise.all([
        getUserVotingHistory(userId),
        getUserFavorites(userId)
      ]);

      // Analyze user preferences
      const userPreferences = this.analyzeUserPreferences(votingHistory, favorites);
      
      // Score videos based on user preferences
      const scoredVideos = allVideos.map(video => ({
        ...video,
        recommendationScore: this.calculateRecommendationScore(video, userPreferences)
      }));

      // Sort by recommendation score and return top recommendations
      return scoredVideos
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 10)
        .map(({ recommendationScore, ...video }) => video);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to trending videos
      return allVideos.slice(0, 10);
    }
  }

  private analyzeUserPreferences(votingHistory: any[], favorites: any[]) {
    const preferences = {
      channels: new Map<string, number>(),
      categories: new Map<string, number>(),
      keywords: new Map<string, number>(),
      avgViews: 0,
      avgLikes: 0,
      recencyPreference: 0.5 // 0 = old videos, 1 = new videos
    };

    // Analyze voting patterns
    let totalViews = 0;
    let totalLikes = 0;
    let videoCount = 0;

    votingHistory.forEach(vote => {
      const weight = vote.type === 'up' ? 2 : -1;
      
      if (vote.channelTitle) {
        const current = preferences.channels.get(vote.channelTitle) || 0;
        preferences.channels.set(vote.channelTitle, current + weight);
      }

      if (vote.title) {
        // Extract keywords from title
        const keywords = this.extractKeywords(vote.title);
        keywords.forEach(keyword => {
          const current = preferences.keywords.get(keyword) || 0;
          preferences.keywords.set(keyword, current + weight);
        });
      }

      if (vote.viewCount) {
        totalViews += parseInt(vote.viewCount);
        videoCount++;
      }

      if (vote.likeCount) {
        totalLikes += parseInt(vote.likeCount);
      }
    });

    // Analyze favorite videos
    favorites.forEach(fav => {
      if (fav.channel) {
        const current = preferences.channels.get(fav.channel) || 0;
        preferences.channels.set(fav.channel, current + 3); // Favorites get higher weight
      }
    });

    preferences.avgViews = videoCount > 0 ? totalViews / videoCount : 0;
    preferences.avgLikes = videoCount > 0 ? totalLikes / videoCount : 0;

    return preferences;
  }

  private calculateRecommendationScore(video: YouTubeVideo, preferences: any): number {
    let score = 0;

    // Channel preference
    const channelScore = preferences.channels.get(video.snippet.channelTitle) || 0;
    score += channelScore * 0.3;

    // Keyword matching
    const videoKeywords = this.extractKeywords(video.snippet.title);
    const keywordScore = videoKeywords.reduce((sum, keyword) => {
      return sum + (preferences.keywords.get(keyword) || 0);
    }, 0);
    score += keywordScore * 0.25;

    // View count similarity
    const videoViews = parseInt(video.statistics.viewCount);
    const viewSimilarity = preferences.avgViews > 0 
      ? 1 - Math.abs(videoViews - preferences.avgViews) / preferences.avgViews
      : 0.5;
    score += Math.max(0, viewSimilarity) * 0.2;

    // Engagement rate
    const likes = parseInt(video.statistics.likeCount || '0');
    const engagementRate = videoViews > 0 ? likes / videoViews : 0;
    score += engagementRate * 1000 * 0.15; // Scale up engagement rate

    // Recency bonus
    const publishDate = new Date(video.snippet.publishedAt);
    const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSincePublish / 30); // Decay over 30 days
    score += recencyScore * preferences.recencyPreference * 0.1;

    return score;
  }

  private extractKeywords(title: string): string[] {
    // Simple keyword extraction - in a real app, you'd use NLP
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an']);
    
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 10); // Limit to top 10 keywords
  }
}

export const recommendationEngine = new AIRecommendationEngine();