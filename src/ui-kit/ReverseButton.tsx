import { useThemeContext } from '@/contexts/ThemeContext'
import { Button, ButtonProps } from 'antd'
import styled, { css } from 'styled-components'

const StyledButton = styled(Button)<{ $advanced: boolean }>`
  ${(props) =>
    props.$advanced
      ? css`
          &.ant-btn-primary {
            background-color: #03a6a6;
            box-shadow: 0 2px 0 rgba(0, 107, 113, 0.15);
            &:not(:disabled) {
              &:hover {
                background-color: #20bab4;
              }
              &:active {
                background-color: #078484;
              }
            }
          }
        `
      : css`
          &.ant-btn-primary {
            background-color: #7003a5;
            box-shadow: 0 2px 0 rgba(67, 0, 113, 0.15);
            &:not(:disabled) {
              &:hover {
                background-color: #8c20ba;
              }
              &:active {
                background-color: #5a0783;
              }
            }
          }
        `}
`

function ReverseButton(props: ButtonProps) {
  const { advanced } = useThemeContext()
  return <StyledButton $advanced={advanced} {...props} />
}

export default ReverseButton
