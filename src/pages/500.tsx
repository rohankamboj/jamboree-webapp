import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import { Link } from 'react-router-dom'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(1),
  },
}))

const Error500 = ({ devError, resetErrorBoundry }: { devError?: string; resetErrorBoundry?: () => void }) => {
  return (
    <BlankLayout>
      <CustomHelmet title='Error' />
      <Box sx={{ maxHeight: '100vh' }} className='content-center'>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <BoxWrapper>
            <Typography variant='h4' sx={{ mb: 1.5 }}>
              Oops, something went wrong!
            </Typography>
            <Typography sx={{ mb: 6, color: 'text.secondary' }}>
              There was an error with the internal server. Please contact your site administrator.
              {devError ? import.meta.env.DEV && <p style={{ color: 'red' }}>{`Dev Error   ${devError}`} </p> : null}
            </Typography>
            <Button onClick={resetErrorBoundry} to='/' component={Link} variant='contained'>
              Back to Home
            </Button>
          </BoxWrapper>
          <Img height='500' alt='error-illustration' src='/images/pages/404.png' />
        </Box>
      </Box>
    </BlankLayout>
  )
}

export default Error500
