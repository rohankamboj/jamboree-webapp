import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Logo from '/logo.svg'

const FallbackSpinner = ({ sx, height }: { sx?: BoxProps['sx']; height?: string }) => {
  return (
    <Box
      sx={{
        height: height || '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <img width={248} src={Logo} alt='jamboree_logo' />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
