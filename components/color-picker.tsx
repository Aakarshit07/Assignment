"use client"

import type React from "react"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  id: string
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ id, color, onChange }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value)
    onChange(e.target.value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full h-8 flex items-center justify-between">
          <span>{color === "transparent" ? "None" : color}</span>
          <div
            className="w-4 h-4 rounded border border-gray-300"
            style={{
              backgroundColor: color === "transparent" ? "white" : color,
              backgroundImage:
                color === "transparent"
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                  : "none",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 4px 4px",
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Input
                id={id}
                type="color"
                value={inputColor === "transparent" ? "#ffffff" : inputColor}
                onChange={handleColorChange}
                className="w-full h-8"
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              "#000000",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
              "#FF00FF",
              "#00FFFF",
              "#FFFFFF",
              "#888888",
              "transparent",
            ].map((presetColor) => (
              <button
                key={presetColor}
                className="w-8 h-8 rounded border border-gray-300"
                style={{
                  backgroundColor: presetColor === "transparent" ? "white" : presetColor,
                  backgroundImage:
                    presetColor === "transparent"
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                      : "none",
                  backgroundSize: "8px 8px",
                  backgroundPosition: "0 0, 4px 4px",
                }}
                onClick={() => {
                  setInputColor(presetColor)
                  onChange(presetColor)
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
