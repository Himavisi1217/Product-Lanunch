import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import museumLogo from '../Museum Logo Transparent.svg'
import sltMobitelLogo from '../MobitelLogo.svg'

export default function HeroSection({ onLaunch }) {
    const containerRef = useRef()
    const titleRef = useRef()
    const museumLogoRef = useRef()
    const sltLogoRef = useRef()
    const subtitleRef = useRef()
    const btnRef = useRef()
    const taglineRef = useRef()
    const badgeRef = useRef()
    const solutionProviderRef = useRef()
    const featuresRef = useRef()

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.3 })

            // SLT-Mobitel logo entrance
            tl.fromTo(
                sltLogoRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
            )

            // Solution Provider text entrance
            tl.fromTo(
                solutionProviderRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.6'
            )

            // Badge entrance
            tl.fromTo(
                badgeRef.current,
                { opacity: 0, y: -20, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
                '-=0.5'
            )

            // Museum logo pop-in
            tl.fromTo(
                museumLogoRef.current,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.7)' },
                '-=0.4'
            )

            // Title letters stagger
            const titleLetters = titleRef.current.querySelectorAll('.letter')
            tl.fromTo(
                titleLetters,
                { opacity: 0, y: 60, rotateX: -90 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: 'back.out(1.7)',
                },
                '-=0.3'
            )

            // Subtitle
            tl.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.4'
            )

            // Features
            const featureItems = featuresRef.current?.querySelectorAll('.feature-item')
            if (featureItems?.length) {
                tl.fromTo(
                    featureItems,
                    { opacity: 0, y: 20, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
                    '-=0.3'
                )
            }

            // Tagline
            tl.fromTo(
                taglineRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: 'power2.out' },
                '-=0.2'
            )

            // Button entrance
            tl.fromTo(
                btnRef.current,
                { opacity: 0, scale: 0.5, y: 40 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)',
                },
                '-=0.4'
            )

        }, containerRef)

        return () => ctx.revert()
    }, [])

    const handleLaunchClick = () => {
        const btn = btnRef.current
        const btnText = btn.querySelector('.btn-text')

        if (btnText) btnText.textContent = 'LAUNCHING...'
        btn.style.pointerEvents = 'none'

        if (museumLogoRef.current) {
            gsap.set(museumLogoRef.current, { autoAlpha: 0 })
        }
        if (sltLogoRef.current) {
            gsap.set(sltLogoRef.current, { autoAlpha: 0 })
        }

        onLaunch()
    }

    const splitText = (text) => {
        return text.split('').map((char, i) => (
            <span
                key={i}
                className="letter inline-block"
                style={{ perspective: '500px' }}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ))
    }

    return (
        <div
            ref={containerRef}
            className="relative z-20 flex flex-col items-center justify-center h-full px-6 pb-52 text-center"
        >
            {/* Solution Provider Text - Bottom Right */}
            <span
                ref={solutionProviderRef}
                className="fixed z-10 right-8 bottom-28 text-sm md:text-base font-medium tracking-widest uppercase text-[#361717]"
                style={{ fontFamily: 'var(--font-mono)' }}
            >
                Solution Provider
            </span>

            {/* SLT-Mobitel Logo - Bottom Right */}
            <div ref={sltLogoRef} className="fixed z-10 right-8 bottom-7 flex flex-col items-center gap-2">
                <img
                    src={sltMobitelLogo}
                    alt="SLT-Mobitel Logo"
                    className="w-36 md:w-44 h-auto object-contain opacity-85"
                />
            </div>

            {/* Official Launch text */}
            <div
                ref={badgeRef}
                className="fade-away relative z-30 -mt-64 mb-12 w-full flex justify-center text-center"
            >
                <span className="text-xl md:text-2xl font-medium tracking-widest uppercase text-[#361717]" style={{ fontFamily: 'var(--font-mono)' }}>
                    Official website of the
                </span>
            </div>

            {/* Main Title with Logo */}
            <div className="relative z-20">
                <h1
                    ref={titleRef}
                    className="fade-away relative z-30 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-12"
                    style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}
                >
                    <span className="glow-text">{splitText('DEPARTMENT OF')}</span>
                    <br />
                    <span className="glow-text">{splitText('NATIONAL MUSEUMS')}</span>
                </h1>
                <img
                    ref={museumLogoRef}
                    src={museumLogo}
                    alt="National Museums Logo"
                    className="fixed z-10 -left-8 -bottom-6 w-40 h-40 md:w-[15rem] md:h-[15rem] object-contain opacity-85"
                />
            </div>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                className="fade-away relative z-30 max-w-xl text-lg md:text-xl text-[#361717]/100 mb-6 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                Experience the launch of the Official National History Museum Website
            </p>

            {/* Feature pills */}
            {/* <div ref={featuresRef} className="fade-away flex flex-wrap justify-center gap-3 mb-10">
                {['AI Powered', 'Lightning Fast', 'Secure', 'Revolutionary'].map((feature, i) => (
                    <div
                        key={i}
                        className="feature-item px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase glass-card text-[#2a1010]/60"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        {feature}
                    </div>
                ))}
            </div>

            {/* Tagline */}
            {/* <p
                ref={taglineRef}
                className="fade-away text-xs tracking-[0.3em] uppercase text-[#2a1010]/30 mb-8"
                style={{ fontFamily: 'var(--font-mono)' }}
            >
                Ready to witness greatness?
            </p> */}
            <br>

            </br>
            <br>

            </br>
            {/* Launch Button */}
            <button
                ref={btnRef}
                className="launch-btn relative z-30 mt-4"
                onClick={handleLaunchClick}
                id="launch-button"
            >
                <span className="btn-text relative z-10">LAUNCH</span>
            </button>
        </div>
    )
}
