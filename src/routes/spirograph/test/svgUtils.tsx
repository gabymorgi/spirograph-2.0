import { PathChunk } from "@/utils/types"

interface SVGCirlceProps {
  type: 'circle'
  cx: number
  cy: number
  r: number
  fill: string
}

interface SVGLineProps {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  stroke: string
  strokeWidth: number
}

export type SVGElementProps = SVGCirlceProps | SVGLineProps

interface SVGPathOptions {
  cpColor?: string
  pointColor?: string
}
export function generateSVGElements(commands: PathChunk[], options?: SVGPathOptions): SVGElementProps[] {
  const segmentsLength: [number[], number[]] = [[], []]
  const svgElements: SVGElementProps[] = []
  let currentPoint = { x: 0, y: 0 } // Mantener la posición actual

  commands.forEach(({ command, points }, index) => {
    if (command === 'M') {
      // Movimiento absoluto
      currentPoint = { x: points[0].x, y: points[0].y }
    } else if (command === 'C') {
      // Curvas de Bézier absolutas
        const control1 = { x: points[0].x, y: points[0].y }
        const control2 = { x: points[1].x, y: points[1].y }
        const endPoint = { x: points[2].x, y: points[2].y }

        // Línea desde el punto actual al primer punto de control
        svgElements.push({
          type: 'line',
          x1: currentPoint.x,
          y1: currentPoint.y,
          x2: control1.x,
          y2: control1.y,
          stroke: options?.cpColor || '#ff0',
          strokeWidth: 0.01,
        })

        // Línea desde el punto final al segundo punto de control
        svgElements.push({
          type: 'line',
          x1: endPoint.x,
          y1: endPoint.y,
          x2: control2.x,
          y2: control2.y,
          stroke: options?.cpColor || '#ff0',
          strokeWidth: 0.01,
        })

        const seg1 = Math.sqrt(
          Math.pow(control1.x - currentPoint.x, 2) +
            Math.pow(control1.y - currentPoint.y, 2),
        )
        const seg2 = Math.sqrt(
          Math.pow(endPoint.x - control2.x, 2) +
            Math.pow(endPoint.y - control2.y, 2),
        )
        if (index % 2 === 0) {
          segmentsLength[0].push(seg1)
          segmentsLength[1].push(seg2)
        } else {
          segmentsLength[1].push(seg1)
          segmentsLength[0].push(seg2)
        }

        // Punto para los controles y el final
        svgElements.push({
          type: 'circle',
          cx: control1.x,
          cy: control1.y,
          r: 0.02,
          fill: options?.cpColor || '#ff0',
        })
        svgElements.push({
          type: 'circle',
          cx: control2.x,
          cy: control2.y,
          r: 0.02,
          fill: options?.cpColor || '#ff0',
        })
        svgElements.push({
          type: 'circle',
          cx: endPoint.x,
          cy: endPoint.y,
          r: 0.02,
          fill: options?.pointColor || '#f00',
        })

        currentPoint = endPoint // Actualizar la posición
    } else if (command === 'Z') {

    }
  })

  return svgElements
}