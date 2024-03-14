// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { GridProps } from '@mui/material/Grid'

// ** Type Imports
import { IconProps } from '@iconify/react'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Types of Basic Custom Checkboxes
export type CustomCheckboxBasicData = {
  value: number | string
  isSelected?: boolean
  title: string | ReactNode
}
export type CustomCheckboxBasicProps = {
  name: string
  color?: ThemeColor
  selected: number | string
  setSelected: (value: any) => void
  gridProps: GridProps
  data: CustomCheckboxBasicData
  disabled?: boolean
}

// ** Types of Custom Checkboxes with Icons
export type CustomCheckboxIconsData = {
  value: string
  title?: ReactNode
  content?: ReactNode
  isSelected?: boolean
}
export type CustomCheckboxIconsProps = {
  name: string
  icon?: string
  color?: ThemeColor
  selected: string[]
  gridProps: GridProps
  data: CustomCheckboxIconsData
  iconProps?: Omit<IconProps, 'icon'>
  handleChange: (value: string) => void
}

// ** Types of Custom Checkboxes with Images
export type CustomCheckboxImgData = {
  alt?: string
  value: string
  img: ReactNode
  isSelected?: boolean
}
export type CustomCheckboxImgProps = {
  name: string
  color?: ThemeColor
  selected: string[]
  gridProps: GridProps
  data: CustomCheckboxImgData
  handleChange: (value: string) => void
}
