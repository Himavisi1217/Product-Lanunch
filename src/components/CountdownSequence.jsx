import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

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

function TextMorphToLoader({ text, color, onComplete }) {
    const containerRef = useRef()
    const loaderRef = useRef()

    useEffect(() => {
        const letters = containerRef.current.querySelectorAll('.morph-letter')

        const tl = gsap.timeline({ onComplete })

        tl.to(letters, {
            color: color,
            textShadow: `0 0 20px ${color}`,
            duration: 0.3,
            stagger: 0.02,
        })

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

        tl.fromTo(
            loaderRef.current,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.3'
        )

        tl.to(loaderRef.current, {
            scale: 1.2,
            duration: 0.4,
            yoyo: true,
            repeat: 3,
            ease: 'sine.inOut',
        })

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
                    boxShadow: `0 0 60px ${color}`,
                }}
            />
        </div>
    )
}

export default function CountdownSequence({ onComplete }) {

    const containerRef = useRef()
    const numberRef = useRef()

    const tickSoundRef = useRef(null)
    const launchSoundRef = useRef(null)

    const [currentPhase, setCurrentPhase] = useState(0)
    const [progress, setProgress] = useState(0)
    const [showMorph, setShowMorph] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const phase = COUNTDOWN_PHASES[currentPhase]

    // PLAY TICK SOUND WHEN NUMBER CHANGES
    useEffect(() => {
        if (tickSoundRef.current) {
            tickSoundRef.current.currentTime = 0
            tickSoundRef.current.play().catch(() => {})
        }
    }, [currentPhase])

    // PROGRESS ANIMATION
    useEffect(() => {

        if (isTransitioning || showMorph) return

        const progressState = { value: 0 }

        const tween = gsap.to(progressState, {
            value: 100,
            duration: 2,
            ease: 'none',
            onUpdate: () => setProgress(progressState.value),
            onComplete: () => {

                if (currentPhase < COUNTDOWN_PHASES.length - 1) {
                    setIsTransitioning(true)
                } else {

                    if (launchSoundRef.current) {
                        launchSoundRef.current.play().catch(() => {})
                    }

                    setTimeout(() => setShowMorph(true), 300)
                }
            }
        })

        return () => tween.kill()

    }, [currentPhase, isTransitioning, showMorph])

    // ENTER ANIMATION
    useEffect(() => {

        if (isTransitioning) return

        const tl = gsap.timeline()

        tl.fromTo(
            numberRef.current,
            { scale: 5, opacity: 0, rotation: -15 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' }
        )

        return () => tl.kill()

    }, [currentPhase])

    // EXIT ANIMATION
    useEffect(() => {

        if (!isTransitioning) return

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentPhase((prev) => prev + 1)
                setProgress(0)
                setIsTransitioning(false)
            }
        })

        tl.to(numberRef.current, {
            scale: 3,
            opacity: 0,
            y: -100,
            rotation: 15,
            duration: 0.5,
            ease: 'power4.in'
        })

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

                <audio ref={launchSoundRef} src="/sounds/launch.mp3" preload="auto" />

            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="relative z-10 flex flex-col items-center justify-center h-full px-6"
        >

            <DataStreamBackground />

            <div ref={numberRef} className="relative mb-4">

                <span
                    className="countdown-number"
                    style={{ color: phase.color }}
                >
                    {phase.number}
                </span>

            </div>

            <div className="mt-10 flex flex-col items-center">

                <div className="progress-track">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`
                        }}
                    />

                </div>

            </div>

            {/* AUDIO ELEMENTS */}

            <audio
                ref={tickSoundRef}
                src="/sounds/Tick.mp3"
                preload="auto"
            />

            <audio
                ref={launchSoundRef}
                src="/sounds/Launch.mp3"
                preload="auto"
            />

        </div>
    )
}