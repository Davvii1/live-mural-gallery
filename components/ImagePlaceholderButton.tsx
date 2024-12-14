import { Image } from 'lucide-react'

interface ImagePlaceholderButtonProps {
  onNewImage: () => void
}

export function ImagePlaceholderButton({ onNewImage }: ImagePlaceholderButtonProps) {
  return (
    <button
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 flex items-center space-x-2"
      onClick={onNewImage}
    >
      <Image className="w-6 h-6" />
      <span>Add New Image</span>
    </button>
  )
}

