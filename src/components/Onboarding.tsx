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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full text-gray-800 dark:text-gray-100">
        {/* Step progress */}
        <div className="mb-4">
          <div className="h-2 w-full rounded-full overflow-hidden bg-white/60 dark:bg-white/20">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-2 text-xs text-gray-800 dark:text-gray-200 text-center font-medium">Step {step} of {totalSteps}</div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome to ActiveGotchi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your fitness companion is ready to meet you!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div>
              <label htmlFor="petName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Enter your pet's name
              </label>
              <input
                type="text"
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-4 py-3 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="What should we call your pet?"
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="text-sm text-gray-800 dark:text-gray-200 mb-3">Pick a vibe color</div>
              <div className="flex items-center justify-center mb-3">
                <div className="w-20 h-20 rounded-full border border-white/60 shadow-inner" style={{ background: primaryColor || '#A5D8FF' }} aria-label="Selected color" />
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-4">{primaryColor || '#A5D8FF'}</div>
              <div className="flex justify-center">
                <button type="button" onClick={handleGenerateColor} className="px-5 py-2 rounded-full bg-black/80 text-white shadow">
                  Generate
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Avatar mode</span>
              <RadioGroup aria-label="Avatar mode" value={mode} onChange={(v) => setMode(v as any)} className="flex items-center gap-2 bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/20 rounded-full p-1">
                <Radio value="mortal" className={({ isSelected }) => `flex-1 text-center px-4 py-2 rounded-full text-sm cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'bg-black/80 text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  Mortal (5 lives)
                </Radio>
                <Radio value="immortal" className={({ isSelected }) => `flex-1 text-center px-4 py-2 rounded-full text-sm cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${isSelected ? 'bg-black/80 text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  Immortal
                </Radio>
              </RadioGroup>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                {mode==='mortal' ? 'Miss all daily goals and you lose a life. At 0 lives, adopt a new avatar.' : 'Uses your real Apple Health data. Never dies; mood reflects fatigue.'}
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step-1)} className="flex-1 bg-white/30 dark:bg-black/30 text-gray-800 dark:text-gray-100 font-semibold py-3 px-6 rounded-lg">
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {step === totalSteps ? "Let's Start!" : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Onboarding
