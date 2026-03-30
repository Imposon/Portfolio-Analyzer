
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

function Coin3D({ color = '#00D9FF', emissive = '#00D9FF' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const radius = 1.5
    const extrusionSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05
    }

    shape.absarc(0, 0, radius, 0, Math.PI * 2, false)
    return new THREE.ExtrudeGeometry(shape, extrusionSettings)
  }, [])

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={emissive}
          emissiveIntensity={0.2}
          envMapIntensity={1}
        />
      </mesh>
      {}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
    </Float>
  )
}

function Particles() {
  const points = useRef()
  const particleCount = 100

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00D9FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [8, 0, 8], fov: 45 }}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        zIndex: 1
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[-10, 10, 10]} intensity={1} color="#00D9FF" />
      <pointLight position={[10, -10, -10]} intensity={0.5} color="#A855F7" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />

      <Coin3D color="#FFD700" emissive="#FFD700" />
      <Particles />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={10}
        blur={2}
        far={4}
      />

      <Environment preset="city" />
    </Canvas>
  )
}
