import { render, screen, fireEvent } from "@testing-library/react"
import { jest } from "@jest/globals"
import "@testing-library/jest-dom"
import Toolbar from "@/components/toolbar"

describe("Toolbar Component", () => {
  const mockSetActiveTool = jest.fn()
  const mockAddShape = jest.fn()
  const mockDeleteSelected = jest.fn()

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  test("renders all tool buttons", () => {
    render(
      <Toolbar
        activeTool="select"
        setActiveTool={mockSetActiveTool}
        addShape={mockAddShape}
        deleteSelected={mockDeleteSelected}
        showAnnotations={true}
      />,
    )

    // Check if all tool buttons are rendered
    expect(screen.getByRole("button", { name: /select/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /rectangle/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /circle/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /line/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /wall/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /toggle annotations/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /delete selected/i })).toBeInTheDocument()
  })

  test("calls setActiveTool when select tool is clicked", () => {
    render(
      <Toolbar
        activeTool="rectangle"
        setActiveTool={mockSetActiveTool}
        addShape={mockAddShape}
        deleteSelected={mockDeleteSelected}
        showAnnotations={true}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /select/i }))
    expect(mockSetActiveTool).toHaveBeenCalledWith("select")
  })

  test("calls both setActiveTool and addShape when rectangle tool is clicked", () => {
    render(
      <Toolbar
        activeTool="select"
        setActiveTool={mockSetActiveTool}
        addShape={mockAddShape}
        deleteSelected={mockDeleteSelected}
        showAnnotations={true}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /rectangle/i }))
    expect(mockSetActiveTool).toHaveBeenCalledWith("rectangle")
    expect(mockAddShape).toHaveBeenCalledWith("rectangle")
  })

  test("calls deleteSelected when delete button is clicked", () => {
    render(
      <Toolbar
        activeTool="select"
        setActiveTool={mockSetActiveTool}
        addShape={mockAddShape}
        deleteSelected={mockDeleteSelected}
        showAnnotations={true}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /delete selected/i }))
    expect(mockDeleteSelected).toHaveBeenCalled()
  })

  test('calls setActiveTool with "view" when view tool is clicked', () => {
    render(
      <Toolbar
        activeTool="select"
        setActiveTool={mockSetActiveTool}
        addShape={mockAddShape}
        deleteSelected={mockDeleteSelected}
        showAnnotations={true}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /toggle annotations/i }))
    expect(mockSetActiveTool).toHaveBeenCalledWith("view")
  })
})
