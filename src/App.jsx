import { useState, useCallback, useEffect } from 'react'

import ParticleBackground from './components/ParticleBackground'
import HeroSection from './components/HeroSection'
import CountdownSequence from './components/CountdownSequence'

import museumLogo from './Museum Logo Transparent.svg'

const REDIRECT_URL = 'https://true-history.org/v1/home' // Change to your main website URL

function App() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'countdown'


  useEffect(() => {
    let favicon = document.querySelector("link[rel~='icon']")
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.setAttribute('rel', 'icon')
      document.head.appendChild(favicon)
    }

    favicon.setAttribute('type', 'image/svg+xml')
    favicon.setAttribute('href', museumLogo)
  }, [])





  const handleLaunch = useCallback(() => {
    setPhase('countdown')
  }, [])

  const handleCountdownComplete = useCallback(() => {
    // Redirect directly — the final animation already handles the visual transition
    window.location.href = REDIRECT_URL
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Three.js WebGL Background */}
      <ParticleBackground phase={phase} />



      {/* Hexagonal Grid Overlay */}
      <div className="hex-grid" />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Main Content */}
      {phase === 'idle' && <HeroSection onLaunch={handleLaunch} />}
      {phase === 'countdown' && (
        <CountdownSequence onComplete={handleCountdownComplete} />
      )}
    </div>
  )
}

export default App
