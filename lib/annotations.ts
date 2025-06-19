// Simple annotation functions for the native canvas implementation
export function addAnnotation(canvas: any, obj: any) {
  // Annotations are now handled directly in the drawing function
  return null
}

export function toggleAnnotations(canvas: any, show: boolean) {
  // Handled by the showAnnotations state in the main component
  return null
}

export function updateAnnotationPosition(canvas: any, obj: any) {
  // Handled automatically during redraw
  return null
}
