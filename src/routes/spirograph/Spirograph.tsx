import { Card } from 'antd'
import EditingSpiro from './components/EditingSpiro/EditingSpiro'
import ListFavoriteSpiros from './components/favoriteSpiro/ListFavoriteSpiros'

function Sprirograph() {
  return (
    <div className="flex flex-col gap-16 p-16">
      <Card>
        <EditingSpiro />
      </Card>
      <Card>
        <ListFavoriteSpiros />
      </Card>
    </div>
  )
}

export default Sprirograph
