'use client'
import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"

interface ImagePlaceholderButtonProps {
  onNewImage: () => void
}

export function ImagePlaceholderButton({ onNewImage }: ImagePlaceholderButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      className={clsx('fixed bottom-6 right-12 bg-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-200 flex items-center space-x-2', {
        'flex-col': isOpen,
      })}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={clsx('aspect-square relative', {
        'w-12': !isOpen,
        'w-full': isOpen,
      })}>
        <Image src="/uploadqr.png" alt="QR Code" fill />
      </div>
      <span>Agrega tu imagen</span>
    </button>
  )
}