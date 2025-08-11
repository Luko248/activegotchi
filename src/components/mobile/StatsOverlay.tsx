import React from "react";
import { motion } from "framer-motion";
import { HealthData } from "../../types";

interface StatsOverlayProps {
  healthData: HealthData;
}

export const StatsOverlay: React.FC<StatsOverlayProps> = ({ healthData }) => {
  const stepsProgress = Math.min(
    (healthData.steps / healthData.goalSteps) * 100,
    100
  );
  const distanceProgress = Math.min(
    (healthData.distance / healthData.goalDistance) * 100,
    100
  );
  const overallProgress = (stepsProgress + distanceProgress) / 2;

  // Calculate calories (rough estimate: 0.04 calories per step)
  const calories = Math.round(healthData.steps * 0.04);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-8 left-4 right-4 z-40"
    >
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/30">
        <div className="flex justify-between items-center">
          {/* Steps */}
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {healthData.steps.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
              <span>👟</span>
              <span>Steps</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1 mt-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${stepsProgress}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-white/30 mx-3" />

          {/* Distance */}
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {healthData.distance.toFixed(1)}km
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
              <span>🏃</span>
              <span>Distance</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1 mt-1">
              <div
                className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${distanceProgress}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-white/30 mx-3" />

          {/* Calories */}
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {calories}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
              <span>🔥</span>
              <span>Calories</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1 mt-1">
              <div
                className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
