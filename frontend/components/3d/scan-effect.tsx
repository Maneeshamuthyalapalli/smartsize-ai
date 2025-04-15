"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"

function ScanningEffect() {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      // Move the ring up and down
      ringRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 1.5

      // Pulse the opacity
      if (ringRef.current.material) {
        ringRef.current.material.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 3) * 0.2
      }
    }
  })

  return (
    <group>
      {/* Scanning ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.5} />
      </mesh>

      {/* Container cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 4, 32, 1, true]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.1} side={2} />
      </mesh>
    </group>
  )
}

export function ScanEffect() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <ScanningEffect />

      <Environment preset="studio" />
    </Canvas>
  )
}
