export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'steps' | 'distance' | 'streak' | 'special' | 'milestones';
  condition: {
    type: 'steps_daily' | 'steps_total' | 'distance_daily' | 'distance_total' | 'streak_days' | 'pet_taps' | 'pirouettes' | 'goal_achievements';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
  totalSteps: number;
  totalDistance: number;
  currentStreak: number;
  maxStreak: number;
  totalPetTaps: number;
  totalPirouettes: number;
  totalGoalAchievements: number;
  daysActive: number;
  lastActiveDate?: string;
}

export interface AchievementNotification {
  achievement: Achievement;
  timestamp: Date;
  seen: boolean;
}