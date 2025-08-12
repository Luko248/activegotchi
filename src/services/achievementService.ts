import { Achievement, UserStats, AchievementNotification } from '../types/achievements';

export class AchievementService {
  private static instance: AchievementService;
  private storageKey = 'activegotchi-achievements';
  private statsKey = 'activegotchi-user-stats';
  private notificationsKey = 'activegotchi-achievement-notifications';

  static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  private defaultAchievements: Achievement[] = [
    // Steps achievements
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Take your first 100 steps',
      icon: '👶',
      category: 'steps',
      condition: { type: 'steps_total', value: 100 },
      unlocked: false,
      progress: 0,
      rarity: 'common'
    },
    {
      id: 'daily_walker',
      title: 'Daily Walker',
      description: 'Reach your daily step goal',
      icon: '🚶',
      category: 'steps',
      condition: { type: 'steps_daily', value: 10000 },
      unlocked: false,
      progress: 0,
      rarity: 'common'
    },
    {
      id: 'step_master',
      title: 'Step Master',
      description: 'Walk 100,000 total steps',
      icon: '🏃‍♂️',
      category: 'steps',
      condition: { type: 'steps_total', value: 100000 },
      unlocked: false,
      progress: 0,
      rarity: 'epic'
    },
    {
      id: 'marathon_walker',
      title: 'Marathon Walker',
      description: 'Walk 1 million steps',
      icon: '🏆',
      category: 'steps',
      condition: { type: 'steps_total', value: 1000000 },
      unlocked: false,
      progress: 0,
      rarity: 'legendary'
    },
    
    // Distance achievements
    {
      id: 'first_kilometer',
      title: 'First Kilometer',
      description: 'Walk your first kilometer',
      icon: '📍',
      category: 'distance',
      condition: { type: 'distance_total', value: 1 },
      unlocked: false,
      progress: 0,
      rarity: 'common'
    },
    {
      id: 'distance_daily',
      title: 'Daily Distance',
      description: 'Reach your daily distance goal',
      icon: '🎯',
      category: 'distance',
      condition: { type: 'distance_daily', value: 8 },
      unlocked: false,
      progress: 0,
      rarity: 'common'
    },
    {
      id: 'hundred_km',
      title: 'Century Walker',
      description: 'Walk 100 kilometers total',
      icon: '💯',
      category: 'distance',
      condition: { type: 'distance_total', value: 100 },
      unlocked: false,
      progress: 0,
      rarity: 'rare'
    },
    
