import React, { useState } from 'react'
import { RadioGroup, Radio } from 'react-aria-components'
import { usePetStore } from '../store/petStore'

interface OnboardingProps {
  onComplete: (petName: string) => void
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [petName, setPetName] = useState('')
  const [mode, setMode] = useState<'mortal' | 'immortal'>('mortal')
  const [primaryColor, setPrimaryColor] = useState<string>('')
  const [step, setStep] = useState<number>(1)
  const setPet = usePetStore((s) => s.setPet)
  const totalSteps = 3
  const progressPct = (step/totalSteps)*100

  const palette = ['#A5D8FF','#B2F2BB','#FFC9DE','#FFE066','#FFB66B','#E5D0FF','#5DE3DB']
  const handleGenerateColor = () => {
    const next = palette[Math.floor(Math.random()*palette.length)]
    setPrimaryColor(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = petName.trim()
    if (!name) return
    if (step < totalSteps) {
      setStep(step+1)
      return
    }
    // Finalize
    setPet({
      name,
      mode,
      livesRemaining: mode === 'mortal' ? 5 : 0,
      avatarSeed: '',
      avatarKind: undefined,
      primaryColor: primaryColor || palette[0],
      alive: true,
      lastCheckedDate: undefined,
    })
    try { localStorage.setItem('activegotchi-pet-name', name) } catch {}
    onComplete(name)
  }

  return (
    <div className="h-[100svh] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header - always at top */}
      <div className="flex-shrink-0 px-4 pt-8 pb-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            ActiveGotchi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Your fitness companion is ready to meet you!
          </p>
        </div>
        
        {/* Step progress */}
        <div className="mb-4">
          <div className="h-3 w-full rounded-full overflow-hidden bg-white/60 dark:bg-white/20 mb-3">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm transition-all duration-500 ease-out" 
              style={{ width: `${progressPct}%` }} 
            />
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200 text-center font-medium mb-4">Step {step} of {totalSteps}</div>
        </div>
        
        {/* Step titles and descriptions */}
        <div className="text-center">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 mt-12">
                What's your pet's name?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-balance leading-relaxed">
                Choose a name that will motivate you on your fitness journey
              </p>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 mt-12">
                Pick your pet's color
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-balance leading-relaxed">
                This will be your pet's unique personality color
              </p>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 mt-12">
                Choose your challenge level
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-balance leading-relaxed">
                Mortal mode adds stakes with limited lives, while immortal mode focuses on mood and progress without consequences
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content area - grows to fill available space */}
      <div className="flex-1 px-4 flex flex-col justify-start">
        {step === 1 && (
          <input
            type="text"
            id="petName"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full px-6 py-4 text-lg backdrop-blur-md bg-white/50 dark:bg-black/40 border border-white/50 dark:border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-center font-medium"
            placeholder="Enter your pet's name"
            required
          />
        )}

        {step === 2 && (
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center">
              <div 
                className="w-24 h-24 rounded-full border-4 border-white/80 shadow-xl transition-all duration-300 hover:scale-105" 
                style={{ background: primaryColor || '#A5D8FF' }} 
                aria-label="Selected color" 
              />
            </div>
            <button 
              type="button" 
              onClick={handleGenerateColor} 
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Generate New Color
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <RadioGroup 
              aria-label="Avatar mode" 
              value={mode} 
              onChange={(v) => setMode(v as any)} 
              className="space-y-4"
            >
              <Radio 
                value="mortal" 
                className={({ isSelected }) => `block w-full p-4 rounded-xl border-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-white/40 dark:border-white/20 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30'}`}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">🔥 Mortal Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">5 lives • High stakes challenge</div>
                </div>
              </Radio>
              <Radio 
                value="immortal" 
                className={({ isSelected }) => `block w-full p-4 rounded-xl border-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-white/40 dark:border-white/20 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30'}`}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">✨ Immortal Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Endless journey • Mood-based feedback</div>
                </div>
              </Radio>
            </RadioGroup>
          </form>
        )}
      </div>
      
      {/* Buttons - always at bottom */}
      <div className="flex-shrink-0 px-4 pb-8 pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            {step > 1 && (
              <button 
                type="button" 
                onClick={() => setStep(step-1)} 
                className="flex-1 bg-white/40 dark:bg-black/40 text-gray-800 dark:text-gray-100 font-semibold py-4 px-6 rounded-xl hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-200 border border-white/40 dark:border-white/20"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {step === totalSteps ? "🚀 Let's Start!" : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Onboarding
