'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Vector3, TextureLoader, MeshStandardMaterial, Color } from 'three'

interface FloatingCardProps {
  imageUrl: string
  isNew: boolean
}

export function FloatingCard({ imageUrl, isNew }: FloatingCardProps) {
  const mesh = useRef<THREE.Group>(null!)
  const { scene } = useThree()
  const [velocity] = useState(() => new Vector3(
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01
  ))
  const [position] = useState(() => new Vector3(
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 6
  ))
  const [scale] = useState(() => new Vector3(isNew ? 0.001 : 1, isNew ? 0.001 : 1, isNew ? 0.001 : 1))

  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const loader = new TextureLoader()
    setIsLoading(true)
    setHasError(false)

    console.log("Image URL from FC", imageUrl)
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture)
        setIsLoading(false)
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the texture', error)
        setIsLoading(false)
        setHasError(true)
      }
    )
  }, [imageUrl])

  const imageMaterial = useMemo(() => {
    if (isLoading) {
      return new MeshStandardMaterial({ color: new Color(0xcccccc) })
    } else if (hasError) {
      return new MeshStandardMaterial({ color: new Color(0xff0000) })
    } else {
      return new MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.6,
      })
    }
  }, [texture, isLoading, hasError])

  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.copy(position)
    }
  }, [position])

  useFrame((state, delta) => {
    if (mesh.current) {
      const newPosition = mesh.current.position.clone().add(velocity)

      // Boundary check
      const bounds = { x: 4, y: 3, z: 3 }
      for (const axis of ['x', 'y', 'z'] as const) {
        if (Math.abs(newPosition[axis]) > bounds[axis]) {
          velocity[axis] *= -1
          newPosition[axis] = Math.sign(newPosition[axis]) * bounds[axis]
        }
      }

      // Collision detection and response
      scene.children.forEach((child) => {
        if (child !== mesh.current && child.type === 'Group') {
          const distance = newPosition.distanceTo(child.position)
          if (distance < 1.5) {
            const pushVector = newPosition.clone().sub(child.position).normalize()
            newPosition.add(pushVector.multiplyScalar(1.5 - distance))
            velocity.reflect(pushVector)
          }
        }
      })

      mesh.current.position.copy(newPosition)

      // Make the card always face the camera
      mesh.current.lookAt(state.camera.position)

      // Add a slight wobble effect
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05

      // Smooth growing animation
      if (isNew && (scale.x < 1 || scale.y < 1 || scale.z < 1)) {
        scale.x = Math.min(scale.x + delta * 2, 1)
        scale.y = Math.min(scale.y + delta * 2, 1)
        scale.z = Math.min(scale.z + delta * 2, 1)
        mesh.current.scale.copy(scale)
      }
    }
  })

  return (
    <group ref={mesh} scale={scale.toArray()}>
      {/* White border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.1, 1.3]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Image */}
      <mesh>
        <planeGeometry args={[1, 1.2]} />
        <primitive object={imageMaterial} attach="material" />
      </mesh>
    </group>
  )
}

