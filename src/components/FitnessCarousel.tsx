import React from 'react'
import { HealthData } from '../types'

interface FitnessCarouselProps {
  healthData: HealthData
}

const FitnessCarousel: React.FC<FitnessCarouselProps> = ({ healthData }) => {
  const stepsProgress = Math.min((healthData.steps / healthData.goalSteps) * 100, 100)
  const distanceProgress = Math.min((healthData.distance / healthData.goalDistance) * 100, 100)

  return (
    <div className="px-4 pb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
        <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-6 min-w-[280px] flex-shrink-0 text-gray-800 dark:text-gray-100 snap-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Steps</h3>
            <span className="text-2xl">👟</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-blue-600">{healthData.steps.toLocaleString()}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ {healthData.goalSteps.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stepsProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {stepsProgress.toFixed(0)}% of daily goal
            </p>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-6 min-w-[280px] flex-shrink-0 text-gray-800 dark:text-gray-100 snap-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Distance</h3>
            <span className="text-2xl">🏃</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-purple-600">{healthData.distance.toFixed(1)} km</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ {healthData.goalDistance.toFixed(1)} km</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${distanceProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {distanceProgress.toFixed(0)}% of daily goal
            </p>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-6 min-w-[280px] flex-shrink-0 text-gray-800 dark:text-gray-100 snap-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Overall</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-3xl font-bold text-green-600">
                {((stepsProgress + distanceProgress) / 2).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stepsProgress + distanceProgress) / 2}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Daily progress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FitnessCarousel