import React, { useState } from 'react'

interface OnboardingProps {
  onComplete: (petName: string) => void
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [petName, setPetName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (petName.trim()) {
      onComplete(petName.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl p-8 max-w-md w-full text-gray-800 dark:text-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome to ActiveGotchi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your fitness companion is ready to meet you!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Let's Start!
          </button>
        </form>
      </div>
    </div>
  )
}

export default Onboarding