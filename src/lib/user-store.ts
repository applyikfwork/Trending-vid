'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { YouTubeVideo } from './types';

export interface UserData {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  streak: number;
  lastVisit: string;
  totalPredictions: number;
  correctPredictions: number;
  badges: Badge[];
  level: number;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface WatchlistItem {
  video: YouTubeVideo;
  addedAt: string;
  watched: boolean;
}

export interface PredictionEntry {
  id: string;
  videoId: string;
  videoTitle: string;
  predictionType: 'viral' | 'trending' | 'declining';
  confidence: number;
  createdAt: string;
  resolvedAt?: string;
  correct?: boolean;
  actualOutcome?: string;
}

export interface HistoryEntry {
  date: string;
  videos: YouTubeVideo[];
  region: string;
  category: string;
}

interface UserStore {
  user: UserData | null;
  watchlist: WatchlistItem[];
  predictions: PredictionEntry[];
  history: HistoryEntry[];
  
  // User actions
  initializeUser: () => void;
  updateStreak: () => void;
  addXP: (amount: number) => void;
  earnBadge: (badge: Badge) => void;
  
  // Watchlist actions
  addToWatchlist: (video: YouTubeVideo) => void;
  removeFromWatchlist: (videoId: string) => void;
  markAsWatched: (videoId: string) => void;
  
  // Prediction actions
  addPrediction: (prediction: Omit<PredictionEntry, 'id' | 'createdAt'>) => void;
  resolvePrediction: (id: string, correct: boolean, actualOutcome: string) => void;
  
  // History actions
  addToHistory: (entry: HistoryEntry) => void;
  getHistoryByDate: (date: string) => HistoryEntry | undefined;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      watchlist: [],
      predictions: [],
      history: [],

      initializeUser: () => {
        const existingUser = get().user;
        if (!existingUser) {
          const newUser: UserData = {
            id: `user_${Date.now()}`,
            name: 'Trend Explorer',
            avatar: '🔍',
            joinDate: new Date().toISOString(),
            streak: 1,
            lastVisit: new Date().toISOString(),
            totalPredictions: 0,
            correctPredictions: 0,
            badges: [],
            level: 1,
            xp: 0,
          };
          set({ user: newUser });
        } else {
          // Update streak if user returns
          const today = new Date().toDateString();
          const lastVisit = new Date(existingUser.lastVisit).toDateString();
          if (today !== lastVisit) {
            get().updateStreak();
          }
        }
      },

      updateStreak: () => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            streak: state.user.streak + 1,
            lastVisit: new Date().toISOString(),
          } : null
        }));
        get().addXP(10); // Bonus XP for daily visits
      },

      addXP: (amount: number) => {
        set((state) => {
          if (!state.user) return state;
          
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            }
          };
        });
      },

      earnBadge: (badge: Badge) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            badges: [...state.user.badges, badge],
          } : null
        }));
        get().addXP(50); // Bonus XP for earning badges
      },

      addToWatchlist: (video: YouTubeVideo) => {
        const item: WatchlistItem = {
          video,
          addedAt: new Date().toISOString(),
          watched: false,
        };
        set((state) => ({
          watchlist: [item, ...state.watchlist.filter(w => w.video.id !== video.id)]
        }));
        get().addXP(5);
      },

      removeFromWatchlist: (videoId: string) => {
        set((state) => ({
          watchlist: state.watchlist.filter(w => w.video.id !== videoId)
        }));
      },

      markAsWatched: (videoId: string) => {
        set((state) => ({
          watchlist: state.watchlist.map(w => 
            w.video.id === videoId ? { ...w, watched: true } : w
          )
        }));
        get().addXP(2);
      },

      addPrediction: (predictionData) => {
        const prediction: PredictionEntry = {
          ...predictionData,
          id: `pred_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          predictions: [prediction, ...state.predictions],
          user: state.user ? {
            ...state.user,
            totalPredictions: state.user.totalPredictions + 1,
          } : null
        }));
        get().addXP(15);
      },

      resolvePrediction: (id: string, correct: boolean, actualOutcome: string) => {
        set((state) => ({
          predictions: state.predictions.map(p => 
            p.id === id ? {
              ...p,
              resolvedAt: new Date().toISOString(),
              correct,
              actualOutcome,
            } : p
          ),
          user: state.user && correct ? {
            ...state.user,
            correctPredictions: state.user.correctPredictions + 1,
          } : state.user
        }));
        if (correct) {
          get().addXP(25);
        }
      },

      addToHistory: (entry: HistoryEntry) => {
        set((state) => ({
          history: [entry, ...state.history.slice(0, 29)] // Keep last 30 entries
        }));
      },

      getHistoryByDate: (date: string) => {
        return get().history.find(h => h.date === date);
      },
    }),
    {
      name: 'trend-gazer-user-storage',
    }
  )
);