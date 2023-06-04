import SpiroCanvas, { SpiroCanvasHandle } from '../SpiroCanvas'
import { useRef } from 'react'
import AnimationControlForm from './ControlForm'
import ShapeSettingsForm from './ShapeSettingsForm'
import VisualSettingsForm from './VisualSettingsForm'

function EditingSpiro() {
  const spiroRef = useRef<SpiroCanvasHandle>(null)

  return (
    <div className="flex gap-16">
      <div className="flex gap-16">
        <ShapeSettingsForm />
        <VisualSettingsForm />
      </div>
      <div className="flex-grow">
        <AnimationControlForm spiroRef={spiroRef} />
        <SpiroCanvas ref={spiroRef} />
      </div>
    </div>
  )
}

export default EditingSpiro
