import SpiroCanvas, { SpiroCanvasHandle } from '../SpiroCanvas'
import { useState, useRef } from 'react'
import { Interpolation, SpiroAnimationSettings } from '@/utils/types'
import AnimationControlForm from './ControlForm'
import ShapeSettingsForm from './ShapeSettingsForm'
import VisualSettingsForm from './VisualSettingsForm'
import { getIncrementalId } from '@/utils/constants'

const initialSpiro: SpiroAnimationSettings = {
  id: getIncrementalId(),
  name: 'My Spiro',
  movingRadius: 504,
  pointDistance: 1512,
  interpolation: Interpolation.Derivative,
  stepPerLap: 44,
  strokeWidth: 10,
  color: '#ffffff',
  backgroundColor: '#00000000',
  msPerLap: 1000,
}

function EditingSpiro() {
  const spiroRef = useRef<SpiroCanvasHandle>(null)
  const [spiro, setSpiro] = useState<SpiroAnimationSettings>(initialSpiro)

  function handleEdit(partialSpiro: Partial<SpiroAnimationSettings>) {
    const newSpiro = { ...spiro, ...partialSpiro, id: getIncrementalId() }
    setSpiro(newSpiro)
    console.log('edit id', partialSpiro)
  }

  return (
    <div className="flex gap-16">
      <div className="flex gap-16">
        <ShapeSettingsForm spiro={spiro} onEdit={handleEdit} />
        <VisualSettingsForm spiro={spiro} onEdit={handleEdit} />
      </div>
      <div className="flex-grow">
        <AnimationControlForm
          spiroRef={spiroRef}
          spiro={spiro}
          onEdit={handleEdit}
        />
        <SpiroCanvas ref={spiroRef} {...spiro} />
      </div>
    </div>
  )
}

export default EditingSpiro
