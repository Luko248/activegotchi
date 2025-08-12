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

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        await healthService.requestPermissions();
        const data = healthService.getHealthData();
        setHealthData(data);
        updatePetMood(data);
        // Check life outcome once on load
        checkDailyOutcome();
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
    }, 30000);

    return () => clearInterval(interval);
  }, [updateTodayProgress]);

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
        return <AvatarScreen petState={petState} onPetTap={handlePetTap} heartLevel={heartLevel} onToggleDebug={() => setDebugOpen((v) => !v)} debugOpen={debugOpen} onOpenMap={() => setActive('map')} />
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="mt-2 p-3 rounded-2xl backdrop-blur bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/10 shadow-lg w-64">
            <div className="text-xs text-gray-800 dark:text-gray-100 mb-2 font-semibold">Pet Controls</div>
            <div className="space-y-2">
              <input
                value={debugName}
                onChange={(e) => setDebugName(e.target.value)}
                placeholder="Pet name"
                className="w-full px-2 py-1.5 text-sm rounded-md bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 text-gray-800 dark:text-gray-100 placeholder-gray-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDebugSetName}
                  className="flex-1 px-2 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Set Name
                </button>
                <button
                  onClick={handleDebugReset}
                  className="flex-1 px-2 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Reset
                </button>
              </div>
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
    </div>
  );
};
