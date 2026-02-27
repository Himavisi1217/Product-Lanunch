import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import museumLogo from '../museum.Logo.svg'

export default function HeroSection({ onLaunch }) {
    const containerRef = useRef()
    const titleRef = useRef()
    const museumLogoRef = useRef()
    const subtitleRef = useRef()
    const btnRef = useRef()
    const taglineRef = useRef()
    const badgeRef = useRef()
    const featuresRef = useRef()

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.3 })

            // Badge entrance
            tl.fromTo(
                badgeRef.current,
                { opacity: 0, y: -20, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
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
        const container = containerRef.current
        const btnText = btn.querySelector('.btn-text')
        const btnIcon = btn.querySelector('.btn-icon')

        // Create shockwave ring element
        const shockwave = document.createElement('div')
        shockwave.style.cssText = `
            position: fixed; top: 50%; left: 50%; width: 20px; height: 20px;
            border-radius: 50%; border: 2px solid rgba(0,240,255,0.8);
            transform: translate(-50%, -50%); pointer-events: none; z-index: 100;
        `
        document.body.appendChild(shockwave)

        // Create second shockwave
        const shockwave2 = document.createElement('div')
        shockwave2.style.cssText = `
            position: fixed; top: 50%; left: 50%; width: 20px; height: 20px;
            border-radius: 50%; border: 2px solid rgba(123,47,247,0.6);
            transform: translate(-50%, -50%); pointer-events: none; z-index: 100;
        `
        document.body.appendChild(shockwave2)

        // Create screen flash overlay
        const flash = document.createElement('div')
        flash.style.cssText = `
            position: fixed; inset: 0; background: white;
            opacity: 0; pointer-events: none; z-index: 200;
        `
        document.body.appendChild(flash)

        const tl = gsap.timeline({
            onComplete: () => {
                shockwave.remove()
                shockwave2.remove()
                flash.remove()
                onLaunch()
            },
        })

        // Phase 1: Button reacts — squish down
        tl.to(btn, {
            scale: 0.85,
            duration: 0.2,
            ease: 'power3.in',
        })

        // Change button text to "LAUNCHING"
        tl.call(() => {
            if (btnText) btnText.textContent = 'LAUNCHING...'
        })

        // Button glows intensely
        tl.to(btn, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
        })

        // Phase 2: Fade out surrounding elements with a magnetic pull toward button
        tl.to(
            container.querySelectorAll('.fade-away'),
            {
                opacity: 0,
                scale: 0.8,
                y: 20,
                filter: 'blur(8px)',
                duration: 0.5,
                stagger: 0.03,
                ease: 'power3.in',
            },
            '-=0.2'
        )

        // Spin the icon
        if (btnIcon) {
            tl.to(btnIcon, {
                rotation: 720,
                scale: 0,
                duration: 0.5,
                ease: 'power4.in',
            }, '-=0.5')
        }

        // Phase 3: Button collapses to a point
        tl.to(btn, {
            width: 16,
            height: 16,
            padding: 0,
            fontSize: 0,
            borderRadius: '50%',
            duration: 0.4,
            ease: 'power4.in',
        })

        // Phase 4: First shockwave ring blasts outward
        tl.to(shockwave, {
            width: '200vmax',
            height: '200vmax',
            opacity: 0,
            borderWidth: 0.5,
            duration: 0.8,
            ease: 'power2.out',
        })

        // Second shockwave slightly delayed
        tl.to(shockwave2, {
            width: '200vmax',
            height: '200vmax',
            opacity: 0,
            borderWidth: 0.5,
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.6')

        // Phase 5: Button explodes outward
        tl.to(btn, {
            scale: 80,
            opacity: 0,
            duration: 0.6,
            ease: 'power4.in',
        }, '-=0.5')

        // Screen flash
        tl.to(flash, {
            opacity: 1,
            duration: 0.15,
            ease: 'power2.in',
        }, '-=0.3')

        tl.to(flash, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
        })
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
            className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center"
        >
            {/* Background decorative elements removed */}

            {/* Official Launch text */}
            <div
                ref={badgeRef}
                className="fade-away relative z-30 mb-6 md:translate-x-[20rem]"
            >
                <span className="text-lg md:text-xl font-medium tracking-widest uppercase text-[#361717]" style={{ fontFamily: 'var(--font-mono)' }}>
                    Official Launch of
                </span>
            </div>

            {/* Main Title with Logo */}
            <div className="fade-away relative z-20">
                <h1
                    ref={titleRef}
                    className="relative z-30 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 md:translate-x-[20rem]"
                    style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}
                >
                    <span className="glow-text">{splitText('THE  DEPARTMENTS')}</span>
                    <br />
                    <span className="glow-text">
                        {splitText('OF  NATIONAL  MUSEUMS')}
                    </span>
                    <br />
                    <span className="glow-text">{splitText('WEBSITE')}</span>
                </h1>
                <img
                    ref={museumLogoRef}
                    src={museumLogo}
                    alt="National Museums Logo"
                    className="absolute z-0 top-[65%] -left-44 md:-left-[31rem] -translate-y-1/2 w-[24rem] h-[24rem] md:w-[52rem] md:h-[52rem] object-contain opacity-100"
                />
            </div>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                className="fade-away relative z-30 max-w-xl text-lg md:text-xl text-[#361717]/50 mb-8 leading-relaxed md:translate-x-[20rem]"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                Experience the lauch of the Offical National History Museum Website
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

            {/* Launch Button */}
            <button
                ref={btnRef}
                className="launch-btn relative z-30 md:ml-[20rem]"
                onClick={handleLaunchClick}
                id="launch-button"
            >
                <span className="btn-text relative z-10">LAUNCH</span>
            </button>
        </div>
    )
}
