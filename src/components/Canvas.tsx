// src/Canvas.tsx
import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  draw: (context: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ draw, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
