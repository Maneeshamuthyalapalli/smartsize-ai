"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Points } from "@react-three/drei"
import * as THREE from "three"

// Replace the entire HumanModel function with this updated version that doesn't rely on external models
function HumanModel({ measurements, highlightPoints = false }) {
  const group = useRef()

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  // Create measurement points based on the measurements data
  const measurementPoints = measurements
    ? [
        // Chest point
        new THREE.Vector3(0, 1.5, 0.5),
        // Waist point
        new THREE.Vector3(0, 0.8, 0.3),
        // Shoulder points
        new THREE.Vector3(-0.8, 1.8, 0),
        new THREE.Vector3(0.8, 1.8, 0),
        // Sleeve points
        new THREE.Vector3(-1.5, 1.5, 0),
        new THREE.Vector3(1.5, 1.5, 0),
        // Inseam point
        new THREE.Vector3(0, -0.5, 0),
      ]
    : []

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.7, 1.5, 8, 16]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-1.2, 1.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.25, 1.2, 8, 16]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Right Arm */}
      <mesh position={[1.2, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.25, 1.2, 8, 16]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.4, -0.8, 0]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.3, 1.5, 8, 16]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.4, -0.8, 0]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.3, 1.5, 8, 16]} />
        <meshStandardMaterial color="#6ee7b7" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Measurement points */}
      {highlightPoints && measurements && (
        <group>
          {measurementPoints.map((point, i) => (
            <mesh key={i} position={point}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#14b8a6" emissive="#0d9488" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

function MeasurementParticles({ count = 2000 }) {
  const particlesRef = useRef()

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  // Generate random particles in a human-like shape
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    // Create a rough human shape with particles
    const theta = Math.random() * Math.PI * 2
    const radius = 0.2 + Math.random() * 0.3
    const height = (Math.random() - 0.5) * 2

    positions[i3] = Math.cos(theta) * radius
    positions[i3 + 1] = height
    positions[i3 + 2] = Math.sin(theta) * radius
  }

  return (
    <group ref={particlesRef}>
      <Points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#14b8a6" sizeAttenuation transparent opacity={0.8} />
      </Points>
    </group>
  )
}

export function HumanFigure3D({ measurements = null, showParticles = true, highlightPoints = false }) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <HumanModel measurements={measurements} highlightPoints={highlightPoints} />
      {showParticles && <MeasurementParticles />}

      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
    </Canvas>
  )
}
