import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField({ count = 3000, phase }) {
    const mesh = useRef()
    const light = useRef()

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const speeds = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const radius = 8 + Math.random() * 12
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i3 + 2] = radius * Math.cos(phi)

            const t = Math.random()
            colors[i3] = 0.85 + t * 0.15
            colors[i3 + 1] = 0.85 + t * 0.15
            colors[i3 + 2] = 0.9 + t * 0.1

            speeds[i] = Math.random() * 0.5 + 0.2
        }

        return { positions, colors, speeds }
    }, [count])

    useFrame((state) => {
        if (!mesh.current) return

        const time = state.clock.elapsedTime
        const positions = mesh.current.geometry.attributes.position.array

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const speed = particles.speeds[i]

            // Orbital motion
            const originalX = particles.positions[i3]
            const originalY = particles.positions[i3 + 1]
            const originalZ = particles.positions[i3 + 2]

            positions[i3] = originalX + Math.sin(time * speed + i) * 0.3
            positions[i3 + 1] = originalY + Math.cos(time * speed * 0.8 + i) * 0.3
            positions[i3 + 2] = originalZ + Math.sin(time * speed * 0.6 + i * 0.5) * 0.3
        }

        mesh.current.geometry.attributes.position.needsUpdate = true

        // Different rotation speeds based on phase
        const rotSpeed = phase === 'countdown' ? 0.15 : 0.05
        mesh.current.rotation.y = time * rotSpeed
        mesh.current.rotation.x = Math.sin(time * 0.1) * 0.1

        if (light.current) {
            light.current.position.x = Math.sin(time * 0.5) * 5
            light.current.position.z = Math.cos(time * 0.5) * 5
        }
    })

    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight ref={light} color="#ffffff" intensity={4} distance={25} />
            <pointLight position={[5, 5, -5]} color="#ffffff" intensity={3} distance={20} />

            <points ref={mesh}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={particles.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={count}
                        array={particles.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.06}
                    vertexColors
                    transparent
                    opacity={0.9}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </>
    )
}

function NebulaSphere({ phase }) {
    const meshRef = useRef()

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.elapsedTime
        meshRef.current.rotation.y = time * 0.1
        meshRef.current.rotation.z = time * 0.05

        // Pulse effect during countdown
        if (phase === 'countdown') {
            const scale = 1 + Math.sin(time * 2) * 0.05
            meshRef.current.scale.setScalar(scale)
        }
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.5}
                wireframe
                transparent
                opacity={0.2}
            />
        </mesh>
    )
}

function FloatingRings({ phase }) {
    const group = useRef()

    useFrame((state) => {
        if (!group.current) return
        const time = state.clock.elapsedTime
        group.current.rotation.x = time * 0.2
        group.current.rotation.y = time * 0.15

        if (phase === 'countdown') {
            group.current.rotation.x = time * 0.5
            group.current.rotation.y = time * 0.4
        }
    })

    return (
        <group ref={group}>
            {[2.5, 3.5, 4.5].map((radius, i) => (
                <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
                    <torusGeometry args={[radius, 0.01, 16, 100]} />
                    <meshBasicMaterial
                        color={i === 0 ? '#eeff00' : i === 1 ? '#ccff00' : '#ffff00'}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    )
}

export default function ParticleBackground({ phase = 'idle' }) {
    return (
        <div className="canvas-container">
            <Canvas
                camera={{ position: [0, 0, 12], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'none' }}
            >
                {/* Removed white background and fog to allow global background image to show */}
                <ParticleField count={2500} phase={phase} />
                {/* <NebulaSphere phase={phase} /> */}
                {/* <FloatingRings phase={phase} /> */}
            </Canvas>
        </div>
    )
}
