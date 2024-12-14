'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useCallback } from 'react'
import { FloatingCards } from './components/FloatingCards'
import { ImagePlaceholderButton } from './components/ImagePlaceholderButton'
import { useChannel } from 'ably/react'

export default function App() {
  const [lastImageId, setLastImageId] = useState(3)

  const handleNewImage = useCallback(() => {
    setLastImageId(prevId => prevId + 1)
  }, [])

  const { channel } = useChannel('photos', 'photoUploaded', (message) => {
    console.log(message);
  });

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={1.7} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <FloatingCards lastImageId={lastImageId} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <ImagePlaceholderButton onNewImage={handleNewImage} />
    </div>
  )
}

