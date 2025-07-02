import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      updateTheme(e.matches)
    }

    const updateTheme = (dark: boolean) => {
      if (dark) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
      }
    }

    setIsDark(mediaQuery.matches)
    updateTheme(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return { isDark }
}