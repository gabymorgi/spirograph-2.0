import { generateSVGElements } from '../svgUtils'
import { pathChunksToString } from '@/utils/canvasUtils'
import { useMemo, useState } from 'react'
import { getKeyPoints, getPath, getSpiroParams, getSpiroTransition } from '@/utils/functions'
import { PathChunk, SpiroParams } from '@/utils/types'
import { lerp } from '../../fn'

const stepAmount = 20


function SpiroAnim() {
  const [step, setStep] = useState(0)

  function handleChangeStep(diff: number) {
    const newStep = step + diff
    if (newStep < 0) return
    if (newStep > stepAmount) return
    setStep(step + diff)
  }

  const trans = useMemo(() => {
    const pre = [7, 6, 0.5]
    const post = [5, 1, 0.5]
    const preParams = getSpiroParams(pre[0], pre[1], pre[2])
    const postParams = getSpiroParams(post[0], post[1], post[2])
    
    // console.log({ preParams, postParams })
    const path = getSpiroTransition(preParams, postParams, 1 / stepAmount * step)
    return {
      path: path,
      el: generateSVGElements(path)
    }
  }, [step])


  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => handleChangeStep(-1)}>Prev</button>
        <button onClick={() => handleChangeStep(+1)}>Next</button>
      </div>
      {/* <SpriroInner p={p} l={l} d={d} /> */}
      {/* {trans.map((v, i) => ( */}
        <svg
          // key={i}
          height={600}
          width={600}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={"-1.1 -1.1 2.2 2.2"}
          style={{ position: 'relative', top: 0, left: 0 }}
        >
          {trans.el.map((element, index) => {
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
            d={pathChunksToString(trans.path)}
            fill="none"
            stroke="#0f0"
            strokeWidth="0.02"
          />
        </svg>
      {/* ))} */}
    </div>
  )
}

export default SpiroAnim
