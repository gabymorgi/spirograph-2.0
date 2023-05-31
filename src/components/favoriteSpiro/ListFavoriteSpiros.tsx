import { Button, Col, Row } from 'antd'
import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { SpiroSettings } from '@/utils/types'
import FavoriteSpiro from './FavoriteSpiro'

const options = [
  { label: 'Imagenes pequeñas', value: 6 },
  { label: 'Imagenes medianas', value: 8 },
  { label: 'Imagenes grandes', value: 12 },
  { label: 'Imagenes muy grandes', value: 24 },
]

function ListFavoriteSpiros() {
  const [span, setSpan] = useState(8)
  const [favoriteSpiros, setFavoriteSpiros] = useLocalStorage<SpiroSettings[]>('favoriteSpiros')

  function handleEditSpiro(id: string, newId: string) {
    const newFavoriteSpiros = {
      ...favoriteSpiros,
    }
    // newFavoriteSpiros[newId] = newFavoriteSpiros[id]
    // delete newFavoriteSpiros[id]
    // setFavoriteSpiros(newFavoriteSpiros)
  }

  console.log(favoriteSpiros)
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <div className="flex gap-16 justify-between">
          <div className="flex gap-16">
            {options.map((option) => (
              <Button
                key={option.value}
                onClick={() => setSpan(option.value)}
                type={span === option.value ? 'primary' : 'default'}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-16">
            <Button
              type='primary'
            >
              Import
            </Button>
            <Button
              type='primary'
            >
              Export
            </Button>
          </div>
        </div>
      </Col>
      {favoriteSpiros?.map((spiro) => (
        <Col key={spiro.id} span={span}>
          <FavoriteSpiro spiro={spiro} onEditId={handleEditSpiro} />
        </Col>
      )) || 'Aun no hay favoritos'}
    </Row>
  );
}

export default ListFavoriteSpiros;