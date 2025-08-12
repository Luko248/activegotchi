import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { HealthData } from "../../types";

interface StatsSheetProps {
  onClose: () => void;
  healthData: HealthData;
}

export const StatsSheet: React.FC<StatsSheetProps> = ({
  onClose,
  healthData,
}) => {
  const stepsProgress = Math.min(
    (healthData.steps / healthData.goalSteps) * 100,
    100
  );
  const distanceProgress = Math.min(
    (healthData.distance / healthData.goalDistance) * 100,
    100
  );
  const overallProgress = (stepsProgress + distanceProgress) / 2;
  const calories = Math.round(healthData.steps * 0.04);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full bg-white/70 backdrop-blur-md dark:bg-black/50 rounded-t-3xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => { if ((info?.offset?.y ?? 0) > 60 || (info?.velocity?.y ?? 0) > 500) onClose(); }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Today's Activity
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close stats"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Steps Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Steps
              </h3>
              <span className="text-3xl">👟</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-bold text-blue-600">
                  {healthData.steps.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {healthData.goalSteps.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-white/50 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stepsProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {stepsProgress.toFixed(0)}% of daily goal completed
              </p>
            </div>
          </div>

          {/* Distance Card */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Distance
              </h3>
              <span className="text-3xl">🏃</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-bold text-purple-600">
                  {healthData.distance.toFixed(1)} km
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {healthData.goalDistance.toFixed(1)} km
                </span>
              </div>
              <div className="w-full bg-white/50 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${distanceProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {distanceProgress.toFixed(0)}% of daily goal completed
              </p>
            </div>
          </div>

          {/* Calories Card */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Calories Burned
              </h3>
              <span className="text-3xl">🔥</span>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-4xl font-bold text-orange-600">
                  {calories}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  kcal
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Estimated from your steps
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Overall Progress
              </h3>
              <span className="text-3xl">🎯</span>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-4xl font-bold text-green-600">
                  {overallProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-white/50 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Combined daily progress
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
