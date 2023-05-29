import { Button, Col, Row } from 'antd'
import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Dict, SpirographSettings } from '../utils/maths.type'
import EditingSpiro from './EditingSpiro'

const options = [
  { label: 'Imagenes pequeñas', value: 6 },
  { label: 'Imagenes medianas', value: 8 },
  { label: 'Imagenes grandes', value: 12 },
  { label: 'Imagenes muy grandes', value: 24 },
]

function ListFavoriteSpiros() {
  const [span, setSpan] = useState(8)
  const [favoriteSpiros, setFavoriteSpiros] = useLocalStorage<Dict<SpirographSettings>>('favoriteSpiros')

  function handleEditSpiro(id: string, newSpiro: SpirographSettings) {
    const newFavoriteSpiros = {
      ...favoriteSpiros,
      [id]: newSpiro,
    }
    setFavoriteSpiros(newFavoriteSpiros)
  }

  console.log(favoriteSpiros)
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
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
      </Col>
      {favoriteSpiros ? Object.entries(favoriteSpiros).map(([key, spiro]) => (
        <Col key={key} span={span}>
          <EditingSpiro spiro={spiro} id={key} onEdit={handleEditSpiro} />
        </Col>
      )) : null}
    </Row>
  );
}

export default ListFavoriteSpiros;