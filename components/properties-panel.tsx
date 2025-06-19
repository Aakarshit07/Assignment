"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "./color-picker"

interface PropertiesPanelProps {
  activeObject: any
  updateActiveObject: (updates: any) => void
}

export default function PropertiesPanel({ activeObject, updateActiveObject }: PropertiesPanelProps) {
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)
  const [strokeWidth, setStrokeWidth] = useState<number>(1)
  const [strokeColor, setStrokeColor] = useState<string>("#000000")
  const [fillColor, setFillColor] = useState<string>("transparent")

  // Update state when active object changes
  useEffect(() => {
    if (!activeObject) return

    setX(Math.round(activeObject.x || activeObject.x1 || 0))
    setY(Math.round(activeObject.y || activeObject.y1 || 0))
    setStrokeWidth(activeObject.strokeWidth || 1)
    setStrokeColor(activeObject.stroke || "#000000")
    setFillColor(activeObject.fill || "transparent")

    if (activeObject.type === "rectangle" || activeObject.type === "wall") {
      setWidth(Math.round(activeObject.width || 0))
      setHeight(Math.round(activeObject.height || 0))
    } else if (activeObject.type === "circle") {
      const diameter = (activeObject.radius || 0) * 2
      setWidth(Math.round(diameter))
      setHeight(Math.round(diameter))
    } else if (activeObject.type === "line") {
      setWidth(Math.round(Math.abs(activeObject.x2 - activeObject.x1)))
      setHeight(Math.round(Math.abs(activeObject.y2 - activeObject.y1)))
    }
  }, [activeObject])

  // Update object properties
  const updateObject = () => {
    if (!activeObject) return

    const updates: any = {
      strokeWidth,
      stroke: strokeColor,
      fill: fillColor,
    }

    if (activeObject.type === "rectangle" || activeObject.type === "wall") {
      updates.x = x
      updates.y = y
      updates.width = width
      updates.height = height
    } else if (activeObject.type === "circle") {
      updates.x = x
      updates.y = y
      updates.radius = width / 2
    } else if (activeObject.type === "line") {
      updates.x1 = x
      updates.y1 = y
      updates.x2 = x + width
      updates.y2 = y + height
    }

    updateActiveObject(updates)
  }

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-medium text-lg mb-4 capitalize">{activeObject.type} Properties</h3>

      <div className="space-y-4">
        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="x">X Position</Label>
            <Input
              id="x"
              type="number"
              value={x}
              onChange={(e) => {
                setX(Number(e.target.value))
                updateObject()
              }}
            />
          </div>
          <div>
            <Label htmlFor="y">Y Position</Label>
            <Input
              id="y"
              type="number"
              value={y}
              onChange={(e) => {
                setY(Number(e.target.value))
                updateObject()
              }}
            />
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => {
                setWidth(Number(e.target.value))
                updateObject()
              }}
            />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value))
                updateObject()
              }}
            />
          </div>
        </div>

        {/* Stroke width */}
        <div>
          <Label htmlFor="strokeWidth">Stroke Width ({strokeWidth}px)</Label>
          <Slider
            id="strokeWidth"
            min={1}
            max={10}
            step={1}
            value={[strokeWidth]}
            onValueChange={(value) => {
              setStrokeWidth(value[0])
              updateObject()
            }}
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="strokeColor">Stroke Color</Label>
            <ColorPicker
              id="strokeColor"
              color={strokeColor}
              onChange={(color) => {
                setStrokeColor(color)
                updateObject()
              }}
            />
          </div>
          <div>
            <Label htmlFor="fillColor">Fill Color</Label>
            <ColorPicker
              id="fillColor"
              color={fillColor}
              onChange={(color) => {
                setFillColor(color)
                updateObject()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
