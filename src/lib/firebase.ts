import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      totalVotes: 0,
      favoriteVideos: []
    });
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        totalVotes: 0,
        favoriteVideos: []
      });
    }
    
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Voting functions
export const voteForVideo = async (user: User, videoId: string, voteType: 'up' | 'down') => {
  if (!user) throw new Error('User must be authenticated to vote');
  
  try {
    const voteDoc = doc(db, 'votes', `${user.uid}_${videoId}`);
    const existingVote = await getDoc(voteDoc);
    
    if (existingVote.exists()) {
      const currentVote = existingVote.data().type;
      if (currentVote === voteType) {
        throw new Error('You have already voted on this video');
      }
      // Update existing vote
      await updateDoc(voteDoc, {
        type: voteType,
        updatedAt: new Date()
      });
    } else {
      // Create new vote
      await setDoc(voteDoc, {
        userId: user.uid,
        videoId: videoId,
        type: voteType,
        createdAt: new Date()
      });
      
      // Increment user's total votes
      await updateDoc(doc(db, 'users', user.uid), {
        totalVotes: increment(1)
      });
    }
    
    // Update video vote counts
    const videoDoc = doc(db, 'videoStats', videoId);
    const videoStats = await getDoc(videoDoc);
    
    if (videoStats.exists()) {
      const currentStats = videoStats.data();
      const upVotes = voteType === 'up' ? (currentStats.upVotes || 0) + 1 : currentStats.upVotes || 0;
      const downVotes = voteType === 'down' ? (currentStats.downVotes || 0) + 1 : currentStats.downVotes || 0;
      
      await updateDoc(videoDoc, {
        upVotes,
        downVotes,
        updatedAt: new Date()
      });
    } else {
      await setDoc(videoDoc, {
        videoId,
        upVotes: voteType === 'up' ? 1 : 0,
        downVotes: voteType === 'down' ? 1 : 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getUserVote = async (userId: string, videoId: string) => {
  try {
    const voteDoc = await getDoc(doc(db, 'votes', `${userId}_${videoId}`));
    return voteDoc.exists() ? voteDoc.data().type : null;
  } catch (error) {
    return null;
  }
};

export const getVideoStats = async (videoId: string) => {
  try {
    const videoDoc = await getDoc(doc(db, 'videoStats', videoId));
    if (videoDoc.exists()) {
      return videoDoc.data();
    }
    return { upVotes: 0, downVotes: 0 };
  } catch (error) {
    return { upVotes: 0, downVotes: 0 };
  }
};

export const addToFavorites = async (user: User, videoId: string) => {
  if (!user) throw new Error('User must be authenticated');
  
  try {
    const userDoc = doc(db, 'users', user.uid);
    const userData = await getDoc(userDoc);
    
    if (userData.exists()) {
      const favorites = userData.data().favoriteVideos || [];
      if (!favorites.includes(videoId)) {
        await updateDoc(userDoc, {
          favoriteVideos: [...favorites, videoId]
        });
      }
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const removeFromFavorites = async (user: User, videoId: string) => {
  if (!user) throw new Error('User must be authenticated');
  
  try {
    const userDoc = doc(db, 'users', user.uid);
    const userData = await getDoc(userDoc);
    
    if (userData.exists()) {
      const favorites = userData.data().favoriteVideos || [];
      const updatedFavorites = favorites.filter((id: string) => id !== videoId);
      await updateDoc(userDoc, {
        favoriteVideos: updatedFavorites
      });
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};