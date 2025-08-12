import React from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { HealthData } from '../../types';

interface ProgressPeekProps {
  healthData: HealthData;
}


const ProgressPeek: React.FC<ProgressPeekProps> = ({ healthData }) => {
  const [expanded, setExpanded] = React.useState(false);
  const y = useMotionValue(0);
  // const peekHeight = 56; // visible when collapsed (handled by layout)
  const maxHeight = 420; // expanded height

  // Drag constraints: allow dragging from collapsed (0) to expanded (-maxHeight)
  const dragBounds = { top: -maxHeight, bottom: 0 } as const;
  const backdropOpacity = useTransform(y, [dragBounds.top, dragBounds.bottom], [1, 0]);

  const stepsProgress = Math.min((healthData.steps / healthData.goalSteps) * 100, 100);
  const distanceProgress = Math.min((healthData.distance / healthData.goalDistance) * 100, 100);
  const overallProgress = (stepsProgress + distanceProgress) / 2;
  const calories = Math.round(healthData.steps * 0.04);

  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    const offsetY = info?.offset?.y ?? 0;
    // If dragged up sufficiently, expand; else collapse
    if (!expanded && offsetY < -60) setExpanded(true);
    if (expanded && offsetY > 60) setExpanded(false);
  };

  React.useEffect(() => {
    // Snap to state when toggled via gestures
    y.set(expanded ? dragBounds.top : dragBounds.bottom);
  }, [expanded]);

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="absolute inset-0 bg-black/40 z-30" 
            style={{ opacity: backdropOpacity }} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute left-0 right-0 bottom-0 z-40"
        drag="y"
        dragConstraints={dragBounds}
        style={{ y }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={false}
      >
        <div className="mx-4 mb-4 rounded-3xl overflow-hidden shadow-2xl border border-white/30 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-black/50">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1.5 bg-gray-400/70 rounded-full" />
          </div>

          {/* Peek header summary (always visible) */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>👟</span>
                <span className="font-semibold">{healthData.steps.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏃</span>
                <span className="font-semibold">{healthData.distance.toFixed(1)} km</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span className="font-semibold">{calories} kcal</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
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

          {/* Expanded content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 pb-4 max-h-[60vh] overflow-y-auto"
              >
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Steps</h3>
                      <span className="text-2xl">👟</span>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-blue-600">{healthData.steps.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/ {healthData.goalSteps.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/50 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: `${stepsProgress}%` }} />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Distance</h3>
                      <span className="text-2xl">🏃</span>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-purple-600">{healthData.distance.toFixed(1)} km</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/ {healthData.goalDistance.toFixed(1)} km</span>
                    </div>
                    <div className="w-full bg-white/50 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: `${distanceProgress}%` }} />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Overall</h3>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="flex justify-center items-end mb-2">
                      <span className="text-3xl font-bold text-green-600">{overallProgress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/50 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${overallProgress}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default ProgressPeek;
