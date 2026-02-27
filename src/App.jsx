import { useState, useCallback } from 'react'
import ParticleBackground from './components/ParticleBackground'
import HeroSection from './components/HeroSection'
import CountdownSequence from './components/CountdownSequence'
import mobitelLogo from './MobitelLogo.svg'

const REDIRECT_URL = 'https://true-history.org/v1/home' // Change to your main website URL

function App() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'countdown'

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

      <img
        src={mobitelLogo}
        alt="Mobitel Logo"
        className="fixed -top-6 left-4 md:-top-3 md:left-6 w-[100px] h-[100px] md:w-56 md:h-56 object-contain opacity-90 z-20"
      />

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
