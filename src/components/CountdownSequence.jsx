import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import museumLogo from '../museum.Logo.svg'

const COUNTDOWN_PHASES = [
    {
        number: 3,
        label: 'Preparing Resources',
        sublabel: 'Initializing core systems...',
        color: '#361717',
        accentColor: '#361717',
    },
    {
        number: 2,
        label: 'Finalizing Resources',
        sublabel: 'Compiling launch sequences...',
        color: '#361717',
        accentColor: '#361717',
    },
    {
        number: 1,
        label: 'Launching',
        sublabel: 'All systems nominal.',
        color: '#361717',
        accentColor: '#361717',
    },
]

function DataStreamBackground() {
    const chars = '01אבגדABCDEFGH{}[]<>/\\|~^&*+=@#$%'
    const streams = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        char: chars[Math.floor(Math.random() * chars.length)],
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
        size: 10 + Math.random() * 8,
    }))

    return (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            {streams.map((s) => (
                <span
                    key={s.id}
                    className="data-stream-char"
                    style={{
                        left: s.left,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${s.duration}s`,
                        fontSize: `${s.size}px`,
                    }}
                >
                    {s.char}
                </span>
            ))}
        </div>
    )
}

function CircularProgress({ progress, color, size = 280 }) {
    const strokeWidth = 3
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (progress / 100) * circumference

    return (
        <svg
            width={size}
            height={size}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
            style={{ filter: `drop-shadow(0 0 10px ${color}40)` }}
        >
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
            {/* Glow dot at progress tip */}
            <circle
                cx={size / 2 + radius * Math.cos((progress / 100) * Math.PI * 2 - Math.PI / 2)}
                cy={size / 2 + radius * Math.sin((progress / 100) * Math.PI * 2 - Math.PI / 2)}
                r={4}
                fill={color}
                style={{ filter: `blur(2px)` }}
            />
        </svg>
    )
}

function HexagonalSpinner({ color, isActive }) {
    const spinnerRef = useRef()

    useEffect(() => {
        if (!spinnerRef.current || !isActive) return
        gsap.to(spinnerRef.current, {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: 'none',
        })
    }, [isActive])

    return (
        <div ref={spinnerRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="350" height="350" viewBox="-175 -175 350 350">
                {[0, 60, 120].map((angle, i) => (
                    <line
                        key={i}
                        x1={140 * Math.cos((angle * Math.PI) / 180)}
                        y1={140 * Math.sin((angle * Math.PI) / 180)}
                        x2={140 * Math.cos(((angle + 180) * Math.PI) / 180)}
                        y2={140 * Math.sin(((angle + 180) * Math.PI) / 180)}
                        stroke={color}
                        strokeWidth="0.5"
                        opacity="0.15"
                    />
                ))}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <circle
                        key={`dot-${i}`}
                        cx={140 * Math.cos((angle * Math.PI) / 180)}
                        cy={140 * Math.sin((angle * Math.PI) / 180)}
                        r="2"
                        fill={color}
                        opacity="0.4"
                    />
                ))}
            </svg>
        </div>
    )
}

function PulsingDots({ color }) {
    return (
        <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                        backgroundColor: color,
                        animation: `dotPulse 1s ease-in-out ${i * 0.15}s infinite`,
                    }}
                />
            ))}
        </div>
    )
}

function TextMorphToLoader({ text, color, onComplete }) {
    const containerRef = useRef()
    const loaderRef = useRef()

    useEffect(() => {
        const letters = containerRef.current.querySelectorAll('.morph-letter')
        const tl = gsap.timeline({ onComplete })

        // First, highlight letters
        tl.to(letters, {
            color: color,
            textShadow: `0 0 20px ${color}`,
            duration: 0.3,
            stagger: 0.02,
        })

        // Then morph each letter into a particle
        tl.to(letters, {
            y: () => gsap.utils.random(-100, 100),
            x: () => gsap.utils.random(-200, 200),
            rotation: () => gsap.utils.random(-360, 360),
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: { amount: 0.4, from: 'center' },
            ease: 'power4.in',
        })

        // Show the loader
        tl.fromTo(
            loaderRef.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.3'
        )

        // Pulse loader
        tl.to(loaderRef.current, {
            scale: 1.2,
            duration: 0.4,
            yoyo: true,
            repeat: 3,
            ease: 'sine.inOut',
        })

        // Final flash
        tl.to(loaderRef.current, {
            scale: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.in',
        })

        return () => tl.kill()
    }, [color, onComplete])

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div ref={containerRef} className="flex flex-wrap justify-center gap-1">
                {text.split('').map((char, i) => (
                    <span
                        key={i}
                        className="morph-letter inline-block text-4xl md:text-6xl font-black"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#361717',
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </div>
            <div
                ref={loaderRef}
                className="absolute w-16 h-16 rounded-full opacity-0"
                style={{
                    background: `radial-gradient(circle, ${color}, transparent)`,
                    boxShadow: `0 0 60px ${color}, 0 0 120px ${color}50`,
                }}
            />
        </div>
    )
}

export default function CountdownSequence({ onComplete }) {
    const containerRef = useRef()
    const numberRef = useRef()
    const labelsRef = useRef()
    const [currentPhase, setCurrentPhase] = useState(0)
    const [progress, setProgress] = useState(0)
    const [showMorph, setShowMorph] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const progressIntervalRef = useRef(null)

    const phase = COUNTDOWN_PHASES[currentPhase]

    // Handle the progress fill and phase transitions
    useEffect(() => {
        if (isTransitioning) return

        const startTime = Date.now()
        const duration = 2000

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime
            const pct = Math.min((elapsed / duration) * 100, 100)
            setProgress(pct)

            if (pct >= 100) {
                clearInterval(progressIntervalRef.current)

                if (currentPhase < COUNTDOWN_PHASES.length - 1) {
                    // Start exit transition
                    setIsTransitioning(true)
                } else {
                    // Final phase complete — morph text
                    setTimeout(() => setShowMorph(true), 300)
                }
            }
        }, 16)

        return () => {
            clearInterval(progressIntervalRef.current)
        }
    }, [currentPhase, isTransitioning])

    // Handle entrance animation when phase changes
    useEffect(() => {
        if (isTransitioning) return

        const tl = gsap.timeline()

        // Force-clear any GSAP inline styles on the number element
        if (numberRef.current) {
            gsap.set(numberRef.current, { clearProps: 'transform,opacity' })
            tl.fromTo(
                numberRef.current,
                { scale: 5, opacity: 0, rotation: -15, y: 0 },
                { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
            )
        }

        // Animate labels
        if (labelsRef.current) {
            const labels = labelsRef.current.querySelectorAll('.phase-text')
            if (labels.length) {
                gsap.set(labels, { clearProps: 'transform,opacity' })
                tl.fromTo(
                    labels,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
                    '-=0.4'
                )
            }
        }

        return () => tl.kill()
    }, [currentPhase, isTransitioning])

    // Handle exit animation when transitioning
    useEffect(() => {
        if (!isTransitioning) return

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentPhase((prev) => prev + 1)
                setProgress(0)
                setIsTransitioning(false)
            },
        })

        // Exit: Number flies out
        if (numberRef.current) {
            tl.to(numberRef.current, {
                scale: 3,
                opacity: 0,
                y: -100,
                rotation: 15,
                duration: 0.5,
                ease: 'power4.in',
            })
        }

        // Exit: Labels fade
        if (labelsRef.current) {
            const labels = labelsRef.current.querySelectorAll('.phase-text')
            tl.to(labels, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.in',
            }, '-=0.3')
        }

        // Container flash
        if (containerRef.current) {
            tl.to(containerRef.current, {
                backgroundColor: 'rgba(0,0,0,0.3)',
                duration: 0.1,
            })
            tl.to(containerRef.current, {
                backgroundColor: 'transparent',
                duration: 0.3,
            })
        }

        return () => tl.kill()
    }, [isTransitioning])

    if (showMorph) {
        return (
            <div className="relative z-10 flex items-center justify-center h-full">
                <TextMorphToLoader
                    text="LAUNCHING NOW"
                    color={COUNTDOWN_PHASES[2].color}
                    onComplete={onComplete}
                />
                <img
                    src={museumLogo}
                    alt="National Museums Logo"
                    className="fixed bottom-3 right-4 md:bottom-4 md:right-6 w-20 h-20 md:w-32 md:h-32 object-contain opacity-90 z-20 pointer-events-none"
                />
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="relative z-10 flex flex-col items-center justify-center h-full px-6"
        >
            <DataStreamBackground />

            {/* Circular progress ring */}
            {/* <CircularProgress
                progress={progress}
                color={phase.color}
                size={320}
            /> */}

            {/* Hexagonal spinner */}
            {/* <HexagonalSpinner color={phase.color} isActive={true} /> */}

            {/* Countdown Number — key forces React to remount for each phase */}
            <div ref={numberRef} key={`number-${currentPhase}`} className="relative mb-4">
                <span
                    className="countdown-number"
                    style={{
                        background: `linear-gradient(135deg, ${phase.color}, ${phase.accentColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {phase.number}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-10 flex flex-col items-center">
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${phase.color}, ${phase.accentColor})`,
                            boxShadow: `0 0 20px ${phase.color}80`,
                        }}
                    />
                </div>
            </div>

            <img
                src={museumLogo}
                alt="National Museums Logo"
                className="fixed bottom-3 right-4 md:bottom-4 md:right-6 w-20 h-20 md:w-32 md:h-32 object-contain opacity-90 z-20 pointer-events-none"
            />
        </div>
    )
}
