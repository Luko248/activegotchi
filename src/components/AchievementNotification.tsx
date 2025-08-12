import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../types/achievements';
import { triggerSuccessHaptic } from '../services/haptics';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      triggerSuccessHaptic();
      
      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for exit animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-blue-500 to-blue-600';
      case 'rare': return 'from-purple-500 to-purple-600';
      case 'epic': return 'from-orange-500 to-orange-600';
      case 'legendary': return 'from-yellow-400 to-yellow-500';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-blue-500/50';
      case 'rare': return 'shadow-purple-500/50';
      case 'epic': return 'shadow-orange-500/50';
      case 'legendary': return 'shadow-yellow-500/50';
      default: return 'shadow-blue-500/50';
    }
  };

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 300,
            opacity: { duration: 0.3 }
          }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              duration: 0.6,
              repeat: 1,
              delay: 0.2
            }}
            className={`
              bg-gradient-to-r ${getRarityColor(achievement.rarity)}
              backdrop-blur-md rounded-2xl p-4 shadow-2xl ${getRarityGlow(achievement.rarity)}
              border border-white/20 max-w-sm mx-4
            `}
          >
            {/* Sparkle effects for rare+ achievements */}
            {achievement.rarity !== 'common' && (
              <>
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: 2,
                    delay: 0.1
                  }}
                  className="absolute -top-2 -right-2 text-yellow-300 text-xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, -180, -360] 
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: 2,
                    delay: 0.3
                  }}
                  className="absolute -bottom-1 -left-1 text-yellow-300 text-lg"
                >
                  ⭐
                </motion.div>
              </>
            )}

            <div className="flex items-center space-x-3 text-white">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: 1
                }}
                className="text-4xl"
              >
                {achievement.icon}
              </motion.div>
              
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-medium text-white/90 uppercase tracking-wide"
                >
                  {achievement.rarity} Achievement Unlocked!
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-bold text-lg text-white"
                >
                  {achievement.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-white/80"
                >
                  {achievement.description}
                </motion.p>
              </div>
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};