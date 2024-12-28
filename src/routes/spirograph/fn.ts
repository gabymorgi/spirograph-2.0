// Función que transforma una línea para centrarla en el origen y rotarla sobre el eje Y
export function transformLineToYAxis(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  // Calcula el centro de la línea
  const centerX = (x1 + x2) / 2
  const centerY = (y1 + y2) / 2

  // Calcula el desplazamiento para centrar la línea en el origen
  const translatedX1 = x1 - centerX
  const translatedY1 = y1 - centerY
  const translatedX2 = x2 - centerX
  const translatedY2 = y2 - centerY

  // Calcula la longitud de la línea
  const length = Math.sqrt(
    Math.pow(translatedX2 - translatedX1, 2) +
      Math.pow(translatedY2 - translatedY1, 2),
  )

  // Calcula el ángulo de la línea con respecto al eje Y
  const angle = Math.atan2(
    translatedX2 - translatedX1,
    translatedY2 - translatedY1,
  )

  // Rota la línea hasta que esté sobre el eje Y
  const rotatedX1 = 0
  const rotatedY1 = -length / 2
  const rotatedX2 = 0
  const rotatedY2 = length / 2

  // Devuelve la nueva línea
  return {
    x1: rotatedX1,
    y1: rotatedY1,
    x2: rotatedX2,
    y2: rotatedY2,
  }
}
