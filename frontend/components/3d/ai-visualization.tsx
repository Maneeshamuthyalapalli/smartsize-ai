"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

function AICore() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#14b8a6"
          metalness={0.5}
          roughness={0.2}
          emissive="#0d9488"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Orbiting rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.7} />
      </mesh>

      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.4, 0.03, 16, 100]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.5} />
      </mesh>

      <mesh rotation={[Math.PI / 3, Math.PI / 2, 0]}>
        <torusGeometry args={[1.6, 0.02, 16, 100]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function DataPoints({ count = 100 }) {
  const pointsRef = useRef()

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  // Generate data points in a spherical pattern
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = 1.8 + Math.random() * 0.3
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
  }

  return (
    <group ref={pointsRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#14b8a6" sizeAttenuation transparent opacity={0.8} />
      </points>
    </group>
  )
}

export function AIVisualization() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <AICore />
      <DataPoints />

      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  )
}
