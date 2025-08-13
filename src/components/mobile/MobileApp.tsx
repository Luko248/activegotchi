import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
// Navigation bar replaced by floating actions per Figma layout
import { HealthDataService } from "../../services/healthData";
import { HealthData, PetState } from "../../types";
import { useProgressData } from "../../hooks/useProgressData";
import AvatarScreen from "./screens/AvatarScreen";
import StatsScreen from "./screens/StatsScreen";
import MapScreen from "./screens/MapScreen";
import { StatsSheet } from "./StatsSheet";
import BottomProgressPeek from "./BottomProgressPeek";
import { usePetStore } from "../../store/petStore";
import usePetLifecycle from "../../hooks/usePetLifecycle";
import { useAchievementStore } from "../../store/achievementStore";
import { AchievementNotification } from "../AchievementNotification";
import { Achievement } from "../../types/achievements";
import ModelExporterDebug from '../ModelExporterDebug';

interface MobileAppProps {
  petName: string;
}

type Tab = 'avatar' | 'stats' | 'map'

export const MobileApp: React.FC<MobileAppProps> = ({ petName }) => {
  const [active, setActive] = useState<Tab>('avatar');
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    distance: 0,
    goalSteps: 10000,
    goalDistance: 8.0,
  });
  const [petState, setPetState] = useState<PetState>({
    name: petName,
    mood: "neutral",
    primaryColor: '#7CC6FF', // Default pastel blue
  });

  const healthService = HealthDataService.getInstance();
  const { updateTodayProgress } = useProgressData();
  const [heartLevel, setHeartLevel] = useState<number>(0);
  const [debugOpen, setDebugOpen] = useState<boolean>(false);
  const [debugName, setDebugName] = useState<string>(petName);
  const [statsOpen, setStatsOpen] = useState<boolean>(false);
  const petMeta = usePetStore((s) => s.pet);
  const { checkDailyOutcome } = usePetLifecycle();
  
  // Achievement system
  const { 
    initializeAchievements, 
    trackPetTap, 
    trackPirouette, 
    trackDailyProgress,
    checkDailyAchievements,
    markNotificationsSeen 
  } = useAchievementStore();
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  // Initialize achievements
  useEffect(() => {
    initializeAchievements();
  }, [initializeAchievements]);

  // Handle achievement notifications
  useEffect(() => {
    if (achievementQueue.length > 0 && !currentNotification) {
      setCurrentNotification(achievementQueue[0]);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [achievementQueue, currentNotification]);


  const showAchievements = (newAchievements: Achievement[]) => {
    if (newAchievements.length > 0) {
      setAchievementQueue(prev => [...prev, ...newAchievements]);
    }
  };

  const dismissNotification = () => {
    setCurrentNotification(null);
    markNotificationsSeen();
  };

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        await healthService.requestPermissions();
        const data = healthService.getHealthData();
        setHealthData(data);
        updatePetMood(data);
        // Check life outcome once on load
        checkDailyOutcome();
        
        // Check for daily achievements
        const newAchievements = checkDailyAchievements(data.steps, data.distance);
        showAchievements(newAchievements);
      } catch (error) {
        console.error("Failed to fetch health data:", error);
      }
    };

    fetchHealthData();

    const interval = setInterval(() => {
      const data = healthService.getHealthData();
      setHealthData(data);
      updatePetMood(data);
      updateTodayProgress(data);
      checkDailyOutcome();
      
      // Check for daily achievements
      const newAchievements = checkDailyAchievements(data.steps, data.distance);
      showAchievements(newAchievements);
    }, 30000);

    return () => clearInterval(interval);
  }, [updateTodayProgress, checkDailyAchievements]);

  // Sync 3D pet state with stored meta (color/mode/lives)
  useEffect(() => {
    setPetState((prev) => ({
      ...prev,
      name: petMeta?.name ?? prev.name,
      primaryColor: petMeta?.primaryColor ?? prev.primaryColor ?? '#7CC6FF', // Always ensure a color
      mode: petMeta?.mode ?? prev.mode,
      livesRemaining: petMeta?.livesRemaining ?? prev.livesRemaining,
    }))
  }, [petMeta?.name, petMeta?.primaryColor, petMeta?.mode, petMeta?.livesRemaining])

  const updatePetMood = (_data: HealthData) => {
    const progress = healthService.getGoalProgress();
    const averageProgress = (progress.stepsProgress + progress.distanceProgress) / 2;
    setHeartLevel(averageProgress);

    const goalsHit = healthService.hasReachedGoals();
    const goodSleep = healthService.hasGoodSleep();

    let mood: "happy" | "neutral" | "sad" | "sleepy" = "neutral";
    if (goalsHit) {
      mood = "happy";
      // Track daily progress achievements
      const newAchievements = trackDailyProgress(_data.steps, _data.distance, true);
      showAchievements(newAchievements);
    } else if (!goodSleep) {
      mood = "sleepy"; // sleep affects mood/look but not lives
    } else if (averageProgress < 80) {
      mood = "sad";
    }


    setPetState((prev) => ({ ...prev, mood }));
  };

  const handlePetTap = () => {
    const currentData = healthService.getHealthData();
    const newSteps = currentData.steps + Math.floor(Math.random() * 50) + 25;
    const newDistance = currentData.distance + Math.random() * 0.1 + 0.05;

    healthService.updateMockData(newSteps, newDistance);
    const updatedData = healthService.getHealthData();
    setHealthData(updatedData);
    updatePetMood(updatedData);
    updateTodayProgress(updatedData);
    
    // Track pet tap achievement
    const newAchievements = trackPetTap();
    showAchievements(newAchievements);
  };

  const handlePirouette = () => {
    // Track pirouette achievement
    const newAchievements = trackPirouette();
    showAchievements(newAchievements);
  };

  const handleDebugReset = () => {
    localStorage.removeItem('activegotchi-pet-name');
    window.location.reload();
  };

  const handleDebugSetName = () => {
    const name = (debugName || '').trim();
    if (!name) return;
    localStorage.setItem('activegotchi-pet-name', name);
    window.location.reload();
  };

  const renderScreen = () => {
    switch (active) {
      case 'stats':
        return <StatsScreen healthData={healthData} />
      case 'map':
        return <MapScreen onBack={() => setActive('avatar')} />
      case 'avatar':
      default:
        return <AvatarScreen petState={petState} onPetTap={handlePetTap} onPirouette={handlePirouette} heartLevel={heartLevel} onToggleDebug={() => setDebugOpen((v) => !v)} debugOpen={debugOpen} onOpenMap={() => setActive('map')} />
    }
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Back button moved inside MapScreen */}

      {/* Debug panel (dev only) */}
      {import.meta.env.MODE !== 'production' && debugOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="p-4 rounded-2xl backdrop-blur bg-white/90 dark:bg-black/80 border border-white/40 dark:border-white/20 shadow-xl w-80 max-w-[90vw]">
            <div className="text-sm text-gray-800 dark:text-gray-100 mb-3 font-semibold">Pet Controls</div>
            <div className="space-y-3">
              <input
                value={debugName}
                onChange={(e) => setDebugName(e.target.value)}
                placeholder="Pet name"
                className="w-full px-3 py-2 text-sm rounded-md bg-white/80 dark:bg-black/60 border border-white/40 dark:border-white/20 text-gray-800 dark:text-gray-100 placeholder-gray-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDebugSetName}
                  className="flex-1 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Set Name
                </button>
                <button
                  onClick={handleDebugReset}
                  className="flex-1 px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Reset
                </button>
              </div>
              
              {/* Mood selector */}
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Force Mood</label>
                <select
                  value={petState.mood}
                  onChange={(e) => setPetState(prev => ({ ...prev, mood: e.target.value as any }))}
                  className="w-full px-3 py-2 text-sm rounded-md bg-white/80 dark:bg-black/60 border border-white/40 dark:border-white/20 text-gray-800 dark:text-gray-100"
                >
                  <option value="happy">Happy</option>
                  <option value="neutral">Neutral</option>
                  <option value="sad">Sad</option>
                  <option value="sleepy">Sleepy</option>
                </select>
              </div>
              
              {/* Model Exporter in Debug Panel */}
              <ModelExporterDebug />
              
              <button
                onClick={() => setDebugOpen(false)}
                className="w-full px-3 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats bottom sheet overlay */}
      <AnimatePresence>
        {statsOpen && (
          <StatsSheet 
            onClose={() => setStatsOpen(false)} 
            healthData={healthData}
          />
        )}
      </AnimatePresence>

      {/* Bottom progress peek to drag up and open stats */}
      {active === 'avatar' && !statsOpen && (
        <BottomProgressPeek healthData={healthData} onExpand={() => setStatsOpen(true)} />
      )}

      {/* Achievement notifications */}
      <AchievementNotification 
        achievement={currentNotification}
        onDismiss={dismissNotification}
      />
    </div>
  );
};
