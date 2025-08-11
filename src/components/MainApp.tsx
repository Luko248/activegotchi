import React, { useState, useEffect } from 'react'
import PetAvatar from './PetAvatar'
import FitnessCarousel from './FitnessCarousel'
import { WeeklyProgressMap } from './progress/WeeklyProgressMap'
import { HealthDataService } from '../services/healthData'
import { PetState, HealthData } from '../types'
import { useProgressData } from '../hooks/useProgressData'

interface MainAppProps {
  petName: string
}

const MainApp: React.FC<MainAppProps> = ({ petName }) => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    distance: 0,
    goalSteps: 10000,
    goalDistance: 8.0
  })
  const [petState, setPetState] = useState<PetState>({
    name: petName,
    mood: 'neutral'
  })

  const healthService = HealthDataService.getInstance()
  const { updateTodayProgress } = useProgressData()

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        await healthService.requestPermissions()
        const data = healthService.getHealthData()
        setHealthData(data)
        updatePetMood()
      } catch (error) {
        console.error('Failed to fetch health data:', error)
      }
    }

    fetchHealthData()

    const interval = setInterval(() => {
      const data = healthService.getHealthData()
      setHealthData(data)
      updatePetMood()
      updateTodayProgress(data)
    }, 30000)

    return () => clearInterval(interval)
  }, [updateTodayProgress])

  const updatePetMood = () => {
    const progress = healthService.getGoalProgress()
    const averageProgress = (progress.stepsProgress + progress.distanceProgress) / 2

    let mood: 'happy' | 'neutral' | 'sad' = 'neutral'
    
    if (averageProgress >= 80) {
      mood = 'happy'
    } else if (averageProgress < 30) {
      mood = 'sad'
    }

    setPetState(prev => ({ ...prev, mood }))
  }

  const handlePetTap = () => {
    const currentData = healthService.getHealthData()
    const newSteps = currentData.steps + Math.floor(Math.random() * 50) + 25
    const newDistance = currentData.distance + Math.random() * 0.1 + 0.05
    
    healthService.updateMockData(newSteps, newDistance)
    const updatedData = healthService.getHealthData()
    setHealthData(updatedData)
    updatePetMood()
    updateTodayProgress(updatedData)
  }

  const handleResetPet = () => {
    localStorage.removeItem('activegotchi-pet-name')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleResetPet}
          className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Reset Pet
        </button>
      </div>
      
      <div className="flex-1 flex flex-col">
        <PetAvatar 
          petState={petState} 
          onPetTap={handlePetTap}
        />
        
        <div className="flex-shrink-0 space-y-4 px-4">
          <WeeklyProgressMap />
          <FitnessCarousel healthData={healthData} />
        </div>
      </div>
    </div>
  )
}

export default MainApp