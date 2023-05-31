import { Col, Row } from 'antd'
import { useState } from 'react'
import { useLocalStorage } from '@/contexts/localStorage'
import FavoriteSpiro from './FavoriteSpiro'
import Button from '@/ui-kit/Button'
import { mdiApps, mdiDatabaseExportOutline, mdiDatabaseImportOutline, mdiHeartPlusOutline, mdiShapeOutline, mdiSquare, mdiUpload, mdiViewComfy, mdiViewGrid, mdiViewGridOutline, mdiViewModule, mdiViewQuilt, mdiViewStream } from '@mdi/js'
import Icon from '@/ui-kit/Icon'
import MDIIcon from '@mdi/react'

const options = [
  { label: 'Imagenes pequeñas', icon: mdiViewComfy, value: 6 },
  { label: 'Imagenes medianas', icon: mdiApps, value: 8 },
  { label: 'Imagenes grandes', icon: mdiViewGrid, value: 12 },
  { label: 'Imagenes muy grandes', icon: mdiSquare, value: 24 },
]

function ListFavoriteSpiros() {
  const [span, setSpan] = useState(8)
  const {values, removeValue} = useLocalStorage()

  function handleEditSpiro(id: string, newId: string) {
    const newvalues = {
      ...values,
    }
    // newvalues[newId] = newvalues[id]
    // delete newvalues[id]
    // setvalues(newvalues)
  }

  console.log(values)
  return values?.length ? (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <div className="flex gap-16 justify-between">
          <div className="flex gap-16 items-center">
            Tamaño: {options.map((option) => (
              <Button
                key={option.value}
                onClick={() => setSpan(option.value)}
                tooltip={option.label}
                icon={
                  <Icon path={option.icon} />
                }
                type={span === option.value ? 'primary' : 'default'}
              />
            ))}
          </div>
          <div className="flex gap-16">
            <Button
              type='primary'
              icon={
                <Icon path={mdiDatabaseImportOutline} />
              }
            >
              Import
            </Button>
            <Button
              type='primary'
              icon={
                <Icon path={mdiDatabaseExportOutline} />
              }
            >
              Export
            </Button>
          </div>
        </div>
      </Col>
      {values?.map((spiro) => (
        <Col key={spiro.id} span={span}>
          <FavoriteSpiro spiro={spiro} onEditId={handleEditSpiro} />
        </Col>
      )) || 'Aun no hay favoritos'}
    </Row>
  ) : (
    <div className="flex flex-col gap-16 items-center">
      <h2>No tienes ningún spiro en tus favoritos... aún</h2>
      <MDIIcon path={mdiShapeOutline} size={4} />
      <p>Este es el lugar donde aparecerán tus spiro favoritos.</p>
      <p>Puedes agregar algunos a tu lista seleccionando el <Icon path={mdiHeartPlusOutline} /> en cada spiro,</p>
      <p>o importar algunos si ya tienes un archivo de spiro listo.</p>
      <Button
        type='primary'
        icon={
          <Icon path={mdiDatabaseImportOutline} />
        }
      >
        Import
      </Button>
    </div>
  );
}

export default ListFavoriteSpiros;