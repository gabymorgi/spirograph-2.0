import SpiroCanvas, { SpiroCanvasHandle } from '../SpiroCanvas'
import { useRef } from 'react'
import AnimationControlForm from './ControlForm'
import ShapeSettingsForm from './ShapeSettingsForm'
import VisualSettingsForm from './VisualSettingsForm'
import { SpiroParam } from '@/utils/queryParamsUtils'
import { SpiroAnimationSettings } from '@/utils/types'
import { useQueryParams } from 'use-query-params'
import { getIncrementalId } from '@/utils/constants'
import { getUniqueSpirographName } from '@/utils/canvasUtils'

function EditingSpiro() {
  const spiroRef = useRef<SpiroCanvasHandle>(null)
  const [query, setQuery] = useQueryParams(SpiroParam)
  const spiro = query as SpiroAnimationSettings

  function handleEdit(partialSpiro: Partial<SpiroAnimationSettings>) {
    const newSpiro = { ...spiro, ...partialSpiro, id: getIncrementalId() }
    setQuery(newSpiro, 'replaceIn')
  }

  function handleEditWithName(partialSpiro: Partial<SpiroAnimationSettings>) {
    const newSpiro = { ...spiro, ...partialSpiro, id: getIncrementalId() }
    newSpiro.name = getUniqueSpirographName(newSpiro)
    setQuery(newSpiro, 'replaceIn')
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
