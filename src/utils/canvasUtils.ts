interface Options {
  color?: string;
  fill?: boolean;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const drawRectangle = (
  context: CanvasRenderingContext2D,
  rect: Rectangle,
  options?: Options
) => {
  if (options?.fill) {
    context.fillStyle = options.color || 'red';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  } else {
    context.strokeStyle = options?.color || 'red';
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
};

export const drawCircle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  options?: Options
) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  if (options?.fill) {
    context.fillStyle = options.color || 'red';
    context.fill();
  } else {
    context.strokeStyle = options?.color || 'red';
    context.stroke();
  }
}

export const drawParabola = (context: CanvasRenderingContext2D) => {
  // Establecer el rango y el paso para los valores de x
  const xStart = -50;
  const xEnd = 50;
  const xStep = 1;

  // Establecer una escala y una traslación para ajustar la parábola al canvas
  const scaleX = 5;
  const scaleY = 0.1;
  const offsetX = 250;
  const offsetY = 250;

  context.beginPath();
  for (let x = xStart; x <= xEnd; x += xStep) {
    const y = x * x;

    // Convertir las coordenadas de la parábola a las coordenadas del canvas
    const canvasX = x * scaleX + offsetX;
    const canvasY = y * scaleY + offsetY;

    if (x === xStart) {
      context.moveTo(canvasX, canvasY);
    } else {
      context.lineTo(canvasX, canvasY);
    }
  }

  context.strokeStyle = 'black';
  context.stroke();
};

export const drawQuadraticBezier = (context: CanvasRenderingContext2D) => {
  context.beginPath();
  context.moveTo(50, 200);
  context.quadraticCurveTo(200, 100, 350, 200);
  context.strokeStyle = 'black';
  context.stroke();

  // Dibujar puntos de control y líneas auxiliares
  context.fillStyle = 'red';
  context.fillRect(200 - 3, 100 - 3, 6, 6);
  context.strokeStyle = 'gray';
  context.beginPath();
  context.moveTo(50, 200);
  context.lineTo(200, 100);
  context.lineTo(350, 200);
  context.stroke();
};