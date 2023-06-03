import SpiroCanvas, { SpiroCanvasHandle } from '../SpiroCanvas'
import { useState, useRef } from 'react'
import { Interpolation, SpiroAnimationSettings } from '@/utils/types'
import AnimationControlForm from './ControlForm'
import ShapeSettingsForm from './ShapeSettingsForm'
import VisualSettingsForm from './VisualSettingsForm'
import { getIncrementalId } from '@/utils/constants'
import { getUniqueSpirographName } from '@/utils/canvasUtils'

const initialSpiro: SpiroAnimationSettings = {
  id: getIncrementalId(),
  name: 'My Spiro',
  laps: 1,
  petals: 5,
  pointDistance: 1512,
  interpolation: Interpolation.Derivative,
  stepPerLap: 44,
  strokeWidth: 10,
  color: '#ffffff',
  backgroundColor: '#00000000',
  msPerPetal: 1000,
}

function EditingSpiro() {
  const spiroRef = useRef<SpiroCanvasHandle>(null)
  const [spiro, setSpiro] = useState<SpiroAnimationSettings>(initialSpiro)

  function handleEdit(partialSpiro: Partial<SpiroAnimationSettings>) {
    const newSpiro = { ...spiro, ...partialSpiro, id: getIncrementalId() }
    setSpiro(newSpiro)
  }

  function handleEditWithName(partialSpiro: Partial<SpiroAnimationSettings>) {
    const newSpiro = { ...spiro, ...partialSpiro, id: getIncrementalId() }
    newSpiro.name = getUniqueSpirographName(newSpiro)
    setSpiro(newSpiro)
  }

  return (
    <div className="flex gap-16">
      <div className="flex gap-16">
        <ShapeSettingsForm spiro={spiro} onEdit={handleEditWithName} />
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
