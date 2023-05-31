import styled from "styled-components";

const StyledIcon = styled.svg`
  width: 1.5em;
  height: 1.5em;
  fill: currentColor;
`;

interface IconProps {
  path: string;
  title: string;
}

function Icon(props: IconProps) {
  return (
    <StyledIcon className="icon" viewBox="0 0 24 24" aria-label={props.title}>
      <path fill="currentColor" d={props.path} />
    </StyledIcon>
  );
}

export default Icon;
