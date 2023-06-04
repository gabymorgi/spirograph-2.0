import { SpiroSettings } from '@/utils/types'
import SpiroCanvas from '../SpiroCanvas'
import InteractionFormProps from './InteractionForm'
import { SpiroParam } from '@/utils/queryParamsUtils'
import { useQueryParams } from 'use-query-params'

interface FavoriteSpiroProps {
  spiro: SpiroSettings
}

function FavoriteSpiro(props: FavoriteSpiroProps) {
  const [, setQuery] = useQueryParams(SpiroParam)

  function handleSendToEditor() {
    setQuery(props.spiro, 'replaceIn')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col">
      <InteractionFormProps
        onSendToEditor={handleSendToEditor}
        id={props.spiro.id}
        name={props.spiro.name}
      />
      <SpiroCanvas {...props.spiro} />
    </div>
  )
}

export default FavoriteSpiro
