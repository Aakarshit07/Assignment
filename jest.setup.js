import jest from "jest"
import "@testing-library/jest-dom"

// Mock fabric.js for testing
jest.mock("fabric", () => ({
  default: {
    Canvas: jest.fn(() => ({
      add: jest.fn(),
      remove: jest.fn(),
      renderAll: jest.fn(),
      setActiveObject: jest.fn(),
      getActiveObject: jest.fn(),
      on: jest.fn(),
      setDimensions: jest.fn(),
      loadFromJSON: jest.fn(),
      toJSON: jest.fn(),
      toDataURL: jest.fn(),
      getObjects: jest.fn().mockReturnValue([]),
      dispose: jest.fn(),
      isDrawingMode: false,
      selection: true,
      forEachObject: jest.fn(),
    })),
    Rect: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      data: {},
      left: 0,
      top: 0,
      width: 100,
      height: 50,
      type: "rect",
    })),
    Circle: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      data: {},
      left: 0,
      top: 0,
      radius: 50,
      type: "circle",
    })),
    Line: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      data: {},
      left: 0,
      top: 0,
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 0,
      type: "line",
    })),
    Text: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      data: {},
      left: 0,
      top: 0,
      type: "text",
    })),
    Object: class FabricObject {
      constructor() {
        this.data = {}
        this.left = 0
        this.top = 0
        this.type = "object"
      }
      set() {
        return this
      }
      get() {
        return undefined
      }
    },
  },
}))

// Mock UUID
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-123"),
}))
