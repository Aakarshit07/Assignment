"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Toolbar from "./toolbar"
import PropertiesPanel from "./properties-panel"
import { saveDrawing, loadDrawing } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

export default function BuildingPlanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [activeObject, setActiveObject] = useState<any>(null)
  const [selectedObjects, setSelectedObjects] = useState<any[]>([])
  const [activeTool, setActiveTool] = useState<string>("select")
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [drawingName, setDrawingName] = useState<string>("My Building Plan")
  const [shapes, setShapes] = useState<any[]>([])
  const [annotations, setAnnotations] = useState<any[]>([])
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [pencilPath, setPencilPath] = useState<{ x: number; y: number }[]>([])
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        // Set canvas size
        canvasRef.current.width = window.innerWidth - 300
        canvasRef.current.height = window.innerHeight - 100

        setCanvas(ctx)

        // Handle window resize
        const handleResize = () => {
          if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth - 300
            canvasRef.current.height = window.innerHeight - 100
            redrawCanvas()
          }
        }

        window.addEventListener("resize", handleResize)

        // Handle keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
              case "a":
                e.preventDefault()
                selectAll()
                break
              case "s":
                e.preventDefault()
                handleSave()
                break
            }
          }

          if (e.key === "Delete" || e.key === "Backspace") {
            deleteSelected()
          }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
          window.removeEventListener("resize", handleResize)
          window.removeEventListener("keydown", handleKeyDown)
        }
      }
    }
  }, [])

  // Redraw all shapes on canvas
  const redrawCanvas = () => {
    if (!canvas || !canvasRef.current) return

    // Clear canvas
    canvas.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set background
    canvas.fillStyle = "#f8f9fa"
    canvas.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw grid
    drawGrid()

    // Draw all shapes
    shapes.forEach((shape) => {
      drawShape(shape)
    })

    // Draw annotations if enabled
    if (showAnnotations) {
      annotations.forEach((annotation) => {
        drawAnnotation(annotation)
      })
    }

    // Draw selection box
    if (isSelecting && selectionBox) {
      drawSelectionBox()
    }

    // Draw preview shape while drawing
    if (isDrawing && startPos && currentPos && activeTool !== "select") {
      drawPreviewShape()
    }
  }

  // Draw grid for better visual guidance
  const drawGrid = () => {
    if (!canvas || !canvasRef.current) return

    const gridSize = 20
    canvas.strokeStyle = "#e0e0e0"
    canvas.lineWidth = 0.5

    // Vertical lines
    for (let x = 0; x <= canvasRef.current.width; x += gridSize) {
      canvas.beginPath()
      canvas.moveTo(x, 0)
      canvas.lineTo(x, canvasRef.current.height)
      canvas.stroke()
    }

    // Horizontal lines
    for (let y = 0; y <= canvasRef.current.height; y += gridSize) {
      canvas.beginPath()
      canvas.moveTo(0, y)
      canvas.lineTo(canvasRef.current.width, y)
      canvas.stroke()
    }
  }

  // Draw selection box
  const drawSelectionBox = () => {
    if (!canvas || !selectionBox) return

    canvas.strokeStyle = "#007bff"
    canvas.fillStyle = "rgba(0, 123, 255, 0.1)"
    canvas.lineWidth = 1
    canvas.setLineDash([5, 5])

    canvas.fillRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height)
    canvas.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height)

    canvas.setLineDash([])
  }

  // Draw preview shape while drawing
  const drawPreviewShape = () => {
    if (!canvas || !startPos || !currentPos) return

    canvas.strokeStyle = "#007bff"
    canvas.fillStyle = "rgba(0, 123, 255, 0.1)"
    canvas.lineWidth = 2
    canvas.setLineDash([5, 5])

    canvas.beginPath()

    switch (activeTool) {
      case "rectangle":
        const rectWidth = currentPos.x - startPos.x
        const rectHeight = currentPos.y - startPos.y
        canvas.strokeRect(startPos.x, startPos.y, rectWidth, rectHeight)
        canvas.fillRect(startPos.x, startPos.y, rectWidth, rectHeight)
        break
      case "circle":
        const radius = Math.sqrt(Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2))
        canvas.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
        canvas.fill()
        canvas.stroke()
        break
      case "line":
        canvas.moveTo(startPos.x, startPos.y)
        canvas.lineTo(currentPos.x, currentPos.y)
        canvas.stroke()
        break
      case "wall":
        const wallWidth = currentPos.x - startPos.x
        const wallHeight = Math.abs(wallWidth) > Math.abs(currentPos.y - startPos.y) ? 10 : currentPos.y - startPos.y
        canvas.strokeRect(startPos.x, startPos.y, wallWidth, wallHeight)
        canvas.fillRect(startPos.x, startPos.y, wallWidth, wallHeight)
        break
      case "pencil":
        if (pencilPath.length > 1) {
          canvas.strokeStyle = "#333"
          canvas.lineWidth = 2
          canvas.lineCap = "round"
          canvas.lineJoin = "round"
          canvas.beginPath()
          canvas.moveTo(pencilPath[0].x, pencilPath[0].y)
          for (let i = 1; i < pencilPath.length; i++) {
            canvas.lineTo(pencilPath[i].x, pencilPath[i].y)
          }
          canvas.stroke()
        }
        break
    }

    canvas.setLineDash([])
  }

  // Draw a single shape
  const drawShape = (shape: any) => {
    if (!canvas) return

    canvas.strokeStyle = shape.stroke || "#333"
    canvas.fillStyle = shape.fill || "transparent"
    canvas.lineWidth = shape.strokeWidth || 2

    canvas.beginPath()

    switch (shape.type) {
      case "rectangle":
        if (shape.fill !== "transparent") {
          canvas.fillRect(shape.x, shape.y, shape.width, shape.height)
        }
        canvas.strokeRect(shape.x, shape.y, shape.width, shape.height)
        break
      case "circle":
        canvas.arc(shape.x + shape.radius, shape.y + shape.radius, shape.radius, 0, 2 * Math.PI)
        if (shape.fill !== "transparent") {
          canvas.fill()
        }
        canvas.stroke()
        break
      case "line":
        canvas.moveTo(shape.x1, shape.y1)
        canvas.lineTo(shape.x2, shape.y2)
        canvas.stroke()
        break
      case "wall":
        canvas.fillStyle = shape.fill || "#555"
        canvas.fillRect(shape.x, shape.y, shape.width, shape.height)
        canvas.strokeRect(shape.x, shape.y, shape.width, shape.height)
        break
      case "pencil":
        if (shape.path && shape.path.length > 1) {
          canvas.strokeStyle = shape.stroke || "#333"
          canvas.lineWidth = shape.strokeWidth || 2
          canvas.lineCap = "round"
          canvas.lineJoin = "round"
          canvas.beginPath()
          canvas.moveTo(shape.path[0].x, shape.path[0].y)
          for (let i = 1; i < shape.path.length; i++) {
            canvas.lineTo(shape.path[i].x, shape.path[i].y)
          }
          canvas.stroke()
        }
        break
    }

    // Highlight if selected
    if (selectedObjects.some((obj) => obj.id === shape.id)) {
      drawSelectionHandles(shape)
    }
  }

  // Draw selection handles around selected shape
  const drawSelectionHandles = (shape: any) => {
    if (!canvas) return

    canvas.strokeStyle = "#007bff"
    canvas.fillStyle = "#007bff"
    canvas.lineWidth = 2
    canvas.setLineDash([5, 5])

    const bounds = getShapeBounds(shape)

    // Draw selection rectangle
    canvas.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10)

    // Draw corner handles
    const handleSize = 6
    const handles = [
      { x: bounds.x - 5, y: bounds.y - 5 }, // top-left
      { x: bounds.x + bounds.width + 5 - handleSize, y: bounds.y - 5 }, // top-right
      { x: bounds.x - 5, y: bounds.y + bounds.height + 5 - handleSize }, // bottom-left
      { x: bounds.x + bounds.width + 5 - handleSize, y: bounds.y + bounds.height + 5 - handleSize }, // bottom-right
    ]

    handles.forEach((handle) => {
      canvas.fillRect(handle.x, handle.y, handleSize, handleSize)
    })

    canvas.setLineDash([])
  }

  // Get bounding box of a shape
  const getShapeBounds = (shape: any) => {
    switch (shape.type) {
      case "rectangle":
      case "wall":
        return {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
        }
      case "circle":
        return {
          x: shape.x,
          y: shape.y,
          width: shape.radius * 2,
          height: shape.radius * 2,
        }
      case "line":
        return {
          x: Math.min(shape.x1, shape.x2),
          y: Math.min(shape.y1, shape.y2),
          width: Math.abs(shape.x2 - shape.x1),
          height: Math.abs(shape.y2 - shape.y1),
        }
      case "pencil":
        if (!shape.path || shape.path.length === 0) return { x: 0, y: 0, width: 0, height: 0 }
        const xs = shape.path.map((p: any) => p.x)
        const ys = shape.path.map((p: any) => p.y)
        return {
          x: Math.min(...xs),
          y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        }
      default:
        return { x: 0, y: 0, width: 0, height: 0 }
    }
  }

  // Draw annotation
  const drawAnnotation = (annotation: any) => {
    if (!canvas) return

    // Draw annotation background
    canvas.fillStyle = "rgba(255, 255, 255, 0.95)"
    canvas.font = "12px Arial"
    const textWidth = canvas.measureText(annotation.text).width
    const padding = 6

    canvas.fillRect(annotation.x - textWidth / 2 - padding, annotation.y - 16, textWidth + padding * 2, 20)

    // Draw annotation border
    canvas.strokeStyle = "#007bff"
    canvas.lineWidth = 1
    canvas.strokeRect(annotation.x - textWidth / 2 - padding, annotation.y - 16, textWidth + padding * 2, 20)

    // Draw annotation text
    canvas.fillStyle = "#333"
    canvas.textAlign = "center"
    canvas.fillText(annotation.text, annotation.x, annotation.y - 2)

    // Draw leader line if it has one
    if (annotation.leaderStart && annotation.leaderEnd) {
      canvas.strokeStyle = "#007bff"
      canvas.lineWidth = 1
      canvas.setLineDash([2, 2])
      canvas.beginPath()
      canvas.moveTo(annotation.leaderStart.x, annotation.leaderStart.y)
      canvas.lineTo(annotation.leaderEnd.x, annotation.leaderEnd.y)
      canvas.stroke()
      canvas.setLineDash([])
    }
  }

  // Create annotation for a shape
  const createAnnotationForShape = (shape: any) => {
    let text = ""
    let x = 0
    let y = 0

    switch (shape.type) {
      case "rectangle":
      case "wall":
        text = `${Math.abs(shape.width)} × ${Math.abs(shape.height)}`
        x = shape.x + shape.width / 2
        y = shape.y - 20
        break
      case "circle":
        text = `⌀ ${Math.round(shape.radius * 2)}`
        x = shape.x + shape.radius
        y = shape.y - 20
        break
      case "line":
        const length = Math.sqrt(Math.pow(shape.x2 - shape.x1, 2) + Math.pow(shape.y2 - shape.y1, 2))
        text = `${Math.round(length)}px`
        x = (shape.x1 + shape.x2) / 2
        y = (shape.y1 + shape.y2) / 2 - 20
        break
      case "pencil":
        text = "Freehand"
        const bounds = getShapeBounds(shape)
        x = bounds.x + bounds.width / 2
        y = bounds.y - 20
        break
    }

    return {
      id: crypto.randomUUID(),
      shapeId: shape.id,
      text,
      x,
      y,
      type: "dimension",
    }
  }

  // Update annotations when shapes change
  const updateAnnotations = () => {
    const newAnnotations = shapes.map((shape) => createAnnotationForShape(shape))
    setAnnotations(newAnnotations)
  }

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (activeTool === "select") {
      // Find clicked shape
      const clickedShape = shapes.find((shape) => isPointInShape(x, y, shape))

      if (clickedShape) {
        if (!e.ctrlKey && !e.metaKey) {
          setSelectedObjects([clickedShape])
          setActiveObject(clickedShape)
        } else {
          // Multi-select with Ctrl/Cmd
          if (selectedObjects.some((obj) => obj.id === clickedShape.id)) {
            setSelectedObjects((prev) => prev.filter((obj) => obj.id !== clickedShape.id))
          } else {
            setSelectedObjects((prev) => [...prev, clickedShape])
          }
          setActiveObject(clickedShape)
        }

        setIsDragging(true)

        // Calculate drag offset
        const bounds = getShapeBounds(clickedShape)
        setDragOffset({
          x: x - bounds.x,
          y: y - bounds.y,
        })
      } else {
        // Start selection box
        if (!e.ctrlKey && !e.metaKey) {
          setSelectedObjects([])
          setActiveObject(null)
        }
        setIsSelecting(true)
        setStartPos({ x, y })
        setSelectionBox({ x, y, width: 0, height: 0 })
      }
    } else {
      // Start drawing
      setIsDrawing(true)
      setStartPos({ x, y })
      setCurrentPos({ x, y })

      if (activeTool === "pencil") {
        setPencilPath([{ x, y }])
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isSelecting && startPos) {
      // Update selection box
      setSelectionBox({
        x: Math.min(startPos.x, x),
        y: Math.min(startPos.y, y),
        width: Math.abs(x - startPos.x),
        height: Math.abs(y - startPos.y),
      })
    } else if (isDrawing) {
      setCurrentPos({ x, y })

      if (activeTool === "pencil") {
        setPencilPath((prev) => [...prev, { x, y }])
      }
    } else if (isDragging && selectedObjects.length > 0 && dragOffset) {
      // Move selected objects
      const deltaX = x - (startPos?.x || 0)
      const deltaY = y - (startPos?.y || 0)

      selectedObjects.forEach((obj) => {
        updateShapePosition(obj.id, deltaX, deltaY, true)
      })
    }

    // Update cursor based on tool
    if (canvasRef.current) {
      if (activeTool === "select") {
        const hoveredShape = shapes.find((shape) => isPointInShape(x, y, shape))
        canvasRef.current.style.cursor = hoveredShape ? "move" : "default"
      } else if (activeTool === "pencil") {
        canvasRef.current.style.cursor = "crosshair"
      } else {
        canvasRef.current.style.cursor = "crosshair"
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isSelecting && selectionBox) {
      // Select shapes within selection box
      const selectedShapes = shapes.filter((shape) => {
        const bounds = getShapeBounds(shape)
        return (
          bounds.x >= selectionBox.x &&
          bounds.y >= selectionBox.y &&
          bounds.x + bounds.width <= selectionBox.x + selectionBox.width &&
          bounds.y + bounds.height <= selectionBox.y + selectionBox.height
        )
      })

      setSelectedObjects(selectedShapes)
      if (selectedShapes.length > 0) {
        setActiveObject(selectedShapes[0])
      }

      setIsSelecting(false)
      setSelectionBox(null)
    } else if (isDrawing && startPos) {
      // Create new shape
      let newShape = null

      if (activeTool === "pencil") {
        newShape = {
          id: crypto.randomUUID(),
          type: "pencil",
          path: pencilPath,
          stroke: "#333",
          strokeWidth: 2,
        }
      } else {
        newShape = createShape(activeTool, startPos.x, startPos.y, x, y)
      }

      if (newShape) {
        setShapes((prev) => [...prev, newShape])
        setSelectedObjects([newShape])
        setActiveObject(newShape)
      }

      setPencilPath([])
    }

    setIsDrawing(false)
    setIsDragging(false)
    setStartPos(null)
    setCurrentPos(null)
    setDragOffset(null)
  }

  // Select all shapes
  const selectAll = () => {
    setSelectedObjects([...shapes])
    if (shapes.length > 0) {
      setActiveObject(shapes[0])
    }
  }

  // Update shape position
  const updateShapePosition = (shapeId: string, deltaX: number, deltaY: number, isRelative = false) => {
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id === shapeId) {
          const updatedShape = { ...shape }

          switch (shape.type) {
            case "rectangle":
            case "wall":
            case "circle":
              if (isRelative) {
                updatedShape.x = shape.x + deltaX
                updatedShape.y = shape.y + deltaY
              } else {
                updatedShape.x = deltaX
                updatedShape.y = deltaY
              }
              break
            case "line":
              if (isRelative) {
                updatedShape.x1 = shape.x1 + deltaX
                updatedShape.y1 = shape.y1 + deltaY
                updatedShape.x2 = shape.x2 + deltaX
                updatedShape.y2 = shape.y2 + deltaY
              } else {
                const currentDeltaX = deltaX - Math.min(shape.x1, shape.x2)
                const currentDeltaY = deltaY - Math.min(shape.y1, shape.y2)
                updatedShape.x1 = shape.x1 + currentDeltaX
                updatedShape.y1 = shape.y1 + currentDeltaY
                updatedShape.x2 = shape.x2 + currentDeltaX
                updatedShape.y2 = shape.y2 + currentDeltaY
              }
              break
            case "pencil":
              if (isRelative && shape.path) {
                updatedShape.path = shape.path.map((point: any) => ({
                  x: point.x + deltaX,
                  y: point.y + deltaY,
                }))
              }
              break
          }

          return updatedShape
        }
        return shape
      }),
    )
  }

  // Check if point is inside shape
  const isPointInShape = (x: number, y: number, shape: any): boolean => {
    switch (shape.type) {
      case "rectangle":
      case "wall":
        return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
      case "circle":
        const dx = x - (shape.x + shape.radius)
        const dy = y - (shape.y + shape.radius)
        return dx * dx + dy * dy <= shape.radius * shape.radius
      case "line":
        const dist = distanceToLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2)
        return dist <= 8
      case "pencil":
        if (!shape.path || shape.path.length === 0) return false
        return shape.path.some((point: any, index: number) => {
          if (index === 0) return false
          const prevPoint = shape.path[index - 1]
          return distanceToLine(x, y, prevPoint.x, prevPoint.y, point.x, point.y) <= 8
        })
      default:
        return false
    }
  }

  // Distance from point to line
  const distanceToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D

    if (lenSq === 0) return Math.sqrt(A * A + B * B)

    const param = dot / lenSq

    let xx, yy
    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = px - xx
    const dy = py - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Create shape based on tool and coordinates
  const createShape = (tool: string, x1: number, y1: number, x2: number, y2: number) => {
    const id = crypto.randomUUID()

    switch (tool) {
      case "rectangle":
        return {
          id,
          type: "rectangle",
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
          stroke: "#333",
          fill: "transparent",
          strokeWidth: 2,
        }
      case "circle":
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        return {
          id,
          type: "circle",
          x: x1 - radius,
          y: y1 - radius,
          radius,
          stroke: "#333",
          fill: "transparent",
          strokeWidth: 2,
        }
      case "line":
        return {
          id,
          type: "line",
          x1,
          y1,
          x2,
          y2,
          stroke: "#333",
          strokeWidth: 2,
        }
      case "wall":
        const width = Math.abs(x2 - x1)
        const height = Math.abs(y2 - y1)
        const finalHeight = height < 10 ? 10 : height

        return {
          id,
          type: "wall",
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width,
          height: finalHeight,
          stroke: "#333",
          fill: "#555",
          strokeWidth: 1,
        }
      default:
        return null
    }
  }

  // Add predefined shape
  const addShape = (type: string) => {
    const newShape = createShape(type, 100, 100, 200, 150)
    if (newShape) {
      setShapes((prev) => [...prev, newShape])
      setSelectedObjects([newShape])
      setActiveObject(newShape)
    }
  }

  // Delete selected shapes
  const deleteSelected = () => {
    if (selectedObjects.length > 0) {
      const selectedIds = selectedObjects.map((obj) => obj.id)
      setShapes((prev) => prev.filter((shape) => !selectedIds.includes(shape.id)))
      setSelectedObjects([])
      setActiveObject(null)
    }
  }

  // Update active object
  const updateActiveObject = (updates: any) => {
    if (!activeObject) return

    setShapes((prev) => prev.map((shape) => (shape.id === activeObject.id ? { ...shape, ...updates } : shape)))
    setActiveObject((prev) => ({ ...prev, ...updates }))

    // Update selected objects as well
    setSelectedObjects((prev) => prev.map((obj) => (obj.id === activeObject.id ? { ...obj, ...updates } : obj)))
  }

  // Add custom annotation
  const addCustomAnnotation = (x: number, y: number, text: string) => {
    const newAnnotation = {
      id: crypto.randomUUID(),
      text,
      x,
      y,
      type: "custom",
    }
    setAnnotations((prev) => [...prev, newAnnotation])
  }

  // Update annotations when shapes change
  useEffect(() => {
    updateAnnotations()
  }, [shapes])

  // Redraw when anything changes
  useEffect(() => {
    redrawCanvas()
  }, [shapes, annotations, showAnnotations, selectedObjects, isDrawing, currentPos, isSelecting, selectionBox])

  // Save drawing
  const handleSave = async () => {
    try {
      await saveDrawing({
        name: drawingName,
        json: { shapes, annotations },
        thumbnail: canvasRef.current?.toDataURL() || "",
        lastModified: new Date().toISOString(),
      })
      alert("Drawing saved successfully!")
    } catch (error) {
      console.error("Error saving drawing:", error)
      alert("Failed to save drawing")
    }
  }

  // Load drawing
  const handleLoad = async () => {
    try {
      setIsLoading(true)
      const drawing = await loadDrawing()

      if (drawing && drawing.json) {
        setShapes(drawing.json.shapes || [])
        setAnnotations(drawing.json.annotations || [])
        setDrawingName(drawing.name)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading drawing:", error)
      alert("Failed to load drawing")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        addShape={addShape}
        deleteSelected={deleteSelected}
        selectAll={selectAll}
        showAnnotations={showAnnotations}
        setShowAnnotations={setShowAnnotations}
        selectedCount={selectedObjects.length}
        addCustomAnnotation={addCustomAnnotation}
      />

      {/* Canvas container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}

        <div className="p-4 bg-gray-100 flex items-center justify-between">
          <input
            type="text"
            value={drawingName}
            onChange={(e) => setDrawingName(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">
              {selectedObjects.length > 0 && `${selectedObjects.length} selected`}
            </span>
            <Button onClick={handleLoad} variant="outline">
              Load
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-1">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            id="building-canvas"
            className="border"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>

      {/* Properties panel */}
      {activeObject && <PropertiesPanel activeObject={activeObject} updateActiveObject={updateActiveObject} />}
    </div>
  )
}
