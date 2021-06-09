import { ToolbarOptions } from '../utils/types'

export interface ToolsProps {
  options: ToolbarOptions
}

export interface SelectProps
  extends React.ButtonHTMLAttributes<HTMLSelectElement> {
  options: (number | string | boolean)[]
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: string[]
}

export interface ItemProps extends ButtonProps {}
