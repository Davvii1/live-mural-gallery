"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import type React from "react"

import { useChannel } from "ably/react"
import QRGenerator from "@/components/qr-generator"
import FrameRotation from "./components/svg/frameRotation"
import DrawingCanvas from "./components/drawing-canvas"
import LogoSienteLaEnergia from "./components/svg/logoSienteLaenergia"
interface AppProps {
  page: number
  title: string
  isSping: boolean
}

// Cache to store images by page
const imageCache: Record<number, string[]> = {}

export default function App(props: AppProps) {
  const [sizes, setSizes] = useState<number[]>([])
  const [imageArray, setImageArray] = useState<string[]>(new Array(40).fill(""))
  const [urls, setUrls] = useState<string[]>([])
  const [draggedImage, setDraggedImage] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [showDrawingCanvas, setShowDrawingCanvas] = useState<boolean>(false)
  const [canvasData, setCanvasData] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const prevPageRef = useRef<number>(props.page)

const [isTopQRShowing, setIsTopQRShowing] = useState(false)

  // Flag to check if movement is allowed (no QR codes present)
  const canMoveImages = urls.length === 0

  useEffect(() => {
    const dominioUpload = "https://live-mural-gallery-clon.vercel.app/upload"

    // Check if we already have cached data for this page
    if (imageCache[props.page]) {
      console.log("Using cached images for page", props.page)
      setImageArray(imageCache[props.page])

      // Calculate how many empty slots we have to determine QR codes
      const emptySlots = imageCache[props.page].filter((img) => img === "").length
      setUrls(emptySlots > 0 ? new Array(emptySlots).fill(dominioUpload) : [])
      return
    }

    setImageArray(new Array(40).fill(""))

    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/files?page=${props.page}&limit=40`)
        const data = await response.json()
        if (data.results.length === 0) setUrls(new Array(40).fill(dominioUpload))

        if (data && Array.isArray(data.results)) {
          const updatedImages = [...new Array(40).fill("")]

          data.results.forEach((imageUrl: string) => {
            const emptyIndex = updatedImages.findIndex((image) => image === "")
            if (emptyIndex !== -1) {
              updatedImages[emptyIndex] = imageUrl
            }
          })

          // Calculate how many empty slots we have
          const emptySlots = updatedImages.filter((img) => img === "").length
          setUrls(emptySlots > 0 ? new Array(emptySlots).fill(dominioUpload) : [])

          // Store in cache
          imageCache[props.page] = [...updatedImages]
          setImageArray(updatedImages)
        }
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }

    fetchImages()
  }, [props.page])

  useEffect(() => {
    setSizes(urls.map(() => getRandomArbitrary(0.4, 1) * 128))
  }, [urls])

  // Add keyboard event listener for 'q' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q") {
        setShowDrawingCanvas((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  const { channel } = useChannel("photos", "photoUploaded", (message) => {
    handleNewImage(message.data)
    console.log(message.data)
  })

  const handleNewImage = useCallback(
    (imageUrl: string) => {
      const emptyIndex = imageArray.findIndex((image) => image === "")

      console.log(emptyIndex)
      if (emptyIndex !== -1) {
        const newImageArray = [...imageArray]
        newImageArray[emptyIndex] = imageUrl
        setImageArray(newImageArray)

        // Update the cache for current page
        imageCache[props.page] = newImageArray

        deleteQr()
        console.log(sizes.length)
      }
    },
    [imageArray, sizes, props.page],
  )

  const deleteQr = () => {
    if (urls.length > 1) {
      const updatedUrls = [...urls]
      updatedUrls.pop()
      setUrls(updatedUrls)

      const updatedSizes = [...sizes]
      updatedSizes.pop()
      setSizes(updatedSizes)
    } else if (urls.length === 1) {
      const updatedUrls: string[] = []
      const updatedSizes: number[] = []
      setUrls(updatedUrls)
      setSizes(updatedSizes)
    }
  }

  // Find the cell index from coordinates
  const findCellFromPoint = (x: number, y: number): number | null => {
    if (!gridRef.current) return null

    const grid = gridRef.current
    const gridRect = grid.getBoundingClientRect()

    // Check if point is within grid
    if (x < gridRect.left || x > gridRect.right || y < gridRect.top || y > gridRect.bottom) {
      return null
    }

    // Calculate relative position within grid
    const relX = x - gridRect.left
    const relY = y - gridRect.top

    // Calculate cell width and height
    const cellWidth = gridRect.width / 8 // 8 columns
    const cellHeight = gridRect.height / 5 // 5 rows

    // Calculate column and row
    const col = Math.floor(relX / cellWidth)
    const row = Math.floor(relY / cellHeight)

    // Calculate index (row * columns + column)
    const index = row * 8 + col

    // Ensure index is within bounds
    if (index >= 0 && index < 40) {
      return index
    }

    return null
  }

  // Touch handlers
  const handleTouchStart = (index: number) => (e: React.TouchEvent) => {
    // Only allow movement if there are no QR codes
    if (!canMoveImages || !imageArray[index]) return

    e.preventDefault()
    setDraggedIndex(index)
    setDraggedImage(imageArray[index])
    setDragPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedImage || draggedIndex === null) return

    e.preventDefault()
    setDragPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (draggedIndex === null || !dragPosition) {
      setDraggedIndex(null)
      setDraggedImage(null)
      setDragPosition(null)
      return
    }

    // Get the position of the last touch
    const x = dragPosition.x
    const y = dragPosition.y

    // Find the cell at this position
    const targetIndex = findCellFromPoint(x, y)

    // If we found a valid cell and it's different from the source
    if (targetIndex !== null && targetIndex !== draggedIndex) {
      // Swap the images
      const newImageArray = [...imageArray]
      const temp = newImageArray[draggedIndex]
      newImageArray[draggedIndex] = newImageArray[targetIndex]
      newImageArray[targetIndex] = temp
      setImageArray(newImageArray)

      // Update the cache for current page
      imageCache[props.page] = newImageArray
    }

    // Reset drag state
    setDraggedIndex(null)
    setDraggedImage(null)
    setDragPosition(null)
  }

useEffect(() => {
    const handleMKeyDown = (e: KeyboardEvent) => {
      if (e.key === "m") {
        setIsTopQRShowing((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleMKeyDown)

    return () => {
      window.removeEventListener("keydown", handleMKeyDown)
    }
  }, [isTopQRShowing])

  // Mouse handlers
  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    // Only allow movement if there are no QR codes
    if (!canMoveImages || !imageArray[index]) return

    e.preventDefault()
    setDraggedIndex(index)
    setDraggedImage(imageArray[index])
    setDragPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedImage || draggedIndex === null) return

    e.preventDefault()
    setDragPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggedIndex === null || !dragPosition) {
      setDraggedIndex(null)
      setDraggedImage(null)
      setDragPosition(null)
      return
    }

    // Get the position of the mouse
    const x = e.clientX
    const y = e.clientY

    // Find the cell at this position
    const targetIndex = findCellFromPoint(x, y)

    // If we found a valid cell and it's different from the source
    if (targetIndex !== null && targetIndex !== draggedIndex) {
      // Swap the images
      const newImageArray = [...imageArray]
      const temp = newImageArray[draggedIndex]
      newImageArray[draggedIndex] = newImageArray[targetIndex]
      newImageArray[targetIndex] = temp
      setImageArray(newImageArray)

      // Update the cache for current page
      imageCache[props.page] = newImageArray
    }

    // Reset drag state
    setDraggedIndex(null)
    setDraggedImage(null)
    setDragPosition(null)
  }

  // Global mouse handlers
  useEffect(() => {
    if (!draggedImage || draggedIndex === null) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      setDragPosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (draggedIndex === null || !dragPosition) {
        setDraggedIndex(null)
        setDraggedImage(null)
        setDragPosition(null)
        return
      }

      // Get the position of the mouse
      const x = e.clientX
      const y = e.clientY

      // Find the cell at this position
      const targetIndex = findCellFromPoint(x, y)

      // If we found a valid cell and it's different from the source
      if (targetIndex !== null && targetIndex !== draggedIndex) {
        // Swap the images
        const newImageArray = [...imageArray]
        const temp = newImageArray[draggedIndex]
        newImageArray[draggedIndex] = newImageArray[targetIndex]
        newImageArray[targetIndex] = temp
        setImageArray(newImageArray)

        // Update the cache for current page
        imageCache[props.page] = newImageArray
      }

      // Reset drag state
      setDraggedIndex(null)
      setDraggedImage(null)
      setDragPosition(null)
    }

    // Add global event listeners
    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [draggedImage, draggedIndex, dragPosition, imageArray, props.page])

  // Global touch handlers
  useEffect(() => {
    if (!draggedImage || draggedIndex === null) return

    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      setDragPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (draggedIndex === null || !dragPosition) {
        setDraggedIndex(null)
        setDraggedImage(null)
        setDragPosition(null)
        return
      }

      // Get the position of the last touch
      const x = dragPosition.x
      const y = dragPosition.y

      // Find the cell at this position
      const targetIndex = findCellFromPoint(x, y)

      // If we found a valid cell and it's different from the source
      if (targetIndex !== null && targetIndex !== draggedIndex) {
        // Swap the images
        const newImageArray = [...imageArray]
        const temp = newImageArray[draggedIndex]
        newImageArray[draggedIndex] = newImageArray[targetIndex]
        newImageArray[targetIndex] = temp
        setImageArray(newImageArray)

        // Update the cache for current page
        imageCache[props.page] = newImageArray
      }

      // Reset drag state
      setDraggedIndex(null)
      setDraggedImage(null)
      setDragPosition(null)
    }

    // Add global event listeners
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false })
    window.addEventListener("touchend", handleGlobalTouchEnd)

    return () => {
      window.removeEventListener("touchmove", handleGlobalTouchMove)
      window.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [draggedImage, draggedIndex, dragPosition, imageArray, props.page])

  if (sizes.length === 0 && imageArray.every((image) => image === "")) return null

  // If drawing canvas is active, show it instead of the main content
  if (showDrawingCanvas) {
    return <DrawingCanvas initialCanvasData={canvasData} onCanvasUpdate={(data) => setCanvasData(data)} />
  }

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <div
        style={{ pointerEvents: "none" }}
        className="absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center animate-spinScale opacity-70"
      >
        <LogoSienteLaEnergia width="38vw" height="38vw" title={props.title} />
      </div>
      <div
        style={{ pointerEvents: "none" }}
        className="absolute top-0 left-0 w-full h-full z-1 flex justify-center items-center animate-spinScale opacity-90"
      >
        <FrameRotation
          className={props.isSping ? "animate-spinSlow" : "animate-spinFast"}
          width="280vw"
          height="280vh"
        />
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-8 grid-rows-5 gap-0 p-0 w-[1920px] h-[1152px] mx-auto"
        style={{
          background: "radial-gradient(closest-side, #FFFFFF, #FAFAFA, #eaeaea, #DADADA)",
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {imageArray.map((imageUrl, index) => (
          <div
            key={index}
            className={`w-full h-full aspect-square flex items-center justify-center relative ${canMoveImages && imageUrl ? "cursor-move" : ""}`}
            onMouseDown={handleMouseDown(index)}
            onTouchStart={handleTouchStart(index)}
            onContextMenu={(e) => e.preventDefault()}
          >
            {imageUrl && (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover grayscale opacity-40"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            )}
          </div>
        ))}
      </div>

      {/* Dragged image preview */}
      {draggedImage && dragPosition && (
        <img
          src={draggedImage || "/placeholder.svg"}
          alt="Dragged Preview"
          className="absolute w-24 h-24 object-cover opacity-80 pointer-events-none z-50"
          style={{
            left: dragPosition.x - 48,
            top: dragPosition.y - 48,
            transform: "scale(3.1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />
      )}

      {/* Render QR codes only if there's at least one */}
      {urls.length > 0 && (
        <div>
          {urls.map((url, index) => (
            <QRGenerator
              key={index}
              url={url}
              id={`qr-${index}`}
              index={index}
              totalQRs={urls.length}
              size={sizes[index]}
            />
          ))}
        </div>
      )}

 {isTopQRShowing ? (
        <div className="absolute z-50 bottom-10 right-10 rounded-md bg-white p-4 shadow-lg">
          <QRCodeSVG value="https://live-mural-gallery-clon.vercel.app/upload" />
        </div>
      ) : null}

    </div>
  )
}

const getRandomArbitrary = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

