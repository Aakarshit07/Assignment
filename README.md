# Building Planner

A web application that allows users to select, draw, and annotate building plans.

## Features

- **Drawing Tools**: Create lines, rectangles, circles, and walls
- **Selection Tool**: Move, resize, and delete shapes
- **Annotation Tool**: Automatically display dimensions of shapes
- **View Tool**: Toggle visibility of annotations
- **Save/Load**: Store and retrieve building plans

## Tech Stack

- **Frontend Framework**: Next.js with React
- **Canvas Library**: Fabric.js
- **Styling**: Tailwind CSS with shadcn/ui components
- **Storage**: Local storage (can be extended to use a database)

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/building-planner.git
   cd building-planner
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Drawing Tools

- **Select Tool**: Click on objects to select them. Drag to move, use handles to resize.
- **Rectangle Tool**: Click to add a rectangle to the canvas.
- **Circle Tool**: Click to add a circle to the canvas.
- **Line Tool**: Click to add a line to the canvas.
- **Wall Tool**: Click to add a wall to the canvas.

### Annotations

- Annotations showing dimensions are automatically added to each shape.
- Use the View Tool (eye icon) to toggle visibility of annotations.

### Properties Panel

- When an object is selected, the properties panel appears on the right.
- Modify position, dimensions, rotation, stroke width, and colors.

### Saving and Loading

- Enter a name for your drawing and click "Save" to store it.
- Click "Load" to retrieve your saved drawing.

## Database Model

The application uses a simple data model to store drawings:

\`\`\`typescript
interface DrawingData {
  name: string;         // Name of the drawing
  json: any;            // Serialized canvas data (Fabric.js JSON)
  thumbnail: string;    // Base64 encoded thumbnail image
  lastModified: string; // ISO timestamp of last modification
}
\`\`\`

In a production environment, this would be stored in a database like MongoDB or PostgreSQL.

## Architecture

The application follows a component-based architecture:

- **BuildingPlanner**: Main component that initializes the canvas and manages state
- **Toolbar**: Contains drawing tools and actions
- **PropertiesPanel**: Displays and allows editing of selected object properties
- **ColorPicker**: Custom component for selecting colors
- **Annotations**: Utility functions for managing annotations
- **Storage**: Utility functions for saving and loading drawings

## Screenshots

![Building Planner Interface](/placeholder.svg?height=400&width=800&query=Building%20Planner%20Interface%20with%20toolbar%20and%20canvas)

![Annotations Example](/placeholder.svg?height=400&width=800&query=Building%20Plan%20with%20dimensions%20and%20annotations)

## Testing

Run the test suite with:

\`\`\`bash
npm test
# or
yarn test
\`\`\`

## Future Improvements

- Add user authentication
- Implement cloud storage for drawings
- Add collaboration features
- Support for more complex shapes and tools
- Export to PDF or CAD formats

## License

This project is licensed under the MIT License - see the LICENSE file for details.
