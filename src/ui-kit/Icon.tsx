import styled from 'styled-components'

const StyledIcon = styled.svg`
  width: 1.5em;
  height: 1.5em;
  stroke-width: 10%;
`

interface IconProps {
  path: string
  stroke?: boolean
  fill?: boolean
}

function Icon(props: IconProps) {
  const fill = props.stroke === undefined && props.fill === undefined ? true : props.fill
  return (
    <StyledIcon className="icon" viewBox="0 0 24 24">
      <path
        stroke={props.stroke ? "currentColor" : "none" }
        fill={fill ? "currentColor" : "none" }
        strokeLinecap="round"
        d={props.path}
      />
    </StyledIcon>
  )
}

export default Icon
