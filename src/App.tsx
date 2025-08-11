import { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import { MobileApp } from "./components/mobile/MobileApp";
import { useTheme } from "./hooks/useTheme";
import { usePetStore } from "./store/petStore";

function App() {
  const [petName, setPetName] = useState<string>("");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useTheme(); // Initialize theme detection
  const pet = usePetStore((s) => s.pet);

  useEffect(() => {
    const storedPetName = localStorage.getItem("activegotchi-pet-name");
    if (storedPetName && pet?.alive !== false) {
      setPetName(storedPetName);
      setIsOnboarded(true);
    } else {
      setIsOnboarded(false);
    }
    setIsLoading(false);
  }, [pet?.alive]);

  const handleOnboardingComplete = (name: string) => {
    setPetName(name);
    setIsOnboarded(true);
    localStorage.setItem("activegotchi-pet-name", name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-8 text-gray-800 dark:text-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <MobileApp petName={petName} />;
}

export default App;