    // Streak achievements
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      category: 'streak',
      condition: { type: 'streak_days', value: 3 },
      unlocked: false,
      progress: 0,
      rarity: 'common'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⚡',
      category: 'streak',
      condition: { type: 'streak_days', value: 7 },
      unlocked: false,
      progress: 0,
      rarity: 'rare'
    },
    {
      id: 'streak_30',
      title: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      category: 'streak',
      condition: { type: 'streak_days', value: 30 },
      unlocked: false,
      progress: 0,
      rarity: 'epic'
    },
    
    // Special achievements
    {
      id: 'pet_lover',
      title: 'Pet Lover',
      description: 'Tap your pet 100 times',
      icon: '💕',
      category: 'special',
      condition: { type: 'pet_taps', value: 100 },
      unlocked: false,
      progress: 0,
      rarity: 'common'
    },
    {
      id: 'pirouette_master',
      title: 'Pirouette Master',
      description: 'Make your pet do 50 pirouettes',
      icon: '🩰',
      category: 'special',
      condition: { type: 'pirouettes', value: 50 },
      unlocked: false,
      progress: 0,
      rarity: 'rare'
    },
    {
      id: 'goal_crusher',
      title: 'Goal Crusher',
      description: 'Achieve your daily goals 10 times',
      icon: '💪',
      category: 'milestones',
      condition: { type: 'goal_achievements', value: 10 },
      unlocked: false,
      progress: 0,
      rarity: 'rare'
    }
  ];

  private defaultStats: UserStats = {
    totalSteps: 0,
    totalDistance: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalPetTaps: 0,
    totalPirouettes: 0,
    totalGoalAchievements: 0,
    daysActive: 0
  };

  getAchievements(): Achievement[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const achievements = JSON.parse(stored);
        // Merge with defaults to add new achievements
        return this.mergeWithDefaults(achievements);
      }
    } catch {}
    return [...this.defaultAchievements];
  }

  getUserStats(): UserStats {
    try {
      const stored = localStorage.getItem(this.statsKey);
      if (stored) {
        return { ...this.defaultStats, ...JSON.parse(stored) };
      }
    } catch {}
    return { ...this.defaultStats };
  }

  updateStats(updates: Partial<UserStats>): Achievement[] {
    const currentStats = this.getUserStats();
    const newStats = { ...currentStats, ...updates };
    
    try {
      localStorage.setItem(this.statsKey, JSON.stringify(newStats));
    } catch {}

    return this.checkAchievements(newStats);
  }

  trackPetTap(): Achievement[] {
    const stats = this.getUserStats();
    return this.updateStats({ totalPetTaps: stats.totalPetTaps + 1 });
  }

  trackPirouette(): Achievement[] {
    const stats = this.getUserStats();
    return this.updateStats({ totalPirouettes: stats.totalPirouettes + 1 });
  }

  trackDailyProgress(steps: number, distance: number, goalAchieved: boolean): Achievement[] {
    const stats = this.getUserStats();
    const today = new Date().toDateString();
    
    // Update streak
    let newStreak = stats.currentStreak;
    if (goalAchieved && stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (stats.lastActiveDate === yesterday.toDateString()) {
        newStreak = stats.currentStreak + 1;
      } else if (stats.lastActiveDate === today) {
        newStreak = stats.currentStreak; // Same day, no change
      } else {
        newStreak = 1; // Streak broken, start new
      }
    }

    const updates: Partial<UserStats> = {
      totalSteps: Math.max(stats.totalSteps, steps),
      totalDistance: Math.max(stats.totalDistance, distance),
      currentStreak: newStreak,
      maxStreak: Math.max(stats.maxStreak, newStreak),
      lastActiveDate: today,
      daysActive: stats.lastActiveDate !== today ? stats.daysActive + 1 : stats.daysActive
    };

    if (goalAchieved) {
      updates.totalGoalAchievements = stats.totalGoalAchievements + 1;
    }

    return this.updateStats(updates);
  }

  private checkAchievements(stats: UserStats): Achievement[] {
    const achievements = this.getAchievements();
    const newlyUnlocked: Achievement[] = [];

    achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      const progress = this.calculateProgress(achievement, stats);
      achievement.progress = Math.min(progress, 100);

      if (progress >= 100) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
      }
    });

    this.saveAchievements(achievements);
    
    if (newlyUnlocked.length > 0) {
      this.addNotifications(newlyUnlocked);
    }

    return newlyUnlocked;
  }

  private calculateProgress(achievement: Achievement, stats: UserStats): number {
    const { condition } = achievement;
    let current = 0;

    switch (condition.type) {
      case 'steps_total':
        current = stats.totalSteps;
        break;
      case 'steps_daily':
        // This should be calculated from current day data, not total
        return 0; // Handled separately
      case 'distance_total':
        current = stats.totalDistance;
        break;
      case 'distance_daily':
        // This should be calculated from current day data, not total
        return 0; // Handled separately
      case 'streak_days':
        current = stats.currentStreak;
        break;
      case 'pet_taps':
        current = stats.totalPetTaps;
        break;
      case 'pirouettes':
        current = stats.totalPirouettes;
        break;
      case 'goal_achievements':
        current = stats.totalGoalAchievements;
        break;
    }

    return Math.min((current / condition.value) * 100, 100);
  }

  checkDailyAchievements(steps: number, distance: number): Achievement[] {
    const achievements = this.getAchievements();
    const newlyUnlocked: Achievement[] = [];

    achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let progress = 0;
      if (achievement.condition.type === 'steps_daily') {
        progress = Math.min((steps / achievement.condition.value) * 100, 100);
      } else if (achievement.condition.type === 'distance_daily') {
        progress = Math.min((distance / achievement.condition.value) * 100, 100);
      } else {
        return; // Not a daily achievement
      }

      achievement.progress = progress;

      if (progress >= 100 && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
      }
    });

    this.saveAchievements(achievements);
    
    if (newlyUnlocked.length > 0) {
      this.addNotifications(newlyUnlocked);
    }

    return newlyUnlocked;
  }

  private mergeWithDefaults(stored: Achievement[]): Achievement[] {
    const merged = [...this.defaultAchievements];
    const storedIds = new Set(stored.map(a => a.id));
    
    // Update existing achievements with stored data
    stored.forEach(storedAchievement => {
      const index = merged.findIndex(a => a.id === storedAchievement.id);
      if (index >= 0) {
        merged[index] = { ...merged[index], ...storedAchievement };
      }
    });

    return merged;
  }

  private saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(achievements));
    } catch {}
  }

  private addNotifications(achievements: Achievement[]): void {
    try {
      const stored = localStorage.getItem(this.notificationsKey);
      const notifications: AchievementNotification[] = stored ? JSON.parse(stored) : [];
      
      achievements.forEach(achievement => {
        notifications.push({
          achievement,
          timestamp: new Date(),
          seen: false
        });
      });

      localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
    } catch {}
  }

  getUnseenNotifications(): AchievementNotification[] {
    try {
      const stored = localStorage.getItem(this.notificationsKey);
      if (stored) {
        const notifications: AchievementNotification[] = JSON.parse(stored);
        return notifications.filter(n => !n.seen);
      }
    } catch {}
    return [];
  }

  markNotificationsSeen(): void {
    try {
      const stored = localStorage.getItem(this.notificationsKey);
      if (stored) {
        const notifications: AchievementNotification[] = JSON.parse(stored);
        notifications.forEach(n => n.seen = true);
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
      }
    } catch {}
  }
}