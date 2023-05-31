import { Button as AntdButton, ButtonProps as AntdButtonProps, Tooltip } from 'antd';

interface ButtonProps extends AntdButtonProps {
  tooltip?: string;
}

function Button(props: ButtonProps) {
  const { tooltip, children, ...rest } = props;
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <AntdButton {...rest}>{children}</AntdButton>
      </Tooltip>
    );
  } else {
    return <AntdButton {...rest}>{children}</AntdButton>;
  }
};

export default Button;
