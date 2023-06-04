import { Col, Row, Upload, message } from 'antd'
import { useState } from 'react'
import { useFavSpiros } from '@/contexts/favSpiros'
import FavoriteSpiro from './FavoriteSpiro'
import Button from '@/ui-kit/Button'
import {
  mdiApps,
  mdiDatabaseExportOutline,
  mdiDatabaseImportOutline,
  mdiHeartPlusOutline,
  mdiShapeOutline,
  mdiSquare,
  mdiViewComfy,
  mdiViewGrid,
} from '@mdi/js'
import Icon from '@/ui-kit/Icon'
import MDIIcon from '@mdi/react'
import { Dict, SpiroSettings, isSpiroSetting } from '@/utils/types'
import { saveAs } from 'file-saver'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { getIncrementalId } from '@/utils/constants'

const options = [
  { label: 'Imagenes pequeñas', icon: mdiViewComfy, value: 6 },
  { label: 'Imagenes medianas', icon: mdiApps, value: 8 },
  { label: 'Imagenes grandes', icon: mdiViewGrid, value: 12 },
  { label: 'Imagenes muy grandes', icon: mdiSquare, value: 24 },
]

function ListFavoriteSpiros() {
  const [span, setSpan] = useState(8)
  const [selectedSpiros, setSelectedSpiros] = useState<Dict<boolean>>({})
  const [exportMode, setExportMode] = useState(false)
  const { spiros, setSpiros } = useFavSpiros()

  const handleExportSelected = (id: number) => {
    if (selectedSpiros[id]) {
      delete selectedSpiros[id]
      setSelectedSpiros({ ...selectedSpiros })
    } else {
      setSelectedSpiros({ ...selectedSpiros, [id]: true })
    }
  }

  function downloadSpirosAsJson() {
    const dataStr = JSON.stringify(spiros.filter((s) => selectedSpiros[s.id]))
    const blob = new Blob([dataStr], { type: 'application/json' })
    saveAs(blob, 'spiros.json')
  }

  function onInport(info: UploadChangeParam<UploadFile<any>>) {
    if (info.file.status === 'done') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json: SpiroSettings[] = JSON.parse(e.target?.result as string)
          // check if is a list of spiros
          if (Array.isArray(json) && json.every((s) => isSpiroSetting(s))) {
            for (const spiro of json) {
              if (spiros.some((s) => s.id === spiro.id)) {
                spiro.id = getIncrementalId()
              }
            }
            setSpiros([...json, ...spiros])
          } else {
            message.error('File parsing failed: Invalid file format')
          }
        } catch (error) {
          message.error(`File parsing failed: ${error}`)
        }
      }
      if (info.file.originFileObj) {
        reader.readAsText(info.file.originFileObj)
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  return (
    <>
      <h1 className="text-center">Spirodex</h1>
      {spiros?.length ? (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="flex gap-16 justify-between">
              <div className="flex gap-16 items-center">
                Tamaño:{' '}
                {options.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setSpan(option.value)}
                    tooltip={option.label}
                    icon={<Icon path={option.icon} />}
                    type={span === option.value ? 'primary' : 'default'}
                  />
                ))}
              </div>
              {exportMode ? (
                <div className="flex gap-16">
                  <Button
                    type="primary"
                    disabled={!Object.keys(selectedSpiros).length}
                    icon={<Icon path={mdiDatabaseExportOutline} />}
                    onClick={downloadSpirosAsJson}
                  >
                    Download selected
                  </Button>
                  <Button
                    onClick={() => setExportMode(false)}
                    icon={<Icon path={mdiHeartPlusOutline} />}
                  >
                    cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-16">
                  <Upload
                    name="file"
                    accept=".json"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    headers={{
                      authorization: 'authorization-text',
                    }}
                    onChange={onInport}
                  >
                    <Button
                      type="primary"
                      icon={<Icon path={mdiDatabaseImportOutline} />}
                    >
                      Import
                    </Button>
                  </Upload>

                  <Button
                    type="primary"
                    onClick={() => setExportMode(true)}
                    icon={<Icon path={mdiDatabaseExportOutline} />}
                  >
                    Export
                  </Button>
                </div>
              )}
            </div>
          </Col>
          {spiros.map((spiro) => (
            <Col key={spiro.id} span={span}>
              <FavoriteSpiro
                spiro={spiro}
                onSelected={handleExportSelected}
                isSelected={selectedSpiros[spiro.id]}
                exportMode={exportMode}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="flex flex-col gap-16 items-center">
          <h2>No tienes ningún spiro en tu spirodex... aún</h2>
          <MDIIcon path={mdiShapeOutline} size={4} />
          <p>Este es el lugar donde aparecerán tus spiro favoritos.</p>
          <p>
            Puedes agregar algunos a tu lista seleccionando el{' '}
            <Icon path={mdiHeartPlusOutline} /> en cada spiro,
          </p>
          <p>o importar algunos si ya tienes un archivo de spiro listo.</p>
          <Button
            type="primary"
            icon={<Icon path={mdiDatabaseImportOutline} />}
          >
            Import
          </Button>
        </div>
      )}
    </>
  )
}

export default ListFavoriteSpiros
