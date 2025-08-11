import React from 'react'
import { DuoPathMap } from '../../progress/DuoPathMap'

export const MapScreen: React.FC = () => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="pt-4 pb-24 h-full">
        <div className="px-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Weekly Path</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Past days first. Today highlighted.</p>
        </div>
        <DuoPathMap className="h-[calc(100%-4rem)]" />
      </div>
    </div>
  )
}

export default MapScreen
