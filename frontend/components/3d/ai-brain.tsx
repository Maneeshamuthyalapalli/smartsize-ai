"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function NeuralNetwork({ count = 100, connections = 150 }) {
  const pointsRef = useRef()
  const linesRef = useRef()

  // Create neural network nodes
  const nodes = []
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 1 + Math.random() * 0.2

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    nodes.push(new THREE.Vector3(x, y, z))
  }

  // Create connections between nodes
  const linePositions = []
  for (let i = 0; i < connections; i++) {
    const node1 = nodes[Math.floor(Math.random() * nodes.length)]
    const node2 = nodes[Math.floor(Math.random() * nodes.length)]

    linePositions.push(node1.x, node1.y, node1.z)
    linePositions.push(node2.x, node2.y, node2.z)
  }

  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))

  useFrame((state) => {
    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group>
      {/* Brain core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial
          color="#0d9488"
          distort={0.4}
          speed={2}
          metalness={0.8}
          roughness={0.2}
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Neural network nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            array={new Float32Array(nodes.flatMap((v) => [v.x, v.y, v.z]))}
            count={nodes.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#14b8a6" sizeAttenuation transparent opacity={0.8} />
      </points>

      {/* Neural network connections */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#14b8a6" transparent opacity={0.2} />
      </lineSegments>
    </group>
  )
}

export function AIBrain3D() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <NeuralNetwork />

      <Environment preset="studio" />
    </Canvas>
  )
}
