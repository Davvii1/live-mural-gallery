"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

type Point = {
  x: number
  y: number
}

type DrawingMode = "draw" | "erase"

interface DrawingCanvasProps {
  initialCanvasData: string | null
  onCanvasUpdate: (data: string) => void
}

export default function DrawingCanvas({ initialCanvasData, onCanvasUpdate }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#FF5500") // Default orange color
  const [mode, setMode] = useState<DrawingMode>("draw")
  const [lastPoint, setLastPoint] = useState<Point | null>(null)
  const [brushSize, setBrushSize] = useState(5)
  const [history, setHistory] = useState<string[]>([])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas to full screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Get context
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set initial canvas background to white
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load saved canvas data if available
    if (initialCanvasData) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = initialCanvasData
    } else {
      // Initialize history with blank canvas
      const blankCanvas = canvas.toDataURL()
      setHistory([blankCanvas])
    }

    // Handle window resize
    const handleResize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.putImageData(imageData, 0, 0)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [initialCanvasData])

  // Handle keyboard event to return to main screen
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q") {
        // This will trigger the parent component to switch back
        // The parent component handles the actual view switching
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const point = getPointFromEvent(e)
    setLastPoint(point)

    // For single dot drawing
    drawPoint(point)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return

    const currentPoint = getPointFromEvent(e)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (mode === "draw") {
      ctx.strokeStyle = color
      ctx.globalCompositeOperation = "source-over"
    } else {
      ctx.strokeStyle = "#FFFFFF"
      ctx.globalCompositeOperation = "destination-out"
    }

    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)
    ctx.stroke()

    setLastPoint(currentPoint)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      saveCanvasState()
    }
    setIsDrawing(false)
    setLastPoint(null)
  }

  const drawPoint = (point: Point) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2)

    if (mode === "draw") {
      ctx.fillStyle = color
      ctx.globalCompositeOperation = "source-over"
    } else {
      ctx.fillStyle = "#FFFFFF"
      ctx.globalCompositeOperation = "destination-out"
    }

    ctx.fill()
  }

  const saveCanvasState = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL()
    setHistory((prev) => [...prev, dataURL])
    onCanvasUpdate(dataURL)
  }

  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const toggleMode = (newMode: DrawingMode) => {
    setMode(newMode)
  }

  const toggleColor = (newColor: string) => {
    setColor(newColor)
    setMode("draw") // Switch back to draw mode when changing color
  }

  const handleUndo = () => {
    if (history.length <= 1) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Remove the last state and get the previous one
    const newHistory = [...history]
    newHistory.pop()
    const previousState = newHistory[newHistory.length - 1]

    // Load the previous state
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      // Update history and notify parent
      setHistory(newHistory)
      onCanvasUpdate(previousState)
    }
    img.src = previousState
  }

  return (
    <div className="relative w-full h-screen overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Drawing tools */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg">
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center ${mode === "draw" && color === "#FF5500" ? "ring-2 ring-black" : ""}`}
          style={{ backgroundColor: "#FF5500" }}
          onClick={() => toggleColor("#FF5500")}
          aria-label="Orange color"
        />
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center ${mode === "draw" && color === "#FF0000" ? "ring-2 ring-black" : ""}`}
          style={{ backgroundColor: "#FF0000" }}
          onClick={() => toggleColor("#FF0000")}
          aria-label="Red color"
        />
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-300 ${mode === "erase" ? "ring-2 ring-black" : ""}`}
          onClick={() => toggleMode("erase")}
          aria-label="Eraser"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 20H9L4 15C2.9 13.9 2.9 12.1 4 11L13 2C14.1 0.9 15.9 0.9 17 2L22 7C23.1 8.1 23.1 9.9 22 11L13 20" />
            <path d="M9 15L4 20" />
          </svg>
        </button>
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-300"
          onClick={handleUndo}
          aria-label="Undo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 14L4 9L9 4" />
            <path d="M4 9H16C18.2091 9 20 10.7909 20 13C20 15.2091 18.2091 17 16 17H12" />
          </svg>
        </button>
      </div>

      {/* Brush size control */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-lg">
        <input
          type="range"
          min="1"
          max="30"
          value={brushSize}
          onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
          className="w-12 h-40"
          orient="vertical"
          style={{ writingMode: "bt-lr", WebkitAppearance: "slider-vertical" }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow-lg text-center">
        <p>Press 'Q' to return to gallery</p>
      </div>
    </div>
  )
}

