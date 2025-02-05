import { SpiroSettings } from '@/utils/types'
import SpiroCanvas from '../SpiroCanvas'
import InteractionFormProps from './InteractionForm'
import { SpiroParam } from '@/utils/queryParamsUtils'
import { useQueryParams } from 'use-query-params'
import { Button } from 'antd'

interface FavoriteSpiroProps {
  spiro: SpiroSettings
  exportMode?: boolean
  isSelected?: boolean
  onSelected?: (id: number) => void
}

function FavoriteSpiro(props: FavoriteSpiroProps) {
  const [, setQuery] = useQueryParams(SpiroParam)

  function handleSendToEditor() {
    setQuery(props.spiro, 'replaceIn')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col">
      {props.exportMode ? (
        <Button
          type={props.isSelected ? 'primary' : 'default'}
          onClick={() => props.onSelected?.(props.spiro.id)}
        >
          {props.isSelected ? 'Selected' : 'Select'}
        </Button>
      ) : (
        <InteractionFormProps
          onSendToEditor={handleSendToEditor}
          id={props.spiro.id}
          name={props.spiro.name}
        />
      )}
      <div className="card">
        <SpiroCanvas {...props.spiro} />
      </div>
    </div>
  )
}

export default FavoriteSpiro
