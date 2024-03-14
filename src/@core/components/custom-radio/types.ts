// ** MUI Imports
import { BoxProps } from '@mui/material'
import { GridProps } from '@mui/material/Grid'
import { ReactNode } from 'react'

// ** Type Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Types of Basic Custom Radios
export type CustomRadioBasicData = {
  value: string
  isSelected?: boolean
  title: string | ReactNode
}

export type CustomRadioBasicProps = {
  name: string
  selected: string
  setSelected: (value: string) => void
  color?: ThemeColor
  gridProps: GridProps
  data: CustomRadioBasicData
  quizRadioLabel?: string
  // handleChange: (prop: string | ChangeEvent<HTMLInputElement>) => void
  radioButtonCustomStyles?: BoxProps['sx']
  isIncorrect?: boolean
}
