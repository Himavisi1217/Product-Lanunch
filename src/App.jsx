import { useState, useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ParticleBackground from './components/ParticleBackground'
import HeroSection from './components/HeroSection'
import CountdownSequence from './components/CountdownSequence'
import mobitelLogo from './MobitelLogo.svg'
import museumLogo from './Museum Logo Transparent.svg'

const REDIRECT_URL = 'https://true-history.org/v1/home' // Change to your main website URL

function App() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'countdown'
  const mobitelLogoRef = useRef(null)
  const solutionProviderRef = useRef(null)

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

  useEffect(() => {
    if (!mobitelLogoRef.current) return

    if (solutionProviderRef.current) {
      gsap.fromTo(
        solutionProviderRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.7, scale: 1, duration: 0.9, ease: 'back.out(1.7)', delay: 0.3 }
      )
    }

    gsap.fromTo(
      mobitelLogoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.9, scale: 1, duration: 0.9, ease: 'back.out(1.7)', delay: 0.3 }
    )
  }, [])

  useEffect(() => {
    if (phase !== 'countdown') return

    const elements = [solutionProviderRef.current, mobitelLogoRef.current].filter(Boolean)
    gsap.set(elements, { autoAlpha: 1 })
  }, [phase])

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

      <div className={`fixed z-20 flex flex-col items-center ${phase === 'countdown' ? 'top-0 right-4 md:top-1 md:right-6' : 'bottom-0 right-8 md:bottom-0 md:right-10'}`}>
        {phase !== 'countdown' && (
          <span ref={solutionProviderRef} className="text-[10px] md:text-xs uppercase tracking-wide text-[#361717]/70 mb-0 translate-y-24" style={{ fontFamily: 'var(--font-mono)' }}>
            solution provider
          </span>
        )}
        <img
          ref={mobitelLogoRef}
          src={mobitelLogo}
          alt="Mobitel Logo"
          className={`${phase === 'countdown' ? 'w-[120px] h-[120px] md:w-64 md:h-64' : 'w-[84px] h-[84px] md:w-48 md:h-48'} object-contain opacity-90`}
        />
      </div>

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
