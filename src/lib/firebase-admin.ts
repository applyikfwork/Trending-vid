import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  Timestamp,
  updateDoc,
  doc,
  getDoc,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

// Analytics and monitoring functions
export const logUserActivity = async (userId: string, action: string, metadata?: any) => {
  try {
    await addDoc(collection(db, 'userActivity'), {
      userId,
      action,
      metadata: metadata || {},
      timestamp: Timestamp.now(),
      sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('sessionId') || 'unknown' : 'server'
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};

export const getSystemMetrics = async () => {
  try {
    const [
      usersSnapshot,
      videosSnapshot,
      votesSnapshot,
      activitySnapshot
    ] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'videoStats')),
      getDocs(collection(db, 'votes')),
      getDocs(query(
        collection(db, 'userActivity'), 
        where('timestamp', '>=', Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))),
        orderBy('timestamp', 'desc')
      ))
    ]);

    const totalUsers = usersSnapshot.size;
    const totalVideos = videosSnapshot.size;
    const totalVotes = votesSnapshot.size;
    const dailyActivity = activitySnapshot.size;

    // Calculate engagement metrics
    let totalUpVotes = 0;
    let totalDownVotes = 0;
    
    videosSnapshot.forEach(doc => {
      const data = doc.data();
      totalUpVotes += data.upVotes || 0;
      totalDownVotes += data.downVotes || 0;
    });

    return {
      totalUsers,
      totalVideos,
      totalVotes,
      dailyActivity,
      totalUpVotes,
      totalDownVotes,
      engagementRate: totalUsers > 0 ? (totalVotes / totalUsers) : 0
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return null;
  }
};

export const getUserAnalytics = async (timeRange = '7d') => {
  try {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const activityQuery = query(
      collection(db, 'userActivity'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(activityQuery);
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Analyze user behavior patterns
    const actionCounts = activities.reduce((acc: any, activity: any) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {});

    const userEngagement = activities.reduce((acc: any, activity: any) => {
      if (!acc[activity.userId]) {
        acc[activity.userId] = { actions: 0, lastSeen: activity.timestamp };
      }
      acc[activity.userId].actions += 1;
      return acc;
    }, {});

    return {
      totalActivities: activities.length,
      actionBreakdown: actionCounts,
      activeUsers: Object.keys(userEngagement).length,
      avgActionsPerUser: Object.keys(userEngagement).length > 0 
        ? activities.length / Object.keys(userEngagement).length 
        : 0,
      topActions: Object.entries(actionCounts)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 5),
      activities: activities.slice(0, 100) // Recent 100 activities
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return null;
  }
};

export const getContentReports = async () => {
  try {
    const reportsQuery = query(
      collection(db, 'contentReports'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(reportsQuery);
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return reports;
  } catch (error) {
    console.error('Error getting content reports:', error);
    return [];
  }
};

export const reportContent = async (videoId: string, userId: string, reason: string, description?: string) => {
  try {
    await addDoc(collection(db, 'contentReports'), {
      videoId,
      reportedBy: userId,
      reason,
      description: description || '',
      status: 'pending',
      timestamp: Timestamp.now()
    });

    // Log the reporting activity
    await logUserActivity(userId, 'report_content', { videoId, reason });
    
    return { success: true };
  } catch (error) {
    console.error('Error reporting content:', error);
    return { success: false, error: error };
  }
};

export const updateSystemConfig = async (config: any) => {
  try {
    const configDoc = doc(db, 'systemConfig', 'main');
    await updateDoc(configDoc, {
      ...config,
      lastUpdated: Timestamp.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating system config:', error);
    return { success: false, error: error };
  }
};

export const getSystemConfig = async () => {
  try {
    const configDoc = await getDoc(doc(db, 'systemConfig', 'main'));
    if (configDoc.exists()) {
      return configDoc.data();
    }
    
    // Return default config if none exists
    return {
      trendingAlgorithm: {
        viewWeight: 0.4,
        likeWeight: 0.3,
        recencyWeight: 0.3,
        minViews: 1000
      },
      contentModeration: {
        autoFlag: true,
        flagThreshold: 5,
        requireApproval: false
      },
      rateLimiting: {
        votesPerHour: 100,
        reportsPerDay: 10
      }
    };
  } catch (error) {
    console.error('Error getting system config:', error);
    return null;
  }
};