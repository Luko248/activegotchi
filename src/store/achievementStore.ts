import { create } from 'zustand';
import { Achievement, UserStats, AchievementNotification } from '../types/achievements';
import { AchievementService } from '../services/achievementService';

interface AchievementStore {
  achievements: Achievement[];
  userStats: UserStats;
  unseenNotifications: AchievementNotification[];
  
  // Actions
  initializeAchievements: () => void;
  trackPetTap: () => Achievement[];
  trackPirouette: () => Achievement[];
  trackDailyProgress: (steps: number, distance: number, goalAchieved: boolean) => Achievement[];
  checkDailyAchievements: (steps: number, distance: number) => Achievement[];
  markNotificationsSeen: () => void;
  refreshNotifications: () => void;
}

const achievementService = AchievementService.getInstance();

export const useAchievementStore = create<AchievementStore>((set, _get) => ({
  achievements: [],
  userStats: {
    totalSteps: 0,
    totalDistance: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalPetTaps: 0,
    totalPirouettes: 0,
    totalGoalAchievements: 0,
    daysActive: 0
  },
  unseenNotifications: [],

  initializeAchievements: () => {
    const achievements = achievementService.getAchievements();
    const userStats = achievementService.getUserStats();
    const unseenNotifications = achievementService.getUnseenNotifications();
    
    set({
      achievements,
      userStats,
      unseenNotifications
    });
  },

  trackPetTap: () => {
    const newAchievements = achievementService.trackPetTap();
    const userStats = achievementService.getUserStats();
    const achievements = achievementService.getAchievements();
    const unseenNotifications = achievementService.getUnseenNotifications();
    
    set({
      achievements,
      userStats,
      unseenNotifications
    });
    
    return newAchievements;
  },

  trackPirouette: () => {
    const newAchievements = achievementService.trackPirouette();
    const userStats = achievementService.getUserStats();
    const achievements = achievementService.getAchievements();
    const unseenNotifications = achievementService.getUnseenNotifications();
    
    set({
      achievements,
      userStats,
      unseenNotifications
    });
    
    return newAchievements;
  },

  trackDailyProgress: (steps: number, distance: number, goalAchieved: boolean) => {
    const newAchievements = achievementService.trackDailyProgress(steps, distance, goalAchieved);
    const userStats = achievementService.getUserStats();
    const achievements = achievementService.getAchievements();
    const unseenNotifications = achievementService.getUnseenNotifications();
    
    set({
      achievements,
      userStats,
      unseenNotifications
    });
    
    return newAchievements;
  },

  checkDailyAchievements: (steps: number, distance: number) => {
    const newAchievements = achievementService.checkDailyAchievements(steps, distance);
    const achievements = achievementService.getAchievements();
    const unseenNotifications = achievementService.getUnseenNotifications();
    
    set({
      achievements,
      unseenNotifications
    });
    
    return newAchievements;
  },

  markNotificationsSeen: () => {
    achievementService.markNotificationsSeen();
    set({ unseenNotifications: [] });
  },

  refreshNotifications: () => {
    const unseenNotifications = achievementService.getUnseenNotifications();
    set({ unseenNotifications });
  }
}));
