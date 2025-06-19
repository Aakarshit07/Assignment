import { type NextRequest, NextResponse } from "next/server"

// In a real application, this would connect to a database
// For now, we'll use a simple in-memory store
const drawings: any[] = []

export async function GET(request: NextRequest) {
  // Get query parameters
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (id) {
    // Return a specific drawing
    const drawing = drawings.find((d) => d.id === id)

    if (!drawing) {
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 })
    }

    return NextResponse.json(drawing)
  }

  // Return all drawings
  return NextResponse.json(drawings)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.json) {
      return NextResponse.json({ error: "Missing required fields: name and json" }, { status: 400 })
    }

    // Create a new drawing with ID
    const newDrawing = {
      id: crypto.randomUUID(),
      name: body.name,
      json: body.json,
      thumbnail: body.thumbnail || "",
      lastModified: new Date().toISOString(),
    }

    // Add to our "database"
    drawings.push(newDrawing)

    return NextResponse.json(newDrawing, { status: 201 })
  } catch (error) {
    console.error("Error creating drawing:", error)
    return NextResponse.json({ error: "Failed to create drawing" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.id || !body.name || !body.json) {
      return NextResponse.json({ error: "Missing required fields: id, name and json" }, { status: 400 })
    }

    // Find the drawing
    const index = drawings.findIndex((d) => d.id === body.id)

    if (index === -1) {
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 })
    }

    // Update the drawing
    drawings[index] = {
      ...drawings[index],
      name: body.name,
      json: body.json,
      thumbnail: body.thumbnail || drawings[index].thumbnail,
      lastModified: new Date().toISOString(),
    }

    return NextResponse.json(drawings[index])
  } catch (error) {
    console.error("Error updating drawing:", error)
    return NextResponse.json({ error: "Failed to update drawing" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Get query parameters
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 })
  }

  // Find the drawing
  const index = drawings.findIndex((d) => d.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Drawing not found" }, { status: 404 })
  }

  // Remove the drawing
  drawings.splice(index, 1)

  return NextResponse.json({ success: true })
}
