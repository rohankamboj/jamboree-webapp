import { Typography as MuiTypography, TypographyProps } from '@mui/material'
import { ReactNode } from 'react'

type Props = Omit<TypographyProps, 'variant'> & {
  children?: ReactNode
  variant?:
    | TypographyProps['variant']
    | 'paragraph'
    | 'paragraphMedium'
    | 'paragraphBold'
    | 'paragraphSmall'
    | 'paragraphLead'
    | 'paragraphMain'
    | 'paragraphSemiBold'
}
const Typography = ({ children, ...typographyProps }: Props) => (
  // @ts-ignore
  <MuiTypography {...typographyProps}>{children}</MuiTypography>
)

export default Typography
