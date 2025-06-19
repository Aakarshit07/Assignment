// Type definitions for drawing data
export interface DrawingData {
  name: string
  json: any
  thumbnail: string
  lastModified: string
}

// Save drawing to localStorage
export async function saveDrawing(drawing: DrawingData): Promise<void> {
  try {
    // Save to localStorage
    localStorage.setItem("building-planner-drawing", JSON.stringify(drawing))

    // In a real application, this would save to a database
    return Promise.resolve()
  } catch (error) {
    console.error("Error saving drawing:", error)
    return Promise.reject(error)
  }
}

// Load drawing from localStorage
export async function loadDrawing(): Promise<DrawingData | null> {
  try {
    // Load from localStorage
    const savedDrawing = localStorage.getItem("building-planner-drawing")

    if (savedDrawing) {
      return Promise.resolve(JSON.parse(savedDrawing))
    }

    return Promise.resolve(null)
  } catch (error) {
    console.error("Error loading drawing:", error)
    return Promise.reject(error)
  }
}

// List all saved drawings (in a real app, this would fetch from a database)
export async function listDrawings(): Promise<DrawingData[]> {
  try {
    const savedDrawing = localStorage.getItem("building-planner-drawing")

    if (savedDrawing) {
      return Promise.resolve([JSON.parse(savedDrawing)])
    }

    return Promise.resolve([])
  } catch (error) {
    console.error("Error listing drawings:", error)
    return Promise.reject(error)
  }
}
