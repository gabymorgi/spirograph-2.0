import { ColorPicker as AntColorPicker } from 'antd'
import { Color, ColorPickerProps } from 'antd/es/color-picker'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

const recommendedColors = [
  '#FFFFFF',
  '#a0a0a0',
  '#505050',
  '#000000',
  '#FF0000',
  '#FF8000',
  '#FFFF00',
  '#80FF00',
  '#00FF00',
  '#00FF80',
  '#00FFFF',
  '#0080FF',
  '#0000FF',
  '#8000FF',
  '#FF00FF',
  '#FF0080',
  '#8B4513',
  '#D2691E',
  '#B0C4DE',
  '#FFDAB9',
]

function ColorPicker(props: ColorPickerProps) {
  const [recentColors, setRecentColors] = useState<string[]>([])

  const onColorChangeDebounced = useDebouncedCallback(
    (_color: Color, hex: string) => {
      // Limit to 20 recent colors
      if (!recentColors.includes(hex)) {
        const newRecentColors = [hex, ...recentColors].slice(0, 20)
        setRecentColors(newRecentColors)
      }
      props.onChange?.(_color, hex)
    },
    200,
  )

  return (
    <AntColorPicker
      {...props}
      onChange={onColorChangeDebounced}
      presets={[
        {
          label: 'Recommended',
          colors: recommendedColors,
        },
        {
          label: 'Recent',
          colors: recentColors,
        },
      ]}
    />
  )
}

export default ColorPicker
