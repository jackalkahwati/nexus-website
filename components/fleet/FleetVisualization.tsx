'use client'

import React, { useRef, useState, Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'
import type { AutonomousVehicle, DigitalTwinState } from '@/types/autonomy'
import { Card } from '@/components/ui/card'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Dynamically import heavy 3D components
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { ssr: false })
const useFrame = dynamic(() => import('@react-three/fiber').then(mod => mod.useFrame), { ssr: false })
const useLoader = dynamic(() => import('@react-three/fiber').then(mod => mod.useLoader), { ssr: false })
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => mod.OrbitControls), { ssr: false })
const Environment = dynamic(() => import('@react-three/drei').then(mod => mod.Environment), { ssr: false })
const PerspectiveCamera = dynamic(() => import('@react-three/drei').then(mod => mod.PerspectiveCamera), { ssr: false })
const GLTFLoader = dynamic(() => import('three/examples/jsm/loaders/GLTFLoader.js').then(mod => mod.GLTFLoader), { ssr: false })
const THREE = dynamic(() => import('three'), { ssr: false })

interface VehicleModelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  status: 'active' | 'idle' | 'maintenance' | 'offline'
  vehicleId: string
  onClick?: () => void
}

// Create vehicle model component with dynamic imports
const VehicleModel = React.memo(function VehicleModel({ position, rotation, scale, status, vehicleId, onClick }: VehicleModelProps) {
  const meshRef = useRef(null)
  const gltf = useLoader(GLTFLoader, '/models/autonomous-vehicle.glb') as GLTF

  // Status-based color mapping
  const statusColors = {
    active: '#4CAF50',
    idle: '#FFC107',
    maintenance: '#FF9800',
    offline: '#F44336',
  }

  useFrame((state, delta) => {
    if (meshRef.current && status === 'active') {
      // Add subtle hover animation for active vehicles
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  const clonedScene = gltf.scene.clone()
  clonedScene.userData.vehicleId = vehicleId

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={onClick}
      data-testid={`vehicle-model-${vehicleId}`}
    >
      <primitive object={clonedScene} />
      {/* Add status indicator light */}
      <pointLight
        position={[0, 1, 0]}
        distance={2}
        intensity={0.5}
        color={statusColors[status]}
        data-testid={`vehicle-light-${vehicleId}`}
      />
    </group>
  )
})

interface FleetVisualizationProps {
  vehicles: AutonomousVehicle[]
  digitalTwinStates: Map<string, DigitalTwinState>
  onVehicleSelect?: (vehicle: AutonomousVehicle) => void
  className?: string
}

// Main component with performance optimizations 
function FleetVisualizationImpl({
  vehicles,
  digitalTwinStates,
  onVehicleSelect,
  className,
}: FleetVisualizationProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)

  // Convert GPS coordinates to scene coordinates
  const getScenePosition = (lat: number, lon: number, alt: number): [number, number, number] => {
    // Simple linear mapping for demo - in production use proper geo projection
    const x = (lon + 180) / 360 * 100 - 50
    const y = alt / 1000
    const z = (lat + 90) / 180 * 100 - 50
    return [x, y, z]
  }

  // Find selected vehicle once instead of multiple times
  const selectedVehicle = selectedVehicleId 
    ? vehicles.find((v) => v.id === selectedVehicleId)
    : null

  const selectedTwinState = selectedVehicleId 
    ? digitalTwinStates.get(selectedVehicleId)
    : null

  return (
    <Card className={className} data-testid="fleet-visualization">
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading 3D visualization...</div>}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 20, 50]} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
          />
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#303030" />
          </mesh>

          {/* Render vehicles */}
          {vehicles.map((vehicle) => {
            const twinState = digitalTwinStates.get(vehicle.id)
            if (!twinState) return null

            const position = getScenePosition(
              twinState.position.latitude,
              twinState.position.longitude,
              twinState.position.altitude
            )

            const rotation: [number, number, number] = [
              0,
              twinState.motion.heading * (Math.PI / 180),
              0
            ]

            return (
              <VehicleModel
                key={vehicle.id}
                vehicleId={vehicle.id}
                position={position}
                rotation={rotation}
                scale={1}
                status={vehicle.status}
                onClick={() => {
                  setSelectedVehicleId(vehicle.id)
                  onVehicleSelect?.(vehicle)
                }}
              />
            )
          })}
        </Canvas>
      </Suspense>

      {/* Vehicle info overlay */}
      {selectedVehicle && selectedTwinState && (
        <div
          className="absolute bottom-4 left-4 p-4 bg-card rounded-lg shadow-lg"
          data-testid="vehicle-info-overlay"
        >
          <h3 className="text-lg font-semibold mb-2">
            Vehicle {selectedVehicle.id}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p>Autonomy Level: {selectedVehicle.capabilities.level}</p>
              <p>Status: {selectedVehicle.status}</p>
              <p>Battery: {selectedVehicle.battery}%</p>
            </div>
            <div>
              <p>Speed: {selectedTwinState.motion.speed} km/h</p>
              <p>Mode: {selectedTwinState.systemStatus.currentMode}</p>
              <p>Safety: {selectedTwinState.systemStatus.safetyStatus}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// Export a lazy-loaded version of the component for better code splitting
export const FleetVisualization = dynamic(
  () => Promise.resolve(FleetVisualizationImpl),
  { 
    ssr: false,
    loading: () => (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2">Loading Fleet Visualization...</div>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </Card>
    )
  }
) 