import React from 'react';
import { motion } from 'framer-motion';
import { HealthData } from '../../types';

interface BottomProgressPeekProps {
  healthData: HealthData;
  onExpand: () => void;
}

const BottomProgressPeek: React.FC<BottomProgressPeekProps> = ({ healthData, onExpand }) => {
  const stepsProgress = Math.min((healthData.steps / healthData.goalSteps) * 100, 100);
  const distanceProgress = Math.min((healthData.distance / healthData.goalDistance) * 100, 100);
  const overallProgress = (stepsProgress + distanceProgress) / 2;
  const calories = Math.round(healthData.steps * 0.04);

  return (
    <motion.div
      className="absolute left-0 right-0 z-30"
      drag="y"
      dragConstraints={{ top: -80, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => { if ((info?.offset?.y ?? 0) < -40) onExpand(); }}
      onClick={onExpand}
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
    >
      <div className="mx-4 rounded-full overflow-hidden shadow-2xl border border-white/30 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-black/50">
        {/* Handle bar */}
        <div className="flex justify-center pt-5 pb-4">
          <div className="w-10 h-1.5 bg-gray-400/70 rounded-full" />
        </div>
        {/* Mini summary */}
        <div className="px-8 pb-5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-5">
              <span>👟</span>
              <span className="font-semibold">{healthData.steps.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-5">
              <span>🏃</span>
              <span className="font-semibold">{healthData.distance.toFixed(1)} km</span>
            </div>
            <div className="flex items-center gap-5">
              <span>🔥</span>
              <span className="font-semibold">{calories} kcal</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5 mt-4">
            <div className="w-full bg-gray-300/60 dark:bg-gray-700/60 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${stepsProgress}%` }} />
            </div>
            <div className="w-full bg-gray-300/60 dark:bg-gray-700/60 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${distanceProgress}%` }} />
            </div>
            <div className="w-full bg-gray-300/60 dark:bg-gray-700/60 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomProgressPeek;
