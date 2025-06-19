"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MousePointer,
  Square,
  CircleIcon,
  Minus,
  Eye,
  EyeOff,
  Trash2,
  AlignJustify,
  Pencil,
  MousePointer2,
  MessageSquare,
} from "lucide-react"

interface ToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
  addShape: (type: string) => void
  deleteSelected: () => void
  selectAll: () => void
  showAnnotations: boolean
  setShowAnnotations: (show: boolean) => void
  selectedCount: number
  addCustomAnnotation: (x: number, y: number, text: string) => void
}

export default function Toolbar({
  activeTool,
  setActiveTool,
  addShape,
  deleteSelected,
  selectAll,
  showAnnotations,
  setShowAnnotations,
  selectedCount,
  addCustomAnnotation,
}: ToolbarProps) {
  return (
    <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 gap-2">
      <TooltipProvider>
        {/* Select tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "select" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("select")}
            >
              <MousePointer className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Select & Move (S)</p>
          </TooltipContent>
        </Tooltip>

        {/* Select All */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={selectAll}>
              <MousePointer2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Select All (Ctrl+A)</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-10 h-px bg-gray-300 my-2" />

        {/* Pencil tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "pencil" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("pencil")}
            >
              <Pencil className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Pencil/Freehand (P)</p>
          </TooltipContent>
        </Tooltip>

        {/* Rectangle tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "rectangle" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("rectangle")}
            >
              <Square className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Rectangle (R)</p>
          </TooltipContent>
        </Tooltip>

        {/* Circle tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "circle" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("circle")}
            >
              <CircleIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Circle (C)</p>
          </TooltipContent>
        </Tooltip>

        {/* Line tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "line" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("line")}
            >
              <Minus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Line (L)</p>
          </TooltipContent>
        </Tooltip>

        {/* Wall tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "wall" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("wall")}
            >
              <AlignJustify className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Wall (W)</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-10 h-px bg-gray-300 my-2" />

        {/* Annotation tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === "annotation" ? "default" : "ghost"}
              size="icon"
              onClick={() => setActiveTool("annotation")}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Annotation (A)</p>
          </TooltipContent>
        </Tooltip>

        {/* View tool (toggle annotations) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setShowAnnotations(!showAnnotations)}>
              {showAnnotations ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Toggle Annotations (V)</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-10 h-px bg-gray-300 my-2" />

        {/* Delete tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={deleteSelected}
              disabled={selectedCount === 0}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 disabled:text-gray-400"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Delete Selected (Del) {selectedCount > 0 && `(${selectedCount})`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
