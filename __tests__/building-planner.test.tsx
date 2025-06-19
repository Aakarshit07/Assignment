import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import BuildingPlanner from "@/components/building-planner"
import jest from "jest" // Declare the jest variable

// Mock the storage module
jest.mock("@/lib/storage", () => ({
  saveDrawing: jest.fn().mockResolvedValue(undefined),
  loadDrawing: jest.fn().mockResolvedValue({
    name: "Test Drawing",
    json: {},
    thumbnail: "data:image/png;base64,test",
    lastModified: "2023-01-01T00:00:00.000Z",
  }),
}))

// Mock the annotations module
jest.mock("@/lib/annotations", () => ({
  addAnnotation: jest.fn(),
  toggleAnnotations: jest.fn(),
}))

describe("BuildingPlanner Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  test("renders the building planner component", () => {
    render(<BuildingPlanner />)

    // Check if the canvas element is rendered
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument()
  })

  test("allows changing the drawing name", () => {
    render(<BuildingPlanner />)

    const nameInput = screen.getByDisplayValue("My Building Plan")
    fireEvent.change(nameInput, { target: { value: "New Plan Name" } })

    expect(screen.getByDisplayValue("New Plan Name")).toBeInTheDocument()
  })

  // More tests would be added here for:
  // - Testing tool selection
  // - Testing shape creation
  // - Testing object selection and manipulation
  // - Testing save/load functionality
  // - Testing annotation toggling
})
