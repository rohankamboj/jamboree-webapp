import { Box, BoxProps, styled } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
const { border } = themeConfig

const StyledBox = styled(Box)<BoxProps>(() => ({
  border,
}))

const StyledBorderedBox = (props: BoxProps) => {
  return <StyledBox {...props} />
}

export default StyledBorderedBox
