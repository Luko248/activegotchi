import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Glass morphism base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/80 backdrop-blur-xl" />
      
      {/* Animated background elements - lava lamp style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blue-purple blob */}
        <motion.div 
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, -10, 25, 0],
            y: [0, -20, 15, -15, 0],
            scale: [1, 1.2, 0.9, 1.1, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
        />
        
        {/* Medium pink-orange blob */}
        <motion.div 
          className="absolute top-1/3 -right-16 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, -25, 10, -30, 0],
            y: [0, 15, -10, 20, 0],
            scale: [1, 0.8, 1.3, 0.9, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 0.8, 1]
          }}
        />
        
        {/* Small green-cyan blob */}
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 20, -15, 25, 0],
            y: [0, -10, 25, -5, 0],
            scale: [1, 1.4, 0.7, 1.2, 1]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1]
          }}
        />
        
        {/* Additional floating blob */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-28 h-28 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-xl"
          animate={{ 
            x: [0, -20, 30, -10, 0],
            y: [0, 25, -15, 20, 0],
            scale: [1, 0.9, 1.3, 0.8, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.35, 0.65, 0.85, 1]
          }}
        />
        
        {/* Subtle yellow blob */}
        <motion.div 
          className="absolute bottom-10 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-300/15 to-amber-400/15 rounded-full blur-xl"
          animate={{ 
            x: [0, 15, -20, 10, 0],
            y: [0, -20, 10, -25, 0],
            scale: [1, 1.1, 0.9, 1.3, 1]
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.4, 0.7, 0.9, 1]
          }}
        />
      </div>
    </div>
  );
};