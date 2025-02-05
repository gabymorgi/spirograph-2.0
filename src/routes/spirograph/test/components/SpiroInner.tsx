import { pathChunksToString } from '@/utils/canvasUtils'
import { getAwesomeSpiro } from '@/utils/functions'
import { generateSVGElements } from '../svgUtils'

interface Props {
  l: number
  p: number
  d: number
  viewBox?: string
  showControls?: boolean
}

function SpriroInner(props: Props) {
  const awesomeSpiro = getAwesomeSpiro(props.l, props.p, props.d)
  const divisor = awesomeSpiro[0].points[0].x
  const norm = awesomeSpiro.map((v) => ({ 
    points: v.points.map((p) => ({ x: p.x / divisor, y: p.y / divisor })),
    command: v.command
  }))

  const awesomeElements = generateSVGElements(norm)

  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={props.viewBox || "-1.1 -1.1 2.2 2.2"}>
        {props.showControls ?? awesomeElements.map((element, index) => {
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
          strokeWidth="0.02"
        />
      </svg>
  )
}

export default SpriroInner
