import { useState } from 'react'
import Canvas from './components/Canvas'
import { drawParabola, drawQuadraticBezier, drawRectangle } from './utils/canvasUtils';

function App() {

  const draw = (context: CanvasRenderingContext2D) => {
    drawParabola(context)
    drawQuadraticBezier(context)
  };

  return (
    <>
      <Canvas draw={draw} width={500} height={500} />
    </>
  )
}

export default App
