import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const getUserStats = async (userId: string) => {
  try {
    // Get user votes
    const votesQuery = query(
      collection(db, 'votes'),
      where('userId', '==', userId)
    );
    const votesSnapshot = await getDocs(votesQuery);
    
    let upVotes = 0;
    let downVotes = 0;
    
    votesSnapshot.forEach(doc => {
      const vote = doc.data();
      if (vote.type === 'up') upVotes++;
      else downVotes++;
    });

    // Calculate influence score based on activity
    const influenceScore = (upVotes * 2) + (downVotes * 1) + (votesSnapshot.size * 0.5);

    return {
      totalVotes: votesSnapshot.size,
      upVotes,
      downVotes,
      influenceScore: Math.round(influenceScore)
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalVotes: 0,
      upVotes: 0,
      downVotes: 0,
      influenceScore: 0
    };
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favoriteIds = userData.favoriteVideos || [];
      
      // For now, return mock data. In a real app, you'd fetch video details
      return favoriteIds.map((videoId: string) => ({
        id: videoId,
        title: `Favorite Video ${videoId.slice(0, 8)}`,
        channel: 'Channel Name',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
};

export const getUserVotingHistory = async (userId: string) => {
  try {
    const votesQuery = query(
      collection(db, 'votes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(votesQuery);
    const votes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return votes;
  } catch (error) {
    console.error('Error getting voting history:', error);
    return [];
  }
};

export const getUserFollowing = async (userId: string) => {
  try {
    const followingQuery = query(
      collection(db, 'userFollowing'),
      where('followerId', '==', userId)
    );
    
    const snapshot = await getDocs(followingQuery);
    const following = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return following;
  } catch (error) {
    console.error('Error getting user following:', error);
    return [];
  }
};

export const followUser = async (currentUserId: string, targetUserId: string) => {
  try {
    // Implementation for following a user
    // This would add a document to 'userFollowing' collection
    return { success: true };
  } catch (error) {
    console.error('Error following user:', error);
    return { success: false, error };
  }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  try {
    // Implementation for unfollowing a user
    return { success: true };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, error };
  }
};