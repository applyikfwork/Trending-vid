export interface YouTubeVideo {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
  };
  summary?: string; // AI-generated summary
  userVote?: 'up' | 'down' | null; // User's vote on this video
  communityVotes?: {
    upVotes: number;
    downVotes: number;
  }; // Community voting stats
}

export interface UserVote {
  userId: string;
  videoId: string;
  type: 'up' | 'down';
  createdAt: Date;
  updatedAt?: Date;
}

export interface VideoStats {
  videoId: string;
  upVotes: number;
  downVotes: number;
  createdAt: Date;
  updatedAt: Date;
}
