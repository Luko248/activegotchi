import React from 'react'
import FitnessCarousel from '../../FitnessCarousel'
import { HealthData } from '../../../types'

interface StatsScreenProps {
  healthData: HealthData
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ healthData }) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="py-6">
        <h2 className="px-6 pb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Today</h2>
        <FitnessCarousel healthData={healthData} />
      </div>
    </div>
  )
}

export default StatsScreen

