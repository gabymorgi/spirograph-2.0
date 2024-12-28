import { pathChunksToString } from '@/utils/canvasUtils'
import { getAwesomeSpiro } from '@/utils/functions'
import { PathChunk } from '@/utils/types'

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

type SVGElementProps = SVGCirlceProps | SVGLineProps

function generateSVGElements(commands: PathChunk[]) {
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
          stroke: '#ff0',
          strokeWidth: 0.2,
        })

        // Línea desde el punto final al segundo punto de control
        svgElements.push({
          type: 'line',
          x1: endPoint.x,
          y1: endPoint.y,
          x2: control2.x,
          y2: control2.y,
          stroke: '#ff0',
          strokeWidth: 0.2,
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
          r: 0.5,
          fill: '#ff0',
        })
        svgElements.push({
          type: 'circle',
          cx: control2.x,
          cy: control2.y,
          r: 0.5,
          fill: '#ff0',
        })
        svgElements.push({
          type: 'circle',
          cx: endPoint.x,
          cy: endPoint.y,
          r: 0.5,
          fill: '#f00',
        })

        currentPoint = endPoint // Actualizar la posición
    } else if (command === 'Z') {

    }
  })

  return svgElements
}

interface Props {
  l: number
  p: number
  c: number
}

function Sprirograph(props: Props) {
  const awesomeSpiro = getAwesomeSpiro(props.l, props.p, props.c)
  const divisor = awesomeSpiro[0].points[0].x / 18
  const norm = awesomeSpiro.map((v) => ({ 
    points: v.points.map((p) => ({ x: p.x / divisor, y: p.y / divisor })),
    command: v.command
  }))

  const awesomeElements = generateSVGElements(norm)

  return (
    <div className="flex flex-col gap-16 p-16">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-25 -25 50 50">
        {awesomeElements.map((element, index) => {
          if (element.type === 'circle') {
            const { cx, cy, r, fill } = element
            return <circle key={index} cx={cx} cy={cy} r={r} fill={fill} />
          } else if (element.type === 'line') {
            const { x1, y1, x2, y2, stroke, strokeWidth } = element
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            )
          }
        })}
        <path
          d={pathChunksToString(norm)}
          fill="none"
          stroke="#f00"
          strokeWidth="0.2"
        />
      </svg>
    </div>
  )
}

export default Sprirograph
